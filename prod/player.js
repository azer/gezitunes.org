(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  "all": {
    "gezi": {
      "recebum": "http://mp3.anarko.org/recebum.mp3",
      "gavur imam isyanı": "http://tayfabandista.org/dikkat_askersiz_bolge/player/gavur_imam_isyani.mp3",
      "birinci rollama": "http://tayfabandista.org/su_anda_simdi/birinci_rollama.mp3",
      "ellerinde pankartlar": "http://mp3.anarko.org/ellerindepankartlar.mp3",
      "sık bakalım": "http://mp3.anarko.org/sikbakalim.mp3",
      "eyvallah": "http://mp3.anarko.org/eyvallah.mp3",
      "haydi barikata": "http://tayfabandista.org/player/haydi_barikata.mp3",
      "mother's journey": "http://mp3.anarko.org/journey.mp3",
      "tencere tava": "http://mp3.anarko.org/tenceretava.mp3",
      "yaşamak umrumdadır": "http://mp3.anarko.org/yasamak-umrumdadir.mp3",
      "çav bella": "http://mp3.anarko.org/cavbella.mp3",
      "gündoğdu": "http://mp3.anarko.org/gundogdu.mp3",
      "şarkışla": "http://mp3.anarko.org/sarkisla.mp3",
      "kela meme": "http://mp3.anarko.org/kela-meme.mp3",
      "heq heq": "http://mp3.anarko.org/heqheq.mp3",
      "heq heq": "http://mp3.anarko.org/heqheq.mp3",
      "hellim can": "http://mp3.anarko.org/hellimcan.mp3",
      "yolumuz aynı": "http://mp3.anarko.org/yolumuzayni.mp3"
    }
  }
};

},{}],2:[function(require,module,exports){
var view   = require('./lib/view'),
    player = require('./lib/player');

player.setup();
view.setup();

},{"./lib/player":6,"./lib/view":11}],3:[function(require,module,exports){
var attr = require("attr");

module.exports = {
  index   : attr(0),
  pause   : attr(),
  playing : attr()
};

},{"attr":12}],4:[function(require,module,exports){
var dom      = require('domquery'),
    current  = require('./current'),
    render   = require("./render"),
    playlist = require('./playlist'),
    pause    = require('./pause');

module.exports = {
  setup: setup
};

function onPauseChange(paused){
  if(paused) {
    dom('.container').removeClass('playing');
    return;
  }

  dom('.container').addClass('playing');
}

function setup(){
  current.pause.subscribe(onPauseChange);

  dom(render('header.html'))
    .insert('.container');

  dom('svg').on('click', pause);
}

},{"./current":3,"./pause":5,"./playlist":7,"./render":8,"domquery":16}],5:[function(require,module,exports){
var current  = require("./current"),
    playlist = require('./playlist');

module.exports = pause;

function pause(){
  if(!current.playing()){
    playlist.songs[current.index()].play();
    return;
  }

  if (current.pause()){
    current.pause(false);
    return;
  }

  current.pause(true);
}

},{"./current":3,"./playlist":7}],6:[function(require,module,exports){
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

},{"./current":3,"./playlist":7,"domquery":16,"play-audio":37}],7:[function(require,module,exports){
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

},{"../content":1,"./current":3,"./render":8,"./song":9,"domquery":16,"shuffle-array":45}],8:[function(require,module,exports){
var format    = require('new-format'),
    templates = require('./templates');

module.exports = render;

function render(template, vars){
  return format(templates[template], vars);
}

},{"./templates":10,"new-format":36}],9:[function(require,module,exports){
var attrs   = require('attrs'),
    dom     = require("domquery"),
    current = require('./current'),
    render  = require('./render');

module.exports = newSong;

function newSong(url, title){
  var song = attrs({
    index: 0,
    title: title,
    url: url
  });

  song.play = function(){
    console.log(song);
    current.playing(song);
    current.index(song.index());
  };

  song.show = function(){
    var el = dom(render('song.html', song));
    song.view = el;
    el.select('span').on('click', song.play);
    el.insert('.playlist');
  };

  return song;
}

},{"./current":3,"./render":8,"attrs":15,"domquery":16}],10:[function(require,module,exports){
exports["header.html"] = "<div class=\"header\"> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" enable-background=\"new 0 0 512 512\" xml:space=\"preserve\"> <path class=\"play\" d=\"M256,52.481c-113.771,0-206,91.117-206,203.518c0,112.398,92.229,203.52,206,203.52 c113.772,0,206-91.121,206-203.52C462,143.599,369.772,52.481,256,52.481z M197.604,368.124V148.872l178.799,109.627 L197.604,368.124z\"> </path> <path class=\"pause\" d=\"M256,52.481c-113.771,0-206,91.117-206,203.518c0,112.398,92.229,203.52,206,203.52 c113.772,0,206-91.121,206-203.52C462,143.599,369.772,52.481,256,52.481z M238.397,356h-58.253V156h58.253V356z M333.854,356 h-58.252V156h58.252V356z\"> </path> </svg> </div>"
exports["playlist.html"] = "<ul class=\"playlist\"> </ul>"
exports["song.html"] = "<li class=\"song\"><span>{title}</span></li>"
},{}],11:[function(require,module,exports){
var dom      = require("domquery"),
    current  = require('./current'),
    header   = require('./header'),
    playlist = require('./playlist'),
    pause    = require('./pause');

module.exports = {
  setup: setup
};

function setup(){
  header.setup();
  playlist.setup();

  dom(window)
    .on(':left', playlist.prev)
    .on(':right', playlist.next)
    .on(':space', pause)
    .on(':enter', pause);
}

},{"./current":3,"./header":4,"./pause":5,"./playlist":7,"domquery":16}],12:[function(require,module,exports){
var pubsub = require("new-pubsub"),
    prop   = require("new-prop");

module.exports        = attr;
module.exports.attrs  = attrs;
module.exports.all    = attrs;
module.exports.object = attrs;

function attr(){
  var obj = pubsub(prop.apply(null, arguments).extend(function(raw){

    return function(newValue){
      var oldValue = raw(),
          ret      = raw.apply(undefined, arguments);

      if(arguments.length && oldValue != ret ){
        obj.publish(ret, oldValue);
      }

      return ret;
    };

  }));

  return obj;
}

function attrs(raw, exceptions){
  var obj = {}, key, val;

  for(key in raw){
    val = raw[key];
    obj[key] = ( ! Array.isArray(exceptions) || exceptions.indexOf(key) == -1 )
      && ( typeof val != 'object' || !val || val.constructor != Object )
      && ( typeof val != 'function' )
      ? attr(val)
      : val;
  }

  return obj;
}

},{"new-prop":13,"new-pubsub":14}],13:[function(require,module,exports){
module.exports = prop;

/**
 * Create and return a new property.
 *
 * @param {Anything} rawValue (optional)
 * @param {Function} getter (optional)
 * @param {Function} setter (optional)
 * @return {AdaProperty}
 */
function prop(rawValue, getter, setter){

  var raw = (function(value){

    return function raw(update){
      if( arguments.length ){
        value = update;
      }

      return value;
    };

  }());

  function proxy(update, options){
    if(arguments.length > 0){
      raw( setter ? setter(update, raw()) : update );
    }

    return getter ? getter(raw()) : raw();
  };

  proxy.extend = function(ext){
    raw = ext(raw);
    return proxy;
  }

  proxy.getter = function(newGetter){
    getter = newGetter;
    return proxy;
  };

  proxy.setter = function(newSetter){
    setter = newSetter;
    return proxy;
  };

  proxy.isAdaProperty = true;
  proxy.raw           = raw;

  raw(setter ? setter(rawValue) : rawValue);

  return proxy;
}

},{}],14:[function(require,module,exports){
module.exports = PubSub;

function PubSub(mix){

  var proxy = mix || function pubsubProxy(){
    arguments.length && sub.apply(undefined, arguments);
  };

  function sub(callback){
    subscribe(proxy, callback);
  }

  function subOnce(callback){
    once(proxy, callback);
  }

  function unsubOnce(callback){
    unsubscribeOnce(proxy, callback);
  }

  function unsub(callback){
    unsubscribe(proxy, callback);
  }

  function pub(){
    var args = [proxy];
    Array.prototype.push.apply(args, arguments);
    publish.apply(undefined, args);
  }

  proxy.subscribers        = [];
  proxy.subscribersForOnce = [];

  proxy.subscribe          = sub;
  proxy.subscribe.once     = subOnce;
  proxy.unsubscribe        = unsub;
  proxy.unsubscribe.once   = unsubOnce;
  proxy.publish            = pub;

  return proxy;
}

/**
 * Publish "from" by applying given args
 *
 * @param {Function} from
 * @param {...Any} args
 */
function publish(from){

  var args = Array.prototype.slice.call(arguments, 1);

  if (from && from.subscribers && from.subscribers.length > 0) {
    from.subscribers.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });
  }

  if (from && from.subscribersForOnce && from.subscribersForOnce.length > 0) {
    from.subscribersForOnce.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });

    from.subscribersForOnce = [];

  }

}

