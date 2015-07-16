(function init(){
  var socket = io();
  var whoFirst;
  var cassandraPhrases = [];

  var outBox = document.getElementById('output');

  for(var i=0; i<9; i++){
    var btn = document.getElementById(i);
    //btn.innerHTML = '+'
    btn.addEventListener('click', btnClick);
  }

  function newGame(){
    for(var i=0; i<9; i++){
      var btn = document.getElementById(i);
      btn.innerHTML = '+';
    }

    socket.emit('newGame');

    whoFirst = confirm('Do you want to go first?') ? 1 : 2;
    if(whoFirst == 2){
      socket.emit('compMove', function(err, move){
        document.getElementById(move).innerHTML = 'O';
      });
    }
  };

  function btnClick(){
    var index = this.id;
    socket.emit('playerMove', index, function(err, data){

      if(err){
        outBox.innerHTML = 'Cassandra Says: ' + err.msg;
        document.getElementById(index).innerHTML = 'X';
        newGame();
      }


      if(data == index && err == null){
        document.getElementById(index).innerHTML = 'X';
        socket.emit('compMove', function(err, move, phrase){
          document.getElementById(move).innerHTML = 'O';

          console.log(phrase)
          if(err){
            alert(err.msg);
            return newGame();
          }

          outBox.innerHTML = 'Cassandra Says: ' + phrase;
        });
      }
    });
  }
  newGame();
})();