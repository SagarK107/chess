
export const PAWN_WHITE = 11;
export const ROOK_WHITE = 12;
export const KNIGHT_WHITE = 13;
export const BISHOP_WHITE =14;
export const KING_WHITE = 15;
export const QUEEN_WHITE = 16;

export const PAWN_BLACK = 21;
export const ROOK_BLACK = 22;
export const KNIGHT_BLACK = 23;
export const BISHOP_BLACK =24;
export const KING_BLACK = 25;
export const QUEEN_BLACK = 26;

export const EMPTY = 0;
const INITIAL_PAWN_SQUARE_BLACK = 1;
const INITIAL_PAWN_SQUARE_WHITE = 6;
export function getColour(piece)
{
    if (piece === 0)
      return "none";
    return Math.floor(piece / 10) === 1 ? "white" : "black";
}


export function getKind(piece) {
    switch (piece) {
      case PAWN_WHITE:
      case PAWN_BLACK:
        return 'pawn';
      case KNIGHT_WHITE:
      case KNIGHT_BLACK:
        return 'knight';
      case BISHOP_WHITE:
      case BISHOP_BLACK:
        return 'bishop';
      case ROOK_WHITE:
      case ROOK_BLACK:
        return 'rook';
      case QUEEN_WHITE:
      case QUEEN_BLACK:
        return 'queen';
      case KING_WHITE:
      case KING_BLACK:
        return 'king';
      default:
        return 'empty';
    }
  }


export function checkValidMove(board,source_row,source_column,destination_row,destination_column) 
{
    const piece_int = board[source_row][source_column];
    const piece = getKind(piece_int);
    const colour = getColour(piece_int);
    switch (piece) {
      case 'pawn':
        return checkValidMovePawn(board,source_row,source_column,destination_row,destination_column,colour);
      case 'rook':
        return checkValidMoveRook(board,source_row,source_column,destination_row,destination_column,colour);
      case 'knight':
        return checkValidMoveKnight(board,source_row,source_column,destination_row,destination_column,colour);
      case 'bishop':
        return checkValidMoveBishop(board,source_row,source_column,destination_row,destination_column,colour);
      case 'queen':
        return checkValidMoveKnight(board,source_row,source_column,destination_row,destination_column,colour) ||
                checkValidMoveBishop(board,source_row,source_column,destination_row,destination_column,colour);
      case 'king':
        return checkValidMoveKing(board,source_row,source_column,destination_row,destination_column,colour);
      default:
        return false;

    }



}
export function checkEnemyOnDestination(board,source_row,source_column,colour)
  {
    if (colour === "white" && getColour(board[source_row][source_column]) === "black")
      return true;
    if (colour === "black" && getColour(board[source_row][source_column]) === "white" )
      return true;
    return false;

  }

function checkIfDestinationSquareIsEmpty(board,source_row,source_column)
{
  return board[source_row][source_column] === EMPTY
}

export function checkValidMovePawn(board,source_row,source_column,destination_row,destination_column,colour)
{
  //check if on initial square for black
  const isEnemyOnDestination = checkEnemyOnDestination(board,destination_row,destination_column,colour)
  const isEmpty = checkIfDestinationSquareIsEmpty(board,destination_row,destination_column,colour);

  //Below code checks if you can move on first square, if yes you can move two squares
  if (colour === "black" && source_row === INITIAL_PAWN_SQUARE_BLACK && source_column === destination_column && destination_row === source_row + 2 && isEmpty)
  {
    return true;
  }

  if (colour === "white" && source_row === INITIAL_PAWN_SQUARE_WHITE && source_column === destination_column && destination_row === source_row - 2 && isEmpty)
  {
    return true;
  }
  //You can move one square forward
  if (colour === "black"  && source_column === destination_column && destination_row === source_row + 1 && isEmpty)
  {
    return true;
  }
  
  if (colour === "white"  && source_column === destination_column && destination_row === source_row - 1 && isEmpty)
  {
    return true;
  }
  //You can capture a piece diagonally
  if (colour === "black"  && Math.abs(source_column - destination_column) === 1 && destination_row === source_row + 1 && isEnemyOnDestination)
  {
    return true;
  }

  
  if (colour === "white"  && Math.abs(source_column - destination_column) === 1 && destination_row === source_row - 1 && isEnemyOnDestination)
  {
    return true;
  }

  //TODO: add en passant capture

  return false;
  
}

export function checkValidMoveRook(board,source_row,source_column,destination_row,destination_column,colour)
{
  const isEnemyOnDestination = checkEnemyOnDestination(board,destination_row,destination_row,colour)
  if (source_row === destination_row)
  {
    for (var i = source_column; i < destination_column; i++)
    {
      if (!checkIfDestinationSquareIsEmpty(board,source_row,i,colour))
      {
        return false;
      }
    }
    return true;

    
  }

  if (source_column === destination_column)
  {
    for (var i = source_row; i < destination_row; i++)
    {
      if (!checkIfDestinationSquareIsEmpty(board,i,source_column,colour))
      {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function checkValidMoveKnight(board,source_row,source_column,destination_row,destination_column,colour)
{
  const isEnemyOnDestination = checkEnemyOnDestination(board,destination_row,destination_row,colour);
  const isEmpty = checkIfDestinationSquareIsEmpty(board,destination_row,destination_column);
  console.log(isEnemyOnDestination,checkIfDestinationSquareIsEmpty(board,destination_row,destination_column))
  if (Math.abs(source_row - destination_row) === 2 && Math.abs(source_column - destination_column) === 1 && (isEnemyOnDestination || isEmpty))
  {
    return true;
  }
  if (Math.abs(source_row - destination_row) === 1 && Math.abs(source_column - destination_column) === 2 && (isEnemyOnDestination || isEmpty))
  {
    return true;
  }

  return false;
}

export function checkValidMoveBishop(board,source_row,source_column,destination_row,destination_column,colour)
{
  const isEnemyOnDestination = checkEnemyOnDestination(board,destination_row,destination_row,colour);
  const isEmpty = checkIfDestinationSquareIsEmpty(board,destination_row,destination_column);
  if (Math.abs(source_row - destination_row) === Math.abs(source_column - destination_column) && (isEnemyOnDestination || isEmpty))
  {
    const delta_row = destination_row - source_row > 0 ? 1 : -1;
    const delta_column = destination_column - source_column > 0 ? 1 : -1;
    for (var i = 0; i < Math.abs(source_row - destination_row); i++)
    {
      console.log(source_row+delta_row,source_column+delta_column);
      if (!checkIfDestinationSquareIsEmpty(board,source_row + delta_row,source_column + delta_column,colour))
      {
        return false;
      }
      return true;
    }
  }

  return false;
}

export function checkValidMoveKing(board,source_row,source_column,destination_row,destination_column,colour)
{
  const isEnemyOnDestination = checkEnemyOnDestination(board,destination_row,destination_column,colour);
  const isEmpty = checkIfDestinationSquareIsEmpty(board,destination_row,destination_column);
  console.log(source_row,source_column,destination_row,destination_column);
  if ((Math.abs(source_row - destination_row) <= 1 && Math.abs(source_column - destination_column) <= 1) && (isEnemyOnDestination || isEmpty))
  {
    return true;
  }
  return false;
}