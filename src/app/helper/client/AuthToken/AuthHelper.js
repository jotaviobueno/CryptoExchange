// model
import tokensChangeEmail from '../../../model/client/AuthToken/TokensChangeEmailModel.js';

class AuthToken {

    async checkAmountOfUserTokens (email) {
        const findToken = await tokensChangeEmail.find({email: email, status: null});

        if (findToken.length >= 1) 
            await tokensChangeEmail.updateMany({status: false});
    }

    async verifyTokenDate () {
        const findAllTokens = await tokensChangeEmail.find({status: null});

        findAllTokens.forEach(async (token) => {
            if (new Date >= token.expires_at)
                await findOneAndUpdate({change_token: token.change_token}, {status: false});
        })
    }

}

export default new AuthToken();