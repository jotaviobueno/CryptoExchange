// repository
import repository from '../../repository/client/ChangeRepository.js';

// helpers
import verifyUser from '../../../helper/client/ClientHelper.js';
import responseHelper from '../../../helper/ResponseHelper.js';

class Change {

    async changeName (req, res) {
        const {session_token} = req.params;
        const {new_name, password} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});
        
        if (! await verifyUser.comparePassword(password, clientInfo.password))
            return 
        
        if (await repository.changeName(new_name, clientInfo.email)) {

            await repository.createChangeNameLog(clientInfo.client_name, new_name, clientInfo.email);

            return await responseHelper.success(res, {success: "change made successfully"});
        }
        
        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async changeEmail (req, res) {
        const {change_token} = req.params;
        const {new_email, password} = req.body;

        const tokenInfo = await repository.verifyToken(change_token);

        if (! tokenInfo)
            return await responseHelper.notAuthorized(res, {error: 'email change token is not valid.'});
        
        const clientInfo = await verifyUser.verifyUser(tokenInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        if (await verifyUser.verifyUser(new_email)) 
            return await responseHelper.badRequest(res, {error: 'new Email exist.'});

        if (! await verifyUser.comparePassword(password, clientInfo.password))
            return await responseHelper.notAuthorized(res, {error: 'credentials its invalid.'}); 

        if (clientInfo.email === new_email)
            return await responseHelper.badRequest(res, {error: 'the new email can not be equal to the email gives account.'});

        if (await repository.changeEmail(clientInfo.email, new_email)) {

            await repository.createLogChangeEmail(clientInfo.email, new_email);

            // depositLog
            await repository.changeEmailDepositLog(clientInfo.email, new_email);

            // transferLog
            await repository.changeSentEmailTransferLog(clientInfo.email, new_email);

            await repository.changeReceivedEmailTransferLog(clientInfo.email, new_email);

            await repository.deleteAllOldSession(clientInfo.email);

            await repository.deleteToken(change_token);

            return await responseHelper.badRequest(res, 
                {success: 'changed email, all sessions linked to your old email have been disconnected.'});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async changePasswordV1 (req, res) {
        const {session_token} = req.params;
        const {password, new_password} = req.body;

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        if (! await verifyUser.comparePassword(password, clientInfo.password))
            return await responseHelper.notAuthorized(res, {error: 'credentials its invalid.'});

        if (await verifyUser.comparePassword(password, new_password))
            return await responseHelper.badRequest(res, {error: 'password identical to the account.'});

        if (await repository.changePasswordV1(clientInfo.email, new_password)) {

            await verifyUser.disconnectedAllSession(clientInfo.email);
            
            await repository.createLog(clientInfo.email);

            return await responseHelper.success(res, 
                {success: 'password changed, all sessions linked to your account have been disconnected.'});
        }

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async changePasswordV2 (req, res) {

    }
}

export default new Change();