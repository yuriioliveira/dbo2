// dados do 280 - Obter dados OK
//dados do 230 - Obter dados OK
// dados do 880 - Obter dados OK
// dados Anymarket, só fulfillment. - Obter dados OK - Ok
const BsellerUtils = require("../utils/BsellerUtils");
const AnymarketUtils = require('../utils/AnymarketUtils');
const GeralOrder = require('../models/GeralOrder');


// função para formatar a data para a API do Bseller. Deveria passar isso para o Utils?
function formatDate(dateString) {
  const dateParts = dateString.split("-");
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

// Função para adicionar dois dias na data Final para obter as notas fiscais. 
function addDaysToDate(dateString, daysToAdd) {
  const dateParts = dateString.split("/");
  let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // JavaScript conta os meses a partir de 0
  date.setDate(date.getDate() + daysToAdd);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}


const GeralOrdersFeed = async (dataInicial, dataFinal) => {

  let numeroPaginaAtual = 1;
  let offsetAtual = 0;
  let quantidadePaginas = 999;
  let registrosProcessados = 0;
  let registrosTotal = 0;
  const ordersTodb = [];
  const infoProdutosBseller = []
  const nfOrdersBseller = []

  let dataInicialBseller = formatDate(dataInicial);
  let dataFinalBseller = formatDate(dataFinal);
  let nfDataFinalBseller = addDaysToDate(dataFinalBseller, 2);


  // Obter dados do produto no 230 do Bseller
  try {
    // isso deveria ficar no nosso banco? Talvez deva ir para o Utils tb? 
    console.log("obtendo produtos...")
    const conteudo230Bseller = await BsellerUtils.getDataFrom230Bseller();
    for (const produto of conteudo230Bseller) {
      infoProdutosBseller.push({
        "sku": produto.ITEG_COD_TERCEIRO,
        "departamento": produto.DEPA_NOME,
        "setor": produto.SETO_NOME,
        "familia": produto.FAMI_NOME,
        "subfamilia": produto.SUFA_NOME
      })
    }
    console.log("Terminou de obter produtos!")

  } catch (error) {
    console.error('Erro na requisição dos produtos em GeralOrdersFeed: ', error.message);
  }

  // Obter dados das notas fiscais no 880 para os pedidos faturados pelo Bseller
  // adicionar dois dias na data final para garantir que as notas fiscais sejam obtidas
  try {
    console.log("obtendo notas fiscais...")
    const conteudo880Bseller = await BsellerUtils.getInvoiceFromBseller(dataInicialBseller, nfDataFinalBseller);
    for (const notaFiscal of conteudo880Bseller) {
      let dataBseller = notaFiscal.DT_SIT;
      let horarioBseller = notaFiscal.HORA_EMISSAO;
      const formatedDateTime = await BsellerUtils.bsellerAjusteData(dataBseller, horarioBseller)
      const formatedDateTimeString = formatedDateTime.toISOString();
      nfOrdersBseller.push({
        "id_entrega": notaFiscal.PED,
        "nfe_chave": notaFiscal.CHAVE_ACESSO,
        "nfe_numero": notaFiscal.NOTA,
        "nfe_serie": notaFiscal.SERIE,
        "nfe_data": formatedDateTimeString
      })
    }
    console.log("Terminou de obter as NF's!")

  } catch (error) {
    console.error('Erro na requisição das NFs em GeralOrdersFeed: ', error.message);
  }

  // Obter os pedidos da Anymarket, apenas os que são do fulfillment.
  while (numeroPaginaAtual <= quantidadePaginas) {
    try {
      console.log(numeroPaginaAtual)
      console.log(quantidadePaginas)
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
            cliente_bairro: orderAny.shipping.neighborhood ? orderAny.shipping.neighborhood : 'Sem bairro',
            nfe_chave: orderAny.invoice && orderAny.invoice.accessKey ? orderAny.invoice.accessKey : '',
            nfe_numero: orderAny.invoice && orderAny.invoice.number ? orderAny.invoice.number : '',
            nfe_serie: orderAny.invoice && orderAny.invoice.series ? orderAny.invoice.series : '',
            nfe_data: orderAny.invoice && orderAny.invoice.date ? orderAny.invoice.date : '',
            produtos: orderAny.items.map(item => {
              const produtoBseller = infoProdutosBseller.find(produto => produto.sku === item.sku.partnerId);
              return {
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
                "departamento": produtoBseller ? produtoBseller.departamento : 'nao encontrado',
                "setor": produtoBseller ? produtoBseller.setor : 'nao encontrado',
                "familia": produtoBseller ? produtoBseller.familia : 'nao encontrado',
                "subfamilia": produtoBseller ? produtoBseller.subfamilia : 'nao encontrado',
              }
            }),
            id_filial: null,
            despesas_financeiras: null,
            unidade_negocio: null,
            usuário_inclusao: null,
            id_canal: null,
          });

        }
      }

      registrosTotal = conteudoAnymarket.page.totalElements
      quantidadePaginas = conteudoAnymarket.page.totalPages;
      numeroPaginaAtual++;
      offsetAtual += 100;
    } catch (error) {
      console.error('Erro na requisição Anymarket em GeralOrdersFeed: ', error.message);
      break;
    }
  }

  // Obtendo pedidos do Bseller através do 280. 
  try {
    const conteudo280Bseller = await BsellerUtils.getOrdersFrom280Bseller(
      dataInicialBseller,
      dataFinalBseller
    );

    for (const order280Bseller of conteudo280Bseller) {
      if (order280Bseller.origem_pedido === "Troca") {
        console.log('pedido como troca')
        ordersTodb.push({
          id_entrega: order280Bseller.PEDC_ID_PEDIDO,
          id_anymarket_core: '8889' + order280Bseller.PEDC_PED_CLIENTE,
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
          cliente_bairro: order280Bseller.BAIRRO ? order280Bseller.BAIRRO : 'Sem bairro',
          ...(() => {
            const nfOrder = nfOrdersBseller.find(nf => nf.id_entrega === order280Bseller.PEDC_ID_PEDIDO);
            return {
              nfe_chave: nfOrder ? nfOrder.nfe_chave : 'Sem NF',
              nfe_numero: nfOrder ? nfOrder.nfe_numero : 'Sem NF',
              nfe_serie: nfOrder ? nfOrder.nfe_serie : 'Sem NF',
              nfe_data: nfOrder ? nfOrder.nfe_data : 'Sem NF',
            }
          })(),

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
              ...(() => {
                const produtoBseller = infoProdutosBseller.find(produto => produto.sku === order280Bseller.COD_TERCEIRO);
                return {
                  "departamento": produtoBseller ? produtoBseller.departamento : 'nao encontrado',
                  "setor": produtoBseller ? produtoBseller.setor : 'nao encontrado',
                  "familia": produtoBseller ? produtoBseller.familia : 'nao encontrado',
                  "subfamilia": produtoBseller ? produtoBseller.subfamilia : 'nao encontrado',
                }
              })()
            }
          ],
          id_filial: order280Bseller.PEDC_ID_FILIAL,
          despesas_financeiras: order280Bseller.PEDC_VL_DESP_FINANC,
          unidade_negocio: order280Bseller.PEDC_ID_UNINEG,
          usuário_inclusao: order280Bseller.USUARIO_INC,
          id_canal: order280Bseller.CANAL,
        });

      } else {
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
            cliente_bairro: order280Bseller.BAIRRO ? order280Bseller.BAIRRO : 'Sem bairro',
            ...(() => {
              const nfOrder = nfOrdersBseller.find(nf => nf.id_entrega === order280Bseller.PEDC_ID_PEDIDO);
              return {
                nfe_chave: nfOrder ? nfOrder.nfe_chave : 'Sem NF',
                nfe_numero: nfOrder ? nfOrder.nfe_numero : 'Sem NF',
                nfe_serie: nfOrder ? nfOrder.nfe_serie : 'Sem NF',
                nfe_data: nfOrder ? nfOrder.nfe_data : 'Sem NF',
              }
            })(),

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
                ...(() => {
                  const produtoBseller = infoProdutosBseller.find(produto => produto.sku === order280Bseller.COD_TERCEIRO);
                  return {
                    "departamento": produtoBseller ? produtoBseller.departamento : 'nao encontrado',
                    "setor": produtoBseller ? produtoBseller.setor : 'nao encontrado',
                    "familia": produtoBseller ? produtoBseller.familia : 'nao encontrado',
                    "subfamilia": produtoBseller ? produtoBseller.subfamilia : 'nao encontrado',
                  }
                })()
              }
            ],
            id_filial: order280Bseller.PEDC_ID_FILIAL,
            despesas_financeiras: order280Bseller.PEDC_VL_DESP_FINANC,
            unidade_negocio: order280Bseller.PEDC_ID_UNINEG,
            usuário_inclusao: order280Bseller.USUARIO_INC,
            id_canal: order280Bseller.CANAL,
          });
        } else {
          // incluir produto Bseller
          let addProduto = {
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
            ...(() => {
              const produtoBseller = infoProdutosBseller.find(produto => produto.sku === order280Bseller.COD_TERCEIRO);
              return {
                "departamento": produtoBseller ? produtoBseller.departamento : 'nao encontrado',
                "setor": produtoBseller ? produtoBseller.setor : 'nao encontrado',
                "familia": produtoBseller ? produtoBseller.familia : 'nao encontrado',
                "subfamilia": produtoBseller ? produtoBseller.subfamilia : 'nao encontrado',
              }
            })()
          }
          existingOrder.produtos.push(addProduto)
        }
      }
    }
  } catch (error) {
    console.error('Erro na requisição do 280 AQUI: ', error.message);
  }

  //Envia os dados para o banco de dados.
  try {
    const sendToDatabase = await GeralOrder.bulkCreate(ordersTodb, {
      updateOnDuplicate: ['id_anymarket_core', 'status', 'nfe_chave', 'nfe_numero', 'nfe_serie', 'nfe_data'],
      conflictAttributes: ['id_anymarket_core']
    })

  } catch (error) {
    console.error('Erro ao enviar para o banco em GeralOrdersFeed: ', error.message);
  }


  //registrosProcessados += result.length;

  return ordersTodb;

};

module.exports = {
  GeralOrdersFeed,
};