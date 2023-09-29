import { click } from "@testing-library/user-event/dist/click";
import "./board.css";
import {checkValidMove, getColour,getKind,EMPTY,checkEnemyOnDestination} from "./utils.js"
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
            
            if (checkValidMove(board,source_row,source_column,destination_row,destination_column))
            {                
                board[destination_row][destination_column] = board[source_row][source_column];
                board[source_row][source_column] = EMPTY;
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

    </div>
  )
}
