// repository
import repository from '../../repository/finance/CryptoRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import financeHelper from '../../../helper/finance/FinanceHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class Crypto {

    async buy (req, res) {
        const {session_token, stableCoin, cryptoName} = req.params;
        const {amount} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        if (! await financeHelper.verifyCoin(stableCoin))
            return

        if (! await financeHelper.verifyCrypto(cryptoName))
            return

        const coinPrice = await financeHelper.getCryptoPrice(stableCoin, cryptoName);

        await repository.calculation(amount, coinPrice, stableCoin, cryptoName);

        
        const clientBalance = await financeHelper.seeBalance(clientInfo.email);




    }
}

export default new Crypto();