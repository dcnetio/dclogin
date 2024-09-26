"use client";
import ethers from "@/helpers/ethers";
import styles from "./home.module.css";
import Network from "@/components/network";
import { Popup } from "antd-mobile";
import { SendOutline, GlobalOutline } from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState('0');
  const sendBlance = () => {
    console.log("sendBlance");
    router.push("/transfer")
  }
  const changeNetwork = () => {
    console.log("changeNetwork");
    setVisible(true)
  }

  const changeSuccess = async () => {
    setVisible(false)
    // 切换成功后，获取账号的余额
    const nbalance = await ethers.getUserBlance();
    setBalance(nbalance);
  }
  return (
    <div>
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
            <div className={styles.btn} onClick={changeNetwork}>
              <GlobalOutline fontSize={24} />
            </div>
            <span className={styles.txt}>网络</span>
          </div>
        </div>
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false)
          }}
          onClose={() => {
            setVisible(false)
          }}
          bodyClassName={styles.popup}
        >
          <Network changeSuccess={changeSuccess}/>
        </Popup>
      </div>
    </div>
  );
}
