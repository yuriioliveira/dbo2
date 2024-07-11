const BsellerUtils = require('../utils/BsellerUtils');
const BsellerOrder = require('../models/BsellerOrder');

const BsellerOrdersComplete = async (dataInicial, dataFinal) => {
let quantidadePedidos = 0;
let quantidadeNfs = 0;
let quantidadePedidosSemNf = 0;
let quantidadeNfSemPedido = 0;
const orders280 = [];
const orders880 = [];

try {
    const relatorio280 = await BsellerUtils.getOrdersFrom280Bseller(dataInicial, dataFinal);

    for (const order of relatorio280) {
        const existingOrder280 = orders280.find(o => o.id_anymarket === order.PEDC_PED_CLIENTE);
        if (!existingOrder280) {
            orders280.push({
                id_anymarket: order.PEDC_PED_CLIENTE,
                id_entrega: order.PEDC_ID_PEDIDO,
                status_bseller: order.SREF_ID_PONTO_ULT,
                data_pedido: order.PEDC_DT_EMISSAO,
                origem_pedido: order.ID_ORIGEM,
            });
        }
    }
    quantidadePedidos = orders280.length;
    console.log(quantidadePedidos)


} catch (error) {
    console.error('Erro na requisição 280: AQUI', error.message);   
}

try {
    const relatorio880 = await BsellerUtils.getInvoiceFromBseller(dataInicial, dataFinal);

    for (const order of relatorio880) {
        const existingOrder880 = orders880.find(o => o.id_entrega === order.PED);
        if (!existingOrder880) {
        let dataBseller = order.DT_SIT;
        let horarioBseller = order.HORA_EMISSAO;
        const formatedDateTime = await BsellerUtils.bsellerAjusteData(dataBseller, horarioBseller)
        const formatedDateTimeString = formatedDateTime.toISOString();
        orders880.push({
            id_entrega: order.PED,
            chave_nf: order.CHAVE_ACESSO,
            numero_nf: order.NOTA,
            serie_nf: order.SERIE,
            data_nf: formatedDateTimeString
        });
    }
    }

    quantidadeNfs = orders880.length;
    console.log(quantidadeNfs)

    
} catch (error) {
    console.error('Erro na requisição em relatório 880', error.message);
}


const combinedOrders = orders280.map(order280 => {
    const order880 = orders880.find(order => order.id_entrega === order280.id_entrega);
    return order880 ? {...order280, ...order880} : order280;
});

return {
    "pedidos": combinedOrders,
}

}

module.exports = {
    BsellerOrdersComplete,
};