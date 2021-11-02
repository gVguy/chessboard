const initialBoard = {
	a: {
		1: { piece: 'R', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'R', color: 'black' },
	},
	b: {
		1: { piece: 'N', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'N', color: 'black' },
	},
	c: {
		1: { piece: 'B', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'B', color: 'black' },
	},
	d: {
		1: { piece: 'Q', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'Q', color: 'black' },
	},
	e: {
		1: { piece: 'K', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'K', color: 'black' },
	},
	f: {
		1: { piece: 'B', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'B', color: 'black' },
	},
	g: {
		1: { piece: 'N', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'N', color: 'black' },
	},
	h: {
		1: { piece: 'R', color: 'white' },
		2: { piece: 'p', color: 'white' },
		3: { piece: null },
		4: { piece: null },
		5: { piece: null },
		6: { piece: null },
		7: { piece: 'p', color: 'black' },
		8: { piece: 'R', color: 'black' },
	},
};

const newGame = (state) => ({
	board: JSON.parse(JSON.stringify(initialBoard)),
	currentMove: {
		color: 'white',
		currentPosition: null,
		possibleMoves: null,
	},
	takenPieces: {
		white: [],
		black : [],
	},
	notation: [],
	orientation: 'white',
	flipEveryMove: state ? state.flipEveryMove : false,
	drag: {
		active: false,
		piece: null,
		origin: null,
		pos: [0,0],
		cancelUnlock: false,
	}
});

export function gameReducer(state = newGame(), action) {

	if (action.type === 'NEW_GAME') {
		state = newGame(state);
	}

	switch (action.type) {

		//game progress

		case 'MOVE_START':
			return {
				...state,
				currentMove: {
					...state.currentMove,
					currentPosition: action.position,
					possibleMoves: calculatePossibleMoves(action.piece, action.position, state.board),
				}
			};

		case 'MOVE_CANCEL':
			return {
				...state,
				currentMove: {
					...state.currentMove,
					currentPosition: null,
					possibleMoves: null,
				}
			};

		case 'MOVE_MAKE':
			const board = { ...state.board };
			const [ source, destination ] = [ state.currentMove.currentPosition, action.position ];
			const activePiece = board[source.file][source.square];
			const nextColor = state.currentMove.color === 'white' ? 'black' : 'white';
			const takenPiece = board[destination.file][destination.square].piece;
			const takenPieces = { ...state.takenPieces };
			if (takenPiece) takenPieces[state.currentMove.color].push(takenPiece);
			board[destination.file][destination.square] = activePiece;
			board[source.file][source.square] = { piece: null };
			function makeNotation() {
				let notation = '';
				if (activePiece.piece === 'p') {
					if (source.file !== destination.file) notation += source.file;
				} else notation += activePiece.piece;
				if (takenPiece) notation += 'x';
				notation += destination.file + destination.square;
				return { move: notation };
			}
			const notation = [ ...state.notation ];
			if (notation.length && notation[notation.length-1].length < 2) {
				notation[notation.length-1].push(makeNotation());
			} else {
				notation.push([makeNotation()]);
			}
			return {
				...state,
				currentMove: {
					//...state.currentMove,
					color: nextColor,
					currentPosition: null,
					possibleMoves: null,
				},
				takenPieces: takenPieces,
				board: board,
				notation: notation,
				orientation: state.flipEveryMove ? orientationFlip(state.orientation) : state.orientation,
			};


		//game preferences

		case 'ORIENTATION_FLIP':
			return {
				...state,
				flipEveryMove: false,
				orientation: orientationFlip(state.orientation),
			};
		case 'FLIP_EVERY_MOVE_TOGGLE':
			return {
				...state,
				orientation: state.currentMove.color,
				flipEveryMove: state.flipEveryMove ? false : true,
			};


		//dragging

		case 'DRAG_START':
			console.log('drag start');
			return {
				...state,
				drag: {
					active: true,
					piece: action.piece,
					origin: action.position,
					pos: action.mousePos,
					cancelUnlock: false,
				},
			};

		case 'DRAG_END':
			if (!state.drag.active) return state;
			else {
				console.log('drag end');
				return {
					...state,
					drag: {
						active: false,
						piece: null,
						origin: null,
						pos: [0,0],
						cancelUnlock: false,
					}
				};
			}

		case 'DRAG_MOVE':
			return {
				...state,
				drag: {
					...state.drag,
					pos: action.pos,
				}
			}

		case 'DRAG_CANCEL_UNLOCK':
			return {
				...state,
				drag: {
					...state.drag,
					cancelUnlock: true,
				}
			}



		default:
			return state;
	}
}

