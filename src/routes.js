const express = require('express');
const AnymarketController = require('./controllers/AnymarketController');
const OrdersFeedAnymarketController = require('./controllers/OrdersFeedAnymarketController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

routes.get('/api/anymarket/orders/feed', async (req, res) => {
  try {
      const result = await OrdersFeedAnymarketController.OrdersFeedAnymarketController();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

routes.get('/api/anymarket/orders', AnymarketController.index);
routes.post('/api/anymarket/orders', AnymarketController.store);

module.exports = routes;
