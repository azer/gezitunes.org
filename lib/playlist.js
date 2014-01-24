var dom     = require('domquery'),
    shuffle = require('shuffle-array'),
    current = require('./current'),
    content = require('../content'),
    render  = require("./render"),
    newSong = require('./song'),
    songs   = [];

module.exports = {
  next: next,
  prev: prev,
  songs: songs,
  setup: setup
};

function next(){
  songs[(current.index() + 1) % songs.length].play();
}

function prev(){
  songs.slice(current.index() - 1)[0].play();
}

function setup(){
  dom('.container').add(render('playlist.html'));

  var artist, album, title, song, ind;
  for(artist in content){
    for ( album in content[artist] ) {
      for ( title in content[artist][album] ) {
        songs.push(song = newSong(content[artist][album][title], title)) - 1;
      }
    }
  }

  songs = shuffle(songs);
  var i = -1, len = songs.length;
  while ( ++i < len ){
    songs[i].index(i);
    songs[i].show();
  }
}