const orientationFlip = (orientation) => orientation === 'white' ? 'black' : 'white';

function calculatePossibleMoves(piece, position, board) {
	const files = Object.keys(board);
	const squares = [...Array(9).keys()].slice(1);
	//position.square = Number(position.square);
	function isEmpty(position) {
		return files.includes(position.file) && squares.includes(position.square) && //make sure position exists
			board[position.file][position.square].piece === null;
	}
	function enemyPieceOn(position) {
		return files.includes(position.file) && squares.includes(position.square) && //make sure position exists
			board[position.file][position.square].piece && board[position.file][position.square].color !== piece.color;
	}
	function file(file, i) {
		return files[files.indexOf(file) + i];
	}
	function calculateLine(dir) {
		const possiblePositions = [];
		let pos = { file: file(position.file, dir[0]), square:position.square+dir[1] };
		while (isEmpty(pos)) {
			possiblePositions.push({...pos});
			pos.file = file(pos.file, dir[0]);
			pos.square += dir[1];
		}
		if (enemyPieceOn(pos)) possiblePositions.push(pos);
		return possiblePositions;
	}
	let possibleMoves = [];
	let possiblePositions = [];
	const forward = piece.color === 'white' ? 1 : -1;
	const backward = forward*-1;
	const bishopDirections = [[1,1],[1,-1],[-1,1],[-1,-1]];
	const rookDirections = [[1,0],[-1,0],[0,1],[0,-1]];
	switch (piece.piece) {
		case 'p':
			//one forward
			possiblePositions = [{ file: position.file, square: position.square+forward }];
			//two forward
			if ((piece.color === 'white' && position.square === 2) || (piece.color === 'black' && position.square === 7)) {
				possiblePositions.push({ file: position.file, square: position.square+forward*2 });
			}
			//check if possible squares are empty
			for (let pos of possiblePositions) {
				if (isEmpty(pos)) possibleMoves.push(pos);
			}
			//takes
			possiblePositions = [
				{ file: file(position.file, +1), square: position.square+forward },
				{ file: file(position.file, -1), square: position.square+forward },
			];
			//check if possible squares are occupied by enemy
			for (let pos of possiblePositions) {
				if (enemyPieceOn(pos)) possibleMoves.push(pos);
			}
			break;
		case 'N':
			possiblePositions = [
				{ file: file(position.file, +1), square: position.square+forward*2 },
				{ file: file(position.file, +2), square: position.square+forward },
				{ file: file(position.file, -1), square: position.square+forward*2 },
				{ file: file(position.file, -2), square: position.square+forward },
				{ file: file(position.file, +1), square: position.square+backward*2 },
				{ file: file(position.file, +2), square: position.square+backward },
				{ file: file(position.file, -1), square: position.square+backward*2 },
				{ file: file(position.file, -2), square: position.square+backward },
			];
			//check if possible squares are empty or occupied by an enemy piece
			for (let pos of possiblePositions) {
				if (isEmpty(pos) || enemyPieceOn(pos)) possibleMoves.push(pos);
			}
			break;
		case 'B':
			bishopDirections.forEach(dir => possibleMoves = possibleMoves.concat(calculateLine(dir)));
			break;
		case 'R':
			rookDirections.forEach(dir => possibleMoves = possibleMoves.concat(calculateLine(dir)));
			break;
		case 'Q':
			bishopDirections.concat(rookDirections).forEach(dir => possibleMoves = possibleMoves.concat(calculateLine(dir)));
			break;
		case 'K':
			bishopDirections.concat(rookDirections).forEach(dir => possiblePositions.push(
				{ file: file(position.file, dir[0]), square: position.square+dir[1] }
			));
			for (let pos of possiblePositions) {
				if (isEmpty(pos) || enemyPieceOn(pos)) possibleMoves.push(pos);
			}
			break;
		default:
			break;
	}
	//can't take the king
	for (let i in possibleMoves) {
		const pos = possibleMoves[i];
		if (board[pos.file][pos.square].piece === 'K') possibleMoves.splice(i, 1);
	}
	return possibleMoves;
}
