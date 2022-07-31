import mongoose from 'mongoose';

const ChangeEmail = mongoose.model('ChangeEmail', {

    old_email: String,
    new_email: String,
    change_in: Date
});

export default ChangeEmail;