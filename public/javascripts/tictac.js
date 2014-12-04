(function init(){
  var socket = io();
  var whoFirst;

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
        alert(err.msg);
        return newGame();
      }

      if(data == index){
        document.getElementById(index).innerHTML = 'X';
        socket.emit('compMove', function(err, move){
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