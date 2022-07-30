import mongoose from 'mongoose';

const transferLog = mongoose.model('transferLog', {

    sent_email: String,
    received: String,
    transfer_in: Date,
    // value
        usd: Number,
        brl: Number,
        euro: Number,
        ars: Number,
        rub: Number,
});

export default transferLog;