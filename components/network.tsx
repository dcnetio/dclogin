import { Button, List, Toast } from "antd-mobile";
import styles from "./network.module.css";
import { useEffect, useState } from "react";
import { getAllData, store_chain } from "@/helpers/DBHelper";
import { getCurrentNetwork, switchChain } from "@/app/home/home";
import { ChainInfo} from '../types/walletTypes';      
interface NetworkProps {
  onSuccess: (name: string) => void; // 定义onSuccess为一个无参数无返回值的函数
}
export default function Network(props: NetworkProps) {
  const { onSuccess } = props;
  const [list, setList] = useState([]);
  const [chainId, setChainId] = useState(0);
  const getNetworks = async () => {
    const data = (await getAllData(store_chain)) || [];
    setList(data);
  };

  const getNowNetwork = async () => {
    const info = getCurrentNetwork();
    if (info) {
      setChainId(info.chainId);
    }
  };

  useEffect(() => {
    getNetworks();
    getNowNetwork();
  }, []);
  const connect = async (info: ChainInfo) => {
    const bool = await switchChain(info);
    if (bool) {
      setChainId(info.chainId);
      onSuccess?.(info.name);
      return;
    }
    Toast.show({
      content: "连接失败",
      position: "bottom",
    });
  };
  return (
    <div>
      <List header="选择网络">
        {list.map((item: ChainInfo, index) => (
          <List.Item
            key={"network" + index}
            arrowIcon={false}
            clickable
            onClick={() => connect(item)}
          >
            <span className={item.chainId === chainId ? styles.now : ""}>
              {item.name}{" "}
            </span>
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
