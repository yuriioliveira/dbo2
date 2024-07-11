const axios = require('axios');

const getOrdersCore = async (pageIndex) => {
  const requestFinalDate = getCurrentDateTimeMinus15Days();
  const requestWhere = `CreatedDate >= "${requestFinalDate}" `


  const requestBodyData = {
    Page: {
        PageIndex: pageIndex,
        PageSize: 100,
    },
    Where: requestWhere,
    OrderBy: "OrderNumber"
  }

  try {
    const requestUrl = "https://lojadasalonline.layer.core.dcg.com.br/v1/Sales/API.svc/web/SearchOrders"

    const response = await axios.post(requestUrl, requestBodyData, {
        headers: {
            'Authorization': "Basic eXVyaS5jYXJ2YWxobzpOWkdfbnhhMHludjVoeHpfeHRt"
        }
    })

    const pedidos = response.data.Result
    console.log(pedidos)
    console.log("passou aqui")
    return pedidos
  } catch (error) {
    console.error('Erro em CoreUtils.js, função: getOrdersCore: ');
        throw error;
  }
}

const getCurrentDateTimeMinus15Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    date.setHours(0, 0, 0, 0);
    const formattedDate = date.toISOString().slice(0,19);

    return formattedDate;
}

module.exports = { getOrdersCore } 