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
            return await responseHelper.badRequest(res, {error: 'paridade de moeda n encontrada.'});

        const clientBalance = await financeHelper.seeBalance(clientInfo.email);

        if (value > clientBalance[stableCoin])
            return await responseHelper.badRequest(res, {error: 'você não tem dinheiro suficiente para isso.'});

        if (value <= 5)
            return await responseHelper.badRequest(res, {error: 'valor menor que 5.'});

        const buyInfo = await repository.buy(value, coinPrice, stableCoin, cryptoName, clientBalance, clientInfo);

        if (buyInfo) {
            const order_id = await repository.createLog(cryptoName, stableCoin, clientInfo, value, buyInfo);
            return await responseHelper.success(res, {total_buy: buyInfo, order_id: order_id});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new Crypto();