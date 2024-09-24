import { Button, List } from "antd-mobile";
import styles from "./network.module.css";
export default function header({}) {
  return (
    <div>
      <List header="选择网络">
        <List.Item arrowIcon={false} clickable>
          网络1
        </List.Item>
        <List.Item arrowIcon={false} clickable>
          网络2
        </List.Item>
        <List.Item arrowIcon={false} clickable>
          网络3
        </List.Item>
        <List.Item arrowIcon={false} clickable>
          网络4
        </List.Item>
      </List>
      <div className={styles.btn}>
        <Button color="primary" size="large" block>
          添加网络
        </Button>
      </div>
    </div>
  );
}
