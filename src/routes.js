const express = require('express');
const AnymarketController = require('./controllers/AnymarketController');
const BsellerController = require('./controllers/BsellerController');
const ErroIntegracaoController = require('./controllers/ErroIntegracaoController');
const StatusValidationController = require('./controllers/StatusValidationController');

const OrdersFeedToAnymarket = require('./services/OrdersFeedToAnymarket');
const OrdersFeedToBseller = require('./services/OrdersFeedToBseller');
const OrdersFeedToIntelipost = require('./services/OrdersFeedToIntelipost');
const OrdersValidationAnyToBseller = require('./services/OrdersValidationAnyToBseller');
const TestBulkUpsert = require('./services/TestBulkUpsert');
const OrdersStatusValidation = require('./services/OrdersStatusValidation');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// ############## INÍCIO DAS ROTAS DE TESTE #####################

// rota teste bulkUpsert
routes.get('/api/bulkupsertteste', async (req, res) => {
  try {
      const result = await TestBulkUpsert.OrdersUpsertAnymarket();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});
// rota teste Intelipost
routes.get('/api/intelipost/teste', OrdersFeedToIntelipost.getShopeeOrders);

// ############## FIM DAS ROTAS DE TESTE #####################


// rota para alimentar a tabela StatusValidation
routes.post('/api/statusvalidation/new', StatusValidationController.store);

// rota para rodar o StatusValidation
routes.get('/api/statusvalidation', async (req, res) => {
  try {
      const result = await OrdersStatusValidation.OrdersStatusValidation();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição AQUI.' });
  }
});



// rota para incluir manualmente um pedido na tabela de erros de integracao do bseller
routes.post('/api/validacao/bseller/add', ErroIntegracaoController.store);

// rota para validar se os pedidos da anymarket estão devidamente integrados no Bseller
routes.get('/api/validacao/bseller', async (req, res) => {
  try {
      const result = await OrdersValidationAnyToBseller.OrdersValidationAnyToBseller();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabeka Anymarkets
routes.get('/api/anymarket/orders/feed', async (req, res) => {
  try {
      const result = await OrdersFeedToAnymarket.OrdersFeedToAnymarket();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabela bsellers
routes.get('/api/bseller/orders/feed', async (req, res) => {
  try {
      const result = await OrdersFeedToBseller.ordersFeedToBseller280();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição AQUI 2.' });
  }
});


routes.get('/api/bseller/orders', BsellerController.index);
routes.post('/api/bseller/orders', BsellerController.store);

routes.get('/api/anymarket/orders', AnymarketController.index);
routes.post('/api/anymarket/orders', AnymarketController.store);

module.exports = routes;
