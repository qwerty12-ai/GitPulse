// perform calculations on data from the repositorties

const totalStars = (repos) => {
    return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

const totalForks = (repos) => {
    return repos.reduce((total, repo) => total + repo.forks_count, 0);
}

const topLanguage = (repos) => {
    const languages = {};

    repos.forEach((repo) => {
        if (!repo.language) return;
        languages[repo.language] = (languages[repo.language] || 0) + 1;
    })

    let topLanguage = null;
    let maxCount = 0;

    for (const language in languages) {
        if (languages[language] > maxCount) {
            maxCount = languages[language];
            topLanguage = language;
        }
    }

    return topLanguage;
}

const topRepository = (repos) => {
    if (repos.length === 0) return null;

    return repos.reduce((topRepo, currentRepo) => {
        return currentRepo.stargazers_count > topRepo.stargazers_count ? currentRepo : topRepo;
    });
}

const devScore = (
    publicRepos,
    totalStars,
    followers,
    totalForks
) => {
    return followers + publicRepos + (totalStars * 2) + totalForks;
}

module.exports = {
    totalStars,
    totalForks,
    topLanguage,
    topRepository,
    devScore
}