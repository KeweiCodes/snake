import MemberActions from '../actions/MemberActions';
import MemberStore from '../stores/MemberStore';
import React from 'react';
import constants from "CONSTANTS"
import Block from './Block';

var config = {
  width: 30,
  height: 30,
  snake: [{x:2, y:14}, {x:1, y:14}, {x:0, y:14}],
  startDirection: constants.RIGHT,
  score: 0
};

class GamePanel extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = this.setupGameState();
  }

  setupGameState(){
    var gameState = [];
    var width = config.width;
    var height = config.height;
    var snake = JSON.parse(JSON.stringify(config.snake));;
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

    this.generateFruit(gameState);

    var headPos = snake[0];
    console.log(constants.SNAKE_HEAD_SQUARE);
    console.log(headPos.y);
    console.log(headPos.x);
    gameState[headPos.y][headPos.x] = constants.SNAKE_HEAD_SQUARE;

    return {
      direction: constants.RIGHT,
      nextDirection: constants.RIGHT,
      width: width,
      height: height,
      gameState: gameState,
      snake: snake,
      score: config.score
    };
  }

  generateFruit(gameState){
    var i, j;
    var emptyBlocksArray = [];
    for(i=0; i<config.height; i++){
      for(j=0; j<config.width; j++){
        var currentBlock = gameState[i][j];
        if(!(currentBlock === constants.SNAKE_SQUARE) &&
            !(currentBlock === constants.SNAKE_HEAD_SQUARE)){
          emptyBlocksArray.push({x: j, y: i});
        }
      }
    }
    var length = emptyBlocksArray.length;
    var randomPos = emptyBlocksArray[Math.floor(Math.random()*length)];
    gameState[randomPos.y][randomPos.x] = constants.FRUIT_SQUARE;
    console.log(randomPos);
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
    var gameState = this.state.gameState;
    var score = this.state.score;
    var snake = this.state.snake;
    var snakeLength = snake.length;

    var head = snake[0];
    var tail = snake[snakeLength - 1];

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

    if(nextHead.x == this.state.width
      || nextHead.x < 0
      || nextHead.y == this.state.height
      || nextHead.y < 0
      || gameState[nextHead.y][nextHead.x] === constants.SNAKE_SQUARE
      ){
      this.setState(
        {
          gameState: gameState,
          snake: snake,
          gameOver: true
        }
      );
      clearInterval(this.state.intervalId);
      return;
    }

    if(gameState[nextHead.y][nextHead.x] === constants.FRUIT_SQUARE){
      gameState[tail.y][tail.x] = constants.SNAKE_SQUARE;
      this.generateFruit(gameState);
      score++;
    }else{
      snake.splice(snakeLength-1, 1);
      gameState[tail.y][tail.x] = constants.EMPTY_SQUARE;
    }
    snake.splice(0, 0, nextHead);

    gameState[head.y][head.x] = constants.SNAKE_SQUARE;
    gameState[nextHead.y][nextHead.x] = constants.SNAKE_HEAD_SQUARE;
    this.setState(
      {
        gameState: gameState,
        snake: snake,
        direction: nextDirection,
        score: score
      }
    );
  }

  replay(){
    this.setState(this.setupGameState());
    this.setState({gameOver: false});
    var tickFunction = function(){ this.tick(); }.bind(this);
    setTimeout(function(){
      this.setState({ intervalId: setInterval(tickFunction, 50) });
    }.bind(this), 300);
  }

  render() {
    var replay;
    if(this.state.gameOver){
      replay = <button
                type="button"
                className={'btn btn-primary'}
                onClick={this.replay.bind(this)}>
                Oops, try again?
              </button>
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
      <div className={ 'container' }>
        <div className={ 'col-md-12' }>
        <div className={ 'game-panel' } >
          {blocks}
        </div>
        Score: { this.state.score }
        <br/>
        {replay}

      </div>
      </div>
    );
  }
};

module.exports = GamePanel;
