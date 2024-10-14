"use client";
import { useEffect} from "react";
// import { getData, store_record } from "@/helpers/DBHelper";
import { useSearchParams } from "next/navigation";
export default function Activity({}) {
  const searchParams = useSearchParams()
  console.log('searchParams', searchParams)
  // const [info, setInfo] = useState([]);
  const getActivityInfo = async () => {
    // const id = searchParams?.get('id') || ''
    // const data = await getData(store_record, id) || []
    // setInfo(data)
  }

  useEffect(() => {
    getActivityInfo();
  }, [])
  return (
    <div>
    </div>
  );
}
