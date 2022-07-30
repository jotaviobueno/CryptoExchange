// model
import balanceModel from '../../../model/wallet/BalanceModel.js';
import depositLogModel from '../../../model/log/depositLogModel.js';
import transferLogModel from '../../../model/log/transferLogModel.js';

class repository {

    async seeBalance (email) {
       return true, await balanceModel.findOne({email: email, deleted_at: null}).select({_id: 0, __v: 0, deleted_at: 0, created_in: 0, update_at: 0});
    }

    async createDepositLog (email, cpf, value, coin) {
        return await depositLogModel.create({
            cpf: cpf,
            email: email,
            deposited_in: new Date().toString(),
            [coin]: value
        });
    }

    async deposit (accountBalance, clientInfo, coin, value) {
        const somBalance = parseFloat(accountBalance[coin]) + parseFloat(value);

        await balanceModel.findOneAndUpdate({email: clientInfo.email, deleted_at: null}, {[coin]: somBalance});

        return true;
    }

    async createTransferLog (clientInfo, transferClientInfo, coin, value) {
        return await transferLogModel.create({
            sent_email: clientInfo.email,
            received: transferClientInfo.email,
            transfer_in: new Date(),
            [coin]: value
        });
    }

    async transfer (clientBalance, transferBalanceInfo, coin, value) {
        const WithdrawValue = parseFloat(clientBalance[coin]) - parseFloat(value);
        const InsertValue = parseFloat(transferBalanceInfo[coin]) + parseFloat(value);

        await balanceModel.findOneAndUpdate({email: clientBalance.email}, {[coin]: WithdrawValue});
        await balanceModel.findOneAndUpdate({email: transferBalanceInfo.email}, {[coin]: InsertValue});

        return true;

    }
}

export default new repository();