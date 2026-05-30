const {analyzeProfile} = require("../controllers/profileController")

const req = {
    params: {
        username: "octocat"
    }
};

const res = {
    status(code) {
        console.log("Status code: ", code);

        return {
            json(data) {
                console.log(JSON.stringify(data, null, 2));
            }
        }
    }
}

analyzeProfile(req, res);