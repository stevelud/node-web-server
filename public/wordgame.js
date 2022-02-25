"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function getWordPath() {
  // retrieve word, and dictionary definition data for word
  var i = 25 * Math.random();
  i = Math.floor(i);
  var n = 6 * Math.random();
  n = Math.floor(n);
  var questionString = "?";

  while (n > 0) {
    questionString += "?";
    n = n - 1;
  }

  var firstLetter = alphabet[i];
  var path = "https://api.datamuse.com/words?sp=" + firstLetter + "????" + questionString;
  return path;
}

function getDefPath(word) {
  var path = 'https://api.datamuse.com/words?sp=' + word + '&md=d';
  return path; // example path:
  // https://api.datamuse.com/words?sp=nourishment&md=d
}

var GameContainer = /*#__PURE__*/function (_React$Component) {
  _inherits(GameContainer, _React$Component);

  var _super = _createSuper(GameContainer);

  function GameContainer(props) {
    var _this;

    _classCallCheck(this, GameContainer);

    _this = _super.call(this, props);
    _this.state = {
      guess: "",
      word: "",
      lettersGuessed: [],
      guessesLeft: 11,
      message: "",
      gameOver: false,
      dictionaryRowClass: "dictionary-row hidden",
      wordDefs: ""
    };
    _this.guessLetter = _this.guessLetter.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this)); // retrieve word, and dictionary definition data for word

    var path = getWordPath();
    console.log(path); // retrive word and word definitions from Datamuse API

    fetch(path).then(function (response) {
      return response.json();
    }).then(function (data) {
      var i = 25 * Math.random(25);
      i = Math.floor(i);
      console.log(data[i].word); // retrieve definition and meaning for word:

      var wordPath = getDefPath(data[i].word);
      console.log(wordPath);
      fetch(wordPath).then(function (response) {
        return response.json();
      }).then(function (data) {
        // this should be an array
        var defs = data[0].defs;

        _this.setState({
          wordDefs: data[0].defs
        });

        console.log(_this.state.wordDefs);
      })["catch"](function (err) {
        _this.setState({
          wordDefs: ["no definitions available"]
        });
      });

      _this.setState({
        word: data[i].word
      });
    });
    /* TESTING COMMUNICATION WITH SERVER */

    fetch('/wg', {
      method: "POST",
      body: JSON.stringify(_this.state)
    });
    return _this;
  }

  _createClass(GameContainer, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({
        guess: event.target.value
      });
      console.log(event.target.value);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      event.target.value = "";
      this.setState({
        guess: event.target.value
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      if (event.keyCode == 13 && this.state.guessesLeft > 0 && !this.state.gameOver) {
        //enter
        this.guessLetter();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }, {
    key: "componentWillUnMount",
    value: function componentWillUnMount() {
      document.removeEventlistener('keydown', this.handleKeyDown);
    }
  }, {
    key: "guessLetter",
    value: function guessLetter() {
      // TO DO: include a sub method that, if the guess is wrong,
      // flashes in red letters some msg like 'no bad guess!'
      var g = this.state.guess;
      var word = this.state.word;
      var guesses = this.state.lettersGuessed;
      var guessesLeft = this.state.guessesLeft;

      function checkForCompletion(word, guesses) {
        for (var i = 0; i < word.length; i++) {
          if (!guesses.includes(word[i])) {
            return false;
          }
        }

        return true;
      }

      if (g === "") {
        return this.setState({
          message: "You didn't make a guess!"
        });
      }

      if (!alphabet.includes(g)) {
        return this.setState({
          message: "That is not actually a letter."
        });
      }

      if (guesses.includes(g)) {
        return this.setState({
          message: "You already guessed " + g + ".",
          guess: ""
        }); // send game state to server to be saved for user

        fetch.post('/sendWordGameState', {
          method: 'POST',
          body: JSON.stringify(this.state)
        });
      }

      if (word.includes(g)) {
        guesses.push(g);

        if (checkForCompletion(word, guesses)) {
          return this.setState({
            message: "Congratulations! You got it!!",
            gameOver: true,
            guess: "",
            dictionaryRowClass: "dictionary-row"
          });
        } else {
          return this.setState({
            lettersGuessed: guesses,
            message: "Good guess! The letter " + g + " is in the word.",
            guess: ""
          });
        }
      } else if (this.state.guessesLeft > 1) {
        guesses.push(g);
        return this.setState({
          lettersGuessed: guesses,
          guessesLeft: guessesLeft - 1,
          message: "Bad guess. The letter " + g + " is not in the word.",
          guess: ""
        });
      } else {
        return this.setState({
          lettersGuessed: guesses,
          guessesLeft: guessesLeft - 1,
          message: "Oh no! No more guesses." + " The word is " + this.state.word + ".",
          gameOver: true,
          dictionaryRowClass: "dictionary-row"
        });
      }

      console.log(this.state.lettersGuessed);
    }
  }, {
    key: "render",
    value: function render() {
      var handleGuess;

      if (!this.state.gameOver) {
        handleGuess = this.guessLetter;
      } else {
        handleGuess = null;
      }

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "GameContainer"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col1"
      }, /*#__PURE__*/React.createElement(PlayerFrame, {
        playerName: "Human",
        buttonHandler: handleGuess,
        inputHandler: this.handleChange,
        handleClick: this.handleClick,
        message: this.state.message,
        guess: this.state.guess
      }), /*#__PURE__*/React.createElement(GuessCounterBar, {
        guessesLeft: this.state.guessesLeft
      }), /*#__PURE__*/React.createElement(WordBar, {
        word: this.state.word,
        lettersGuessed: this.state.lettersGuessed
      })), /*#__PURE__*/React.createElement("div", {
        className: "col2"
      }, /*#__PURE__*/React.createElement(Keyboard, {
        lettersGuessed: this.state.lettersGuessed,
        word: this.state.word
      }))), /*#__PURE__*/React.createElement("div", {
        className: this.state.dictionaryRowClass
      }, /*#__PURE__*/React.createElement(DictionaryRow, {
        word: this.state.word,
        defs: this.state.wordDefs
      })));
    }
  }]);

  return GameContainer;
}(React.Component); // this component should appear visible when the game ends:


