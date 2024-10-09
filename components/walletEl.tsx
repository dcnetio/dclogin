"use client";
import { Button } from "antd-mobile";
import { version } from "os";
import { useEffect, useState } from "react";

export default function WalletEl() {
  const version = 'v_0_0_1';
  const walletUrl = 'http://localhost:3000/home?origin=http://localhost:3000'; // 钱包地址
  const walletWindowName = 'walletWindow'; // 窗口名称  
  const defaultAccount = {
    account: "",
  }
  let code = "0";
  const [accountInfo, setAccountInfo] = useState(defaultAccount)
  const openConnect = () => {
    const newWindow = window.open(walletUrl, walletWindowName); 
    const message = {
      code: getMessageCode(),
      version: version,
      type: 'connect',
      data: {
        origin: window.location.origin,
      },
    };
    const jsonMessage = JSON.stringify(message);
    sendMessage(jsonMessage)
  }

  function generateRandomString(length:number) {  
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
    let result = '';  
    const charactersLength = characters.length;  
    for (let i = 0; i < length; i++) {  
        result += characters.charAt(Math.floor(Math.random() * charactersLength));  
    }  
    return result;  
}  

// 使用示例：生成一个长度为10的随机字符串  
  const getMessageCode = () => {
    code = generateRandomString(10); 
    return code;
  }

  const initConfig = () => {
    const message = {
      code: getMessageCode(),
      version: version,
      type: 'init',
      data: {
        appName: 'testDAPP',
        appIcon: 'https://dcnetio.cloud/ipfs/bafybeicco3kk3aq5to5l376npfosnvgwk6yr4azz35xinnilqvpa4hmbq4/favicon.ico',
        appVersion: '1.0.0',
        appUrl: 'http://localhost:3000',
      }
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


// 签名普通消息
  const signMessage = () => {
    if (!accountInfo.account) {
      console.log('未连接钱包');
      return;
    }
    const newWindow = window.open(walletUrl, walletWindowName); 
    const message = {
      code: getMessageCode(),
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
    const jsonMessage = JSON.stringify(message);
    sendMessage(jsonMessage)
  }

  // 签名EIP712消息
  const signEIP712Message = () => {
    if (!accountInfo.account) {
      console.log('未连接钱包');
      return;
    }
    const newWindow = window.open(walletUrl, walletWindowName); 
    const message = {
      code: getMessageCode(),
      version: version,
      type: 'signEIP712Message',
      data: {
        account: accountInfo.account,
        appName:'test',
        appIcon:'',
        appUrl: 'http://localhost:8080',
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
    const jsonMessage = JSON.stringify(message);
    sendMessage(jsonMessage)
  }

 
  useEffect(() => {
     // 父窗口监听消息
    window.addEventListener('message', function(event) {
      // if (event.origin !== "todo来源") return; // 可选：对源进行验证
      try {
        const data = JSON.parse(event.data);
        if (data.code !== code) {
          console.log('code不匹配', event.data, code);
          return;
        }
        if (data.type === 'initConfigResponse') {
          // 初始化成功
          console.log('初始化成功', data.data);
        }else if (data.type === 'walletConnected') {
          // 连接成功
          console.log('连接成功', data.data);
          setAccountInfo(data.data);

        }else if (data.type === 'signMessageResponse') {
          // 签名
          console.log('签名', data.data);
        }else if (data.type === 'signEIP712MessageResponse') {
          // Eip712签名
          console.log('Eip712签名', data.data);
        }else {
          console.log('未知消息', data);
        }
      } catch (error) {
    //    console.error('message error', error);
      }

      // 处理消息
      
    });
    // const message = {
    //     type: 'init',
    //     data: {
    //       appName: 'testDAPP',
    //       appIcon: 'https://dcnetio.cloud/ipfs/bafybeicco3kk3aq5to5l376npfosnvgwk6yr4azz35xinnilqvpa4hmbq4/favicon.ico',
    //       appVersion: '1.0.0',
    //       appUrl: 'http://localhost:3000',
    //     }
    //   };
    //   const jsonMessage = JSON.stringify(message);
    // // 初始化
    // sendMessage(jsonMessage)
  })
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
      <iframe id="myIframe"  src="http://localhost:3000/iframe" onLoad={initConfig}></iframe>
    </>
  );
}
