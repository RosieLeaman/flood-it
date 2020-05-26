'use strict';

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

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <span className="game-name">Flood it!</span>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById("game")
);
