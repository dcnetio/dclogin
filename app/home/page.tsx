"use client";
import ethers from "@/helpers/ethersHelper";
import styles from "./home.module.css";
import { SendOutline, FileOutline } from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { useAppSelector } from "@/lib/hooks";
import { appState } from "@/context/constant";
import { getCurrentAccount } from "./home";

export default function Home() {
  const router = useRouter();
  const [balance, setBalance] = useState("0");
  const initState = useAppSelector(state => state.app.initState)

  const sendBlance = () => {
    console.log("sendBlance");
    router.push("/transfer");
  };
  const gotoActivity = () => {
    router.push("/activity");
  }
  
  const changeSuccess = async () => {
    // todo 切换成功后，获取账户，切换余额
    getUserBalance();
  };

  const getUserBalance = async () => {
    const accountInfo = getCurrentAccount();
    console.log('accountInfo1111', accountInfo)
    if(accountInfo && accountInfo.account){
      const nbalance = await ethers.getUserBlance(accountInfo.account) || '0';
      setBalance(nbalance);
    }
  };
  
  useEffect(() => {
    if(initState  == appState.init_success){
      getUserBalance();
    }
  }, [initState])
  return (
    <div>
      <Header changeNetworkSuccess={changeSuccess} changeAccountSuccess={changeSuccess}/>
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
