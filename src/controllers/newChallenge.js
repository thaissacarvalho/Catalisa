const Users = require("../models/Users");

async function newChallenge(req, res) {
    
   try {
    const user = await Users.findAll({
        where: { id_user, name, email, cargo, empresa }
    })


    const 
   } catch (error) {
    
   }
}

module.exports = newChallenge;