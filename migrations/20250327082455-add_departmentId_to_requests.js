/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('requests', 'departmentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'departments',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('requests', 'departmentId');
  },
};
