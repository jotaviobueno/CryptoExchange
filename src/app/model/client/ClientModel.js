import mongoose from 'mongoose';

const client = mongoose.model('client', {

    client_name: String,
    cpf: String,
    email: String,
    password: String,
    created_in: Date,
    update_at: Date,
    deleted_at: Date,
    
});

export default client;