// models
import repository from '../../repository/finance/HistoryRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import financeHelper from '../../../helper/finance/FinanceHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class History {

    async depositHistory (req, res) {
        const {session_token} = req.headers;
    
        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);
    
        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        const history = await repository.depositHistory(clientInfo.email, clientInfo.cpf);

        if (history)
            return await responseHelper.badRequest(res, {deposit_history: history});

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async transferHistory (req, res) {
        const {session_token} = req.headers;
    
        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);
    
        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        const history = await repository.sentTransferHistory(clientInfo.email);

        if (history)
            return await responseHelper.success(res, 
                {sent_transfer_history: history,
                received_transfer_history: await repository.receivedTransferHistory(clientInfo.email),
                buy_crypto_log: await repository.BuyCryptoTransfer(clientInfo.email),
                sell_crypto_log: await repository.SellCryptoTransfer(clientInfo.email)
            });

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new History();