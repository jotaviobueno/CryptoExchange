import express from 'express';
export const ClientRoutes = express.Router();
import {apiInitial} from './FinanceRoutes.js';

import UserController from '../http/controller/client/ClientController.js';
import AuthLoginController from '../http/controller/client/Auth/AuthLoginController.js';
import ChangeController from '../http/controller/client/ChangeController.js';
import GetTokenController from '../http/controller/client/auth/AuthGenerationController.js';

ClientRoutes.post(`${apiInitial}/register`, UserController.register);
ClientRoutes.post(`${apiInitial}/login/email`, AuthLoginController.loginByEmail);
ClientRoutes.post(`${apiInitial}/login/cpf`, AuthLoginController.loginByCpf);
ClientRoutes.get(`${apiInitial}/logout/`, AuthLoginController.logout);
ClientRoutes.post(`${apiInitial}/my-account/change-name`, ChangeController.changeName);
ClientRoutes.post(`${apiInitial}/change-email/:change_token`, ChangeController.changeEmail);
ClientRoutes.post(`${apiInitial}/my-account/change-password/`, ChangeController.changePasswordV1);
ClientRoutes.post(`${apiInitial}/:change_token/change-password/`, ChangeController.changePasswordV2);
ClientRoutes.get(`${apiInitial}/my-account`, UserController.seeAccount);
ClientRoutes.delete(`${apiInitial}/my-account/delete`, UserController.deleteAccount);
ClientRoutes.get(`${apiInitial}/get-token/change-email`, GetTokenController.tokenToChangeTheEmail);
ClientRoutes.get(`${apiInitial}/get-token/change-password`, GetTokenController.tokenToChangePassword);