// dados do 280 - Obter dados OK
//dados do 230 - Obter dados OK
// dados do 880 - Obter dados OK
// dados Anymarket, só fulfillment. - Obter dados OK
const BsellerUtils = require("../utils/BsellerUtils");
const AnymarketUtils = require('../utils/AnymarketUtils');

const GeralOrdersFeed = async (dataInicial, dataFinal) => {
    console.log(dataInicial)
    console.log(dataFinal)
  let numeroPaginaAtual = 1;
  let offsetAtual = 0;
  let quantidadePaginas = 999;
  let registrosProcessados = 0;
  let registrosTotal = 0;
  const ordersTodb = [];

  while (numeroPaginaAtual <= quantidadePaginas) {
    try {
        const conteudoAnymarket = await AnymarketUtils.getOrdersFromAnymarket(dataInicial, dataFinal, offsetAtual, registrosTotal);
        for (const orderAny of conteudoAnymarket.content) {
            if (orderAny.fulfillment === true) {
                ordersTodb.push({
                    id_entrega: null,
                    id_anymarket_core: orderAny.id,
                    id_marketplace: orderAny.marketPlaceId,
                    valor_total: orderAny.total,
                    valor_frete: orderAny.freight,
                    data_pedido: orderAny.createdAt,
                    forma_pagamento: orderAny.payments[0].paymentMethodNormalized,
                    data_aprovacao_pagamento: orderAny.paymentDate,
                    status: orderAny.status,
                    status_data: null,
                    nome_marketplace: orderAny.marketPlace,
                    transportadora: 'fulfillment',
                    origem_pedido: 'Anymarket',
                    fulfillment: orderAny.fulfillment,
                    custo_frete_fulfillment: orderAny.sellerFreight,
                    cliente_nome: orderAny.buyer.name,
                    cliente_cpfcnpj: orderAny.buyer.document,
                    cliente_uf: orderAny.shipping.state,
                    cliente_cidade: orderAny.shipping.city,
                    cliente_bairro: orderAny.shipping.neighborhood,
                    nfe_chave: orderAny.invoice && orderAny.invoice.accessKey ? orderAny.invoice.accessKey : '',
                    nfe_numero: orderAny.invoice && orderAny.invoice.number ? orderAny.invoice.number : '',
                    nfe_serie: orderAny.invoice && orderAny.invoice.series ? orderAny.invoice.series : '',
                    nfe_data: orderAny.invoice && orderAny.invoice.date ? orderAny.invoice.date : '',
                    produtos: orderAny.items.map(item => ({
                        "nome_produto": item.product.title,
                        "sku_kit": item.sku.partnerId,
                        "sku_item": item.sku.partnerId,
                        "id_produto": null,
                        "quantidade": item.amount,
                        "valor_mercadoria": item.unit,
                        "valor_total": item.total,
                        "desconto_incondicional": item.discount,
                        "desconto_condicional": null,
                        "quantidade_faturado": null,
                        "Departamento": null,
                        "SETOR": null,
                        "Familia": null,
                        "subfamilia": null,
                    })),
                    id_filial: null,
                    despesas_financeiras: null,
                    unidade_negocio: null,
                    usuário_inclusao: null,
                    id_canal: null,
                });
                
            }
        }
        console.log("chegouAqui galera")
        registrosProcessados += result.length;
        registrosTotal = conteudo.page.totalElements

        quantidadePaginas = conteudo.page.totalPages;
        numeroPaginaAtual++;
        offsetAtual += 100;
      } catch (error) {
        console.error('Erro na requisição Anymarket em GeralOrdersFeed: ', error.message);
        break;
      }
  }

  // passar para o Utils
  function formatDate(dateString) {
    const dateParts = dateString.split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

  try {

    let dataInicialBseller = formatDate(dataInicial);
    console.log("data Inicial Bseller " + dataInicialBseller)
    let dataFinalBseller = formatDate(dataFinal);
    console.log("data final Bseller " + dataFinalBseller)

    const conteudo280Bseller = await BsellerUtils.getOrdersFrom280Bseller(
        dataInicialBseller,
        dataFinalBseller
      );
    
      for(const order280Bseller of conteudo280Bseller) {
        const existingOrder = ordersTodb.find(
            (o) => o.id_entrega === order280Bseller.PEDC_ID_PEDIDO
          );
          if (!existingOrder) {
            ordersTodb.push({
                id_entrega: order280Bseller.PEDC_ID_PEDIDO,
                id_anymarket_core: order280Bseller.PEDC_PED_CLIENTE,
                id_marketplace: order280Bseller.PED_EXTERNO,
                valor_total: order280Bseller.PEPA_VL_MEIO,
                valor_frete: order280Bseller.PEDC_VL_FRETE_CLIENTE,
                data_pedido: order280Bseller.PEDC_DT_EMISSAO,
                forma_pagamento: order280Bseller.MEIP_NOME,
                data_aprovacao_pagamento: order280Bseller.PEDC_DT_APROVADO,
                status: order280Bseller.SREF_ID_PONTO_ULT,
                status_data: order280Bseller.SREF_DT_PREV_ULT,
                nome_marketplace: order280Bseller.NOME_CANAL,
                transportadora: order280Bseller.CLIE_APELIDO,
                origem_pedido: order280Bseller.ID_ORIGEM,
                fulfillment: 'false',
                custo_frete_fulfillment: null,
                cliente_nome: order280Bseller.CLIE_NOME,
                cliente_cpfcnpj: order280Bseller.PEDC_ID_CLIENTE,
                cliente_uf: order280Bseller.ESTADO,
                cliente_cidade: order280Bseller.NOME_MUNICIPIO,
                cliente_bairro: order280Bseller.BAIRRO,
                nfe_chave: null,
                nfe_numero: null,
                nfe_serie: null,
                nfe_data: null,
                produtos: [
                    {
                        "nome_produto": order280Bseller.NOME_ITEM,
                        "sku_kit": order280Bseller.PEDD_ID_ITEM_PAI,
                        "sku_item": order280Bseller.COD_TERCEIRO,
                        "id_produto": order280Bseller.PEDD_ID_ITEM,
                        "quantidade": order280Bseller.QT_PED,
                        "valor_mercadoria": order280Bseller.VL_MERCADORIA,
                        "valor_total": order280Bseller.VL_TOTAL,
                        "desconto_incondicional": order280Bseller.VL_DESC_INC,
                        "desconto_condicional": order280Bseller.VL_DESC_COND,
                        "quantidade_faturado": order280Bseller.QT_FAT,
                        "Departamento": null,
                        "SETOR": null,
                        "Familia": null,
                        "subfamilia": null,
                    }
                ],
                id_filial: order280Bseller.PEDC_ID_FILIAL,
                despesas_financeiras: order280Bseller.PEDC_VL_DESP_FINANC,
                unidade_negocio: order280Bseller.PEDC_ID_UNINEG,
                usuário_inclusao: order280Bseller.USUARIO_INC,
                id_canal: order280Bseller.CANAL,
            });
          }
      }
  } catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
  }

return ordersTodb;

};

module.exports = {
    GeralOrdersFeed,
  };