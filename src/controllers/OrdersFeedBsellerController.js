const BsellerService = require('../services/BsellerServices');
const Bseller = require('../models/Bseller');

const ordersFeed280BsellerController = async () => {
    let dataInicial = "24/01/2024";
    let dataFinal = "28/01/2024";
    let registrosCriados = 0;
    let registrosAtualizados = 0;
    const maxIntegerValue = 5297918851;

    try {
        const conteudo = await BsellerService.getOrdersFrom280Bseller(dataInicial, dataFinal);
        console.log(conteudo)
        for (const order of conteudo) {
            const orderData = {
                id_anymarket: order.PEDC_PED_CLIENTE,
                id_entrega: order.PEDC_ID_PEDIDO,
                status_bseller: order.SREF_ID_PONTO_ULT,
                data_pedido: order.PEDC_DT_EMISSAO,
                chave_nf: '',
                numero_nf: '',
                serie_nf: '',
                data_nf: '',
                pedido_integrado_intelipost: false,
                app_pagamento_aprovado: false,
                app_data_aprovacao_pagamento: ''
            };
            if (order.PEDC_PED_CLIENTE < maxIntegerValue) {
                const [registro, created] = await Bseller.findOrCreate({
                    where: { id_entrega: orderData.id_entrega },
                    defaults: orderData
                });

                if (created) {
                    registrosCriados++;
                } else {
                    delete orderData.chave_nf;
                    delete orderData.numero_nf;
                    delete orderData.serie_nf;
                    delete orderData.data_nf;
                    delete orderData.pedido_integrado_intelipost;
                    delete orderData.app_pagamento_aprovado;
                    delete orderData.app_data_aprovacao_pagamento;
                    
                    await registro.update(orderData);
                    registrosAtualizados++;
                }
            }
        }
    } catch (error) {
        console.error('Erro na requisição:', error.message);
    }

    return {
        registrosCriados,
        registrosAtualizados
    };
}

module.exports = {
    ordersFeed280BsellerController
};