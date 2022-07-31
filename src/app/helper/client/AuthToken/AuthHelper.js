// model
import tokensChangeEmail from '../../../model/client/AuthToken/TokensChangeEmailModel.js';
import tokensChangePassword from '../../../model/client/AuthToken/TokensChangePasswordModel.js';

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
                await tokensChangeEmail.findOneAndUpdate({change_token: token.change_token}, {status: false});
        });
    }

    async checkAmountOfTokensToChangeTheUsersPassword (email) {
        const findToken = await tokensChangePassword.find({email: email, status: null});

        if (findToken.length >= 1)
            await tokensChangePassword.updateMany({status: false});
    }

    async verifyTokenDatePassword () {
        const findAllTokens = await tokensChangePassword.find({status: null});

        findAllTokens.forEach(async (token) => {
            if (new Date >= token.expires_at)
                await tokensChangePassword.findOneAndUpdate({change_token: token.change_token}, {status: false});
        });
    }
}

export default new AuthToken();