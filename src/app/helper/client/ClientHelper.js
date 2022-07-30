// model
import ClientModel from '../../model/client/ClientModel.js';
import loginModel from '../../model/client/LoginModel.js';

import bcrypt from 'bcrypt';

class ClientHelper {

    async verifyUser (email) {
        const findUser = await ClientModel.findOne({email: email, deleted_at: null});

        if (findUser === null)
            return false;

        return true, findUser;
    }

    async verifyCpf (cpf) {
        const findCpf = await ClientModel.findOne({cpf: cpf, deleted_at: null});

        if (findCpf === null)
            return false;
        
        return true, findCpf;
    }

    async verifySession (session_token) {
        const findSession = await loginModel.findOne({session_token: session_token, disconnected_in: null});

        if (findSession === null)
            return false;
        
        return true, findSession;
    }

    async comparePassword (password, hash) {
        return await bcrypt.compare(password, hash);
    }

    async disconnectedAllSession (email) {
        await loginModel.updateMany({disconnected_in: new Date()});
    }
}

export default new ClientHelper();