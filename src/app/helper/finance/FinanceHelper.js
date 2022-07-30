// model
import balanceModel from '../../model/wallet/BalanceModel.js';

class finance {
    
    async getBalance (email) {
        const getClientBalance = await balanceModel.findOne({email: email, deleted_at: null});

        if (getClientBalance === null)
            return false;

        return true, getClientBalance;
    }

    async verifyCoin (firstCoin) {
        const fiatCoinArray = [{coin: "usd"}, {coin: "brl"}, {coin: "euro"}, {coin: "ars"}, {coin: "rub"}];

        const filter = fiatCoinArray.filter((coin) => coin.coin === firstCoin);

        if (filter.length != 1)
            return false;

        return true;

    }
}

export default new finance();