let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
'v', 'w', 'x', 'y', 'z'];

function getWordPath() {
    // retrieve word, and dictionary definition data for word
    let i = 25*Math.random();
    i = Math.floor(i);
    let n = 6*Math.random();
    n = Math.floor(n)
    let questionString = "?";

    while (n > 0) {
      questionString += "?";
      n = n - 1;
    }

    let firstLetter = alphabet[i];

    let path = "https://api.datamuse.com/words?sp=" + firstLetter +
      "????" +  questionString;

    return path;
}

function getDefPath(word) {
    let path = 'https://api.datamuse.com/words?sp=' + word + '&md=d';

    return path;
    // example path:
    // https://api.datamuse.com/words?sp=nourishment&md=d
}


class GameContainer extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
          guess: "",
          word: "",
          lettersGuessed: [],
          guessesLeft: 11,
          message: "",
          gameOver:false,
          dictionaryRowClass:"dictionary-row hidden",
          wordDefs: "",
      }
      this.guessLetter = this.guessLetter.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    handleChange(event) {
        this.setState({ guess: event.target.value })
        console.log(event.target.value)
    }
    handleClick(event) {
        event.target.value = "";
        this.setState({ guess: event.target.value })
    }
    handleKeyDown(event) {
        if (event.keyCode == 13 && this.state.guessesLeft > 0 && !this.state.gameOver) {    //enter
          this.guessLetter()
        }
    }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);


    // retrieve word, and dictionary definition data for word
    let path = getWordPath();

    console.log(path);

    // retrive word and word definitions from Datamuse API
    fetch(path)
        .then(response => response.json())
        .then(data => {
            let i = 25*Math.random(25);
            i = Math.floor(i);

            console.log(data[i].word)

            // retrieve definition and meaning for word:
            let wordPath = getDefPath(data[i].word);

            console.log(wordPath)

            fetch(wordPath)
              .then(response => response.json())
              .then(data => {

                // this should be an array
                let defs = data[0].defs

                if (!defs) {
                  return this.setState({ wordDefs: [ "No dictionary definitions available." ]});
                } else {
                  return this.setState({ wordDefs: data[0].defs })
                }

                console.log(this.state.wordDefs)

              }).catch((err) => {
                this.setState({ wordDefs: ["no definitions available"] })
              })

            this.setState({
              word: data[i].word,
            })

        });

  }

  componentWillUnMount() {
      document.removeEventlistener('keydown', this.handleKeyDown);
  }


  guessLetter() {
      // TO DO: include a sub method that, if the guess is wrong,
      // flashes in red letters some msg like 'no bad guess!'

      let g = this.state.guess;
      let word = this.state.word;
      let guesses = this.state.lettersGuessed;
      let guessesLeft = this.state.guessesLeft;

    function checkForCompletion(word, guesses) {
        for (let i = 0; i<word.length; i++) {
          if (!guesses.includes(word[i])) {
            return false
          }
        }
        return true
    }

    if (g === "") {
        return this.setState({ message: "You didn't make a guess!" })
    }

    if (!alphabet.includes(g)) {
        return this.setState({ message: "That is not actually a letter." })
    }

    if (guesses.includes(g)) {
      return this.setState({ message: "You already guessed " + g + ".",
                          guess: "" });


      // send game state to server to be saved for user
      fetch.post('/sendWordGameState', { method: 'POST',
        body: JSON.stringify(this.state) })
    }

    if (word.includes(g)) {
      guesses.push(g);
      if (checkForCompletion(word, guesses)) {
        return this.setState({
          message: "Congratulations! You got it!!",
          gameOver:true,
          guess:"",
          dictionaryRowClass: "dictionary-row"
        })
      } else {
        return this.setState({
          lettersGuessed: guesses,
          message: "Good guess! The letter " + g + " is in the word.",
          guess: "",
          });
      }
    } else if (this.state.guessesLeft > 1) {
      guesses.push(g)
      return this.setState({
        lettersGuessed: guesses,
        guessesLeft: guessesLeft - 1,
        message: "Bad guess. The letter " + g + " is not in the word.",
        guess: "",
      })
    } else {
      return this.setState({
        lettersGuessed: guesses,
        guessesLeft: guessesLeft - 1,
        message: "No more guesses! The word is " + this.state.word + ".",
        gameOver:true,
        dictionaryRowClass: "dictionary-row"
      })
    }
    console.log(this.state.lettersGuessed)
  }


  render() {
      let handleGuess;
      if (!this.state.gameOver) {
          handleGuess = this.guessLetter;
      } else {
          handleGuess = null;
      }

    return (
        <div>
          <div className="GameContainer">
            <div className="col1">
              <PlayerFrame playerName="Human"
                           buttonHandler={handleGuess}
                           inputHandler={this.handleChange}
                           handleClick={this.handleClick}
                           message={this.state.message}
                           guess={this.state.guess} />
              <GuessCounterBar guessesLeft={this.state.guessesLeft} />
              <WordBar word={this.state.word}
                       lettersGuessed={this.state.lettersGuessed} />
            </div>
            <div className="col2">
              <Keyboard lettersGuessed={this.state.lettersGuessed}
                        word={this.state.word} />
            </div>
          </div>
          <div className={this.state.dictionaryRowClass}>
            <DictionaryRow word={this.state.word}
                           defs={this.state.wordDefs} />
          </div>
        </div>
      )
    }
}



