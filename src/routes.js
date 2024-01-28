const express = require('express');
const AnymarketController = require('./controllers/AnymarketController');
const BsellerController = require('./controllers/BsellerController');
const OrdersFeedAnymarketController = require('./controllers/OrdersFeedAnymarketController');
const OrdersFeedBsellerController = require('./controllers/OrdersFeedBsellerController');
const OrdersFeedIntelipostController = require('./controllers/OrdersFeedIntelipostController');
const ValidacaoIntegracaoAnymarketBseller = require('./services/ValidacaoIntegracaoAnymarketBseller');
const ErroIntegracaoController = require('./controllers/ErroIntegracaoController');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// ############## INÍCIO DAS ROTAS DE TESTE #####################

// rota teste Intelipost
routes.get('/api/intelipost/teste', OrdersFeedIntelipostController.getShopeeOrders);

// ############## FIM DAS ROTAS DE TESTE #####################



// rota para incluir manualmente um pedido na tabela de erros de integracao do bseller
routes.post('/api/validacao/bseller/add', ErroIntegracaoController.store);

// rota para validar se os pedidos da anymarket estão devidamente integrados no Bseller
routes.get('/api/validacao/bseller', async (req, res) => {
  try {
      const result = await ValidacaoIntegracaoAnymarketBseller.validacaoErrosIntegracao();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabeka Anymarkets
routes.get('/api/anymarket/orders/feed', async (req, res) => {
  try {
      const result = await OrdersFeedAnymarketController.OrdersFeedAnymarketController();
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabela bsellers
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
