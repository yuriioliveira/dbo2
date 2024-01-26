const BsellerService = require('../services/BsellerServices');
const Bseller = require('../models/Bseller');

const OrdersFeedBsellerController = async () => {
    let dataInicial = "2024-01-25";
    let dataFinal = "2024-01-25";
    const maxIntegerValue = 5297918851;

    let uniNeg = [1, 7];
    let registrosCriados = 0;
    let registrosAtualizados = 0;
    let i;

    try {
        for (let i = 0; i < uniNeg.length; i++) {
            const conteudo = await BsellerService.getOrdersFromBseller(dataInicial, dataFinal, uniNeg, i);
            for (const order of conteudo.content) {
                let orderData = {
                    id_anymarket: order.pedido,
                    id_entrega: order.entrega,
                    status_bseller: order.ultimoStatus.id,
                    chave_nf: '',
                    numero_nf: '',
                    serie_nf: '',
                    data_nf: '',
                    app_pagamento_aprovado: false,
                    app_data_aprovacao_pagamento: ''
                };
                if (order.pedido < maxIntegerValue) {
                    const [registro, created] = await Bseller.findOrCreate({
                        where: { id_entrega: orderData.id_entrega },
                        defaults: orderData
                    });

                    if (created) {
                        registrosCriados++;
                    } else {
                        await registro.update(orderData);
                        registrosAtualizados++;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro na requisição:', error.message);
    }
    return { "criado": "com sucesso!" };
}

module.exports = {
    OrdersFeedBsellerController,
};