import mongoose from 'mongoose';

const depositLog = mongoose.model('depositLog', {

    cpf: String,
    email: String,
    deposited_in: Date,
    // value
        usd: Number,
        brl: Number,
        eur: Number,
        ars: Number,
        rub: Number,
});

export default depositLog;