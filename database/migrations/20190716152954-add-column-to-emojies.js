'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'Emojies',
            'deleted_at',
            Sequelize.DATE,
            {
                after: 'updated_at',
                allowNull: true
            }
        );
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'Emojies',
            'deleted_at'
        );
    }
};
