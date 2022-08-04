// models
import depositLogModel from '../../../model/finance/log/depositLogModel.js';
import transferLogModel from '../../../model/finance/log/transferLogModel.js';
import BuyCryptoLogModel from '../../../model/finance/log/BuyCryptoLogModel.js';
import SellCryptoLogModel from '../../../model/finance/log/SellCryptoLogModel.js';

class repository {

    async depositHistory (email, cpf) {
        return true, await depositLogModel.find({email: email, cpf: cpf}).select({__v: 0});
    }

    async sentTransferHistory (email) {
        return true, await transferLogModel.find({sent_email: email}).select({__v: 0});
    }

    async receivedTransferHistory (email) {
        return await transferLogModel.find({received: email}).select({__v: 0});
    }

    async BuyCryptoTransfer (email) {
        return true, await BuyCryptoLogModel.find({buy_by: email}).select({__v: 0, _id: 0});
    }

    async SellCryptoTransfer (email) {
        return true, await SellCryptoLogModel.find({sell_by: email}).select({__v: 0, _id: 0});
    }

}

export default new repository();