// repository
import repository from '../../../repository/client/Auth/AuthGenerationRepository.js';

// helpers
import verifyUser from '../../../../helper/client/ClientHelper.js';
import responseHelper from '../../../../helper/ResponseHelper.js';
import AuthHelper from '../../../../helper/client/AuthToken/AuthHelper.js';

class AuthGeneration {

    async tokenToChangeTheEmail (req, res) {
        const {session_token} = req.headers;

        await AuthHelper.verifyTokenDate();

        const sessionInfo = await verifyUser.verifySession(session_token);

        if (! sessionInfo)
            return await responseHelper.badRequest(res, {error: 'session its invalid.'});
        
        const clientInfo = await verifyUser.verifyUser(sessionInfo.email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        await AuthHelper.checkAmountOfUserTokens(clientInfo.email);

        const change_token = await repository.generationTokenToChangeEmail(clientInfo.email);

        if (change_token) 
            return await responseHelper.success(res, {change_token: change_token, expires_at: new Date().toString()});

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }

    async tokenToChangePassword (req, res) {
        const {email} = req.body;

        await AuthHelper.verifyTokenDatePassword();

        const clientInfo = await verifyUser.verifyUser(email);

        if (! clientInfo) 
            return await responseHelper.badRequest(res, {error: 'E-mail already registered.'});

        await AuthHelper.checkAmountOfTokensToChangeTheUsersPassword(clientInfo.email);

        const change_token = await repository.generationTokenToChangePassword(clientInfo.email);
        
        if (change_token)
            return await responseHelper.success(res, {change_token: change_token, expires_at: new Date().toString()});

        return await responseHelper.unprocessableEntity(res, {error: 'it was not possible to proceed'});
    }
}

export default new AuthGeneration();