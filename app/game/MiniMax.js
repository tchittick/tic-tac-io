var MiniMax = function(){
  //init values and options
  this.bestMove = 0;
  this.MAX_DEPTH = 6;
}

MiniMax.prototype = {
  //function called from game, bestmove will return the computer move
  buildTree: function(board, player, cb){
    this.bestMove = 0;
    var alpha = this.buildTree_r(board, player, 0);
    cb(this.bestMove);
  },
  //recursive function to build minimax tree and rate the value of the board
  buildTree_r: function(board, currPlayer, depth){
    if(depth > this.MAX_DEPTH){
      return 0;
    }
    //Set the otherplayer for the next game state and to check for loss
    var otherPlayer;
    if(currPlayer == board.X){
      otherPlayer = board.O;
    } else {
      otherPlayer = board.X;
    }
    //check for a winner in the boardstate, if currPlayer we win, else we lose in this tree
    var winner = board.getWinner();
    if(winner == currPlayer){
      return 1;
    } else if(winner == otherPlayer){
      return -1;
    }
    //check for a full board and therefore cats game in this true
    if(board.isFull()){
      return 0;
    }
    //this is where we begin to rank moves, get an array of moves, set alpha low, instantiate parallel
    //subAlpha list  to movelist to remember move ranks
    var moveList = board.getMoves();
    var alpha = -1;
    var saList = [];
    for(var i=0; i<moveList.length; i++){

      var boardCopy = board.copy(); //Copy current gamestate
      boardCopy.move(currPlayer, moveList[i]); //Make a move for in the gamestate for each possible move
      //console.log(boardCopy.gamestate);

      var subalpha = -this.buildTree_r(boardCopy, otherPlayer, depth + 1); //pass new gamestate into recursion
      if(alpha < subalpha){ //if move is better than alpha, increase alpha
        alpha = subalpha;
      }
      if(depth == 0){ //only if we are looking at REAL gamestate do we push an alpha to the list
        saList.push(subalpha);
      }
    }
    if(depth == 0){
      var posMoves = [];
      for(var n=0; n<saList.length; n++){
        if(saList[n] == alpha){
          posMoves.push(moveList[n]);
        }
      }
      this.bestMove = this.rand(posMoves); //in future pick random..
    }
    return alpha;
  },
  rand: function(list){
    var item = list[Math.floor(Math.random() * list.length)];
    return item;
  }
}

module.exports = MiniMax;