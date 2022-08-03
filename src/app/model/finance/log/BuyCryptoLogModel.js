import mongoose from 'mongoose';

const BuyCryptoLog = mongoose.model('BuyCryptoLog', {

    buy_by: String,
    purchase_made_in: Date,
    total_value: Number,
    order_id: String,
    // value
        usd: String,
        brl: String,
        eur: String,
        ars: String,
        rub: String,

        btc: String,
        xrp: String,
        eth: String,
        ltc: String
});

export default BuyCryptoLog;