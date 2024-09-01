import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ref, onValue ,push} from 'firebase/database';
import { database } from '@/app/firebase';

const useHomePage = () =>{
    const [hotList, setHotList] = useState<any[]>([]);
  const [newList, setNewList] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState<'hotList' | 'newList'>('hotList');
  const columnHelper = createColumnHelper();

  useEffect(() => {
    const hotListRef = ref(database, 'hotList');
    const newListRef = ref(database, 'newList');

    let hotListLoaded = false;
    let newListLoaded = false;

    const handleDataLoad = () => {
      if (hotListLoaded && newListLoaded) {
        setLoading(false); // Stop loading when both lists are loaded
      }
    };

    onValue(hotListRef, (snapshot) => {
      const data = snapshot.val();
      setHotList(data ? Object.values(data) : []);
      hotListLoaded = true;
      handleDataLoad();
    });

    onValue(newListRef, (snapshot) => {
      const data = snapshot.val();
      setNewList(data ? Object.values(data) : []);
      newListLoaded = true;
      handleDataLoad();
    });
  }, []);


  //
  const seedData = async () => {
    const hotListRef = ref(database, 'hotList');
    const newListRef = ref(database, 'newList');
  
    const data = [
      { name: 'Item 1', price: 100, change: 5, trade: 'Buy', volume: 1500 },
      { name: 'Item 2', price: 200, change: 10, trade: 'Sell', volume: 2500 },
      { name: 'Item 3', price: 150, change: -3, trade: 'Hold', volume: 2000 },
      { name: 'Item 4', price: 175, change: 2, trade: 'Buy', volume: 1800 },
      { name: 'Item 5', price: 225, change: 8, trade: 'Sell', volume: 2200 },
    ];
  
    for (const item of data) {
      await push(hotListRef, item);
      await push(newListRef, item);
    }
  };
  //
  const SerialNumber = ({ row }: any) => {
    return (
      <span className="!text-[14px]  !text-[#808080]">{ row.index + 1}</span>
    );
  };
  // created columns for table
  const columns = [
    columnHelper.display({
      id: "sr_no",
      cell: (props) => <SerialNumber row={props.row} />,
      header: () => <span className="!text-[16px]  ">{`SI No`}</span>,
      size: 60,
    }),

    columnHelper.accessor("name", {
      id: "name",
      cell: (info) => <span className="!text-[14px]  !text-[#808080] flex justify-center text-center items-center">{info.getValue()}</span>, 
      header: () => <span className="!text-[16px] ">{`Name`}</span>,
      size: 300,
    }),
    columnHelper.accessor("price", {
      id: "price",
      cell: (info) => <span className="!text-[14px]  !text-[#808080] flex justify-center text-center items-center">{info.getValue()}</span>, 
      header: () => <span className="!text-[16px] ">{`Price`}</span>,
      size: 250,
    }),
    columnHelper.accessor("change", {
      id: "change",
      cell: (info) =><span className="!text-[14px]  !text-[#808080] flex justify-center text-center items-center">{info.getValue()}</span>, 
      header: () => <span className="!text-[16px] ">{`Change`}</span>,
      size: 250,
    }),
    columnHelper.accessor("trade", {
      id: "trade",
      cell: (info) => <span className="!text-[14px]  !text-[#808080] flex justify-center text-center items-center">{info.getValue()}</span>, 
      header: () => <span className="!text-[16px]">{`Trade`}</span>,
      size: 250,
    }),
    columnHelper.accessor("volume", {
      id: "volume",
      cell: (info) => <span className="!text-[14px]  !text-[#808080] flex justify-center text-center items-center">{info.getValue()}</span>, 
      header: () => <span className="!text-[16px]">{'Volume'}</span>,
      size: 250,
    }),
  ];


    return{
        columns,
        hotList,
        newList,
        activeTab,
        isLoading,
        setActiveTab,
    }
}

export default useHomePage