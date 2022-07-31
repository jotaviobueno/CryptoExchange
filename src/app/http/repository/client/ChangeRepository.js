// models
import ClientModel from '../../../model/client/ClientModel.js';
import loginModel from '../../../model/client/LoginModel.js';
import tokensChangeEmailModel from '../../../model/client/AuthToken/TokensChangeEmailModel.js';
import changeNameLog from '../../../model/client/log/ChangeNameLogModel.js';
import changeEmailLog from '../../../model/client/log/ChangeEmailLogModel.js';
import balanceModel from '../../../model/finance/BalanceModel.js';
import depositHistoryModel from '../../../model/finance/log/depositLogModel.js';
import transferHistoryModel from '../../../model/finance/log/transferLogModel.js';
import changePasswordModel from '../../../model/client/log/ChangePasswordLogModel.js';

import bcrypt from 'bcrypt';

class repository {

    async createChangeNameLog (old_name, new_name, email) {
        await changeNameLog.create({

            old_name: old_name,
            new_name: new_name,
            email: email,
            change_in: new Date()
        });
    }

    async changeName (new_name, email) {
       return true, await ClientModel.findOneAndUpdate({email: email, deleted_at: null}, {client_name: new_name, update_at: new Date()});
    }

    async verifyToken (change_token) {
        const findToken = await tokensChangeEmailModel.findOne({change_token: change_token, status: null});
        
        if (findToken === null)
            return false;

        return true, findToken;
    }

    async deleteToken (token) {
        await tokensChangeEmailModel.findOneAndUpdate({change_token: token}, {status: true});
    }

    async changeEmailDepositLog (oldEmail, newEmail) {
        const findDepositHistoryOldEmail = await depositHistoryModel.find({email: oldEmail});

        if (findDepositHistoryOldEmail.length != 0) {
            findDepositHistoryOldEmail.forEach(async (depositHistory) => {
                await depositHistoryModel.findOneAndUpdate({email: depositHistory.email}, {email: newEmail});
            });
        }
    }

    async changeSentEmailTransferLog (oldEmail, newEmail) {
        const findSent = await transferHistoryModel.find({sent_email: oldEmail}); 

        if (findSent.length != 0) {
            findSent.forEach(async (transferHistory) => {
                await transferHistoryModel.findOneAndUpdate({sent_email: transferHistory.email}, {sent_email: newEmail});
            });
        }
    }

    async changeReceivedEmailTransferLog (oldEmail, newEmail) {
        const findReceived = await transferHistoryModel.find({received: oldEmail}); 

        if (findReceived.length != 0) {
            findReceived.forEach(async (transferHistory) => {
                await transferHistoryModel.findOneAndUpdate({received: transferHistory.email}, {received: newEmail});
            });
        }
    }
    async deleteAllOldSession (email) {
        await loginModel.deleteMany({email: email});
    }

    async createLogChangeEmail (OldEmail, NewEmail) {
        await changeEmailLog.create({
            old_email: OldEmail,
            new_email: NewEmail,
            change_in: new Date()});

            return true;
    }

    async changeEmail (oldEmail, newEmail) {
        await ClientModel.findOneAndUpdate({email: oldEmail, deleted_at: null}, {email: newEmail, update_at: new Date()});

        await balanceModel.findOneAndUpdate({email: oldEmail, deleted_at: null}, {email: newEmail, update_at: new Date()});

            return true;
    }

    async createLog (email) {
        await changePasswordModel.create({email: email, change_in: new Date()});
    }

    async changePasswordV1 (email, new_password) {
        await ClientModel.findOneAndUpdate({email: email, deleted_at: null}, 
            {password: await bcrypt.hash(new_password, 10), update_at: new Date()});
    
            return true;
    }

}

export default new repository();