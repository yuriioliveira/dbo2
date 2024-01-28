const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');

const connection = new Sequelize(dbConfig);

Anymarket.init(connection);
Bseller.init(connection);
IntegracaoBsellerErros.init(connection);


module.exports = connection;