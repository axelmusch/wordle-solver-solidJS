
import styles from './App.module.css';
import Header from './components/Header';
import words from './assets/words';
import words_test from './assets/words_test';
import { createSignal, createEffect } from "solid-js"

function App() {
  const [possible, setPossible] = createSignal([...words])
  const [wrong, setWrong] = createSignal([])
  const [good, setGood] = createSignal([])
  const [place, setPlace] = createSignal(["", "", "", "", ""])
  const [badPlace, setBadPlace] = createSignal(["", "", "", "", ""])
  const [msgError, setMsgError] = createSignal('')

  function checkWords(e) {
    e.preventDefault()

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

    console.log(place())
    let newWords = []

    words.forEach((word, idx) => {
      let matchall = []

      for (let letter of good()) {
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
    setPossible(newWords)
  }

  function checkInputWrong(event) {
    console.log(event)

    if (alphaOnly(event.data)) {
      console.log('is alpha')

    }
    if (event.data != null) {
      if (wrong().includes(event.data)) {
        const temp = wrong()
        setWrong('')
        setWrong(temp)
        setMsgError('Letter "' + event.data + '" is already in Wrong.')

      } else {
        if (good().includes(event.data)) {
          const temp = wrong()
          setWrong('')
          setWrong(temp)
          console.warn('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')
          setMsgError('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')
        } else {
          setWrong((prev) => {
            return prev + event.data
          })
        }

      }
    } else {
      console.log('backspace')
    }


    //check if not in good letters
  }
  function checkInputGood(event) {
    //check if not in bad letters

    if (good().includes(event.data)) {

      const temp = good()
      setGood('')
      setGood(temp)
      setMsgError('Letter "' + event.data + '" is already in Good.')

    } else {
      if (wrong().includes(event.data)) {
        const temp = good()
        setGood('')
        setGood(temp)
        console.warn('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')
        setMsgError('Letter "' + event.data + '" cannot be in Good and Wrong at the same time')

      } else {
        setGood((prev) => {
          return prev + event.data
        })
      }

    }
  }
  function alphaOnly(sign) {
    //^[a-zA-Z0-9._]+$/;
    return /[a-z\b]/i.test(sign)
  };
  return (
    <div class={styles.App}>
      <Header />

      <div class={styles.mainContent}>
        <h1>wordle solver app</h1>

        <form onSubmit={checkWords}>
          <div class={styles.form__inputs}>
            <div class={styles.form__left}>
              <h2>Wrong letters:</h2>
              <div class={styles.form__wrongContainer}>
                <input id='lettersWrong' name='lettersWrong' type="text" value={wrong()} onInput={checkInputWrong} />
              </div>

              <h2>Good letters:</h2>
              <div class={styles.form__goodContainer}>
                <input id='lettersGood' name='lettersGood' type="text" value={good()} onInput={checkInputGood} />
              </div>

              <h2>Green letters:</h2>
              <div class={styles.form__greenContainer}>
                <input id='letterGood_1' type="text" value={place()[0]} />
                <input id='letterGood_2' type="text" value={place()[1]} />
                <input id='letterGood_3' type="text" value={place()[2]} />
                <input id='letterGood_4' type="text" value={place()[3]} />
                <input id='letterGood_5' type="text" value={place()[4]} />
              </div>
            </div>

            <div class={styles.form__right}>
              <h2>Letters not in spot</h2>
              <div class={styles.form__notInSpotContainer}>
                <div><p>1</p><input id='letterBad_1' type="text" value={badPlace()[0]} /></div>
                <div><p>2</p><input id='letterBad_2' type="text" value={badPlace()[1]} /></div>
                <div><p>3</p><input id='letterBad_3' type="text" value={badPlace()[2]} /></div>
                <div><p>4</p><input id='letterBad_4' type="text" value={badPlace()[3]} /></div>
                <div><p>5</p><input id='letterBad_5' type="text" value={badPlace()[4]} /></div>
              </div>
            </div>
            <div>errors: {msgError()}</div>
          </div>
          <button class={styles.submitBtn} type="submit">Check for possible words</button>
        </form>

        <h2 class={styles.possibleCount}>Possible words: {possible().length}</h2>
        <div class={styles.wordlist}>{possible().map((word) => { return <p> {word}</p> })}</div>
      </div>
    </div>
  );
}

export default App;
