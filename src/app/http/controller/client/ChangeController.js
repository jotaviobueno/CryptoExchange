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
}

export default new Change();