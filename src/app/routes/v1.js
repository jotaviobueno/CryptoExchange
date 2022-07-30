import express from 'express';
export const router = express.Router();

import UserController from '../http/controller/client/ClientController.js';
import AuthLoginController from '../http/controller/client/AuthLoginController.js';
import FinanceController from '../http/controller/finance/FinanceController.js';
import HistoryController from '../http/controller/finance/HistoryController.js';

router.post('/api/v1/register', UserController.register);
router.post('/api/v1/login/email', AuthLoginController.loginByEmail);
router.post('/api/v1/login/cpf', AuthLoginController.loginByCpf);
router.get('/api/v1/logout/:session_token', AuthLoginController.logout);

router.get('/api/v1/my-account/:session_token', UserController.seeAccount);
router.get('/api/v1/my-account/:session_token/wallet', FinanceController.seeBalance);

router.delete('/api/v1/my-account/delete/:session_token', UserController.deleteAccount);
router.post('/api/v1/:session_token/deposit/:coin', FinanceController.deposit);
router.post('/api/v1/:session_token/transfer/:coin', FinanceController.transfer);

router.get('/api/v1/my-account/deposit-history/:session_token', HistoryController.depositHistory);
router.get('/api/v1/my-account/transfer-history/:session_token', HistoryController.transferHistory);