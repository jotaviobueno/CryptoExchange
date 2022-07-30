// repository
import repository from '../../repository/client/AuthLoginRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class Auth {

    async loginByEmail (req, res) {
        const {email, password} = req.body;
    
        const clientInfo = await verifyUser.verifyUser(email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
        
        if (! await verifyUser.comparePassword(password, clientInfo.password))
            return
        
        await verifyUser.disconnectedAllSession(clientInfo.email);

        const session_token = await repository.createSession(email, clientInfo.cpf);

        if (session_token)
            return await responseHelper.success(res, {
                success: "Login made",
                session_token: session_token, 
                name: clientInfo.name,
                email: clientInfo.email,
                cpf: clientInfo.cpf
            });
        
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async loginByCpf (req, res) {
        const {cpf, password} = req.body;

        const existCpf = await verifyUser.verifyCpf(cpf);

        if (! existCpf)
            return await responseHelper.badRequest(res, {error: 'cpf non-existent.'});
        
        if (! await verifyUser.comparePassword(password, existCpf.password))
            return await responseHelper.notAuthorized(res, {error: 'credentials its invalid.'});
    
        await verifyUser.disconnectedAllSession(existCpf.email);

        const session_token = await repository.createSession(existCpf.email, existCpf.cpf);

        if (session_token)
            return await responseHelper.success(res, {
                success: "Login made",
                session_token: session_token, 
                name: existCpf.name,
                email: existCpf.email,
                cpf: existCpf.cpf
            });
            
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async logout (req, res) {
        const {session_token} = req.params;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
    
        if (await repository.logout(session_token))
            return await responseHelper.noContent(res)
        
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new Auth();