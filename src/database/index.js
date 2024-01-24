const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Anymarket = require('../models/Anymarket');

const connection = new Sequelize(dbConfig);

Anymarket.init(connection);

module.exports = connection;