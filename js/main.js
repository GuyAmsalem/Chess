'use strict'

// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gElSelectedCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}
function buildBoard() {
    var board = [];
    const SIZE = 8;
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            var cell = '';
            if (i === 1) cell = PAWN_WHITE;
            if (i === 6) cell = PAWN_BLACK;
            board[i][j] = cell;
        }
    }
    board[0][0] = board[0][7] = ROOK_WHITE;
    board[0][1] = board[0][6] = KNIGHT_WHITE;
    board[0][2] = board[0][5] = BISHOP_WHITE;
    board[0][3] = KING_WHITE;
    board[0][4] = QUEEN_WHITE;

    board[7][0] = board[7][7] = ROOK_BLACK;
    board[7][1] = board[7][6] = KNIGHT_BLACK;
    board[7][2] = board[7][5] = BISHOP_BLACK;
    board[7][3] = KING_BLACK;
    board[7][4] = QUEEN_BLACK;

    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black'
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="    ' + className + '" >' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {
    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        console.log('MOVING THE PIECE', gElSelectedCell);
        movePiece(gElSelectedCell, elCell)
        return;
    }

    cleanBoard();

    elCell.classList.add('selected');
    gElSelectedCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);


    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    // TODO: use: getCellCoord to get the coords, move the piece

    var coord = getCellCoord(elFromCell.id)
    var piece = gBoard[coord.i][coord.j];

    console.log('P', piece);

    var nextCoord = getCellCoord(elToCell.id)
    // update the MODEl
    gBoard[coord.i][coord.j] = '';
    gBoard[nextCoord.i][nextCoord.j] = piece;
    // update the DOM
    renderBoard(gBoard);


}

function markCells(coords) {
    // query select them one by one and add mark
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var elCell = document.querySelector(getSelector(coord));
        elCell.classList.add('mark');
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function cleanBoard() {
    var tds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < tds.length; i++) {
        tds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    var diff = (isWhite) ? 1 : -1;
    var coord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    if (!isEmptyCell(coord)) return res;
    res.push(coord)

    if ((pieceCoord.i === 1 && isWhite) || (pieceCoord.i === 6 && !isWhite)) {
        coord = { i: coord.i + diff, j: pieceCoord.j }
        if (!isEmptyCell(coord)) return res;
        res.push(coord)
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];

    for (var i = pieceCoord.i + 1; i < gBoard.length; i++) {
        var coord = { i: i, j: pieceCoord.j };
        if (isEmptyCell(coord)) res.push(coord)
        else break;
    }
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var coord = { i: i, j: pieceCoord.j };
        if (isEmptyCell(coord)) res.push(coord)
        else break;
    }
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var coord = { i: pieceCoord.i, j: j };
        if (isEmptyCell(coord)) res.push(coord)
        else break;
    }
    for (var j = pieceCoord.j + 1; j < gBoard[0].length; j++) {
        var coord = { i: pieceCoord.i, j: j };
        if (isEmptyCell(coord)) res.push(coord)
        else break;
    }

    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    // 3 more directions - the Bishop 
    i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];
    //Down
    var coord = { i: pieceCoord.i + 2, j: pieceCoord.j + 1 };
    if (coord.j < 8 && coord.i < 8 && isEmptyCell(coord)) res.push(coord);

    var coord = { i: pieceCoord.i + 2, j: pieceCoord.j - 1 };
    if (coord.j >= 0 && coord.i < 8 && isEmptyCell(coord)) res.push(coord);
    //Up
    var coord = { i: pieceCoord.i - 2, j: pieceCoord.j + 1 };
    if (coord.j < 8 && coord.i >= 0 && isEmptyCell(coord)) res.push(coord);

    var coord = { i: pieceCoord.i - 2, j: pieceCoord.j - 1 };
    if (coord.j >= 0 && coord.i >= 0 && isEmptyCell(coord)) res.push(coord);
    //Left
    var coord = { i: pieceCoord.i + 1, j: pieceCoord.j - 2 };
    if (coord.j >= 0 && coord.i < 8 && isEmptyCell(coord)) res.push(coord);

    var coord = { i: pieceCoord.i - 1, j: pieceCoord.j - 2 };
    if (coord.j >= 0 && coord.i >= 0 && isEmptyCell(coord)) res.push(coord);
    //Right
    var coord = { i: pieceCoord.i + 1, j: pieceCoord.j + 2 };
    if (coord.j < 8 && coord.i < 8 && isEmptyCell(coord)) res.push(coord);

    var coord = { i: pieceCoord.i - 1, j: pieceCoord.j + 2 };
    if (coord.j < 8 && coord.i >= 0 && isEmptyCell(coord)) res.push(coord);

    return res;
}

function getAllPossibleCoordsQueen(pieceCoord){
    var res = [];
    res.push(...getAllPossibleCoordsRook(pieceCoord));
    res.push(...getAllPossibleCoordsBishop(pieceCoord))

    return res;
}

function getAllPossibleCoordsKing(pieceCoord){
    var res = [];
    var coord = { i: pieceCoord.i - 1, j: pieceCoord.j - 1 };
    if (coord.i >= 0 && coord.j >= 0 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i - 1, j: pieceCoord.j};
    if (coord.i >= 0 && isEmptyCell(coord)) res.push(coord);

    var coord = { i: pieceCoord.i - 1, j: pieceCoord.j + 1 };
    if (coord.i >= 0 && coord.j <8 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i, j: pieceCoord.j + 1 };
    if (coord.j < 8 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i + 1, j: pieceCoord.j + 1 };
    if (coord.i < 8 && coord.j < 8 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i + 1, j: pieceCoord.j };
    if (coord.i < 8 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i + 1, j: pieceCoord.j - 1 };
    if (coord.i < 8 && coord.j >= 0 && isEmptyCell(coord)) res.push(coord);
    
    var coord = { i: pieceCoord.i , j: pieceCoord.j - 1 };
    if ( coord.j >= 0 && isEmptyCell(coord)) res.push(coord);
    
    return res;  
}

