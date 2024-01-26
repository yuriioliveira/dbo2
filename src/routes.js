const express = require('express');
const AnymarketController = require('./controllers/AnymarketController');
const BsellerController = require('./controllers/BsellerController');
const OrdersFeedAnymarketController = require('./controllers/OrdersFeedAnymarketController');
const OrdersFeedBsellerController = require('./controllers/OrdersFeedBsellerController');

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

routes.get('/api/bseller/orders/feed', async (req, res) => {
  try {
      const result = await OrdersFeedBsellerController.ordersFeed280BsellerController();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

routes.get('/api/bseller/orders', BsellerController.index);
routes.post('/api/bseller/orders', BsellerController.store);

routes.get('/api/anymarket/orders', AnymarketController.index);
routes.post('/api/anymarket/orders', AnymarketController.store);

module.exports = routes;
