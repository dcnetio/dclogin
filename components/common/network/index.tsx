import { Button, List, Popup } from "antd-mobile";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getAllData, store_chain } from "@/helpers/DBHelper";
import { getCurrentNetwork, switchChain } from "@/app/index";
import { ChainInfo } from "@/types/walletTypes";
import { useTranslation } from "react-i18next";
interface NetworkProps {
  visible: boolean;
  onSuccess: (name: string) => void; // 定义onSuccess为一个无参数无返回值的函数
}
export default function Network(props: NetworkProps) {
  const { visible, onSuccess } = props;
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [chainId, setChainId] = useState(0);
  const [networkVisible, setNetworkVisible] = useState(visible);
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
    setNetworkVisible(visible);
    if (visible) {
      getNetworks();
      getNowNetwork();
    }
  }, [visible]);
  const connect = async (info: ChainInfo) => {
    const bool = await switchChain(info);
    if (bool) {
      setChainId(info.chainId);
      onSuccess?.(info.name);
      return;
    }
    window.showToast({
      content: t("network.connect_failed"),
      position: "bottom",
    });
  };
  return (
    <Popup
      visible={networkVisible}
      onMaskClick={() => {
        setNetworkVisible(false);
      }}
      onClose={() => {
        setNetworkVisible(false);
      }}
    >
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
          {t("network.add")}
        </Button>
      </div>
    </Popup>
  );
}
