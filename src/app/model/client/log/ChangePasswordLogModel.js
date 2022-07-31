import mongoose from 'mongoose';

const ChangePassword = mongoose.model('ChangePassword', {

    email: String,
    change_in: Date
    
});

export default ChangePassword;