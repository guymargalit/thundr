import { createStore, applyMiddleware } from 'redux';
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const logger = createLogger();
const initialState = getInitialStateRenderer();

const store = createStore(rootReducer, initialState, applyMiddleware(forwardToMain, logger));

replayActionRenderer(store);

export default store;
