const BsellerUtils = require('../utils/BsellerUtils');
const BsellerOrder = require('../models/BsellerOrder');

// teoricamente vai pegar todas as NF do dia e atualizar a base, caso alguma NF seja cancelada e emitida novamente, a tabela deve ser atualizada.
// poosso pensar numa logica para identificar pedidos sem NF e buscar através daqui pela data do pedido a atualizaçãso da NF. 
// só chamar o update para pedidos sem chave_nf com status maior ou igual ETR

async function BsellerOrdersFeedInvoiceUpdate() {
    let registroAtualizados = 0;
    let registrosTotal = 0;
    let dataInicial = "09/02/2024";
    let dataFinal = "12/02/2024";

    try {
        const conteudo = await BsellerUtils.getInvoiceFromBseller(dataInicial, dataFinal);
        const orders_bseller = [];
        for (const order of conteudo) {
            const existingOrder = orders_bseller.find(o => o.id_entrega === order.PED);
            if (!existingOrder) {
            let dataBseller = order.DT_SIT;
            let horarioBseller = order.HORA_EMISSAO;
            const formatedDateTime = await BsellerUtils.bsellerAjusteData(dataBseller, horarioBseller)
            const formatedDateTimeString = formatedDateTime.toISOString();
            orders_bseller.push({
                id_entrega: order.PED,
                chave_nf: order.CHAVE_ACESSO,
                numero_nf: order.NOTA,
                serie_nf: order.SERIE,
                data_nf: formatedDateTimeString
            });
        }
        }

        for (const item of orders_bseller) {
            await BsellerOrder.update({
                chave_nf: item.chave_nf,
                numero_nf: item.numero_nf,
                serie_nf: item.serie_nf,
                data_nf: item.data_nf
            }, {
                where: {
                    id_entrega: item.id_entrega
                }
            });
            registroAtualizados++
        }

        registrosTotal = conteudo.length;
        
    } catch (error) {
        console.error('Erro na requisição em BsellerOrdersFeedInvoiceUpdate', error.message);
    }

    return {
        registrosTotal,
        registroAtualizados
    };
}

module.exports = { 
    BsellerOrdersFeedInvoiceUpdate 
};