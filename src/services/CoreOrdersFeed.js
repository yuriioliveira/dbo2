const CoreUtils = require('../utils/CoreUtils');
const CoreOrder = require('../models/CoreOrder');


const CoreOrdersFeed = async (data) => {
    let pageIndex = 0;
    let pageCount = 999;

    while ( pageIndex <= pageCount ) {

        try {
            const ordersCore = await CoreUtils.getOrdersCore(pageIndex, pageCount);
            
        } catch (error) {
            
        }

    }
}

module.exports = {
    CoreOrdersFeed
};