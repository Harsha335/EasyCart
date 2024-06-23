import React, { useEffect, useMemo, useState } from 'react'
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { axiosInstance } from '../../Api_calls/API';
import { getDate, numberFormatter } from '../../assets/formatter';
import AdminNavbar from '../../Components/Admin/AdminNavbar';
import {useTable, useSortBy, usePagination} from 'react-table';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OrderPopup from '../../Components/OrderPopup';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    const getOrders = async () => {
      try{
        const res = await axiosInstance.get("/api/admin/allOrders");
        console.log("Orders : ", res);
        setOrders(res.data?.orders);
      }catch(err){
        console.log("Error at orders page ");
      }
    }
    getOrders();
  },[]);

  const [orderPopupItem, setOrderPopupItem] = useState(null);
  const OrderPopupActivate = (order) => {
    setOrderPopupItem(order);
  }

  const statusOptionColors = useMemo(() => ({
    abort :'bg-red-500',
    confirm:'bg-blue-500',
    shipping:'bg-orange-500',
    delivered:'bg-green-500'
  }),[])

  const columns = useMemo(() => [
    {
      Header: "Order Id",
      accessor: "_id",
      disableSortBy: true,
      Cell: ({row, value}) => (
        <span onClick={() => OrderPopupActivate(row.original)} className='cursor-pointer'>{value}</span>
      )
    },
    {
      Header: "Order Amount (₹)",
      accessor: "amount",
      Cell: ({value}) => numberFormatter(value)
    },
    {
      Header: "Payment Status",
      accessor: "payment_status",
      Cell: ({value}) => (
        <span className={`${value === "success" ? "text-green-600" : "text-red-500"}`}>{value}</span>
      )
    },
    {
      Header: "Order Status",
      accessor: "status",
      // "abort","confirm","shipping","delivered"
      Cell: ({row, value}) => (
        <select
          className={`px-2 py-1 cursor-pointer text-white ${statusOptionColors[value]}`}
          onChange={(e) => {e.preventDefault();saveAction(row.original._id, "status", e.target.value)}}
          value={value}
        >
          <option value="abort" className={`${statusOptionColors["abort"]}`}>Abort</option>
          <option value="confirm" className={`${statusOptionColors["confirm"]}`}>Confirm</option>
          <option value="shipping" className={`${statusOptionColors["shipping"]}`}>Shipping</option>
          <option value="delivered" className={`${statusOptionColors["delivered"]}`}>Delivered</option>
        </select>
      )
    },
    {
      Header: "Order Date",
      accessor: "createdAt",
      Cell : ({value}) => getDate(new Date(value))  // Format date
    },
    {
      Header: "Delivery Date",
      accessor: "deliveryAt",
      Cell : ({row, value}) => (
        <span>
          <DatePicker  minDate={new Date(row.original.createdAt)} clearIcon value={value} onChange={(value) => {value !== null && saveAction(row.original._id, "deliveryAt", value)}}/>
          {/* <input type='date'  value={new Date(value)} onChange={(e) => saveAction(e, row.original.id, "deliveryAt", e.target.value)}/> */}
        </span>
      )
    },
  ], [orders]);

  const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canPreviousPage, canNextPage, state:{pageIndex}, pageCount, gotoPage} = useTable({
      columns,
      data: orders,
      initialState: {pageSize: 7},
  }, useSortBy, usePagination);

  const saveAction = async (id, key, value) => {
    try{
      const response = await axiosInstance.put(`/api/admin/purchase/${id}`, {key, value});
      console.log("Response at saveAction (orders): ", response);
      alert(response.data?.message);
      setOrders(orders => {
        return orders.map(order => {
          return order._id === id ? {...order, [key]:value} : order;
        })
      });
    }catch(err){
      console.log("Error save isAdmin: ", err);
    }
  }

  return (
    <>
      <Navbar />
      <style>
        {`
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }

          td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 1rem;
          }

          tr:nth-child(even) {
            background-color: #dddddd;
          }
        `}
      </style>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <AdminNavbar/>
        <div className='flex-1'>
            <div className='overflow-auto'>
                <div className='font-bold text-3xl p-4'>Order Management</div>
                <div className='relative'>
                    <table className='w-full' {...getTableProps()}>
                      <thead>
                        {
                          headerGroups.map(hg => (
                            <tr {...hg.getHeaderGroupProps()}>
                              {
                                hg.headers.map(header => (
                                  <th {...header.getHeaderProps(header.getSortByToggleProps())} className='relative'>
                                    {header.render("Header")}
                                    {header.isSorted && <span className='absolute top-3 right-3'>{header.isSortedDesc ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</span>}
                                  </th>
                                ))
                              }
                            </tr>
                          ))
                        }
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {
                          page.map(row => {
                            prepareRow(row);
                            return (
                              <tr {...row.getRowProps()}>
                                {
                                  row.cells.map(cell => {
                                    return (
                                      <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                      </td>
                                    )
                                  })
                                }
                              </tr>
                          )})
                        }
                      </tbody>
                    </table>
                    <div className='p-4 flex flex-row gap-4 justify-center items-center'>
                      <button disabled={pageIndex === 0} onClick={()=> gotoPage(0)} className='w-8 border-black border-2 rounded-md font-bold text-xl pb-1 '>{"«"}</button>
                      <button disabled={!canPreviousPage} onClick={previousPage} className={`w-8 pb-1  border-black border-2 rounded-md font-bold text-xl ${!canPreviousPage && 'bg-zinc-500 cursor-default'}`}>{"‹"}</button>
                      <span className=" font-semibold">{pageIndex + 1} of {pageCount}</span>
                      <button disabled={!canNextPage} onClick={nextPage} className={` w-8 pb-1  border-black border-2 rounded-md font-bold text-xl ${!canNextPage && 'bg-zinc-500 cursor-default'}`}>{"›"}</button>
                      <button disabled={pageIndex === pageCount-1} onClick={() => gotoPage(pageCount-1)} className="border-black border-2 rounded-md font-bold text-xl w-8 pb-1 ">{"»"}</button>
                    </div>
                </div>
                {orderPopupItem && <OrderPopup order={orderPopupItem} setOrderPopupItem={setOrderPopupItem}/>}
            </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderManagement;
