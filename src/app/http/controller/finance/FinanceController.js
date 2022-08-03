// repository
import repository from '../../repository/finance/FinanceRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import financeHelper from '../../../helper/finance/FinanceHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class finance {

    async seeBalance (req, res) {
        const {session_token} = req.headers;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        const clientBalance = await financeHelper.seeBalance(clientInfo.email);

        if (clientBalance)
            return await responseHelper.success(res, {balance: clientBalance});

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async deposit (req, res) {
        const {session_token} = req.headers;
        const {coin} = req.params;
        const {value} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);
    
        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        const clientBalance = await financeHelper.getBalance(clientInfo.email);

        if (! await financeHelper.verifyCoin(coin))
            return await responseHelper.badRequest(res, {error: 'currency not found in the system.'});

        if (value < 3)
            return await responseHelper.badRequest(res, {error: 'the deposit amount cannot be below 3.'}); 

        if (await repository.deposit(clientBalance, clientInfo, coin, value)) {

            const deposit_id = await repository.createDepositLog(clientInfo.email, clientInfo.cpf, value, coin);

            return await responseHelper.success(res, 
                {deposit_id: deposit_id._id, deposit_status: "success", deposit_date: new Date().toString()});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async transfer (req, res) {
        const {session_token} = req.headers;
        const {coin} = req.params;
        const {transfer_to, value} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        // #1
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);
    
        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        // #2
        const transferClientInfo = await verifyUser.verifyUser(transfer_to);

        if (! transferClientInfo)
            return await responseHelper.badRequest(res, 
                {error: 'the person you are trying to send the money to does not exist in our database.'});

        if (clientInfo.email === transferClientInfo.email)
            return await responseHelper.badRequest(res, {error: 'you cannot transfer to yourself.'});
        
        const clientBalance = await financeHelper.getBalance(clientInfo.email);

        const transferBalanceInfo = await financeHelper.getBalance(transferClientInfo.email);

        if (! await financeHelper.verifyCoin(coin))
            return await responseHelper.badRequest(res, {error: 'currency not found in the system.'});

        if (value < 3)
            return await responseHelper.badRequest(res, {error: 'value cannot be less than 3.'});

        if (clientBalance[coin] < value)
            return await responseHelper.badRequest(res, {error: 'you dont have that balance for shipping.'});
    
        if (await repository.transfer(clientBalance, transferBalanceInfo, coin, value)) {
            
            const transfer_id = await repository.createTransferLog(clientInfo, transferClientInfo, coin, value);

            return await responseHelper.success(res, 
                {transfer_id: transfer_id._id, transfer_status: "success", transfer_date: new Date().toString()});
        }
    
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new finance();