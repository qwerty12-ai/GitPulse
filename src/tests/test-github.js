const {
    fetchUser,
    fetchRepos
} = require("../services/githubService")

async function test() {
    const user = await fetchUser("torvalds");
    console.log(user.login)

    const repos = await fetchRepos("torvalds");
    console.log(repos.length)
}

test();