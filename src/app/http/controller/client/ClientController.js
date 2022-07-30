// repository
import repository from '../../repository/client/ClientRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class Client {

    async register (req, res) {
        const {client_name, email, cpf, password} = req.body;

        const clientInfo = await verifyUser.verifyUser(email);

        if (clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
        
        const existCpf = await verifyUser.verifyCpf(cpf);

        if (existCpf)
            return await responseHelper.badRequest(res, {error: 'Cpf already registered.'});
        
        const returnUserInfo = await repository.create(client_name, email, cpf, password);

        if (returnUserInfo) {
            await repository.createWallet(cpf, email)

            return await responseHelper.created(res, {
                success: "Email registered",
                client_name: returnUserInfo.client_name, 
                cpf: returnUserInfo.cpf, 
                email: returnUserInfo.email
            });
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async seeAccount (req, res) {
        const {session_token} = req.params;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
    
        const returnClientInfo = await repository.seeAccount(clientInfo.email);

        if (returnClientInfo)
            return await responseHelper.success(res, {clientInfo: returnClientInfo});
        
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async deleteAccount (req, res) {
        const {session_token} = req.params;
        const {password} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        if (! await verifyUser.comparePassword(password, clientInfo.password))
            return await responseHelper.notAuthorized(res, {error: 'credentials its invalid.'});
            
        if (! await repository.verifyBalance(clientInfo.email))
            return await responseHelper.badRequest(res, 
                {error: 'you cannot delete an account with a fiat balance greater than 3, and also with high crypto balances..'});
        
        if (await repository.deleteAccount(clientInfo.email)) {
            
            await verifyUser.disconnectedAllSession(clientInfo.email);

            return await responseHelper.success(res, {success: "Account deleted"});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new Client();