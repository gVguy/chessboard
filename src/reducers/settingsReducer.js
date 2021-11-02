const initialSettings = {
	orientation: 'white',
	flipEveryMove: false,
};

const orientationFlip = (orientation) => orientation === 'white' ? 'black' : 'white';

export default function settingsReducer(state = { ...initialSettings }, action) {
	switch (action.type) {
		case 'ORIENTATION_FLIP':
			return {
				flipEveryMove: false,
				orientation: orientationFlip(state.orientation),
			}
		case 'FLIP_EVERY_MOVE_TOGGLE':
			return {
				orientation: state.currentMove.color,
				flipEveryMove: state.flipEveryMove ? false : true,
			}
		case 'MOVE_MAKE':
			return {
				...state,
				orientation: state.flipEveryMove ? orientationFlip(state.orientation) : state.orientation,
			}
		default:
			return state;
	}
}