// repository
import repository from '../../repository/finance/CryptoRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import financeHelper from '../../../helper/finance/FinanceHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class Crypto {

    async buy (req, res) {
        const {session_token} = req.headers;
        const {stableCoin, cryptoName} = req.params;
        const {value} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        if (! await financeHelper.verifyCoin(stableCoin))
            return await responseHelper.badRequest(res, {error: 'stable coin name its invalid.'});

        if (! await financeHelper.verifyCrypto(cryptoName))
            return await responseHelper.badRequest(res, {error: 'crpyto name its invalid.'});

        const coinPrice = await financeHelper.getCryptoPrice(stableCoin, cryptoName);

        if (! coinPrice)
            return await responseHelper.badRequest(res, {error: 'parity with the coin not found.'});

        const clientBalance = await financeHelper.seeBalance(clientInfo.email);

        if (value > clientBalance[stableCoin])
            return await responseHelper.badRequest(res, {error: 'you dont have enough money for that.'});

        if (value <= 5)
            return await responseHelper.badRequest(res, {error: 'purchase value may not be less than 5.'});

        const buyInfo = await repository.buy(value, coinPrice, stableCoin, cryptoName, clientBalance, clientInfo);

        if (buyInfo) {
            const order_id = await repository.createLog(cryptoName, stableCoin, clientInfo, value, buyInfo);
            
            return await responseHelper.success(res, {total_buy: buyInfo, order_id: order_id});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async sell (req, res) {
        const {session_token} = req.headers;
        const {stableCoin, cryptoName} = req.params;
        const {value} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
        
        if (! await financeHelper.verifyCoin(stableCoin))
            return await responseHelper.badRequest(res, {error: 'stable coin name its invalid.'});

        if (! await financeHelper.verifyCrypto(cryptoName))
            return await responseHelper.badRequest(res, {error: 'crpyto name its invalid.'});

        const coinPrice = await financeHelper.getCryptoPrice(stableCoin, cryptoName);

        if (! coinPrice)
            return await responseHelper.badRequest(res, {error: 'parity with the coin not found.'});

        const clientBalance = await financeHelper.seeBalance(clientInfo.email);

        if (value > clientBalance[cryptoName])
            return await responseHelper.badRequest(res, {error: 'you do not have this amount to be able to make this sale'});

        const sellInfo = await repository.sell(value, coinPrice, stableCoin, cryptoName, clientBalance, clientInfo);

        if (sellInfo) {
            const order_id = await repository.sellCryptoLog(clientInfo, value, cryptoName, stableCoin, sellInfo);

            return await responseHelper.success(res, {total_sell: sellInfo, order_id: order_id});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new Crypto();