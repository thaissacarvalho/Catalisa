const { Comments, Likes, Users } = require("../models");

async function getTest(req, res) {
    try {
        const comments = await Comments.findAll()
        
        res.send(comments);

    } catch (error) {
        res.send("Impossivel achar esse comments/likes");
    }
}

module.exports = getTest;