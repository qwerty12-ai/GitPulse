// to control the requests from endpoints related to user profile and send it to the services.
// recieves HTTP requests and sends HTTP responses

const {
    fetchUser,
    fetchRepos
} = require("../services/githubService")

const {
    totalStars,
    totalForks,
    topLanguage,
    topRepository,
    devScore
} = require("../services/analyticsService")

// Run SQL so that the controller can save things to MYSQL database
const pool = require("../database/db")
const dotenv = require("dotenv")
dotenv.config()

const analyzeProfile = async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            })
        }
        // fetch user data and repos from github service
        const user = await fetchUser(username);
        const repos = await fetchRepos(username);

        // perform calculations on the data from github service using analytics service
        const stars = totalStars(repos);
        const forks = totalForks(repos);
        const language = topLanguage(repos);
        const bestRepo = topRepository(repos);
        const score = devScore(
            user.public_repos,
            stars,
            user.followers,
            forks
        );

        // save the data to database using mysql
        await pool.query(
            `INSERT INTO users (
            github_id,
            username,
            name,
            bio,
            company,
            location,
            followers,
            following,
            public_repos,
            developer_score
        ) VALUES (?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        company = VALUES(company),
        location = VALUES(location),
        followers = VALUES(followers),
        following = VALUES(following),
        public_repos = VALUES(public_repos),
        developer_score = VALUES(developer_score)
        `
            ,
            [
                user.id,
                user.login,
                user.name,
                user.bio,
                user.company,
                user.location,
                user.followers,
                user.following,
                user.public_repos,
                score
            ]
        );

        const [userRows] = await pool.query(
            `SELECT id from users WHERE username = ?`,
            [user.login]
        )
        const userId = userRows[0].id;

        await pool.query(
            `DELETE FROM repositories WHERE user_id = ?`,
            [userId]
        )

        for (const repo of repos) {
            const createdAt = new Date(repo.created_at);
            const updatedAt = new Date(repo.updated_at);

            await pool.query(
                `INSERT INTO repositories (
                user_id,
                repo_name,
                language,
                stars,
                forks,
                created_at,
                updated_at
            )
                VALUES(?,?,?,?,?,?,?)
            `,
                [
                    userId,
                    repo.name,
                    repo.language,
                    repo.starsgazers_count,
                    repo.forks_count,
                    createdAt,
                    updatedAt
                ]
            );
        }

        return res.status(200).json({
            message: "Profile analyzed and saved successfully",
            username: user.login,
            developerScore: score,
            totalRepositories: repos.length,
            topLanguage: language,
            topRepository: bestRepo?.name
        })
    } catch (error) {
        console.error("Error analyzing profile:", error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const getProfiles = async (req, res) => {
    try {
        const [profiles] = await pool.query(
            `
                SELECT * FROM users ORDER BY created_at DESC 
            `
        )
        return res.status(200).json(profiles)        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const getProfileByUsername = async (req, res) => {
    try {
        const {username} = req.params;
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        )
        
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }

        return res.status(200).json(rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT username, developer_score, followers, public_repos FROM users ORDER BY developer_score DESC LIMIT 10`
        )

        return res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const getAnalytics = async (req, res) => {
    try {
        const {username} = req.params;
        const [rows] = await pool.query(
            `SELECT username, developer_score, followers, following, public_repos FROM users WHERE username = ?`,
            [username]
        )
        if(rows.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = {
    analyzeProfile,
    getProfiles,
    getProfileByUsername,
    getLeaderboard,
    getAnalytics
}