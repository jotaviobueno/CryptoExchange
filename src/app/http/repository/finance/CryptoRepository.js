// repository
import balanceModel from '../../../model/finance/BalanceModel.js';
import BuyCryptoLogModel from '../../../model/finance/log/BuyCryptoLogModel.js';
import SellCryptoLogModel from '../../../model/finance/log/SellCryptoLogModel.js';

import { v4 as uuidv4 } from 'uuid';

class repository {

    async buy (value, cryptoPrice, stableCoin, cryptoName, accountBalance) {
        let coinName = cryptoName + stableCoin;
        const CoinNameUpperCase = coinName.toUpperCase(); 
        
        const retirarSaldo = parseFloat(accountBalance[stableCoin]) - parseFloat(value);
        const valorDaMoeda = parseFloat(value) / parseFloat(cryptoPrice[CoinNameUpperCase].bid);
        const somaDaConta = parseFloat(accountBalance[cryptoName]) + parseFloat(valorDaMoeda);

        await balanceModel.findOneAndUpdate({email: accountBalance.email, deleted_at: null}, {[stableCoin]: retirarSaldo});
        await balanceModel.findOneAndUpdate({email: accountBalance.email, deleted_at: null}, {[cryptoName]: somaDaConta});

        return true, valorDaMoeda;
    }

    async createLog (cryptoName, stableCoin, clientInfo, value, totalCryptoBuy) {
        const order_id = uuidv4();

        await BuyCryptoLogModel.create({
            buy_by: clientInfo.email,
            purchase_made_in: new Date(),
            total_value: value,
            order_id: order_id,
            [stableCoin]: `-${value}`,
            [cryptoName]: `+${totalCryptoBuy}`
        });
        return order_id;
    }
    
    async sell (value, cryptoPrice, stableCoin, cryptoName, accountBalance) {
        let coinName = cryptoName + stableCoin;
        const CoinNameUpperCase = coinName.toUpperCase(); 
       
        const retirarCryptoValue = parseFloat(accountBalance[cryptoName]) - parseFloat(value);
        const valorDaMoeda = parseFloat(value) * parseFloat(cryptoPrice[CoinNameUpperCase].bid);
        const somaDaConta = parseFloat(accountBalance[stableCoin]) + parseFloat(valorDaMoeda);

        await balanceModel.findOneAndUpdate({email: accountBalance.email, deleted_at: null}, {[cryptoName]: retirarCryptoValue});
        await balanceModel.findOneAndUpdate({email: accountBalance.email, deleted_at: null}, {[stableCoin]: somaDaConta});
        
        return true, valorDaMoeda;
    }

    async sellCryptoLog (clientInfo, value, cryptoName, stableCoin, sellCryptoValue) {
        const order_id = uuidv4();

        await SellCryptoLogModel.create({
            sell_by: clientInfo.email,
            sale_made_in: new Date(),
            total_value: value,
            order_id: order_id,
            [stableCoin]: `+${sellCryptoValue}`,
            [cryptoName]: `-${value}`
        });
        
        return order_id;
    }
  
}

export default new repository();