
import styles from './App.module.css';
import Header from './components/Header';
import words from './assets/words';
import words_test from './assets/words_test';
import { createSignal, createEffect } from "solid-js"

function App() {
  const [possible, setPossible] = createSignal([...words]) //list of possible words
  const [highlight, setHighlight] = createSignal([]) //list of possible words
  const [nextChoice, setNextChoice] = createSignal('') //list of possible words
  const [wrong, setWrong] = createSignal([""]) //list of wrong chars as string
  const [good, setGood] = createSignal([""]) //list of good chars as string
  const [place, setPlace] = createSignal(["", "", "", "", ""]) //array with correct letters
  const [badPlace, setBadPlace] = createSignal(["", "", "", "", ""]) //array with letter that are in the wrong spot
  const [msgError, setMsgError] = createSignal('') // error/conflict message
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  //check for possible words on button press
  function checkWords(e) {
    e.preventDefault()

    //set state from inputs
    setWrong(document.getElementById("lettersWrong").value)
    setGood(document.getElementById("lettersGood").value)

    setPlace((oldPLace) => {
      oldPLace[0] = document.getElementById("letterGood_1").value
      oldPLace[1] = document.getElementById("letterGood_2").value
      oldPLace[2] = document.getElementById("letterGood_3").value
      oldPLace[3] = document.getElementById("letterGood_4").value
      oldPLace[4] = document.getElementById("letterGood_5").value
      return oldPLace
    })

    setBadPlace((oldBadPLace) => {
      oldBadPLace[0] = document.getElementById("letterBad_1").value
      oldBadPLace[1] = document.getElementById("letterBad_2").value
      oldBadPLace[2] = document.getElementById("letterBad_3").value
      oldBadPLace[3] = document.getElementById("letterBad_4").value
      oldBadPLace[4] = document.getElementById("letterBad_5").value
      return oldBadPLace
    })

    //temp arr for new possible words
    let newWords = []
    let commonLetters = {}

    //loop over words 
    words.forEach((word, idx) => {
      let matchall = []

      for (let letter of good()) {//loop over good lettersand check if word contains all good letters
        if (!word.includes(letter)) {
          matchall.push(false)
        }
      }

      place().forEach((letter, idx) => {
        if (letter != "") {
          letter === word[idx] ? matchall.push(true) : matchall.push(false)

        }
      })

      let checkAll = true
      matchall.forEach((val, idx) => {
        if (!val) checkAll = false
      })

      if (checkAll) {

        let checkBadLetter = true
        for (let wrongLetter of wrong()) {
          if (word.includes(wrongLetter)) checkBadLetter = false
        }

        if (checkBadLetter) {
          let canAddWord = true
          badPlace().forEach((position, idx) => {
            for (let letter of position) {
              if (letter == word[idx]) canAddWord = false
            }
          })
          if (canAddWord) newWords.push(word)
        }
      }
    })
    newWords.forEach((newWord, idx) => {
      const l = newWord.split("")
      l.forEach((letter, idx) => {
        if (commonLetters[letter]) {
          commonLetters[letter] += 1
        } else {
          commonLetters[letter] = 1
        }
      })
    })

    const bestLetters = pickHighest(commonLetters, 5)
    console.log(commonLetters)
    console.log(bestLetters)

    let matchCache = []
    let maxMatch = 0
    newWords.forEach((newWord, idx) => {
      let lettersMatch = 0
      for (const letter in bestLetters) {
        if (newWord.includes(letter)) {
          lettersMatch++
        }
      }
      matchCache.push({ word: newWord, matching: lettersMatch })
      if (lettersMatch > maxMatch) maxMatch = lettersMatch
    })

    matchCache = matchCache.filter((word) => {
      return maxMatch == word.matching
    }).map((word) => { return word.word })
    console.log(matchCache)
    setHighlight(matchCache)
    //setNextChoice(Math.floor(Math.random() * matchCache.length))
    console.warn(matchCache[Math.floor(Math.random() * matchCache.length)])
    setNextChoice(matchCache[Math.floor(Math.random() * matchCache.length)])
    setPossible(newWords)
  }


  //validate inputs
  function checkInputWrong(event) {
    console.log(event)
    if (event.data != null) {
      if (alphaOnly(event.data)) {
        if (wrong().includes(event.data)) {
          const temp = wrong()
          setWrong('update state')
          setWrong(temp)
          setMsgError('Letter "' + event.data + '" is already in Wrong.')
        } else {
          if (good().includes(event.data)) {
            const temp = wrong()
            setWrong('update state')
            setWrong(temp)
            setMsgError('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')
          } else {
            setWrong((prev) => {
              return prev + event.data
            })
          }
        }
      } else {
        const temp = wrong()
        setWrong('update state')
        setWrong(temp)
      }
    } else {//backspace
      setWrong(event.target.value)
    }

    //checkWords(event)
    //check if not in good letters
  }

  function checkInputGood(event) {
    //check if not in bad letters
    if (event.data != null) {
      if (alphaOnly(event.data)) {
        if (good().includes(event.data)) {
          const temp = good()
          setGood('update state')
          setGood(temp)
          setMsgError('Letter "' + event.data + '" is already in Good.')
        } else {
          if (wrong().includes(event.data)) {
            const temp = good()
            setGood('update state')
            setGood(temp)
            setMsgError('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')
          } else {
            setGood((prev) => {
              return prev + event.data
            })
          }
        }
      } else {
        const temp = good()
        setGood('update state')
        setGood(temp)
      }
    } else {//backspace
      setGood(event.target.value)
    }

  }
  function checkInputPlace(event) {
    if (alphaOnly(event.data)) {
      console.log('ok')
    } else {
      console.warn('not')
    }
  }

  function alphaOnly(sign) {
    //^[a-zA-Z0-9._]+$/;
    return /[a-z\b]/i.test(sign)
  };

  const pickHighest = (obj, num = 1) => {
    const requiredObj = {};
    if (num > Object.keys(obj).length) {
      return false;
    };
    Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) => {
      if (ind < num) {
        requiredObj[key] = obj[key];
      }
    });
    return requiredObj;
  };

  return (
    <div class={styles.App}>
      <Header />

      <div class={styles.mainContent}>

        <form onSubmit={checkWords}>
          <div class={styles.form__inputs}>
            <div class={styles.form__left}>


              <div class={styles.form__wrongContainer}>
                <h2>Wrong letters:</h2>
                <input autoComplete="off" id='lettersWrong' name='lettersWrong' type="text" value={wrong()} onInput={checkInputWrong} />
              </div>


              <div class={styles.form__goodContainer}>
                <h2>Good letters:</h2>
                <input autoComplete="off" id='lettersGood' name='lettersGood' type="text" value={good()} onInput={checkInputGood} />
              </div>


              <div class={styles.form__greenContainer}>
                <h2>Green letters:</h2>
                <input autoComplete="off" maxlength="1" id='letterGood_1' type="text" value={place()[0]} onInput={checkInputPlace} />
                <input autoComplete="off" maxlength="1" id='letterGood_2' type="text" value={place()[1]} onInput={checkInputPlace} />
                <input autoComplete="off" maxlength="1" id='letterGood_3' type="text" value={place()[2]} onInput={checkInputPlace} />
                <input autoComplete="off" maxlength="1" id='letterGood_4' type="text" value={place()[3]} onInput={checkInputPlace} />
                <input autoComplete="off" maxlength="1" id='letterGood_5' type="text" value={place()[4]} onInput={checkInputPlace} />
              </div>
            </div>

            <div class={styles.form__right}>
              <h2>Letters not in spot</h2>
              <div class={styles.form__notInSpotContainer}>
                <input autoComplete="off" id='letterBad_1' type="text" placeholder='1' value={badPlace()[0]} />
                <input autoComplete="off" id='letterBad_2' type="text" placeholder='2' value={badPlace()[1]} />
                <input autoComplete="off" id='letterBad_3' type="text" placeholder='3' value={badPlace()[2]} />
                <input autoComplete="off" id='letterBad_4' type="text" placeholder='4' value={badPlace()[3]} />
                <input autoComplete="off" id='letterBad_5' type="text" placeholder='5' value={badPlace()[4]} />
              </div>
            </div>
            <div class={styles.form__errors}><p>Warning: {msgError()} </p></div>
            <button class={styles.submitBtn} type="submit">Check for possible words</button>

          </div>
        </form>
        <div class={styles.wordsHeader}>
          <h2 class={styles.possibleCount}>Recommended: {nextChoice()}</h2>
          <h2 class={styles.possibleCount}>Possible: {possible().length}/2315</h2>
        </div>
        <div class={styles.wordlist}>{possible().map((word) => {
          if (highlight().includes(word)) {
            return <p class={styles.highlightWord}>+ {word}</p>
          } else {
            return <p> {word}</p>
          }
        })}</div>
      </div>
    </div>
  );
}

export default App;
