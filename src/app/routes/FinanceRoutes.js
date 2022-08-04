import express from 'express';
export const FinanceRoutes = express.Router();

import FinanceController from '../http/controller/finance/FinanceController.js';
import HistoryController from '../http/controller/finance/HistoryController.js';
import CryptoController from '../http/controller/finance/CryptoController.js';

export const apiInitial = "/api/v1"

FinanceRoutes.get(`${apiInitial}/my-account/wallet`, FinanceController.seeBalance);
FinanceRoutes.post(`${apiInitial}/deposit/:coin`, FinanceController.deposit);
FinanceRoutes.post(`${apiInitial}/transfer/:coin`, FinanceController.transfer);
FinanceRoutes.get(`${apiInitial}/my-account/deposit-history/`, HistoryController.depositHistory);
FinanceRoutes.get(`${apiInitial}/my-account/transfer-history/`, HistoryController.transferHistory);
FinanceRoutes.post(`${apiInitial}/buy/:stableCoin/:cryptoName`, CryptoController.buy);
FinanceRoutes.post(`${apiInitial}/sell/:cryptoName/:stableCoin`, CryptoController.sell);