'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Restaurants", "userId", {
      type: Sequelize.INTEGER,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Restaurants", "userId", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
  }
};
