"use client";
// import ethers from "@/helpers/ethersHelper";
import styles from "./home.module.css";
import { SendOutline, FileOutline } from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();
  const [balance, setBalance] = useState("0");
  const sendBlance = () => {
    console.log("sendBlance");
    router.push("/transfer");
  };
  const gotoActivity = () => {
    router.push("/activity");
  }
  const changeNetworkSuccess = async () => {
    // todo切换成功后，获取账号的余额
    // const nbalance = await ethers.getUserBlance();
    // setBalance(nbalance);
  };
  const changeAccountSuccess = async () => {
    // todo 切换成功后，获取账号的余额
    // const nbalance = await ethers.getUserBlance();
    // setBalance(nbalance);
  };
  return (
    <div>
      <Header changeNetworkSuccess={changeNetworkSuccess} changeAccountSuccess={changeAccountSuccess}/>
      <div className={styles.contentPage}>
        <h1 className={styles.balance}>{balance} DCT</h1>
        <div className={styles.btns}>
          <div className={styles.btnD}>
            <div className={styles.btn} onClick={sendBlance}>
              <SendOutline fontSize={24} />
            </div>
            <span className={styles.txt}>转账</span>
          </div>
          <div className={styles.btnD}>
            <div className={styles.btn} onClick={gotoActivity}>
              <FileOutline fontSize={24} />
            </div>
            <span className={styles.txt}>活动</span>
          </div>
        </div>
      </div>
    </div>
  );
}
