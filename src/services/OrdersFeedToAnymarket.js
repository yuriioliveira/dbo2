const AnymarketUtils = require('../utils/AnymarketUtils');
const Anymarket = require('../models/Anymarket');

const OrdersFeedToAnymarket = async () => {
    let numeroPaginaAtual = 1;
    let offsetAtual = 0;
    let quantidadePaginas = 999;
    let dataInicial = "2024-01-27";
    let dataFinal = "2024-01-30";

    let registrosCriados = 0;
    let registrosAtualizados = 0;

    while (numeroPaginaAtual <= quantidadePaginas) {
        try {
            const conteudo = await AnymarketUtils.getOrdersFromAnymarket(dataInicial, dataFinal, offsetAtual);

            for (const order of conteudo.content) {
                const orderData = {
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
                    pedido_integrado_bseller: false,
                    app_nf_atualizada: false,
                    app_data_nf_atualizada: '',
                    app_status_pedido_atualizado: false,
                    app_data_status_pedido_atualizado: '',
                    app_faturamento_atrasado: false,
                    app_data_faturamento_atrasado: ''
                };

                const [registro, created] = await Anymarket.findOrCreate({
                    where: { id_anymarket: orderData.id_anymarket },
                    defaults: orderData
                });

                if (created) {
                    registrosCriados++;
                } else {
                    delete orderData.marketplace_nome;
                    delete orderData.fulfillment;
                    delete orderData.chave_nf;
                    delete orderData.numero_nf;
                    delete orderData.serie_nf;
                    delete orderData.data_nf;
                    delete orderData.pedido_integrado_bseller;
                    delete orderData.app_nf_atualizada;
                    delete orderData.app_data_nf_atualizada;
                    delete orderData.app_status_pedido_atualizado;
                    delete orderData.app_data_status_pedido_atualizado;
                    delete orderData.app_faturamento_atrasado;
                    delete orderData.app_data_faturamento_atrasado;
                    
                    await registro.update(orderData);
                    registrosAtualizados++;
                }
            }

            quantidadePaginas = conteudo.page.totalPages;
            numeroPaginaAtual++;
            offsetAtual += 100;
        } catch (error) {
            console.error('Erro na requisição:', error.message);
            break;
        }
    }

    return {
        registrosCriados,
        registrosAtualizados
    };
}

module.exports = {
    OrdersFeedToAnymarket,
};