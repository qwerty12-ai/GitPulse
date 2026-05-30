CREATE DATABASE IF NOT EXISTS gitpulse;
USE gitpulse;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    github_id BIGINT UNIQUE,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    public_repos INT DEFAULT 0,
    developer_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repositories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    language VARCHAR(255),
    stars INT DEFAULT 0,
    forks INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);