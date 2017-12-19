// @flow

import type { Backend, BackendError } from '../../lib/backend';

type StartLoginAction = {
  type: 'START_LOGIN',
  accountToken?: string,
};
type LoginSuccessfulAction = {
  type: 'LOGIN_SUCCESSFUL',
  expiry: string,
};
type LoginFailedAction = {
  type: 'LOGIN_FAILED',
  error: BackendError,
};

type LoggedOutAction = {
  type: 'LOGGED_OUT',
};

type ResetLoginErrorAction = {
  type: 'RESET_LOGIN_ERROR',
};

type UpdateAccountTokenAction = {
  type: 'UPDATE_ACCOUNT_TOKEN',
  token: string,
};

export type AccountAction = StartLoginAction
                            | LoginSuccessfulAction
                            | LoginFailedAction
                            | LoggedOutAction
                            | ResetLoginErrorAction;

function startLogin(accountToken?: string): StartLoginAction {
  return {
    type: 'START_LOGIN',
    accountToken: accountToken,
  };
}

function loginSuccessful(expiry: string): LoginSuccessfulAction {
  return {
    type: 'LOGIN_SUCCESSFUL',
    expiry: expiry,
  };
}

function loginFailed(error: BackendError): LoginFailedAction {
  return {
    type: 'LOGIN_FAILED',
    error: error,
  };
}

function loggedOut(): LoggedOutAction {
  return {
    type: 'LOGGED_OUT',
  };
}

function autoLoginFailed(): LoggedOutAction {
  return loggedOut();
}

function resetLoginError(): ResetLoginErrorAction {
  return {
    type: 'RESET_LOGIN_ERROR',
  };
}

function updateAccountToken(token: string): UpdateAccountTokenAction {
  return {
    type: 'UPDATE_ACCOUNT_TOKEN',
    token: token,
  };
}

const login = (backend: Backend, account: string) => () => backend.login(account);
const logout = (backend: Backend) => () => backend.logout();

export default {
  login,
  logout,
  startLogin,
  loginSuccessful,
  loginFailed,
  loggedOut,
  autoLoginFailed,
  resetLoginError,
  updateAccountToken,
};