import styles from '../App.module.css';
import logo from "../assets/pngegg.png"

function Header() {
    return (
        <div class={styles.header}>
            <h1>Wordle solver</h1>
            <a href="https://github.com/axelmusch/wordle-solver-solidJS" target="_blank">
                <img src={logo} alt="" />
            </a>
        </div>
    )
}

export default Header
