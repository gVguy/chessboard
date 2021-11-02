
// GAME

export function moveStart(piece, position) {
	return {
		type: 'MOVE_START',
		piece: piece,
		position: position,
	};
}

export function moveCancel() {
	return {
		type: 'MOVE_CANCEL',
	};
}

export function moveMake(position) {
	return {
		type: 'MOVE_MAKE',
		position: position,
	}
}

export function newGame() {
	return {
		type: 'NEW_GAME',
	}
}

// SETTINGS

export function flipBoard() {
	return {
		type: 'ORIENTATION_FLIP',
	}
}

export function flipEveryMove() {
	return {
		type: 'FLIP_EVERY_MOVE_TOGGLE',
	}
}

// DRAGGING

export const dragStart = (piece, position, mousePos) => ({
	type: 'DRAG_START',
	piece,
	position,
	mousePos,
});

export const dragMove = (pos) => ({
	type: 'DRAG_MOVE',
	pos,
});

export const dragEnd = () => ({
	type: 'DRAG_END',	
});

export const dragCancelUnlock = () => ({
	type: 'DRAG_CANCEL_UNLOCK',	
});