var DictionaryRow = function DictionaryRow(props) {
  var defsArray = Array.from(props.defs); //console.log("Defs Array: " + defsArray)

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, props.word), defsArray.map(function (entry, i) {
    return /*#__PURE__*/React.createElement(DefEntry, {
      num: i + 1,
      key: i,
      entry: entry
    });
  }));
};

var DefEntry = function DefEntry(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "DefEntry"
  }, props.num, " ", props.entry);
};

var PlayerFrame = function PlayerFrame(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "PlayerFrame"
  }, /*#__PURE__*/React.createElement(GuessBar, {
    inputHandler: props.inputHandler,
    handleClick: props.handleClick,
    guess: props.guess
  }), /*#__PURE__*/React.createElement(GuessButton, {
    buttonHandler: props.buttonHandler
  }), /*#__PURE__*/React.createElement(MessageBar, {
    message: props.message
  }));
};

var MessageBar = function MessageBar(props) {
  return /*#__PURE__*/React.createElement("span", {
    className: "Message"
  }, props.message);
};

var GuessBar = function GuessBar(props) {
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    size: "5",
    maxLength: "1",
    placeholder: "",
    onChange: props.inputHandler,
    onClick: props.handleClick,
    value: props.guess
  });
};

var GuessCounterBar = function GuessCounterBar(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "GuessCounterBar"
  }, "You have ", props.guessesLeft, " guesses left!");
};

var GuessButton = function GuessButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.buttonHandler
  }, "Guess!");
};

var WordBar = function WordBar(props) {
  var wordArray = [];
  var lettersGuessed = props.lettersGuessed; // this is an array of letters

  for (var i = 0; i < props.word.length; i++) {
    if (lettersGuessed.includes(props.word[i])) {
      wordArray.push([props.word[i], ""]);
    } else {
      wordArray.push([props.word[i], "hidden"]);
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "WordBar"
  }, wordArray.map(function (letter, i) {
    return /*#__PURE__*/React.createElement(LetterUnit, {
      key: i,
      letter: letter[0].toUpperCase(),
      hidden: letter[1]
    });
  }));
};

var LetterUnit = function LetterUnit(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "LetterUnit"
  }, /*#__PURE__*/React.createElement("div", {
    className: props.hidden
  }, props.letter));
};

var KeyboardUnit = function KeyboardUnit(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: props.guessStatus
  }, props.letter);
};

var Keyboard = function Keyboard(props) {
  var alphabetRowOne = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  var alphabetRowTwo = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  var alphabetRowThree = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  var lettersGuessed = props.lettersGuessed; // array of guessed letters

  var word = props.word; // string representation of word to be guessed

  function returnGuessClass(letter, word, lettersGuessed) {
    if (lettersGuessed.includes(letter) && word.includes(letter)) {
      return "LetterUnit goodGuessLetter";
    } else if (lettersGuessed.includes(letter) && !word.includes(letter)) {
      return "LetterUnit badGuessLetter";
    } else {
      return "LetterUnit";
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "Keyboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbrow1"
  }, alphabetRowOne.map(function (letter, i) {
    return /*#__PURE__*/React.createElement(KeyboardUnit, {
      key: i,
      letter: letter,
      guessStatus: returnGuessClass(letter, word, lettersGuessed)
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbrow2"
  }, alphabetRowTwo.map(function (letter, i) {
    return /*#__PURE__*/React.createElement(KeyboardUnit, {
      key: i,
      letter: letter,
      guessStatus: returnGuessClass(letter, word, lettersGuessed)
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbrow3"
  }, alphabetRowThree.map(function (letter, i) {
    return /*#__PURE__*/React.createElement(KeyboardUnit, {
      key: i,
      letter: letter,
      guessStatus: returnGuessClass(letter, word, lettersGuessed)
    });
  })));
};

ReactDOM.render( /*#__PURE__*/React.createElement(GameContainer, null), document.getElementById('target'));
