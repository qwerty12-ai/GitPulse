// Talking to github

const axios = require("axios")

const headers = {};

if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const GITHUB_BASE_URL = "https://api.github.com/users"

const fetchUser = async (username) => {
    const res = await axios.get(`${GITHUB_BASE_URL}/${username}`, { headers });
    return res.data
}

const fetchRepos = async (username) => {
    const res = await axios.get(`${GITHUB_BASE_URL}/${username}/repos`, { headers });
    return res.data;
}

module.exports = {
    fetchUser,
    fetchRepos
};