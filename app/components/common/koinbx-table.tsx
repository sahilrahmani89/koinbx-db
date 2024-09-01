// components/Table.js

import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from "react";
import Style from  "./koinbx-table.module.scss"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  RowModel,
  Column,
  createColumnHelper,
  ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
// import Image from "next/image";
// import MoveToolIcon from '@/app/assets/icons/common/move_up_down.svg'
// import { useVirtualizer } from '@tanstack/react-virtual'

interface TableProps {
    data: any[];
    columns: any[];
    title?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    isLoading?: boolean;
    pageSize?: number;
    overlayConfig?: { title: string; buttonName: string;};
    onOverlayClick?: () =>  void;
    draggableRows?: boolean;
    setTableData?: (data: any) => void;
    isScroll?:boolean;
}



const fuzzyFilter = (row: any, columnId: string, value: any, addMeta: any) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const KoinbxTable = forwardRef((props: TableProps, ref?) => {
   const {
        data: tableData,
        columns: tableColumns,
        // title,
        searchable = true,
        // searchPlaceholder = "Search",
        isLoading = false,
        pageSize = 10,
        // overlayConfig,
        // onOverlayClick,
        setTableData,
        draggableRows = false,
        isScroll = false,
    } = props;
  
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handleDragStart = (index: number) => {
    setDraggedRowIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (!draggableRows || draggedRowIndex === null || index === draggedRowIndex) return;

    const updatedData = [...tableData];
    const draggedRow = updatedData[draggedRowIndex];
    updatedData.splice(draggedRowIndex, 1);
    updatedData.splice(index, 0, draggedRow);

    if(setTableData) setTableData(updatedData);
    setDraggedRowIndex(index);
  };

  const [globalFilter, setGlobalFilter] = useState("");
  const data = useMemo(() => tableData, [tableData]);
  const columnHelper = createColumnHelper();
  const columns = useMemo(() => [
    ...tableColumns,
    ...(
      draggableRows ? [
        columnHelper.display({
          id: 'drag-action',
          header: () => '',
          cell: props => (
            <button
              className="h-full"
              draggable={true}
              onDragStart={() => handleDragStart(props.row.index)}
            >
              drag
            </button>
          ),
          size: 30
        })
      ] : []
    )
  ], [tableColumns]);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      expanded
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row?.subRows,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableSorting: false,
    initialState: {
      pagination: {
          pageSize: pageSize,
      },
  },
  });

  const { rows } = table.getRowModel();
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

//   const rowVirtualizer = useVirtualizer({
//     count: rows.length,
//     estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
//     getScrollElement: () => tableContainerRef.current,
//     //measure dynamic row height, except in firefox because it measures table border height incorrectly
//     measureElement:
//       typeof window !== 'undefined' &&
//       navigator.userAgent.indexOf('Firefox') === -1
//         ? element => element?.getBoundingClientRect().height
//         : undefined,
//     overscan: 5,
//   });

  

  const getHeaderAlignment = (col: Column<any>) => {
    const { columnDef:  {meta} } = col;
    let alignClass = ''
    if((meta as any)?.align) {
      alignClass = (meta as any).align === 'left' ? 'text-left' : '';
    }
    return '';
  }

  const getCellAlignment = (col: Column<any>) => {
    const { columnDef:  {meta} } = col;
    let alignClass = 'justify-center';
    if((meta as any)?.align) {
      alignClass = (meta as any).align === 'left' ? 'justify-start' : 'justify-center';
    }
    return alignClass;
  }


  const TdSkeleton = () => {
    return (
      <div className="w-full h-full">
        <div className="w-full h-5 bg-gray-200 animate-pulse"></div>
      </div>
    );
  };

  useImperativeHandle(ref, () => ({
    ...table,
    getTableInstance: () => table,
  }));

  useEffect(() => {
    if(tableData?.length) {
        const canBlur = tableData.some((item) => !!item?.blur);
        setShowOverlay(canBlur);
    }
  }, [tableData])

  return (
    <div className="flex flex-col relative">
      <div
        className={`overflow-hidden ${
          !searchable && "mt-6"
        }`}
      >
        <div className="align-middle inline-block w-full">
          {searchable && (
            <div className="py-1">
              {isLoading && (
                <div className="w-full py-3">
                  <div className="relative animate-pulse  justify-between">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              )}
              {!isLoading && (
                <div className="w-full">
                  <div className="relative rounded-md">
                    
                  </div>
                </div>
              )}
            </div>
          )}
          <div  ref={isScroll ? tableContainerRef : null} className={`${Style.table} ${isScroll && "overflow-auto relative max-h-[600px]"} overflow-auto  w-full border border-[#E8EBF1] rounded-lg`}>
            <table className="w-full divide-y divide-[#D4D4D8]">
              <thead   className={`bg-[#F4F5F7] divide-y divide-[#D2E1EF] border-t-0 ${isScroll && "top-0 z-[1] sticky"}`}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          scope="col"
                          className={`px-2 py-4 text-sm font-primary-font-bold text-black ${getHeaderAlignment(header.column)}`}
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              <div className="">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              </div>
                            </button>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-[#D2E1EF]">
                {/* if isLoading, use skeleton rows  */}
                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      {table.getHeaderGroups()[0].headers.map((header) => {
                        return (
                          <td
                            key={header.id}
                            colSpan={header.colSpan}
                            className="px-2 py-4"
                          >
                            <div className={`w-full`}>
                              <div className="text-xs text-gray-900 w-full">
                                <TdSkeleton />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                {!isLoading &&
                  table.getRowModel().rows.map((row, idx) => {
                    const { original: rowData } = row;
                    return (
                      <tr key={row.id} className={`hover:bg-gray-100 ${rowData?.blur ? 'blur-sm pointer-events-none' : ''}`}>
                        {row.getVisibleCells().map((cell, index) => {
                          if (draggableRows && index === row.getVisibleCells().length - 1) {
                            return (
                              <td
                                key={cell.id}
                                className={`px-2 py-4 align-text-top`}
                                width={cell.column.getSize()}
                                onDragOver={() => handleDragOver(idx)}
                                onDragEnd={() => setDraggedRowIndex(null)}
                              >
                                <div className={`${getCellAlignment(cell.column)}`}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </div>
                              </td>
                            )
                          }

                          return (
                            <td
                              key={cell.id}
                              className={`px-2 py-4 align-text-top`}
                              width={cell.column.getSize()}
                            >
                              {(cell.column.columnDef.meta as any)?.lineClamp ?
                                <div className="line-clamp-1 text-center">
                                  <div className={`text-sm text-[#686868]`}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </div>
                                </div> :
                                <div className={`text-sm text-[#686868] flex items-center ${getCellAlignment(cell.column)}`}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </div>
                              }
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
});

KoinbxTable.displayName = "KoinbxTable";
