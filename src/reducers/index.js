import game from './gameReducer';
import settings from './settingsReducer';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
	game,
	settings,
});

const rootReducer = (state, action) => {
	if (action.type === 'NEW_GAME') {
		state = {
			...state,
			game: undefined,
		};
	}
	return appReducer(state, action);
}

export { rootReducer };