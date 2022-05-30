
import styles from './App.module.css';
import Header from './components/Header';
import words from './assets/words';
import words_test from './assets/words_test';
import { createSignal, createEffect } from "solid-js"

function App() {
  const [possible, setPossible] = createSignal([...words_test])
  const [wrong, setWrong] = createSignal([])
  const [good, setGood] = createSignal([])
  const [place, setPlace] = createSignal(["", "", "", "", ""])
  const [badPlace, setBadPlace] = createSignal(["", "", "", "", ""])


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
        console.log(word + " " + matchall)

        let checkBadLetter = true
        for (let wrongLetter of wrong()) {
          if (word.includes(wrongLetter)) {
            checkBadLetter = false
          }
        }

        if (checkBadLetter) {
          let canAddWord = true
          badPlace().forEach((position, idx) => {
            for (let letter of position) {
              if (letter == word[idx]) {
                console.log("cant be in spot ", idx + 1)
                canAddWord = false
              }
            }
          })
          if (canAddWord) {
            newWords.push(word)

          }
        }
      }


    })
    setPossible(newWords)

  }

  return (
    <div class={styles.App}>
      <Header />

      <div class={styles.mainContent}>
        <h1>wordle solver app</h1>

        <form onSubmit={checkWords}>
          <h2>wrong letters</h2>
          <div>
            <input id='lettersWrong' name='lettersWrong' type="text" value={""} />
          </div>

          <h2>good letters</h2>
          <div>
            <input id='lettersGood' name='lettersGood' type="text" value={""} />
          </div>

          <h2>green</h2>
          <div>
            <input value={""} id='letterGood_1' type="text" />
            <input id='letterGood_2' type="text" />
            <input id='letterGood_3' type="text" />
            <input id='letterGood_4' type="text" />
            <input id='letterGood_5' type="text" />
          </div>

          <h2>letters not in spot</h2>
          <div>
            1<input id='letterBad_1' type="text" />
            2<input id='letterBad_2' type="text" />
            3<input id='letterBad_3' type="text" />
            4<input id='letterBad_4' type="text" />
            5<input id='letterBad_5' type="text" />
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
