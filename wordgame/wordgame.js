let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: "",
      word: this.props.word,
      lettersGuessed: [],
      guessesLeft: 4,
      message: "",
      gameOver: false
    };
    this.guessLetter = this.guessLetter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(event) {
    this.setState({ guess: event.target.value });
    console.log(event.target.value);
  }
  handleClick(event) {
    event.target.value = "";
    this.setState({ guess: event.target.value });
  }

  guessLetter() {
    // TO DO: include a sub method that, if the guess is wrong,
    // flashes in red letters some msg like 'no bad guess!'

    let g = this.state.guess;
    let word = this.state.word;
    let guesses = this.state.lettersGuessed;
    let guessesLeft = this.state.guessesLeft;

    function checkForCompletion(word, guesses) {
      for (let i = 0; i < word.length; i++) {
        if (!guesses.includes(word[i])) {
          return false;
        }
      }
      return true;
    }

    if (g === "") {
      return this.setState({ message: "You didn't actually make a guess!" });
    }

    if (!alphabet.includes(g)) {
      return this.setState({ message: "That is not actually a letter." });
    }

    if (guesses.includes(g)) {
      return this.setState({ message: "You already guessed " + g + "." });
    }

    if (word.includes(g)) {
      guesses.push(g);
      if (checkForCompletion(word, guesses)) {
        return this.setState({
          message: "Congratulations! You got it!!",
          gameOver: true
        });
      } else {
        return this.setState({
          lettersGuessed: guesses,
          message: "Good guess! The letter " + g + " is in the word."
        });
      }
    } else if (this.state.guessesLeft > 1) {
      guesses.push(g);
      return this.setState({
        lettersGuessed: guesses,
        guessesLeft: guessesLeft - 1,
        message: "Bad guess. The letter " + g + " is not in the word."
      });
    } else {
      return this.setState({
        lettersGuessed: guesses,
        guessesLeft: guessesLeft - 1,
        message: "Oh no! You're all out of guesses. The word is " + this.state.word + ".",
        gameOver: true
      });
    }
    console.log(this.state.lettersGuessed);
  }

  render() {
    let handleGuess;
    if (!this.state.gameOver) {
      handleGuess = this.guessLetter;
    } else {
      handleGuess = null;
    }

    return React.createElement(
      'div',
      { className: 'GameContainer' },
      React.createElement(
        'div',
        { className: 'col1' },
        React.createElement(PlayerFrame, { playerName: 'Human',
          buttonHandler: handleGuess,
          inputHandler: this.handleChange,
          handleClick: this.handleClick,
          message: this.state.message }),
        React.createElement(GuessCounterBar, { guessesLeft: this.state.guessesLeft }),
        React.createElement(WordBar, { word: this.props.word,
          lettersGuessed: this.state.lettersGuessed })
      ),
      React.createElement(
        'div',
        { className: 'col2' },
        React.createElement(Keyboard, { lettersGuessed: this.state.lettersGuessed,
          word: this.state.word })
      )
    );
  }
}

const PlayerFrame = props => {
  return React.createElement(
    'div',
    { className: 'PlayerFrame' },
    React.createElement(GuessBar, { inputHandler: props.inputHandler, handleClick: props.handleClick }),
    React.createElement(GuessButton, { buttonHandler: props.buttonHandler }),
    React.createElement(MessageBar, { message: props.message })
  );
};

const MessageBar = props => {
  return React.createElement(
    'span',
    { className: 'Message' },
    props.message
  );
};

const GuessBar = props => {
  return React.createElement('input', { type: 'text', size: '5', maxLength: '1',
    placeholder: '', onChange: props.inputHandler,
    onClick: props.handleClick });
};

const GuessCounterBar = props => {
  return React.createElement(
    'div',
    { className: 'GuessCounterBar' },
    'You have ',
    props.guessesLeft,
    ' guesses left!'
  );
};

const GuessButton = props => {
  return React.createElement(
    'button',
    { onClick: props.buttonHandler },
    'Guess!'
  );
};

const WordBar = props => {

  let wordArray = [];
  let lettersGuessed = props.lettersGuessed; // this is an array of letters

  for (let i = 0; i < props.word.length; i++) {
    if (lettersGuessed.includes(props.word[i])) {
      wordArray.push([props.word[i], ""]);
    } else {
      wordArray.push([props.word[i], "hidden"]);
    }
  }

  return React.createElement(
    'div',
    { className: 'WordBar' },
    wordArray.map((letter, i) => React.createElement(LetterUnit, { key: i, letter: letter[0],
      hidden: letter[1] }))
  );
};

const LetterUnit = props => {
  return React.createElement(
    'div',
    { className: 'LetterUnit' },
    React.createElement(
      'div',
      { className: props.hidden },
      props.letter
    )
  );
};

const KeyboardUnit = props => {
  return React.createElement(
    'div',
    { className: props.guessStatus },
    props.letter
  );
};

const Keyboard = props => {
  let alphabetRowOne = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  let alphabetRowTwo = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  let alphabetRowThree = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  let lettersGuessed = props.lettersGuessed; // array of guessed letters
  let word = props.word; // string representation of word to be guessed

  function returnGuessClass(letter, word, lettersGuessed) {
    if (lettersGuessed.includes(letter) && word.includes(letter)) {
      return "LetterUnit goodGuessLetter";
    } else if (lettersGuessed.includes(letter) && !word.includes(letter)) {
      return "LetterUnit badGuessLetter";
    } else {
      return "LetterUnit";
    }
  }

  return React.createElement(
    'div',
    { className: 'Keyboard' },
    React.createElement(
      'div',
      { className: 'kbrow1' },
      alphabetRowOne.map((letter, i) => React.createElement(KeyboardUnit, { key: i, letter: letter,
        guessStatus: returnGuessClass(letter, word, lettersGuessed) }))
    ),
    React.createElement(
      'div',
      { className: 'kbrow2' },
      alphabetRowTwo.map((letter, i) => React.createElement(KeyboardUnit, { key: i, letter: letter,
        guessStatus: returnGuessClass(letter, word, lettersGuessed) }))
    ),
    React.createElement(
      'div',
      { className: 'kbrow3' },
      alphabetRowThree.map((letter, i) => React.createElement(KeyboardUnit, { key: i, letter: letter,
        guessStatus: returnGuessClass(letter, word, lettersGuessed) }))
    )
  );
};

ReactDOM.render(React.createElement(GameContainer, { name: '', word: 'unbelievable' }), document.getElementById('target'));
