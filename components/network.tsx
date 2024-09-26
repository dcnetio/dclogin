import { Button, List, Toast } from "antd-mobile";
import styles from "./network.module.css";
import ethers from "@/helpers/ethersHelper";
import { useEffect, useState } from "react";
import { getTableAllData, store_chain } from "@/helpers/DBHelper";
export default function Network({
  onSuccess,
}) {
  const defaultList = [
    {
      name: "31DC",
      url: "ws://192.168.31.31:9944",
    },
    {
      name: "本地DC",
      url: "ws://192.168.31.99:9944",
    },
  ];
  const [list, setList] = useState([]);
  const getNetworks = async () => {
    const data = await getTableAllData(store_chain) || defaultList
    setList(data)
  }

  useEffect(() => {
    getNetworks();
  }, [])
  const connect = async (info) => {
    let bool = false;
    if(info.url && info.url.indexOf('http') !== -1){
      bool = await ethers.connectWithHttps(info.url);
    }else {
      bool = await ethers.connectChainWithWss(info.url);
    }
    if(bool){
      onSuccess && onSuccess();
      return;
    }
    Toast.show({
      content: '连接失败',
      position: 'bottom',
    })
  };
  return (
    <div>
      <List header="选择网络">
        {list.map((item, index) => (
          <List.Item key={"network" + index} arrowIcon={false} clickable onClick={()=>connect(item)}>
            {item.name} 
          </List.Item>
        ))}
      </List>
      <div className={styles.btn}>
        <Button color="primary" size="large" block>
          添加网络
        </Button>
      </div>
    </div>
  );
}
