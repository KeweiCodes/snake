import MemberActions from '../actions/MemberActions';
import MemberStore from '../stores/MemberStore';
import React from 'react';
import constants from "CONSTANTS"
import Block from './Block';

class GamePanel extends React.Component{
  constructor(props, context){
    super(props, context);

    var gameState = [];
    var width = 30;
    var height = 30;
    var snake = [{x:2, y:14}, {x:1, y:14}, {x:0, y:14}];
    var snakeLength = snake.length;
    var i, j;

    for(i=0; i < height; i++){
      var currentRow = [];
      for(j=0; j < width; j++){
        currentRow.push(constants.EMPTY_SQUARE);
      }
      gameState.push(currentRow);
    }

    if(snakeLength > 1){
      for(i=snakeLength - 1; i > 0; i--){
        var pos = snake[i];
        gameState[pos.y][pos.x] = constants.SNAKE_SQUARE;
      }
    }

    var headPos = snake[0];
    gameState[headPos.y][headPos.x] = constants.SNAKE_HEAD_SQUARE;

    this.state = {
      direction: constants.RIGHT,
      nextDirection: constants.RIGHT,
      width: width,
      height: height,
      gameState: gameState,
      snake: snake
    };
  }

  componentWillMount(){
    $(document).keydown(function(e){
      switch(e.keyCode){
        case 38:
          if(this.state.direction != constants.DOWN
            && this.state.direction != constants.UP){
            this.setState({ nextDirection: constants.UP })
          }
          break;
        case 39:
          if(this.state.direction != constants.LEFT
            && this.state.direction != constants.RIGHT){
            this.setState({ nextDirection: constants.RIGHT })
          }
          break;
        case 40:
          if(this.state.direction != constants.UP
            && this.state.direction != constants.DOWN){
            this.setState({ nextDirection: constants.DOWN })
          }
          break;
        case 37:
          if(this.state.direction != constants.RIGHT
            && this.state.direction != constants.LEFT){
            this.setState({ nextDirection: constants.LEFT })
          }
          break;
      }
      return false;
    }.bind(this));
  }

  componentDidMount(){
    var tickFunction = function(){ this.tick(); }.bind(this);
    setTimeout(function(){
      this.setState({ intervalId: setInterval(tickFunction, 50) });
    }.bind(this), 300);
  }

  tick(){
    console.log('tick');
    var gameState = this.state.gameState;
    var snake = this.state.snake;
    var snakeLength = snake.length;

    var head = snake[0];
    var tail = snake[snakeLength - 1];
    gameState[head.y][head.x] = constants.SNAKE_SQUARE;
    gameState[tail.y][tail.x] = constants.EMPTY_SQUARE;

    var nextDirection = this.state.nextDirection;
    var nextHead;
    switch(nextDirection){
      case constants.UP:
        nextHead = {
          x: head.x,
          y: head.y - 1
        };
        break;
      case constants.DOWN:
        nextHead = {
          x: head.x,
          y: head.y + 1
        };
        break;
      case constants.LEFT:
        nextHead = {
          x: head.x - 1,
          y: head.y
        };
        break;
      case constants.RIGHT:
        nextHead = {
          x: head.x + 1,
          y: head.y
        };
        break;
    }

    snake.splice(snakeLength-1, 1);
    snake.splice(0, 0, nextHead);

    if(nextHead.x == this.state.width
      || nextHead.x < 0){
      this.setState(
        {
          gameState: gameState,
          snake: snake,
          gameOver: true
        }
      );
      clearInterval(this.state.intervalId);
    }else if(nextHead.y == this.state.height
      || nextHead.y < 0){
      this.setState(
        {
          gameState: gameState,
          snake: snake,
          gameOver: true
        }
      );
      clearInterval(this.state.intervalId);
    }else{
      gameState[nextHead.y][nextHead.x] = constants.SNAKE_HEAD_SQUARE;
      this.setState({gameState: gameState, snake: snake, direction: nextDirection});
    }
  }

  render() {
    if(this.state.gameOver){
      alert("game over!");
    }
    var blocks = [];
    var i;
    var j;
    var width = this.state.width;
    var height = this.state.height;
    var gameState = this.state.gameState;
    for(i=0; i < height; i++){
      var blocksRow = [];
      for(j=0; j < width; j++){
        blocksRow.push(<Block type={ gameState[i][j] } key={`${i},${j}`} />);
      }
      blocks.push(<div className={ "blockRow" } key={`${i}`}>{blocksRow}</div>);
    }
    return (
      <div className={ 'game-panel' } >
        {blocks}
      </div>
    );
  }
};

module.exports = GamePanel;
