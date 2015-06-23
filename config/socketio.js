
var MiniMax = App.game('MiniMax')
  , MiniMax = App.game('MiniMax')
  , Board = App.game('Board')
  , cassandra = App.game('Cassandra');

function socketIO(app, io){

  io.on('connection', function(socket){
    socket.board = new Board();
    socket.mm = new MiniMax();


//ANDROID VERSION
    socket.on('gameState', function(data, cb){
      //client request for game state. Called on connection.
      console.log(data);
      //if(!data){
        cb({ key: 'gameState', board: socket.board.gamestate });
      //}
    });

    socket.on('move', function(board, cb){
      console.log(board);
      //check to insure only one space has changed, filthy cheaters
      console.log(board.length)
      if(board.length != 9){ return }
      var count = 0
        , playerMove;
      for(var i=0; i<9; i++){
        if(board[i] != socket.board.gamestate[i]){
          count++;
          playerMove = i;
        }
      }

      console.log(count);
      if(count != 1){ return }

      var moves = socket.board.getMoves();
      if(moves.indexOf(playerMove) < 0){
        //bad play
        return;
      }

      //the move
      socket.board.move(1, playerMove);

      if(socket.board.isFull()){
        //cats game
        return;
      }
      if(socket.board.getWinner()){
        //player wins, not possible
        return;
      }

      //comp turn
      socket.mm.buildTree(socket.board, 2, function(play){
        console.log(play)
        socket.board.move(2, play);
        cb({ key: 'move', gameState: socket.board.gamestate });
      })
    });










//WEB VERSION
    socket.on('playerMove', function(data, cb){
      var moves = socket.board.getMoves();
      var playerMove = parseInt(data);

      if(moves.indexOf(playerMove) < 0){
        var phrase = cassandra.getBadPlay();
        return cb({err: 1, msg: phrase}, null);
      }

      socket.board.move(1, data);

      if(socket.board.isFull()){
        return cb({err: 2, msg: 'cat\'s game'}, data);
      }

      if(socket.board.getWinner()){
        return cb({ err: 4, msg: 'This can\'t be happening, Goodbye.'}, null);
      }

      return cb(null, data);
    });

    socket.on('compMove', function(cb){
      socket.mm.buildTree(socket.board, 2, function(play){
        socket.board.move(2, play);
        if(socket.board.getWinner()){
          var phrase = cassandra.getWinPhrase();
          return cb({ err: 3, msg: phrase}, play);
        }

        if(socket.board.isFull()){
          return cb({err: 2, msg: 'cat\'s game'}, play);
        }
        
        return cb(null, play, cassandra.getMovePhrase());
      })
    })

    socket.on('newGame', function(){
      socket.board = new Board();
    })

  })
}

module.exports = socketIO;