'use strict';

function getNRandomColours(availableColours,n){
  const numColours = availableColours.length

  const colours = Array(n).fill(1).map((el) => {
    return availableColours[Math.floor(Math.random()*numColours)]
  })

  return colours
}

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className={props.className}
    >
      {props.text}
    </button>
  )
}

function InstructionText() {
  return (
    <p className="instructions">These are instructions.</p>
  )
}

function MovesText(props) {
  return (
    <span>{"Moves: " + props.moves + "/" + props.maxMoves}</span>
  )
}

function GameOverText(props) {
  return (
    <span className="game-over-text">{props.text}</span>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSquare(key,colour){
    return (
      <Button
        key = {key}
        className = {"board-square " + colour}
      />
    )
  }

  makeRow(rowIndex){
    const row = Array(this.props.nCols).fill(0).map((col,colIndex) => {
      const colour = this.props.board[rowIndex][colIndex];

      return this.renderSquare(colIndex,colour);
    })
    return (
      <div key = {rowIndex} className="board-row">
        {row}
      </div>
    )
  }

  render() {

    const board = Array(this.props.nRows).fill(0).map((row,rowIndex) => {
      return (this.makeRow(rowIndex));
    })

    return (
      <div className="board">
        {board}
      </div>
    )
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className = "header">
        <span className = "game-name">Flood it!</span>
        <Button
          className = "header-button"
          text = "New Game"
        />
        <InstructionText/>
      </div>
    )
  }
}

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="infobox">
        <MovesText
          moves = {this.props.moves}
          maxMoves = {this.props.maxMoves}
        />
        <Button
          text = "Undo last move"
          className = "infobox-button"
        />

        <Button
          text = "Undo last move"
          className = "infobox-button"
        />
      </div>
    )
  }
}

const availableColours = ['red','blue','green','yellow','purple','black'];

const nRows = 20;
const nCols = 20;

const board = Array(nRows).fill(0).map((el) => getNRandomColours(availableColours,nCols));

const moves = 3;
const maxMoves = 25;

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game">
        <Header/>
        <div className = "game-main">
          <Board
            nRows = {nRows}
            nCols = {nCols}
            board = {board}
          />
          <InfoBox
            moves = {moves}
            maxMoves = {maxMoves}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById("game")
);
