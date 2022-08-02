// repository
import balanceModel from '../../../model/finance/BalanceModel.js';

class repository {

    async calculation (amount, cryptoPrice, stableCoin, cryptoName) {
        let coinName = cryptoName + stableCoin;
        const CoinNameUpperCase = coinName.toUpperCase(); 
        
        const call = parseFloat(amount) / parseFloat(cryptoPrice[CoinNameUpperCase].bid);
        const a = parseFloat(amount) * parseFloat(cryptoPrice[CoinNameUpperCase].bid);
        console.log(a);
    }

    async buy (req, res) {

    }
}

export default new repository();