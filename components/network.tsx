import { Button, List, Toast } from "antd-mobile";
import styles from "./network.module.css";
import ethers from "@/helpers/ethers";
import IndexedDBHelper from '@/helpers/indexedDBHelper';
export default function Network({
  onSuccess,
}) {
  // todo 后期改成从数据库获取
  const list = [
    {
      name: "31DC",
      url: "ws://192.168.31.31:9944",
    },
    {
      name: "本地DC",
      url: "ws://192.168.31.99:9944",
    },
    {
      name: "发布DC",
      url: "ws://io.dcnetio.cloud:9944",
    },
    {
      name: "本地DC",
      url: "ws://192.168.31.99:9944",
    },
    {
      name: "本地DC",
      url: "ws://192.168.31.99:9944",
    },
    {
      name: "本地DC",
      url: "ws://192.168.31.99:9944",
    },
  ];
  const connect = async (info) => {
    console.log("connect");
    const bool = await ethers.connectEth(info.url);
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
