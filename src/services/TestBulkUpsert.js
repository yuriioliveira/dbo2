const AnymarketUtils = require('../utils/AnymarketUtils');
const Anymarket = require('../models/Anymarket');

// implementar para não atualizar os campos: pedido_integrado_bseller e outros a ver

const OrdersUpsertAnymarket = async () => {
    let numeroPaginaAtual = 1;
    let offsetAtual = 0;
    let quantidadePaginas = 999;
    let dataInicial = "2024-01-28";
    let dataFinal = "2024-01-28";

    let registrosCriados = 0;
    let registrosAtualizados = 0;

    while (numeroPaginaAtual <= quantidadePaginas) {
        try {
            const conteudo = await AnymarketUtils.getOrdersFromAnymarket(dataInicial, dataFinal, offsetAtual);

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
                    app_nf_atualizada: false,
                    app_data_nf_atualizada: '',
                    app_status_pedido_atualizado: false,
                    app_data_status_pedido_atualizado: '',
                    app_faturamento_atrasado: false,
                    app_data_faturamento_atrasado: ''
                });
            }
    
                const result = await Anymarket.bulkCreate(orders_anymarket,
                    console.log(orders_anymarket),
                    {
                        updateOnDuplicate:["id_anymarket", "status_marketplace"]
                    }
                    );
    
                registrosCriados += result.length;
                registrosAtualizados += orders_anymarket.length - result.length;
    
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
        OrdersUpsertAnymarket,
    };