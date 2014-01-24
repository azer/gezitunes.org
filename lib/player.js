var dom      = require('domquery'),
    audio    = require('play-audio'),
    current  = require('./current'),
    playlist = require('./playlist'),
    playing;

module.exports = {
  setup: setup
};

function onSongChange(start, stop){
  stop && stop.view.removeClass('selected');

  if(start){
    current.pause(false);
    start.view.addClass('selected');
    console.log('#', start.url());
    playing.src(start.url());
  }
}

function onPause(pause){
  if(pause){
    playing.pause();
    return;
  }

  playing.play();
}

function setup(){
  current.playing.subscribe(onSongChange);
  current.pause.subscribe(onPause);

  window.playing = playing;
  playing = audio().autoplay().on('ended', playlist.next);
}
