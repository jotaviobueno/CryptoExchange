import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {router} from './app/routes/v1.js';

const app = express();

dotenv.config();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', router);

mongoose.connect(process.env.DB_LINK).then(() => {
    console.log('connected to mongoose');

    app.listen(process.env.PORT || 8081, () => {
        console.log('listening on!')
    });
});