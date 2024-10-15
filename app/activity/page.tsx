"use client";
import { List } from "antd-mobile";
import { useEffect, useState } from "react";
import { queryData, store_record } from "@/helpers/DBHelper";
import { useRouter } from "next/navigation";
export default function Activity({
}) {
  const router = useRouter();
  const [list, setList] = useState([]);
  const getActivity = async () => {
    const account = 'test'
    const data = await queryData(store_record, 'account', account) || [{
      account: '23123123',
    }]
    setList(data)
  }

  useEffect(() => {
    getActivity();
  }, [])
  const gotoDetail = async (info: {id: string, account: string}) => {
    router.push('/activity/info?id=' + info.id)
  };
  return (
    <div>
      <List>
        {list.map((item: {id: string, account: string}, index) => (
          <List.Item key={"network" + index} arrowIcon={false} clickable onClick={()=>gotoDetail(item)}>
            {item?.account} 
          </List.Item>
        ))}
      </List>
    </div>
  );
}
