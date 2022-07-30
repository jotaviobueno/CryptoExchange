import mongoose from 'mongoose';

const tokensChangeEmail = mongoose.model('tokensChangeEmail', {
    
    email: String,
    change_token: String,
    created_at: Date,
    expires_at: Date,
    status: String,
    
    // * tokenStatus {
    // *
    // *    null = token gerado é ainda pode ser usado,
    // *    false = token gerado mais expirado,
    // *    true = token gerado é usado.
    // *
    // * {
});

export default tokensChangeEmail;