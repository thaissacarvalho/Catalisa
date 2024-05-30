const { v4: uuidv4 } = require('uuid');

async function generateUserHash() {
  try {
    const userUUID = uuidv4();
    return userUUID;
  } catch (error) {
    console.error('Erro ao gerar UUID do usuário:', error);
    throw error;
  }
}

module.exports = generateUserHash;
