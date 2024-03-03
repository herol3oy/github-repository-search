import styles from './DisplayError.module.scss'

interface DisplayErrorProps {
  message: string
}

export function DisplayError(props: DisplayErrorProps) {
  return (
    <div className={styles.errorMessage}>
      <span className={styles.crossIcon}>&#10799;</span>
      <p>{props.message}</p>
    </div>
  )
}
