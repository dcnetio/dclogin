import styles from "./header.module.css";
export default function header({  }) {
  return (
    <div className={styles.header}>
      <p className={styles.account}>Account</p>
      <p className={styles.address}>0xwueuqiweuiwqeoq8jwqljklqwwq</p>
    </div>
  )
}