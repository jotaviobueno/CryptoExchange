// model
import tokensChangeEmailModel from '../../../../model/client/AuthToken/TokensChangeEmailModel.js';

import { nanoid } from 'nanoid'

class repository {

    async generationTokenToChangeEmail (email) {
        const token = nanoid();
            
        await tokensChangeEmailModel.create({

            email: email,
            change_token: token,
            created_at: new Date(),
            expires_at: new Date().setHours(new Date().getHours() + 1),
            status: null,

        });
        
        return true, token;
    }

}

export default new repository();