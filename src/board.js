import { useSelector, useDispatch } from 'react-redux';
import { moveStart, moveCancel, moveMake, newGame, flipBoard, flipEveryMove, dragStart, dragEnd, dragMove, dragCancelUnlock } from './actions';


export function Board() {
	const dispatch = useDispatch();
	const state = useSelector(state => state);
	const boardState = state.board;
	const currentMove = state.currentMove;

	let dark = true; //for coloring
	const board = Object.keys(boardState).map(file => {
		dark = !dark;
		const fileSquares = Object.keys(boardState[file]).map(square => {
			square = Number(square);
			const piece = boardState[file][square];
			dark = !dark;
			const myPiece = piece.color === currentMove.color;
			const thisIsPossibleMoveSquare = () => currentMove.possibleMoves.length && currentMove.possibleMoves.some(pos => pos.file === file && pos.square === square); //square in possible moves list
			const isActive = (() => {
				if (state.currentMove.possibleMoves && state.currentMove.possibleMoves.length > 0)
					return file === state.currentMove.currentPosition.file && square === state.currentMove.currentPosition.square ? true : false;
				else return false;
			})();
			const thisIsCancelSquare = state.drag.active || isActive || !myPiece;
			const mouseLeaveHandle = () => {
				if (state.drag.active) dispatch(dragCancelUnlock());
			};
			const mouseDownHandle = (e) => {
				dispatch(moveStart(piece, {file,square}));
				dispatch(dragStart(piece, {file,square}, [e.clientX, e.clientY]));
			}
			const cancelMoveHandle = () => {
				//if (!state.drag.active || (state.drag.active && (!(file === state.drag.origin.file && square === state.drag.origin.square) || originSquareCancelsMove)))
				if (!state.drag.active || state.drag.cancelUnlock) dispatch(moveCancel());
			}

			function renderPiece() {
				return myPiece ? (
					<div className={"piece " + piece.color + " clickable" + (isActive ? " active" : "")}
						//onClick={() => dispatch(moveStart(piece, {file,square}))}
						//draggable
						onMouseDown={mouseDownHandle}
						//onMouseOut={mouseLeaveHandle}
						//onMouseUp={() => {dispatch(dragEnd())}}
						>
							{pieceSymbol(piece.piece, piece.color)}
					</div>
				) : (
					<div className={"piece " + piece.color}>
						{pieceSymbol(piece.piece, piece.color)}
					</div>
				);
			}
			return (
				<div className={"boardSquare" + (dark ? " dark" : "")} key={file+square}>
					{ piece.piece ? renderPiece() : ''}
					{ currentMove.currentPosition ? (
						thisIsPossibleMoveSquare() ?
							<div>
								<div className="ghostSquare" onMouseUp={() => dispatch(moveMake({file,square}))} />
								<div className="greenGhostSquare" />
							</div> :
							thisIsCancelSquare ? <div className="cancelMoveGhostSquare" onMouseUp={cancelMoveHandle} onMouseOut={mouseLeaveHandle} /> : ''
					) : '' }
				</div>
			);
		});
		return (
			<div className="boardFile" key={file}>
				<div className="boardFileTitle">{file}</div>
					{ fileSquares }
				<div className="boardFileTitle">{file}</div>
			</div>
		);
	});
	const orientation = state.orientation;
	const renderRankTitles = () => {
		const rankTitles = ['',1,2,3,4,5,6,7,8,''].map((rank,i) => (
			<div className="boardRankTitle" key={'rank'+i}>
				{ rank }
			</div>
		));
		return (
			<div className="boardRankTitles boardFile">{ rankTitles }</div>
		);
	}
	const notation = state.notation.map((notationCouple, i) => {
		const notationMoves = notationCouple.map((notationMove, j) => (
			<span className="notationMove" key={i+''+j}> { notationMove.move } </span>
		));
		return (
			<div className="notationMoveContainer" key={i}>
				<span className="notationCount">{ i+1 }</span>
				{ notationMoves }
			</div>
		);
	});
	const mouseMoveHandle = (e) => {
		if (state.drag.active) {
			dispatch(dragMove([e.clientX,e.clientY]));
		}
	};
	return (
		<div className="app" onMouseUp={() => {dispatch(dragEnd())}} onMouseMove={mouseMoveHandle}>
			<div className={'boardContainer ' + currentMove.color}>
				<div className="boardButtonsContaioner">
					<button onClick={() => dispatch(newGame())} className="boardButton">New Game</button>
					<button onClick={() => dispatch(flipBoard())} className="boardButton">Flip Board</button>
					<div onClick={() => dispatch(flipEveryMove())} className="boardSwitch">
						<div className={"switch" + (state.flipEveryMove ? " checked" : "")}>
							<div className="switchInnerCircle"></div>
						</div>
						<span>Flip by move</span>
					</div>
				</div>
				<div className={"board " + orientation} id="dragRoot">
					{ renderRankTitles() }
					{ board }
					{ renderRankTitles() }
				</div>
				<div className="notation">
					{ notation }
				</div>
				{ state.drag.active ? (
					<div className="draggedContainer" style={{left:state.drag.pos[0]+'px',top:state.drag.pos[1]+'px'}}>
						<div className={"piece " + state.drag.piece.color}>
							{pieceSymbol(state.drag.piece.piece, state.drag.piece.color)}
						</div>
					</div>
					) : ''
				}
			</div>
		</div>);

}

const pieceSymbol = (piece, color) => (
	<img src={'./chess_icons/' + color + '_' + piece + '.svg'} className="symbol" alt={color + ' ' + piece} />
);

/*({
	white: {
		K: "&#9812;",
		Q: "&#9813;",
		R: "&#9814;",
		B: "&#9815;",
		N: "&#9816;",
		p: "&#9817;",
	},
	black: {
		K: "&#9818;",
		Q: "&#9819;",
		R: "&#9820;",
		B: "&#9821;",
		N: "&#9822;",
		p: "&#9823;",
	}
}[color][piece]);*/
