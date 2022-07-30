import mongoose from 'mongoose';

const BalanceModel = mongoose.model('Balance', {

    cpf: String,
    email: String,
    created_in: Date,
    update_at: Date,
    deleted_at: Date,
    
    // fiat
        usd: Number,
        brl: Number,
        euro: Number,
        ars: Number,
        rub: Number,

    // crypto
        btc: Number,
        xrp: Number,
        eth: Number,
        ltc: Number
    
});

export default BalanceModel;