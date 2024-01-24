const axios = require('axios');
const Anymarket = require('../models/Anymarket');

const OrdersFeedAnymarketController = async () => {
    let numeroPaginaAtual = 1;
    let offsetAtual = 0;
    let quantidadePaginas = 999;
    let dataInicial = "2024-01-23";
    let dataFinal = "2024-01-23";

    while (numeroPaginaAtual <= quantidadePaginas) {
        try {
            const response = await axios.get(`http://api.anymarket.com.br/v2/orders?createdAfter=${dataInicial}T00:00:00-03:00&createdBefore=${dataFinal}T23:59:59-03:00&limit=100&offset=${offsetAtual}`, {
                headers: {
                    'gumgaToken': process.env.TOKEN_ANYMARKET,
                    'Content-Type': 'application/json'
                }
            });

            const conteudo = response.data;

            const orders_anymarket = [];
            for (const order of conteudo.content) {
                orders_anymarket.push({
                    id_anymarket: order.id,
                    id_marketplace: order.marketPlaceId,
                    status_anymarket: order.status,
                    status_marketplace: order.marketPlaceStatus,
                    marketplace_nome: order.marketPlace,
                    fulfillment: order.fulfillment,
                    chave_nf: order.invoice && order.invoice.accessKey ? order.invoice.accessKey : '',
                    numero_nf: order.invoice && order.invoice.number ? order.invoice.number : '',
                    serie_nf: order.invoice && order.invoice.series ? order.invoice.series : '',
                    data_nf: order.invoice && order.invoice.date ? order.invoice.date : '',
                    valor_total: order.total,
                    data_pedido: order.createdAt,
                    nome_cliente: order.buyer.name,
                    documento_cliente: order.buyer.document,
                    tipo_documento_cliente: order.buyer.documentType,
                    app_nf_atualizada: false,
                    app_data_nf_atualizada: '',
                    app_status_pedido_atualizado: false,
                    app_data_status_pedido_atualizado: '',
                    app_faturamento_atrasado: false,
                    app_data_faturamento_atrasado: ''
                });
            }
            try {
                Anymarket.bulkCreate(orders_anymarket);
                console.log(insertBanco)
            } catch (erroPedido) {
                console.error('Erro ao enviar o pedido:', erroPedido.message);
            }
            quantidadePaginas = conteudo.page.totalPages
            numeroPaginaAtual++;
            offsetAtual += 100;
        } catch (error) {
        console.error('Erro na requisição:', error.message);
        break;
    }
}

return {"criado": "com sucesso!"};
}

module.exports = {
    OrdersFeedAnymarketController,
};
