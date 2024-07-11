const AnymarketUtils = require('../utils/AnymarketUtils');
const AnymarketOrder = require('../models/AnymarketOrder');

// fazer com que exiba a quantidade de registros no início e outro item que vai mostrando quantos itens faltam serem processados a cada iteração

const AnymarketOrdersFeed = async (dataInicial, dataFinal, marketplaceName) => {
    let numeroPaginaAtual = 1;
    let offsetAtual = 0;
    let quantidadePaginas = 999;
    let registrosProcessados = 0;
    let registrosTotal = 0;

    while (numeroPaginaAtual <= quantidadePaginas) {
        try {
            const conteudo = await AnymarketUtils.getOrdersFromAnymarket(dataInicial, dataFinal, marketplaceName, offsetAtual, registrosTotal);
            console.log("pagina atual: ", numeroPaginaAtual)
            console.log(registrosTotal)
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
                    pedido_integrado_bseller: false,
                    pedido_integrado_intelipost: false,
                    monitorar_status: true,
                    app_nf_atualizada: false,
                    app_data_nf_atualizada: '',
                    app_status_pedido_atualizado: false,
                    app_data_status_pedido_atualizado: '',
                    app_faturamento_atrasado: false,
                    app_data_faturamento_atrasado: ''
                });
            }

                const result = await AnymarketOrder.bulkCreate(orders_anymarket,{
                    updateOnDuplicate: ['id_anymarket','status_anymarket', 'status_marketplace','chave_nf','numero_nf','serie_nf','data_nf'],
                    conflictAttributes: ['id_anymarket']
                })
    
                registrosProcessados += result.length;
                registrosTotal = conteudo.page.totalElements
    
                quantidadePaginas = conteudo.page.totalPages;
                numeroPaginaAtual++;
                offsetAtual += 100;
            } catch (error) {
                console.error('Erro na requisição services/OrdersFeedToAnymarmket.js: ', error.message);
                break;
            }
        }
    
        return {
            registrosProcessados,
            registrosTotal,
            dataInicial,
            dataFinal
        };
    }
    
    module.exports = {
        AnymarketOrdersFeed,
    };