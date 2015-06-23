(function init(){
  var socket = io();
  var whoFirst;
  var cassandraPhrases = [];

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
        cassandraPhrases.shift(err.msg);
        for(var n=0; n<4; n++){
          document.getElementById('outputBox' + n).innerHTML = cassandraPhrases[n];
        }
        if(cassandraPhrases.length > 3){
          cassandraPhrases.pop();
        }
      }


      if(data == index && err == null){
        document.getElementById(index).innerHTML = 'X';
        socket.emit('compMove', function(err, move, phrase){
          document.getElementById(move).innerHTML = 'O';
          if(err){
            alert(err.msg);
            return newGame();
          }
        });
      }
    });
  }
  newGame();
})();