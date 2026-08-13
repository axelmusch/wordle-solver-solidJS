import styles from '../App.module.css';
import logo from "../assets/pngegg.png"

function Header() {
    return (
        <header class={styles.header}>
            <div class={styles.header__brand}>
                <div class={styles.header__mark} aria-hidden="true">
                    <span /><span /><span /><span />
                </div>
                <div class={styles.header__titles}>
                    <h1 class={styles.header__title}>Wordle Solver</h1>
                    <p class={styles.header__subtitle}>Narrow down the answer from your clues</p>
                </div>
            </div>
            <a
                class={styles.header__link}
                href="https://github.com/axelmusch/wordle-solver-solidJS"
                target="_blank"
                rel="noreferrer"
            >
                <span>Source</span>
                <img src={logo} alt="GitHub repository" />
            </a>
        </header>
    )
}

export default Header