/**
 * Subscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function subscribe(to, callback){
  if(!callback) return false;
  return to.subscribers.push(callback);
}


/**
 * Subscribe callback to given pubsub object for only one publish.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function once(to, callback){
  if(!callback) return false;

  return to.subscribersForOnce.push(callback);
}

/**
 * Unsubscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function unsubscribe(to, callback){
  var i = to.subscribers.length;

  while(i--){
    if(to.subscribers[i] && to.subscribers[i] == callback){
      to.subscribers[i] = undefined;

      return i;
    }
  }

  return false;
}


/**
 * Unsubscribe callback subscribed for once to specified pubsub.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 * @return {Boolean or Number}
 */
function unsubscribeOnce(to, callback){
  var i = to.subscribersForOnce.length;

  while(i--){
    if(to.subscribersForOnce[i] && to.subscribersForOnce[i] == callback){
      to.subscribersForOnce[i] = undefined;

      return i;
    }
  }

  return false;
}

},{}],15:[function(require,module,exports){
module.exports = require('attr').attrs;

},{"attr":12}],16:[function(require,module,exports){
var select = require("./lib/select"),
    create = require('./lib/create');

module.exports = select;
module.exports.create = create;

},{"./lib/create":20,"./lib/select":27}],17:[function(require,module,exports){
module.exports = attr;

function attr(chain){

  return function attr(element, name, value){
    if ( arguments.length == 2 ) {
      return element.getAttribute(name);
    }

    element.setAttribute(name, value);

    return chain;
  };

}

},{}],18:[function(require,module,exports){
var unselect = require("./unselect");

module.exports = {
  add          : add,
  addBefore    : addBefore,
  insert       : insert,
  replace      : replace,
  remove       : remove
};

function add(element, child, vars){
  element.appendChild(unselect(child, vars));
}

function addBefore(element, child, varsOrRef, ref){
  element.insertBefore(unselect(child, varsOrRef), pick(element, arguments[ arguments.length - 1 ]));
}

function insert(element, parent){
  add(pick(document, parent), element);
}

function pick(parent, child){
  if ( typeof child == 'string') {
     return parent.querySelector(child);
  }

  return unselect(child);
}

function replace(element, target, replacement){
  element.replaceChild(unselect(replacement), pick(element, target));
}

function remove(element, child){
  if (arguments.length == 1) {
    return element.parentNode.removeChild(element);
  }
  element.removeChild(pick(element, child));
}

},{"./unselect":30}],19:[function(require,module,exports){
module.exports = {
  addClass    : addClass,
  hasClass    : hasClass,
  removeClass : removeClass,
  toggleClass : toggleClass
};

function addClass(element, name){
  element.classList.add(name);
}

function hasClass(element, name){
  return element.classList.contains(name);
}

function removeClass(element, name){
  element.classList.remove(name);
}

function toggleClass(element, name){
  element.classList.toggle(name);
}

},{}],20:[function(require,module,exports){
var select = require("./select");

module.exports = create;

function create(tag){
  return select(document.createElement(tag));
}

},{"./select":27}],21:[function(require,module,exports){
var style = require("./style");

module.exports = {
  hide: hide,
  show: show
};

function hide(element){
  style(element, 'display', 'none');
}

function show(element){
  style(element, 'display', '');
}

},{"./style":28}],22:[function(require,module,exports){
var keyboard = require("./keyboard");

module.exports = {
  change    : event('change'),
  click     : event('click'),
  keydown   : event('keydown'),
  keyup     : event('keyup'),
  keypress  : event('keypress'),
  mousedown : event('mousedown'),
  mouseover : event('mouseover'),
  mouseup   : event('mouseup'),
  resize    : event('resize'),
  on        : on,
  off       : off
};

function event(type){
  return function(element, callback){
    return on(element, type, callback);
  };
}

function off(element, event, callback){
  element.removeEventListener(event, callback, false);
}

function on(element, event, callback){
  if(event.charAt(0) == ':') {
    return keyboard.on(element, event, callback);
  }

  element.addEventListener(event, callback, false);
}

},{"./keyboard":25}],23:[function(require,module,exports){
var format = require('new-format');

module.exports = html;

function html(chain){
  return function(element, newValue, vars){
    if ( arguments.length > 1 ) {
      element.innerHTML = arguments.length > 2 ? format(newValue, vars) : newValue;
      return chain;
    }

    return element.innerHTML;
  };
}

},{"new-format":36}],24:[function(require,module,exports){
module.exports = isHTML;

function isHTML(text){
  return typeof text == 'string' && text.charAt(0) == '<';
}

},{}],25:[function(require,module,exports){
var keynames = require('keynames');

module.exports = {
  on: on
};

function options(key){
  var expected = {}, keys = key.replace(/^\:/g, '').split(':');

  var i = keys.length, name;
  while ( i -- ){
    name = keys[i].trim();

    if(name == 'ctrl') {
      expected.ctrl = true;
      continue;
    }

    if(name == 'alt') {
      expected.alt = true;
      continue;
    }

    if(name == 'shift') {
      expected.shift = true;
      continue;
    }

    expected.key = name.trim();
  }

  return expected;
}

function on(element, keys, callback){
  var expected = options(keys);

  element.addEventListener('keyup', function(event){
    if((event.ctrlKey || undefined) == expected.ctrl &&
       (event.altKey || undefined) == expected.alt &&
       (event.shiftKey || undefined) == expected.shift &&
       keynames[event.keyCode] == expected.key){
      callback(event);
    }
  }, false);
}

},{"keynames":33}],26:[function(require,module,exports){
module.exports = require("domify");

},{"domify":32}],27:[function(require,module,exports){
var newChain  = require("new-chain"),
    format    = require('new-format'),
    attr      = require('./attr'),
    children  = require('./children'),
    classList = require('./classlist'),
    effects   = require('./effects'),
    events    = require('./events'),
    html      = require('./html'),
    isHTML    = require('./is-html'),
    style     = require('./style'),
    text      = require('./text'),
    parse     = require('./parse'),
    val       = require('./val');

module.exports = select;

function each(fn, elements){
  return function(){
    var i, len, ret, params, ret;

    len    = elements.length;
    i      = -1;
    params = [undefined].concat(Array.prototype.slice.call(arguments));

    while ( ++i < len ) {
      params[0] = elements[i];
      ret = fn.apply(undefined, params);
    }

    return ret;
  };
}

function select(query, parent){
  var key, chain, methods, elements;

  if ( isHTML(query) ) {
    elements = [parse(arguments.length > 1 ? format.apply(undefined, arguments) : query)];
  } else if ( typeof query == 'string' ) {
    elements = Array.prototype.slice.call((parent || document).querySelectorAll(query));
  } else if ( query == document ) {
    elements = [document.documentElement];
  } else {
    elements = Array.prototype.slice.call(arguments);
  }

  methods = {
    addClass    : each(classList.addClass, elements),
    removeClass : each(classList.removeClass, elements),
    toggleClass : each(classList.toggleClass, elements),
    show        : each(effects.show, elements),
    hide        : each(effects.hide, elements),
    style       : each(style, elements)
  };

  for ( key in events ) {
    methods[ key ] = each(events[key], elements);
  }

  for ( key in children ) {
    methods[ key ] = each(children[key], elements);
  }

  chain = newChain.from(elements)(methods);

  chain.attr     = each(attr(chain), elements);
  chain.hasClass = each(classList.hasClass, elements),
  chain.html     = each(html(chain), elements);
  chain.text     = each(text(chain), elements);
  chain.val      = each(val(chain), elements);

  chain.select   = function(query){
    return select(query, elements[0]);
  };

  return chain;
}

},{"./attr":17,"./children":18,"./classlist":19,"./effects":21,"./events":22,"./html":23,"./is-html":24,"./parse":26,"./style":28,"./text":29,"./val":31,"new-chain":34,"new-format":36}],28:[function(require,module,exports){
var toCamelCase = require("to-camel-case");

module.exports = style;

function all(element, css){
  var name;
  for ( name in css ) {
    one(element, name, css[name]);
  }
}

function one(element, name, value){
  element.style[toCamelCase(name)] = value;
}

function style(element){
  if ( arguments.length == 3 ) {
    return one(element, arguments[1], arguments[2]);
  }

  return all(element, arguments[1]);
}

},{"to-camel-case":35}],29:[function(require,module,exports){
var format = require('new-format');

module.exports = text;

function text(chain){
  return function(element, newValue, vars){
    if ( arguments.length > 1 ) {
      element.textContent = arguments.length > 2 ? format(newValue, vars) : newValue;
      return chain;
    }

    return element.textContent;
  };
}

},{"new-format":36}],30:[function(require,module,exports){
var format = require('new-format'),
    isHTML = require("./is-html"),
    parse = require('./parse');

module.exports = unselect;

function unselect(el, vars){
  if ( Array.isArray(el) ) return el[0];
  if ( isHTML(el) ) return parse(typeof vars == 'object' ? format(el, vars) : el);
  return el;
}

},{"./is-html":24,"./parse":26,"new-format":36}],31:[function(require,module,exports){
module.exports = val;

function val(chain){
  return function(element, newValue){
    if ( arguments.length > 1 ) {
      element.value = newValue;
      return chain;
    }

    return element.value;
  };
}

},{}],32:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}

},{}],33:[function(require,module,exports){
module.exports = {
  8   : 'backspace',
  9   : 'tab',
  13  : 'enter',
  16  : 'shift',
  17  : 'ctrl',
  18  : 'alt',
  20  : 'capslock',
  27  : 'esc',
  32  : 'space',
  33  : 'pageup',
  34  : 'pagedown',
  35  : 'end',
  36  : 'home',
  37  : 'left',
  38  : 'up',
  39  : 'right',
  40  : 'down',
  45  : 'ins',
  46  : 'del',
  91  : 'meta',
  93  : 'meta',
  224 : 'meta'
};

},{}],34:[function(require,module,exports){
module.exports = newChain;
module.exports.from = from;

function from(chain){

  return function(){
    var m, i;

    m = methods.apply(undefined, arguments);
    i   = m.length;

    while ( i -- ) {
      chain[ m[i].name ] = m[i].fn;
    }

    m.forEach(function(method){
      chain[ method.name ] = function(){
        method.fn.apply(this, arguments);
        return chain;
      };
    });

    return chain;
  };

}

function methods(){
  var all, el, i, len, result, key;

  all    = Array.prototype.slice.call(arguments);
  result = [];
  i      = all.length;

  while ( i -- ) {
    el = all[i];

    if ( typeof el == 'function' ) {
      result.push({ name: el.name, fn: el });
      continue;
    }

    if ( typeof el != 'object' ) continue;

    for ( key in el ) {
      result.push({ name: key, fn: el[key] });
    }
  }

  return result;
}

function newChain(){
  return from({}).apply(undefined, arguments);
}

},{}],35:[function(require,module,exports){
/**
 * Convert a string to camel case
 *
 * @param {String} str
 * @param {Boolean} first upper-case first too ? (PascalCase)
 */
module.exports = function (str, first) {
  str = str.replace(/[_-]([a-z])/g, function (l) {
  	return l[1].toUpperCase()
  })

  if (first)
    str = str.charAt(0).toUpperCase() + str.slice(1)

  return str
}
},{}],36:[function(require,module,exports){
module.exports = format;

function findContext(args){
  if(typeof args[1] == 'object' && args[1])
    return args[1];

  return Array.prototype.slice.call(args, 1);
}

function format(text) {
  var context = findContext(arguments);

  return String(text).replace(/\{?\{([^{}]+)}}?/g, replace(context));
};

function replace(context, nil){

  return function(tag, name) {

    if(tag.substring(0, 2) == '{{' && tag.substring(tag.length - 2) == '}}'){
      return '{' + name + '}';
    }

    if( !context.hasOwnProperty(name) ){
      return tag;
    }

    if( typeof context[name] == 'function' ){
      return context[name]();
    }

    return context[name];

  }

}

},{}],37:[function(require,module,exports){
module.exports = require('./lib/player');

},{"./lib/player":39}],38:[function(require,module,exports){
var table = {
  aif  : "audio/x-aiff",
  aiff : "audio/x-aiff",
  wav  : "audio/x-wav",
  mp3  : 'audio/mpeg',
  m3u  : "audio/x-mpegurl",
  mid  : "audio/midi",
  midi : "audio/midi",
  m4a  : 'audio/m4a',
  ogg  : 'audio/ogg'
};

module.exports = mimeOf;

function mimeOf(url){
  return table[ url.split('.').slice(-1)[0] ];
}

},{}],39:[function(require,module,exports){
var newChain  = require('new-chain'),
    src = require('./src'),
    render = require('./render');

module.exports = play;

function play(urls, dom){
  var el, chain, url;

  dom || ( dom = document.documentElement );
  el = render();
  dom.appendChild(el);

  chain = newChain({
    autoplay: bool('autoplay'),
    controls: bool('controls'),
    load: method('load'),
    loop: bool('loop'),
    muted: bool('muted'),
    on: on,
    pause: method('pause'),
    play: method('play'),
    preload: bool('preload')
  });

  chain.currentTime = attr('currentTime');
  chain.element = element;
  chain.src = src.attr(el);
  chain.volume = attr('volume');
  chain.remove = remove;

  chain.src(urls);

  return chain;

  function attr(name){
    return function(value){
      if ( arguments.length ) {
        el[name] = value;
        return chain;
      }

      return el[name];
    };
  }

  function bool(name){
    return function(value){
      if (value === false) {
        return el[name] = false;
      }

      return el[name] = true;
    };
  }

  function element(){
    return el;
  }

  function on(event, callback){
    el.addEventListener(event, callback, false);
  }

  function method(name){
    return function(){
      return el[name].apply(el, arguments);
    };
  }

  function remove(){
    return el.parentNode.removeChild(el);
  }

}

},{"./render":40,"./src":41,"new-chain":44}],40:[function(require,module,exports){
var domify = require('domify'),
    templates = require("./templates");

module.exports = render;

function render(src){
  return domify(templates['audio.html']);
}

},{"./templates":42,"domify":43}],41:[function(require,module,exports){
var mimeOf = require("./mime");

module.exports = {
  attr: attr,
  pick: pick
};

function attr(el){
  var value;

  return function(urls){
    if (arguments.length) {
      value = urls;
      el.setAttribute('src', pick(el, value));
    }

    return value;
  };
}

function pick(el, urls){
  if(!urls) return;

  if(typeof urls == 'string'){
    return urls;
  }

  return urls.filter(function(url){
    return !!el.canPlayType(mimeOf(url));
  })[0];
}

},{"./mime":38}],42:[function(require,module,exports){
exports["audio.html"] = "<audio preload=\"auto\" /></audio>"
},{}],43:[function(require,module,exports){
module.exports=require(32)
},{}],44:[function(require,module,exports){
module.exports=require(34)
},{}],45:[function(require,module,exports){
/**
 * Randomize the order of the elements in a given array.
 * @param {array} arr - The given array.
 * @param {boolean} [copy] - Sets if should return a shuffled copy of the given array. By default it's a falsy value.
 * @returns {array}
 */
module = module.exports = function (arr, copy) {

    if (!Array.isArray(arr)) {
        throw new Error('shuffle-array expect an array as parameter.');
    }

    var collection = arr,
        len = arr.length,
        random,
        temp;

    if (copy === true) {
        collection = arr.slice();
    }

    while (len) {
        random = Math.floor(Math.random() * len);
        len -= 1;
        temp = collection[len];
        collection[len] = collection[random];
        collection[random] = temp;
    }

    return collection;
};

/**
 * Pick one or more random elements from the given array.
 * @param {array} arr - The given array.
 * @param {number} picks [optional] - Specifies how many random elements you want to pick. By default it picks 1.
 * @returns {Object}
 */
module.pick = function (arr, picks) {

    if (!Array.isArray(arr)) {
        throw new Error('shuffle-array.pick() expect an array as parameter.');
    }

    if (typeof picks === 'number' && picks !== 1) {
        var len = arr.length,
            collection = arr.slice(),
            random = [],
            index;

        while (picks) {
            index = Math.floor(Math.random() * len);
            random.push(collection[index]);
            collection.splice(index, 1);
            len -= 1;
            picks -= 1;
        }

        return random;
    }

    return arr[Math.floor(Math.random() * arr.length)];
};
},{}]},{},[2])