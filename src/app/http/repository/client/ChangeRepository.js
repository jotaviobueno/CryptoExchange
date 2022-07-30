// models
import clientModel from '../../../model/client/ClientModel.js';
import changeNameLog from '../../../model/client/log/ChangeNameLogModel.js';

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
       return true, await clientModel.findOneAndUpdate({email: email, deleted_at: null}, {client_name: new_name, update_at: new Date()});
    }

}

export default new repository();