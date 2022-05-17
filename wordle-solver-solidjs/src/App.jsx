
import styles from './App.module.css';
import Header from './components/Header';


function App() {
  return (
    <div class={styles.App}>
      <Header />
      <h1>wordle solver app</h1>
    </div>
  );
}

export default App;
