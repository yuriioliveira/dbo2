// bater os pedidos
// 	status de pedido
// 	shopee cancelado - bater status any com o do Bseller
// 	transportadora Nao enviar
// 	pagamento

// Acompanha "Nao importados" da any

// magazine, madeira e via - Ver a aba falha da any para identificar erro de atualizacao de NF

// PEdido que nao saiu, pela data de aprovacao de pagamento , relatorio 280 bseller. 

// atraso no rastreio, olhar no magalu para ter uma ideia, passar para o Danilo. 

// relatorio Magalu para identificar problema de XML. 

const BsellerUtils = require("../utils/BsellerUtils");
const AnymarketUtils = require('../utils/AnymarketUtils');

// ANYMARKET
// "id": 158439050,
// "marketPlaceNumber": "2000007899538986",
// "marketPlace": "MERCADO_LIVRE",
// "createdAt": "2024-03-25T17:20:33Z",
// "paymentDate": "2024-03-25T17:29:16Z",
// "status": "INVOICED",
// "invoice": {
//     "accessKey": "35240301773518000988552000004489061181174427",
//     "series": "200",
//     "number": "448906",
//     "date": "2024-03-25T17:29:19Z",
//     "invoiceLink": "https://s3.us-east-1.amazonaws.com/xml.anymarket.com.br/259034735.1584390502024-03-25T14:29:24.363.xml",
//     "cfop": "6106"
// },


// BSELLER
// "PEDC_ID_PEDIDO": 92301911,
// "SREF_ID_PONTO_ULT": "AAP",
// "CLIE_APELIDO": "JADLOG",
// "NOME_CANAL": "Magazine Luiza",
// PEDC_PED_CLIENTE": "158408610",

// CORE

OrderNumber


const OrdersValidation = async (dataInicial, dataFinal) => {
    let dateFilterCore = getCurrentDateTimeMinus15Days();

}



const getCurrentDateTimeMinus15Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    date.setHours(0, 0, 0, 0);
    const formattedDate = date.toISOString().slice(0,19);

    return formattedDate;
}