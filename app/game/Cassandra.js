
var Cassandra = function(){
  this.winPhrase = [
    'I win again',
    'I win yet again',
    'Would you like to know how it feels to win?',
    'All this winning is making me tired',
    'Such win, very doge'];
  this.movePhrase = [
    'Your turn',
    'How do you like that',
    'Deal with this',
    'Another perfect move from me',
    'I am amazing'];
  this.badPlay = [
    'Don\'t be silly',
    'You can\'t move there',
    'This isn\'t Nam. There are rules. Mark it Zero',
    'Trying to cheat are we?']
}

Cassandra.prototype = {
  random: function(list){
    var item = list[Math.floor(Math.random() * list.length)];
    return item;
  },
  getWinPhrase: function(){
    var phrase = this.random(this.winPhrase);
    return phrase;
  },
  getMovePhrase: function(){
    var phrase = this.random(this.movePhrase);
    return phrase;
  },
  getBadPlay: function(){
    var phrase = this.random(this.badPlay);
    return phrase;
  }
}

module.exports = new Cassandra();