// This file defines the API URLs

const express = require("express")
const router = express.Router()

const {
    analyzeProfile,
    getProfiles,
    getProfileByUsername,
    getAnalytics,
    getLeaderboard
} = require("../controllers/profileController")

// Analyze a GitHub profile
router.post("/analyze/:username",analyzeProfile)
// Get all analyzed profiles
router.get("/profiles", getProfiles)
// Get a single analyzed profile
router.get("/profiles/:username", getProfileByUsername)
// Get analytics for a single profile
router.get("/profiles/:username/analytics", getAnalytics)
// Leaderboard of top developers based on analytics
router.get("/leaderboard", getLeaderboard)

module.exports = router