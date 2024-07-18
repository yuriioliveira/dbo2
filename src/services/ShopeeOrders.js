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
                id_marketplace: orderAny.marketPlaceId,
                status_anymarket: orderAny.status,
                status_marketplace: orderAny.marketPlaceStatus,
                data_pedido: orderAny.createdAt,
                chave_nf_any: orderAny.invoice && orderAny.invoice.accessKey ? orderAny.invoice.accessKey : '',
                numero_nf_any: orderAny.invoice && orderAny.invoice.number ? orderAny.invoice.number : '',
                serie_nf_any: orderAny.invoice && orderAny.invoice.series ? orderAny.invoice.series : '',
                data_nf_any: orderAny.invoice && orderAny.invoice.date ? orderAny.invoice.date : '',
                valor_total: orderAny.total,
            });
        }

        quantidadePaginas = conteudoAny.page.totalPages;
        numeroPaginaAtual++;

    } catch (error) {
        console.error('Erro na requisição services/ShopeeOrders.js: ', error.message);
        break;
    }
}

// console.log("passou da fase da Anymarket")
// console.log(ordersShopeeAny)

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
                    chave_nf_bseller: orderBsellerNf.CHAVE_ACESSO,
                    numero_nf_bseller: orderBsellerNf.NOTA,
                    serie_nf_bseller: orderBsellerNf.SERIE,
                    data_nf_bseller: formatedDateTimeString
                })
        }
    }

} catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
}
//console.log(ordersShopeeBsellerNf)
//console.log("Obteve os dados da NF no Bseller")

// COLOCAR O CODIGO DE VALIDACAO AQUI
const matchingOrderNfYuri = ordersShopeeBsellerNf.find(order => order.id_entrega === 96414807);
//console.log('Matching order:', matchingOrderNfYuri);

try {
    const conteudoBseller = await BsellerUtils.getOrdersFrom280Bseller(
        dataInicial,
        dataFinal
      );
      
      for (const orderBseller of conteudoBseller) {
        if ( orderBseller.NOME_CANAL == "Shopee") {
            const matchingNf = ordersShopeeBsellerNf.find(nf => nf.id_entrega === orderBseller.PEDC_ID_PEDIDO);
            
            ordersShopeeBseller.push({
                id_anymarket: orderBseller.PEDC_PED_CLIENTE,
                id_entrega: orderBseller.PEDC_ID_PEDIDO,
                status_bseller: orderBseller.SREF_ID_PONTO_ULT,
                chave_nf_bseller: matchingNf ? matchingNf.chave_nf_bseller : '',
                numero_nf_bseller: matchingNf ? matchingNf.numero_nf_bseller : '',
                serie_nf_bseller: matchingNf ? matchingNf.serie_nf_bseller : '',
                data_nf_bseller: matchingNf ? matchingNf.data_nf_bseller : ''
            })
        }
      }
    
} catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
}

//console.log("Obteve os dados de pedido do Bseller")
//console.log(ordersShopeeBseller[1])

// Combinar ordersShopeeAny e ordersShopeeBseller

const combinedOrders = ordersShopeeAny.map(orderAny => {
    const matchingBseller = ordersShopeeBseller.find(orderBseller => orderBseller.id_anymarket === orderAny.id_anymarket);
    if (matchingBseller) {
        return {
            ...orderAny,
            status_bseller: matchingBseller.status_bseller,
            chave_nf_bseller: matchingBseller.chave_nf_bseller,
            numero_nf_bseller: matchingBseller.numero_nf_bseller,
            serie_nf_bseller: matchingBseller.serie_nf_bseller,
            data_nf_bseller: matchingBseller.data_nf_bseller,
        };
    } else {
        return {
            ...orderAny,
            status_bseller: 'pedido não integrado',
            chave_nf_bseller: 'pedido não integrado',
            numero_nf_bseller: 'pedido não integrado',
            serie_nf_bseller: 'pedido não integrado',
            data_nf_bseller: 'pedido não integrado',
        };
    }
});
//console.log(combinedOrders[1])

// Adicionar a consulta no combinedOrders
const matchingCombinedOrder = combinedOrders.find(order => order.id_anymarket === 174651797);
console.log('Matching combined order:', matchingCombinedOrder);

const result = await ShopeeOrder.bulkCreate(combinedOrders,{
    updateOnDuplicate: [
        'id_anymarket',
        'id_entrega',
        'status_anymarket',
        'status_marketplace',
        'chave_nf_any',
        'numero_nf_any',
        'serie_nf_any',
        'data_nf_any',
        'chave_nf_bseller', 
        'numero_nf_bseller',
        'serie_nf_bseller',
        'data_nf_bseller'
    ],

    conflictAttributes: ['id_anymarket']
})

registrosProcessados += result.length;

return {
    registrosProcessados,
    registrosTotal,
    dataInicial,
    dataFinal,
    combinedOrders
}

}

module.exports = {
    ShopeeOrderFeed,
};
