import express from 'express';
export const router = express.Router();

import UserController from '../http/controller/client/ClientController.js';
import AuthLoginController from '../http/controller/client/Auth/AuthLoginController.js';
import FinanceController from '../http/controller/finance/FinanceController.js';
import HistoryController from '../http/controller/finance/HistoryController.js';
import ChangeController from '../http/controller/client/ChangeController.js';
import GetTokenController from '../http/controller/client/auth/AuthGenerationController.js';
import CryptoController from '../http/controller/finance/CryptoController.js';

const apiInitial = "/api/v1"

router.post(`${apiInitial}/register`, UserController.register);
router.post(`${apiInitial}/login/email`, AuthLoginController.loginByEmail);
router.post(`${apiInitial}/login/cpf`, AuthLoginController.loginByCpf);
router.get(`${apiInitial}/logout/`, AuthLoginController.logout);
router.post(`${apiInitial}/my-account/change-name`, ChangeController.changeName);
router.post(`${apiInitial}/change-email/:change_token`, ChangeController.changeEmail);
router.post(`${apiInitial}/my-account/change-password/`, ChangeController.changePasswordV1);
router.post(`${apiInitial}/:change_token/change-password/`, ChangeController.changePasswordV2);

router.get(`${apiInitial}/my-account`, UserController.seeAccount);
router.get(`${apiInitial}/my-account/wallet`, FinanceController.seeBalance);

router.delete(`${apiInitial}/my-account/delete`, UserController.deleteAccount);
router.post(`${apiInitial}/deposit/:coin`, FinanceController.deposit);
router.post(`${apiInitial}/transfer/:coin`, FinanceController.transfer);

router.get(`${apiInitial}/my-account/deposit-history/`, HistoryController.depositHistory);
router.get(`${apiInitial}/my-account/transfer-history/`, HistoryController.transferHistory);

router.get(`${apiInitial}/get-token/change-email`, GetTokenController.tokenToChangeTheEmail);
router.get(`${apiInitial}/get-token/change-password`, GetTokenController.tokenToChangePassword);

router.post(`${apiInitial}/buy/:stableCoin/:cryptoName`, CryptoController.buy);
router.post(`${apiInitial}/sell/:cryptoName/:stableCoin`, CryptoController.sell);