import { combineReducers } from 'redux';
import playerReducer from './player';
import lightsReducer from './lights';
import keyboardReducer from './keyboard';
import effectsReducer from './effects';

const rootReducer = combineReducers({
	playerState: playerReducer,
	lightsState: lightsReducer,
	keyboardState: keyboardReducer,
	effectsState: effectsReducer,
});

export default rootReducer;
