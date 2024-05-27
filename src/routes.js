import express from 'express';
const database = require("./config/database.config");
const router = express.Router();


router.get('/', (req, res) => {
    database.sync({ force: true })
    .then(() => { 
        res.send('Get Solutions...') 
    });
});

export { router }