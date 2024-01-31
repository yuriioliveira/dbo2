const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');
const StatusValidation = require('../models/StatusValidation');
const Intelipost = require('../models/Intelipost');

const connection = new Sequelize(dbConfig);

Anymarket.init(connection);
Bseller.init(connection);
IntegracaoBsellerErros.init(connection);
StatusValidation.init(connection);
Intelipost.init(connection);


module.exports = connection;