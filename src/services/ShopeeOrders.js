const AnymarketUtils = require('../utils/AnymarketUtils');
const BsellerUtils = require('../utils/BsellerUtils');
const ShopeeOrder = require('../models/ShopeeOrder')

const ShopeeOrderFeed = async (dataInicial, dataFinal, marketplaceName) => { 
    let numeroPaginaAtual = 1;
    let offsetAtual = 0;
    let quantidadePaginas = 999;
    let registrosProcessados = 0;
    let registrosTotal = 0;
    const ordersShopeeAny = [];
    const ordersShopeeBseller = [];
    const ordersShopeeBsellerNf = [];

while (numeroPaginaAtual <= quantidadePaginas) {
    try {
        const conteudoAny = await AnymarketUtils.getOrdersFromAnymarket(dataInicial, dataFinal, marketplaceName, offsetAtual, registrosTotal);
        console.log("pagina atual: ", numeroPaginaAtual)
        console.log(registrosTotal)

        for (const orderAny of conteudoAny.content) {
            ordersShopeeAny.push({
                id_anymarket: orderAny.id,
                // id_entrega: null,
                id_marketplace: orderAny.marketPlaceId,
                status_anymarket: orderAny.status,
                // status_bseller: null,
                status_marketplace: orderAny.marketPlaceStatus,
                data_pedido: orderAny.createdAt,
                chave_nf_any: orderAny.invoice && orderAny.invoice.accessKey ? orderAny.invoice.accessKey : '',
                numero_nf_any: orderAny.invoice && orderAny.invoice.number ? orderAny.invoice.number : '',
                serie_nf_any: orderAny.invoice && orderAny.invoice.series ? orderAny.invoice.series : '',
                data_nf_any: orderAny.invoice && orderAny.invoice.date ? orderAny.invoice.date : '',
                valor_total: orderAny.total,
            });
        }

    } catch (error) {
        console.error('Erro na requisição services/ShopeeOrders.js: ', error.message);
        break;
    }
}

try {
    const conteudoBsellerNf = await BsellerUtils.getInvoiceFromBseller(dataInicial, dataFinal);
    for (const orderBsellerNf of conteudoBsellerNf) {
        if ( orderBsellerNf.NOME_UNINEG == 'SHOPEE') {
                let dataBseller = orderBsellerNf.DT_SIT;
                let horarioBseller = orderBsellerNf.HORA_EMISSAO;
                const formatedDateTime = await BsellerUtils.bsellerAjusteData(dataBseller, horarioBseller)
                const formatedDateTimeString = formatedDateTime.toISOString();
                ordersShopeeBsellerNf.push({
                    id_entrega: orderBsellerNf.PED,
                    chave_nf: orderBsellerNf.CHAVE_ACESSO,
                    numero_nf: orderBsellerNf.NOTA,
                    serie_nf: orderBsellerNf.SERIE,
                    data_nf: formatedDateTimeString
                })
        }
    }

} catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
}

try {
    const conteudoBseller = await BsellerUtils.getOrdersFrom280Bseller(
        dataInicial,
        dataFinal
      );
      
      for (const orderBseller of conteudoBseller) {
        if ( orderBseller.NOME_CANAL == "Shopee") {
            ordersShopeeBseller.push({
                id_anymarket: orderBseller.PEDC_PED_CLIENTE,
                id_entrega: orderBseller.PEDC_ID_PEDIDO,
                status_bseller: orderBseller.SREF_ID_PONTO_ULT,
                // voltar aqui, pegar a NF do array ordersShopeeBsellerNf
                chave_nf_bseller: order.CHAVE_ACESSO,
                numero_nf_bseller: order.NOTA,
                serie_nf_bseller: order.SERIE,
                data_nf_bseller: formatedDateTimeString

            })
        }
      }
    
} catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
}

}
