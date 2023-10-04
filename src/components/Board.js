import { click } from "@testing-library/user-event/dist/click";
import "./board.css";
import {checkValidMove, getColour,getKind,EMPTY,checkEnemyOnDestination,detectCheck} from "./utils.js"
import React, { useState } from 'react';


export default function Board(props) {
    const board = props.board;
    const imageColourMap = {
        "white":"w",
        "black":"b"
    }
    const imagePieceMap = {
        "pawn":"p",
        "rook":"R",
        "knight":"N",
        "queen":"Q",
        "king":"K",
        "bishop":"B",
    }
    const [isPieceClicked,setIsPieceClicked] = useState(false);
    const [currentColour,setCurrentColour] = useState("white");
    const [clickedSquare,setClickedSquare] = useState([-1,-1]);
    const [whiteUnderCheck,setWhiteUnderCheck] = useState(true);
    const [blackUnderCheck,setBlackUnderCheck] = useState(true);
    const [whiteKingPosition,setWhiteKingPosition] = useState([0,3]);
    const [blackKingPosition,setBlackKingPosition] = useState([7,4]);    

    function setBoardColourCSS(ri,ci)
    {
       
         return (ri + ci) % 2 === 0 ? "white" : "black";
    }
    function setSelectedCss(ri,ci)
    {
        if (clickedSquare[0] === ri && clickedSquare[1] === ci)
            return "selected";
        return "";
    }

    function squareClickHandler(destination_row,destination_column)
    {

        if (isPieceClicked)
        {
            const source_row = clickedSquare[0];
            const source_column = clickedSquare[1];
            
            if (checkValidMove(board,source_row,source_column,destination_row,destination_column,currentColour))
            {                
                var temp_piece = board[destination_row][destination_column];
                board[destination_row][destination_column] = board[source_row][source_column];
                board[source_row][source_column] = EMPTY;
                const kingPosition = currentColour === "white" ? whiteKingPosition : blackKingPosition;
                console.log(kingPosition,board[kingPosition[0]][kingPosition[1]])
                if (detectCheck(board,kingPosition[0],kingPosition[1],currentColour))
                {
                    //undo the move and prompt user to try again
                    // this wont work for castling so something else should be done for that
                    board[source_row][source_column] = board[destination_row][destination_column];
                    board[destination_row][destination_column] = temp_piece;
                    console.log("King is under check. Try again")
                }
                else
                {
                    
                setCurrentColour(currentColour === "white" ? "black" : "white");
                }
            }
            else
            {
                console.log("invalid move!");
            }
            setClickedSquare([-1,-1]);
            setIsPieceClicked(false);
        }
        else
        {
            
            console.log(`${getColour(board[destination_row][destination_column])} ${getKind(board[destination_row][destination_column])}`)
            setClickedSquare([destination_row,destination_column]);
            setIsPieceClicked(true);


        }
    }
    
    
    
  return (
    <div>
        {
            board.map((r,ri) => <div>{
                r.map((piece,ci) => <div className={ `square ${setBoardColourCSS(ri,ci)} ${setSelectedCss(ri,ci)}`} onClick={(e) => squareClickHandler(ri,ci) }>
                    {board[ri][ci] !== 0 ? <img src={`${process.env.PUBLIC_URL}/images/${imageColourMap[getColour(board[ri][ci])]}${imagePieceMap[getKind(board[ri][ci])]}.png`}></img> : <div></div>}
                  
                </div> )
        }</div>)}
        
        Current turn: {`${currentColour}`}

    </div>
  )
}
