import MemberActions from '../actions/MemberActions';
import MemberStore from '../stores/MemberStore';
import React from 'react';
import constants from "CONSTANTS"

class Block extends React.Component{

  render() {
    var blockClass;
    switch(this.props.type){
      case constants.EMPTY_SQUARE:
        blockClass = "block-unused block";
        break;
      case constants.SNAKE_SQUARE:
        blockClass = "block-snake block";
        break;
      case constants.SNAKE_HEAD_SQUARE:
        blockClass = "block-snake-head block";
        break;
    }
    return (
      <div className={ blockClass }>
      </div>
    );
  }
};

module.exports = Block;
