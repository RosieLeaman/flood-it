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
          onClick = {() => this.props.onUndo()}
        />
      </div>
    )
  }
}

const availableColours = ['red','blue','green','yellow','purple','black'];
const alternateColour = {'red':'blue','blue':'green','green':'yellow','yellow':'purple','purple':'black','black':'red'}

const nRows = 12;
const nCols = 12;

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
      nRows:nRows,
      nCols:nCols,
      board: board,
      included: included,
      prevBoard: null,
      prevIncluded: null,
      moves: 0,
      maxMoves: 25,
    }
  }

  floodNeighbours(board,included,checked,row,col,chosenColour){
    checked[row][col] = true;

    // find its neighbours
    const neighbours = getNeighbourIndices(this.state.nRows,this.state.nCols,row,col)

    for (var k=0; k < neighbours.length; k++){
      // neighbours become included IF they are chosen colour OR they are already included
      if (board[neighbours[k][0]][neighbours[k][1]] === chosenColour || included[neighbours[k][0]][neighbours[k][1]]){
        included[neighbours[k][0]][neighbours[k][1]] = true;
        board[neighbours[k][0]][neighbours[k][1]] = chosenColour;

        // we only check neighbours of neighbours IF they have NOT ALREADY BEEN CHECKED!!
        if (!checked[neighbours[k][0]][neighbours[k][1]]){
          this.floodNeighbours(board,included,checked,neighbours[k][0],neighbours[k][1],chosenColour)
        }
      }
    }
    return;
  }

  handleSquareClick(row,col) {
    // return early if we have already clicked this square
    if (this.state.included[row][col]) {
      return;
    }

    // actually duplicate the board so that we can make the undo button work
    const nextBoard = [];
    const nextIncluded = [];

    for (var i=0; i < this.state.board.length; i ++){
      nextBoard[i] = this.state.board[i].slice();
      nextIncluded[i] = this.state.included[i].slice();
    }

    // get the colour of that square
    const chosenColour = nextBoard[row][col];

    // set the colour of every already included square to that colour
    // and set its neighbours to be both included and that colour
    // note that this is NOT efficient, it over-checks many squares. 

    nextBoard[0][0] = chosenColour;
    const checked = Array(nRows).fill(0).map((el) => {return Array(nCols).fill(false)})

    this.floodNeighbours(nextBoard,nextIncluded,checked,0,0,chosenColour)

    this.setState({
      board: nextBoard,
      included: nextIncluded,
      prevBoard: this.state.board,
      prevIncluded: this.state.included,
      moves: this.state.moves + 1,
      }
    )
  }

  handleUndo() {
    // if we have no previous move can't exactly undo
    if (this.state.prevBoard === null) {
      return;
    }

    this.setState({
      board: this.state.prevBoard,
      included: this.state.prevIncluded,
      prevBoard: null,
      prevIncluded: null,
    })
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
            onUndo = {() => this.handleUndo()}
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
