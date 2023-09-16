'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'userId', {
       type: Sequelize.INTEGER,
       references: {
        model: 'Users',
        key: 'id'
       },
       allowNull: false,
       defaultValue: 1,
       onDelete: 'CASCADE',
       onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'userId')
  }
};
