"use client";
import { Button } from "antd-mobile";
import { useEffect, useState } from "react";

export default function WalletEl() {
  const defaultAccount = {
    name: "",
    address: "",
    balance: ''
  }
  const [accountInfo, setAccountInfo] = useState(defaultAccount)
  const openConnect = () => {
    const url = 'http://localhost:3000/home';
    const windowName = 'mySharedWindow'; // 窗口名称  
    // const newWindow = window.open(url, windowName); 
    const message = {
      type: 'connect',
      data: {
        origin: window.location.origin,
      },
    };
    const jsonMessage = JSON.stringify(message);
    sendMessage(jsonMessage)
  }


  // 发起
  const sendMessage = (message:any) => {
    // todo 调起钱包
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    if(iframe){
      iframe.contentWindow?.postMessage(message);
    }
  }
 
  useEffect(() => {
     // 父窗口监听消息
    window.addEventListener('message', function(event) {
      // if (event.origin !== "todo来源") return; // 可选：对源进行验证
      console.log("接收到来自iframe的消息,来源:", event.origin);
      console.log("接收到来自iframe的消息:", event.data);
      // 处理消息
      
    });
    const message = {
        type: 'init',
        data: {
          appName: 'testDAPP',
          appIcon: 'https://dcnetio.cloud/ipfs/bafybeicco3kk3aq5to5l376npfosnvgwk6yr4azz35xinnilqvpa4hmbq4/favicon.ico',
          appVersion: '1.0.0',
          appUrl: 'http://127.0.0.1:3000/DAPP',
        }
      };
      const jsonMessage = JSON.stringify(message);
    // 初始化
    sendMessage(jsonMessage)
  })
  return (
    <>
      <div>
        <span>{accountInfo.name}</span>
        <span>{accountInfo.address}</span>
        <span>{accountInfo.balance}</span>
          <Button color="primary" fill="outline" onClick={openConnect}>
            钱包
          </Button>
      </div>
      <iframe id="myIframe"  src="http://localhost:3000/iframe"></iframe>
    </>
  );
}
