const express = require('express');
const AnymarketOrderController = require('./controllers/AnymarketOrderController');
const BsellerOrderController = require('./controllers/BsellerOrderController');
const AnyToBsellerIntegrationErrorController = require('./controllers/AnyToBsellerIntegrationErrorController');
const AnyToBsellerStatusValidation = require('./controllers/AnyToBsellerStatusValidation');
const IntelipostOrderController = require('./controllers/IntelipostOrderController');
const BsellerToIntelipostStatusValidation = require('./controllers/BsellerToIntelipostStatusValidation');

const AnymarketOrdersFeed = require('./services/AnymarketOrdersFeed');
const BsellerOrdersFeed = require('./services/BsellerOrdersFeed');
const IntelipostOrdersFeed = require('./services/IntelipostOrdersFeed');
const IntelipostOrdersUpdateFeed = require('./services/IntelipostOrdersUpdateFeed');
const AnyToBsellerIntegrationErrorFeed = require('./services/AnyToBsellerIntegrationErrorFeed');
const AnyToBsellerStatusValidationFeed = require('./services/AnyToBsellerStatusValidationFeed');
const BsellerToIntelipostStatusValidationFeed = require('./services/BsellerToIntelipostStatusValidationFeed');
const BsellerOrdersFeedInvoiceUpdate = require('./services/BsellerOrdersFeedInvoiceUpdate');

const routes = express.Router();

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// ############## INÍCIO DAS ROTAS DE TESTE #####################

// rota atualizar a tabela bseller_orders com as notas fiscais
routes.get('/api/bseller/orders/feed/update', async (req, res) => {
  try {
    const result = await BsellerOrdersFeedInvoiceUpdate.BsellerOrdersFeedInvoiceUpdate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição BsellerOrdersFeedInvoiceUpdate no routes.' });
  }
});;

// ############## FIM DAS ROTAS DE TESTE #####################

// rotas para puxar os dados da tabela bsellertointelipost_status_validations e para enviar um item para a tabela. 
routes.get('/api/intelipost/checkstatus/index', BsellerToIntelipostStatusValidation.index);
routes.post('/api/intelipost/checkstatus/add', BsellerToIntelipostStatusValidation.store);

// rota para rodar a validação de status do Bseller e Intelipost
routes.get('/api/intelipost/checkstatus', async (req, res) => {
  try {
    const result = await BsellerToIntelipostStatusValidationFeed.BsellerToIntelipostStatusValidationFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição BsellerToIntelipostStatusValidationFeed no routes.' });
  }
});;

// rota para alimentar a tabela Inteliposts com o feed
routes.get('/api/intelipost/orders/feed/update', async (req, res) => {
  try {
    const result = await IntelipostOrdersUpdateFeed.IntelipostOrdersUpdateFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição IntelipostOrdersUpdateFeed no routes.' });
  }
});;

// rotas para a nova tabela Inteliposts
routes.get('/api/intelipost/orders', IntelipostOrderController.index);
routes.post('/api/intelipost/orders/feed', IntelipostOrderController.store);

// rota para alimentar a tabela Inteliposts com o feed
routes.get('/api/intelipost/orders/feed', async (req, res) => {
  try {
    const result = await IntelipostOrdersFeed.IntelipostOrdersFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição IntelipostOrdersFeed no routes.' });
  }
});;

// rota para alimentar a tabela StatusValidation
routes.post('/api/bseller/checkstatus/add', AnyToBsellerStatusValidation.store);

// rota para rodar o StatusValidation
routes.get('/api/bseller/checkstatus', async (req, res) => {
  try {
    const result = await AnyToBsellerStatusValidationFeed.AnyToBsellerStatusValidationFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição AQUI.' });
  }
});

// rota para incluir manualmente um pedido na tabela de erros de integracao do bseller
routes.post('/api/bseller/checkintegration/add', AnyToBsellerIntegrationErrorController.store);

// rota para validar se os pedidos da anymarket estão devidamente integrados no Bseller
routes.get('/api/bseller/checkintegration', async (req, res) => {
  try {
    const result = await AnyToBsellerIntegrationErrorFeed.AnyToBsellerIntegrationErrorFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabeka Anymarkets
routes.get('/api/anymarket/orders/feed', async (req, res) => {
  try {
    const result = await AnymarketOrdersFeed.AnymarketOrdersFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição.' });
  }
});

// rota para alimentar a tabela bsellers
routes.get('/api/bseller/orders/feed', async (req, res) => {
  try {
    const result = await BsellerOrdersFeed.BsellerOrdersFeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a requisição AQUI 2.' });
  }
});


routes.get('/api/bseller/orders', BsellerOrderController.index);
routes.post('/api/bseller/orders', BsellerOrderController.store);

routes.get('/api/anymarket/orders', AnymarketOrderController.index);
routes.post('/api/anymarket/orders', AnymarketOrderController.store);

module.exports = routes;
