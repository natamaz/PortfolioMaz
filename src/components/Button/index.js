import styles from './Button.module.scss'

export default () => `
  <button class="${styles.root}">
    <span class="${styles.label}">Click</span>
  </button>
`