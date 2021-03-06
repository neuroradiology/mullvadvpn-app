// @flow

import { expect } from 'chai';
import connectionActions from '../app/redux/connection/actions';
import { setupBackendAndStore, checkNextTick } from './helpers/ipc-helpers';

describe('connect', () => {

  it('should set the connection state to \'disconnected\' on failed attempts', (done) => {
    const { store, mockIpc, backend } = setupBackendAndStore();

    mockIpc.connect = () => new Promise((_, reject) => reject('Some error'));

    store.dispatch(connectionActions.connected());


    expect(store.getState().connection.status).not.to.equal('disconnected');

    store.dispatch(connectionActions.connect(backend));


    checkNextTick(() => {
      expect(store.getState().connection.status).to.equal('disconnected');
    }, done);
  });

  it('should update the state with the server address', () => {
    const { store, backend } = setupBackendAndStore();

    return backend.connect()
      .then( () => {
        const state = store.getState().connection;
        expect(state.status).to.equal('connecting');
      });
  });

  it('should correctly deduce \'connected\' from backend states', (done) => {
    const { store, mockIpc } = setupBackendAndStore();

    checkNextTick( () => {
      expect(store.getState().connection.status).not.to.equal('connected');
      mockIpc.sendNewState({ state: 'secured', target_state: 'secured' });
      expect(store.getState().connection.status).to.equal('connected');
    }, done);
  });

  it('should correctly deduce \'connecting\' from backend states', (done) => {
    const { store, mockIpc } = setupBackendAndStore();

    checkNextTick( () => {
      expect(store.getState().connection.status).not.to.equal('connecting');
      mockIpc.sendNewState({ state: 'unsecured', target_state: 'secured' });
      expect(store.getState().connection.status).to.equal('connecting');
    }, done);
  });

  it('should correctly deduce \'disconnected\' from backend states', (done) => {
    const { store, mockIpc } = setupBackendAndStore();
    store.dispatch(connectionActions.connected());

    checkNextTick( () => {
      expect(store.getState().connection.status).not.to.equal('disconnected');
      mockIpc.sendNewState({ state: 'unsecured', target_state: 'unsecured' });
      expect(store.getState().connection.status).to.equal('disconnected');
    }, done);
  });
});