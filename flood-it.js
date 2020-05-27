'use strict';

function getNRandomColours(availableColours,n){
  const numColours = availableColours.length

  const colours = Array(n).fill(1).map((el) => {
    return availableColours[Math.floor(Math.random()*numColours)]
  })

  return colours
}

function getNeighbourIndices(nRows,nCols,row,col) {
  const neighbourIndices = []
  if (row > 0) {
    neighbourIndices.push([row-1,col])
  }
  if (row < nRows - 1) {
    neighbourIndices.push([row+1,col])
  }
  if (col > 0) {
    neighbourIndices.push([row,col-1])
  }
  if (col < nCols - 1) {
    neighbourIndices.push([row,col+1])
  }

  return neighbourIndices
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

  renderSquare(key,colour,row,col){
    return (
      <Button
        key = {key}
        className = {"board-square " + colour}
        onClick = {() => this.props.onSquareClick(row,col)}
      />
    )
  }

  makeRow(rowIndex){
    const row = Array(this.props.nCols).fill(0).map((col,colIndex) => {
      const colour = this.props.board[rowIndex][colIndex];

      return this.renderSquare(colIndex,colour,rowIndex,colIndex);
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
        <Button
          className = "header-button"
          text = "Show Instructions"
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
      </div>
    )
  }
}

const availableColours = ['red','blue','green','yellow','purple','black'];
const alternateColour = {'red':'blue','blue':'green','green':'yellow','yellow':'purple','purple':'black','black':'red'}

const nRows = 15;
const nCols = 15;

const showInstructions = false;

class Game extends React.Component {
  constructor(props) {
    super(props);

    const board = Array(nRows).fill(0).map((el) => getNRandomColours(availableColours,nCols));
    // we need to fix the case where the top left corner can have the same colour as its neighbours
    if (board[0][0] === board[0][1]){
      board[0][1] = alternateColour[board[0][1]]
    }
    if (board[0][0] === board[1][0]){
      board[1][0] = alternateColour[board[1][0]]
    }

    const included = Array(nRows).fill(0).map(() => {return Array(nCols).fill(false)});
    included[0][0] = true;

    this.state = {
      board: board,
      included: included,
      moves: 0,
      maxMoves: 25,
    }
  }

  handleSquareClick(row,col) {
    const nextBoard = this.state.board;
    const nextIncluded = this.state.included;

    // return early if we have already clicked this square
    if (nextIncluded[row][col]) {
      return;
    }

    // get the colour of that square
    const chosenColour = nextBoard[row][col];

    // set the colour of every already included square to that colour
    // and set its neighbours to be both included and that colour
    // note that this is NOT efficient, it over-checks many squares. This may not be a problem.
    for (var i=0; i < nRows; i++){
      for (var j=0; j < nCols; j++){
        if (this.state.included[i][j]){
          nextBoard[i][j] = chosenColour;

          const neighbourList = getNeighbourIndices(nRows,nCols,i,j)

          for (var k=0; k < neighbourList.length; k++){
            // neighbours become included IF they are chosen colour
            if (nextBoard[neighbourList[k][0]][neighbourList[k][1]] === chosenColour){
              nextIncluded[neighbourList[k][0]][neighbourList[k][1]] = true;
            }
          }
        }
      }
    }

    console.log(nextBoard)
    console.log(nextIncluded)
    console.log(this.state.moves)

    this.setState({
      board: nextBoard,
      included: nextIncluded,
      moves: this.state.moves + 1,
      }
    )
  }

  render() {
    return (
      <div className="game">
        <Header/>
        <div className = "game-main">
          <Board
            nRows = {nRows}
            nCols = {nCols}
            board = {this.state.board}
            onSquareClick = {(row,col) => this.handleSquareClick(row,col)}
          />
          <InfoBox
            moves = {this.state.moves}
            maxMoves = {this.state.maxMoves}
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
