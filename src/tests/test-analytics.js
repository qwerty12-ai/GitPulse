const {
    totalStars,
    totalForks,
    topLanguage
} = require("../services/analyticsService")

const repos = [
    {
        language: "JavaScript",
        stargazers_count: 10,
        forks_count: 50
    },
    {
        language: "Python",
        stargazers_count: 20,
        forks_count: 30
    },
    {
        language: "JavaScript",
        stargazers_count: 5,
        forks_count: 20
    }
]

console.log(totalStars(repos))
console.log(totalForks(repos))
console.log(topLanguage(repos))