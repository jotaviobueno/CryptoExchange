// model
import balanceModel from '../../model/finance/BalanceModel.js';

import axios from 'axios';

class finance {
    
    async getBalance (email) {
        const getClientBalance = await balanceModel.findOne({email: email, deleted_at: null});

        if (getClientBalance === null)
            return false;

        return true, getClientBalance;
    }

    async verifyCoin (firstCoin) {
        const fiatCoinArray = [{coin: "usd"}, {coin: "brl"}, {coin: "eur"}, {coin: "ars"}, {coin: "rub"}];

        const filter = fiatCoinArray.filter((coin) => coin.coin === firstCoin);

        if (filter.length != 1)
            return false;

        return true;
    }

    async verifyCrypto (crypto) {
        const fiatCryptoArray = [{coin: "btc"}, {coin: "xrp"}, {coin: "eth"}, {coin: "ltc"}];

        const filter = fiatCryptoArray.filter((coin) => coin.coin === crypto);

        if (filter.length != 1)
            return false;

        return true;
    }

    async seeBalance (email) {
        return true, await balanceModel.findOne({email: email, deleted_at: null}).select({_id: 0, __v: 0, deleted_at: 0, created_in: 0, update_at: 0});
    }

    async getCryptoPrice (stableCoin, cryptoName) {
        try {
            const price = await axios.get(`https://economia.awesomeapi.com.br/last/${cryptoName}-${stableCoin}`);

            return price.data

        } catch (e) {
            return false;
        }
    } 
}

export default new finance();