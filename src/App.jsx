import { useState } from 'react';
import './App.css'
import StartScreen from './components/StartScreen'
import Game from './components/Game';
import GameOver from './components/GameOver';
import { wordsList } from './data/words';
import { useEffect } from 'react';
import { useCallback } from 'react';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetter] = useState([]);
  const [wrongLetters, setWrongLetter] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);


  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickedWordAndCategory();
    let wordLetters = word.split('');

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickedWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizeLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    if (letters.includes(normalizeLetter)) {
      setGuessedLetter((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter
      ]);
    } else {
      setWrongLetter((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100);
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  const clearLetterStates = () => {
    setGuessedLetter([]);
    setWrongLetter([]);

  }

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }

  return (
    <>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}


    </>
  )
}

export default App
