// This file is responsible for configuring the express server and setting up middleware and routes.

const express = require("express")
const profileRoutes = require("./routes/profileRoutes")
const app = express()

// Middleware to parse JSON
app.use(express.json())

app.use("/api", profileRoutes);

module.exports = app