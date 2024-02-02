const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const AnymarketOrder = require('../models/AnymarketOrder');
const BsellerOrder = require('../models/BsellerOrder');
const AnytobsellerIntegrationError = require('../models/AnytobsellerIntegrationError');
const AnytobsellerStatusValidation = require('../models/AnytobsellerStatusValidation');
const IntelipostOrder = require('../models/IntelipostOrder');

const connection = new Sequelize(dbConfig);

AnymarketOrder.init(connection);
BsellerOrder.init(connection);
AnytobsellerIntegrationError.init(connection);
AnytobsellerStatusValidation.init(connection);
IntelipostOrder.init(connection);

module.exports = connection;