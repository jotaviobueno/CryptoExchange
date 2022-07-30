// model
import ClientModel from '../../../model/client/ClientModel.js';
import balanceModel from '../../../model/wallet/BalanceModel.js';

import bcrypt from 'bcrypt';

class repository {

    async createWallet (cpf, email) {
        await balanceModel.create({
          cpf: cpf,
          email: email,
          created_in: new Date(),
          update_at: new Date(),
          deleted_at: null,
        //   fiat: {
            usd: 0,
            brl: 0,
            euro: 0,
            ars: 0,
            rub: 0,
        //   },
        
        //   crypto: {
            btc: 0,
            xrp: 0,
            eth: 0,
            ltc: 0
        //   }
        });
    }

    async create (client_name, email, cpf, password) {
        return true, await ClientModel.create({
            client_name: client_name,
            cpf: cpf,
            email: email,
            password: await bcrypt.hash(password, 10),
            created_in: new Date(),
            update_at: new Date(),
            deleted_at: null,
        });
    }

    async seeAccount (email) {
        return true, await ClientModel.findOne({email: email}).select({_id: 0, __v: 0, password: 0});
    }

    async verifyBalance (email) {
        const balance = await balanceModel.findOne({email: email, deleted_at: null});

        if (balance.usd > 3 || balance.brl > 3 || balance.euro > 3 || balance.ars > 3 || balance.rub > 3)
            return false;

        if (balance.btc > 1 || balance.xrp > 1 || balance.eth > 1 || balance.ltc > 1)
            return false;
        
        return true;
    }

    async deleteAccount (email) {
        await ClientModel.findOneAndUpdate({email: email}, {deleted_at: new Date(), last_update: new Date()});
        await balanceModel.findOneAndUpdate({email: email}, {deleted_at: new Date(), last_update: new Date()});
        return true;
    }

}

export default new repository();