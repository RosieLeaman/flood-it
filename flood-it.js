'use strict';

function getNRandomColours(availableColours,n){
  const numColours = availableColours.length

  const colours = Array(n).fill(1).map((el) => {
    return availableColours[Math.floor(Math.random()*numColours)]
  })

  return colours
}

function Button(props){
  return (
    <button
      onClick={props.onClick}
      className={props.className}
    >
      {props.text}
    </button>
  )
}

function InstructionText(){
  return (
    <p>These are instructions.</p>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSquare(key,colour){
    
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <span className="game-name">Flood it!</span>
        <Button
          className="header-button"
          text="New game"
        />
        <Button
          className="header-button"
          text="Instructions"
        />
        <InstructionText/>
      </div>
    )
  }
}

const availableColours = ['red','blue','green','yellow','orange']

const board = getNRandomColours(availableColours,100)

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header/>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById("game")
);
