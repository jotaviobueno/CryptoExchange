// model
import loginModel from '../../../model/client/LoginModel.js';

import {nanoid} from 'nanoid';

class repository {
    async createSession (email, cpf) {
        const session_token = nanoid();

        await loginModel.create({
            email: email,
            cpf: cpf,
            session_token: session_token,
            login_date: new Date(),
            disconnected_in: null,
        });
        return true, session_token;
    }

    async logout (session_token) {
        await loginModel.findOneAndUpdate({session_token: session_token}, {disconnected_in: new Date()});
        return true;
    }
}

export default new repository();