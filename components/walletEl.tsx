"use client";
import { Button } from "antd-mobile";
import { useEffect, useState } from "react";


const dcWalletIframe = 'dcWalletIframe';
const version = 'v_0_0_1';
const walletOrigin = 'http://localhost:3000'; //
const walletUrl = walletOrigin +'/home'; // 钱包地址
const walletWindowName = 'walletWindow'; // 窗口名称  
let walletWindow:Window|null;
let channelPort2: MessagePort | null;
export default function WalletEl() {
  console.log('walletEl');
  const defaultAccount = {
    account: "",
  }
  const [accountInfo, setAccountInfo] = useState(defaultAccount)
  const openConnect = () => {
    const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
    walletWindow = window.open(urlWithOrigin, walletWindowName); 
    initCommChannel();
    const message = {
      version: version,
      type: 'connect',
      data: {
        origin: window.location.origin,
      },
    };
    sendMessageToIframe(message, 60000).then((response) => {
      console.log('openConnect response', response);
      if(response){
        const data = response.data;
        setAccountInfo(response.data.data);
      }else{
        console.error('openConnect response is null');
      }
    }).catch((error) => {
      console.error('openConnect error', error);
    });

  }


  const initConfig = () => {
    const message = {
      version: version,
      type: 'init',
      data: {
        appName: 'testDAPP',
        appIcon: 'https://dcnetio.cloud/ipfs/bafybeicco3kk3aq5to5l376npfosnvgwk6yr4azz35xinnilqvpa4hmbq4/favicon.ico',
        appVersion: '1.0.0',
        appUrl: 'http://127.0.0.1:3000',
      }
    };
    sendMessageToIframe(message, 5000).then((response) => {
      console.log('initConfig response', response);
    }).catch((error) => {
      console.error('initConfig error', error);
    });
  }


  // 利用messageChannel通信
  const sendMessageToIframe = async (message:object,timeout:number): Promise< MessageEvent|null > =>  {
    const iframe = document.getElementById(dcWalletIframe) as HTMLIFrameElement;
    // port2转移给iframe
    if(iframe){
      const messageChannel = new MessageChannel();
      // 等待钱包iframe返回,并关闭channel,超时时间timeout
      return  new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject('timeout');
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timer);
          messageChannel.port1.close();
          resolve(event);
        }
        try {
          iframe.contentWindow?.postMessage(message,walletOrigin,[messageChannel.port2]);
        } catch (error) {
          clearTimeout(timer);
          messageChannel.port1.close();
          reject(error);
        }
      });
    }else{
      console.error('iframe不存在');
      return null;
    }
  }


// 签名普通消息
  const signMessage = () => {
    if (!accountInfo.account) {
      console.log('未连接钱包');
      return;
    }
    const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
    initCommChannel();
    walletWindow = window.open(urlWithOrigin, walletWindowName); 
    // 每100ms发送一次消息,直到钱包加载完成
    const message = {
      version: version,
      type: 'signMessage',
      data: {
        account: accountInfo.account,
        appName:'test',
        appIcon:'',
        appUrl: 'http://localhost:8080',
        messageType: 'string',
        message: 'test message',
      }
    };
    sendMessageToIframe(message, 60000).then((response) => {
      console.log('signMessage response', response);
    }).catch((error) => {
      console.error('signMessage error', error);
    }
    );
  }

  function initCommChannel() {
    const iframe = document.getElementById(dcWalletIframe) as HTMLIFrameElement;
    // port1转移给iframe
    if(iframe){
      const message = {
        code: '0', 
        version: version,
        type: 'channelPort',
      }
      try {
        const messageChannel = new MessageChannel();
        iframe.contentWindow?.postMessage(message,walletOrigin,[messageChannel.port1]);
        channelPort2 = messageChannel.port2;
      }catch(error){
        console.error('initCommChannel error', error);
      }
    }else{
      console.error('iframe不存在');
    }
  }

  // 签名EIP712消息
  const signEIP712Message = () => {
    if (!accountInfo.account) {
      console.log('未连接钱包');
      return;
    }
    const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
    initCommChannel();
    walletWindow = window.open(urlWithOrigin, walletWindowName); 
    // port1 转移给iframe
    const message = {
      version: version,
      type: 'signEIP712Message',
      data: {
        account: accountInfo.account,
        appName:'test',
        appIcon:'',
        appUrl: 'http://localhost:3000',
        domain: {
          name: 'test',
          version: '1',
          chainId: 1,
          verifyingContract: '0x1234567890123456789012345678901234567890',
        },
        types: {
          Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' }
          ],
          Trans: [
              { name: 'from', type: 'Person' },
              { name: 'to', type: 'Person' },
              { name: 'contents', type: 'string' }
          ],
        },
        primaryType: 'Trans',
        message: {
            from: {
                name: 'Cow',
                wallet: '0x601C2e6cDE6917deF84Ee2eEe68DB92a7dD989C4'
            },
            to: {
                name: 'Bob',
                wallet: '0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB'
            },
            contents: 'Hello, Bob!'
          }, 
      }
    };
    sendMessageToIframe(message, 60000).then((response) => {
      console.log('signEIP712Message response', response);
    }).catch((error) => {
      console.error('signEIP712Message error', error);
    });
  }

  function listenFromWallet(event:MessageEvent) {
    // if (event.origin !== "todo来源") return; // 可选：对源进行验证
    try {
      const data = event.data;
      if (!data.type ) {
        //非钱包插件
        return;
      }
      if (data.type === 'walletLoaded') {//钱包加载完成
        if(event.origin !== walletOrigin){
          console.log('来源不匹配', event.origin, walletOrigin);
          return;
        }
        // 钱包打开成功
        console.log('钱包打开成功', data.data);
        if(channelPort2){//port2转移给钱包
          const message = {
            version: version,
            type: 'channelPort',
          }
          if(walletWindow){
            try {
              walletWindow.postMessage(message, walletOrigin, [channelPort2]);
            } catch (error) {
              console.error('postMessage error', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('message error', error);
    }}
 
  useEffect(() => {
     // 父窗口监听消息,只监听钱包加载完成消息
    window.addEventListener('message',listenFromWallet);
    return () => {
      window.removeEventListener('message', listenFromWallet);
    }
  }, []);
  return (
    <>
    
      <div>
        <span>{accountInfo.account}</span>
          <Button color="primary" fill="outline" onClick={openConnect}>
            钱包
          </Button>
          <Button color="primary" fill="outline" onClick={signMessage}>
            签名
          </Button>
          <Button color="primary" fill="outline" onClick={signEIP712Message}>
            Eip712签名
          </Button>
      </div>
      <iframe id={dcWalletIframe}  src={"http://localhost:3000/iframe?parentOrigin="+ window.location.origin} onLoad={initConfig}></iframe>
    </>
  );
}
