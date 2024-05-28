'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Choices', [
      {
        name_choice: 'Pix',
        uri_choice: 'pix',
        date_created: new Date(),
      },
      {
        name_choice: 'Finanças Integradas',
        uri_choice: 'financas-integradas',
        date_created: new Date(),
      },
      {
        name_choice: 'Prevenção à Fraude',
        uri_choice: 'prevencao-a-fraude',
        date_created: new Date(),
      },
      {
        name_choice: 'Seguros',
        uri_choice: 'seguros',
        date_created: new Date(),
      },
      {
        name_choice: 'Carteiras Digitais',
        uri_choice: 'carteiras-digitais',
        date_created: new Date(),
      },
      {
        name_choice: 'Inteligência Artificial',
        uri_choice: 'inteligencia-artificial',
        date_created: new Date(),
      },
      {
        name_choice: 'Open Finance',
        uri_choice: 'open-finance',
        date_created: new Date(),
      },
      {
        name_choice: 'DREX',
        uri_choice: 'drex',
        date_created: new Date(),
      },
      {
        name_choice: 'Tokenização',
        uri_choice: 'tokenizacao',
        date_created: new Date(),
      },
      {
        name_choice: 'Experiência do Usuário',
        uri_choice: 'experiencia-do-usuario',
        date_created: new Date(),
      },
      {
        name_choice: 'Cibersegurança',
        uri_choice: 'ciberseguranca',
        date_created: new Date(),
      },
      {
        name_choice: 'Bancarização',
        uri_choice: 'bancarizacao',
        date_created: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Choices', null, {});
  }
};
