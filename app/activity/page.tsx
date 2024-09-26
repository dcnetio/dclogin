"use client";
import { List } from "antd-mobile";
import { useEffect, useState } from "react";
import { getTableAllData, store_record } from "@/helpers/DBHelper";
import { useRouter } from "next/navigation";
export default function Activity({
}) {
  const router = useRouter();
  const [list, setList] = useState([]);
  const getActivity = async () => {
    const data = await getTableAllData(store_record) || []
    setList(data)
  }

  useEffect(() => {
    getActivity();
  }, [])
  const gotoDetail = async (info) => {
    router.push('/activity/info?id=' + info.id)
  };
  return (
    <div>
      <List header="选择网络">
        {list.map((item, index) => (
          <List.Item key={"network" + index} arrowIcon={false} clickable onClick={()=>gotoDetail(item)}>
            {item.name} 
          </List.Item>
        ))}
      </List>
    </div>
  );
}