// this component should appear visible when the game ends:
const DictionaryRow = (props) => {

    let defsArray = Array.from(props.defs);
    //console.log("Defs Array: " + defsArray)

    return (
        <div>
            <h3>{props.word}</h3>
            {defsArray.map((entry, i) => <DefEntry num={i+1} key={i} entry={entry} />)}
        </div>
    )
}


const DefEntry = (props) => {
    return (
        <div className="DefEntry">{props.num}  {props.entry}</div>
    )
}






const PlayerFrame = (props) => {

  return (
     <div className="PlayerFrame">
       <GuessBar inputHandler={props.inputHandler} handleClick={props.handleClick}
          guess={props.guess} />
       <GuessButton buttonHandler={props.buttonHandler} />
       <MessageBar message={props.message} />
     </div>
  )

}

const MessageBar = (props) => {
    return (
        <span className="Message">{props.message}</span>
    )
}

const GuessBar = (props) => {

    return <input type="text" size="5" maxLength="1"
                placeholder="" onChange={props.inputHandler}
                onClick={props.handleClick} value={props.guess} />
}

const GuessCounterBar = (props) => {
    return (
        <div className="GuessCounterBar">You have {props.guessesLeft} guesses left!</div>
    )
}

const GuessButton = (props) => {
    return (
        <button onClick={props.buttonHandler}>Guess!</button>
    )
}

const WordBar = (props) => {

    let wordArray = [];
    let lettersGuessed = props.lettersGuessed; // this is an array of letters

    for (let i=0; i<props.word.length; i++) {
        if (props.word[i] === " ") {
            wordArray.push([props.word[i], "", "space"]);
        } else if (lettersGuessed.includes(props.word[i])) {
            wordArray.push([props.word[i], "", ""]);
        } else {
            wordArray.push([props.word[i], "hidden", ""]);
        }
    }

    //console.log(wordArray);

    return (
      <div className="WordBar">
        {wordArray.map((letter, i) => <LetterUnit key={i} letter={letter[0].toUpperCase()}
                                        hidden={letter[1]} space={letter[2]} />)}
      </div>
    )
}

const LetterUnit = (props) => {
    return <div className={props.space === "space" ? "LetterUnit hidden": "LetterUnit"}>
        <div className={props.hidden}>{props.letter}</div>
    </div>
}

const KeyboardUnit = (props) => {
    return <div className={props.guessStatus}>
        {props.letter}
    </div>
}

const Keyboard = (props) => {
    let alphabetRowOne = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    let alphabetRowTwo = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    let alphabetRowThree = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

    let lettersGuessed = props.lettersGuessed; // array of guessed letters
    let word = props.word; // string representation of word to be guessed

    function returnGuessClass(letter, word, lettersGuessed) {
        if (lettersGuessed.includes(letter) && word.includes(letter)) {
          return "LetterUnit goodGuessLetter"
        } else if (lettersGuessed.includes(letter) && !word.includes(letter)) {
          return "LetterUnit badGuessLetter"
        } else {
          return "LetterUnit"
        }
    }

    return (
        <div className="Keyboard">
            <div className="kbrow1">
            {alphabetRowOne.map((letter, i) => <KeyboardUnit key={i} letter={letter}
                              guessStatus={returnGuessClass(letter, word, lettersGuessed)} />)}
            </div>
            <div className="kbrow2">
            {alphabetRowTwo.map((letter, i) => <KeyboardUnit key={i} letter={letter}
                                guessStatus={returnGuessClass(letter, word, lettersGuessed)} />)}
            </div>
            <div className="kbrow3">
            {alphabetRowThree.map((letter, i) => <KeyboardUnit key={i} letter={letter}
                                guessStatus={returnGuessClass(letter, word, lettersGuessed)} />)}
            </div>
        </div>
    )
}

ReactDOM.render(<GameContainer />,
  document.getElementById('target'))
