import { Button, List, Toast } from "antd-mobile";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getAllData, store_chain } from "@/helpers/DBHelper";
import { getCurrentNetwork, switchChain } from "@/app/index";
import { ChainInfo} from '@/types/walletTypes';   
import { useTranslation} from 'react-i18next';   
interface NetworkProps {
  onSuccess: (name: string) => void; // 定义onSuccess为一个无参数无返回值的函数
}
export default function Network(props: NetworkProps) {
  const { onSuccess } = props;
  const { t } = useTranslation();
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
      content: t("network.connect_failed"),
      position: "bottom",
    });
  };
  return (
    <div>
      <List header={t("network.choose")}>
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
          {t("network.add" )}
        </Button>
      </div>
    </div>
  );
}
