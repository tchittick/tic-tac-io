
var MiniMax = App.game('MiniMax')
  , mm = new MiniMax()
  , Board = App.game('Board');

function socketIO(app, io){

  io.on('connection', function(socket){
    socket.board = new Board();

    socket.on('playerMove', function(data, cb){
      var moves = socket.board.getMoves();
      var playerMove = parseInt(data);

      if(moves.indexOf(playerMove) < 0){
        return cb({err: 1, msg: 'don\'t be silly'}, null);
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
      mm.buildTree(socket.board, 2, function(play){
        socket.board.move(2, play);
        if(socket.board.getWinner()){
          return cb({ err: 3, msg: 'I win, as usual'}, play);
        }

        if(socket.board.isFull()){
          return cb({err: 2, msg: 'cat\'s game'}, play);
        }
        
        return cb(null, play);
      })
    })

    socket.on('newGame', function(){
      socket.board = new Board();
    })

  })
}

module.exports = socketIO;