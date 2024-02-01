const Intelipost = require('../models/Intelipost');

const intelipostFindOne = async (findParametersIntelipost) => {
    try {
        const returnIntelipostFindOne = await Intelipost.findOne({
          where: 
          findParametersIntelipost
          })
  
          return returnIntelipostFindOne;
  
    } catch (error) {
        console.error('Erro em intelipostUtils.js, função: intelipostFindOne: ', error.message);
        throw error;
    }
  }

  
  module.exports = {
    intelipostFindOne
};