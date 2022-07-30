// models
import depositLogModel from '../../../model/finance/log/depositLogModel.js';
import transferLogModel from '../../../model/finance/log/transferLogModel.js';

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

}

export default new repository();