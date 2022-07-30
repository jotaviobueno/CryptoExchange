import mongoose from 'mongoose';

const login = mongoose.model('login', {

    email: String,
    cpf: String,
    session_token: String,
    login_date: Date,
    disconnected_in: Date,
});

export default login