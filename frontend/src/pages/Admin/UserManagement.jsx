import React, { useEffect, useMemo, useState } from 'react'
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { axiosInstance } from '../../Api_calls/API';
import { getDate } from '../../assets/formatter';
import AdminNavbar from '../../Components/Admin/AdminNavbar';
import {useTable, useSortBy, usePagination} from 'react-table';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  useEffect(()=> {
    const getAllUsers = async () => {
      try{
        const res = await axiosInstance.get("/api/users/all");
        console.log("Users : ", res);
        setUsers(res.data?.users);
      }catch(err){
        console.log("Error at Users page ", err);
      }
    }
    getAllUsers();
  },[]);

  const columns = useMemo(() => [
    {
      Header: "User Id",
      accessor: "id",
      disableSortBy: true
    },
    {
      Header: "User Name",
      accessor: "user_name"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Role",
      accessor: "isAdmin",
      // Cell : ({value}) => (value ? "Admin" : "User")
      Cell: ({ row, value }) => (
        <select
          className='px-2 py-1 cursor-pointer' 
          onChange={(e) => saveAction(e,row.original.id, e.target.value)}
        >
          <option value="true" selected={value}>Admin</option>
          <option value="false" selected={!value}>User</option>
        </select>
      )
    },
    {
      Header: "Joined Date",
      accessor: "createdAt",
      Cell : ({value}) => getDate(new Date(value))  // Format date
    },
    {
      Header: "Actions",
      accessor: "Actions",
      Cell: ({ row }) => (
        <span 
          className='text-red-500 cursor-pointer' 
          onClick={(e) => deleteAction(e,row.original.id)}
        >
          Delete
        </span>
      ),
      disableSortBy: true
    },
  ], []);

  const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canPreviousPage, canNextPage, state:{pageIndex}, pageCount, gotoPage} = useTable({
      columns,
      data: users,
      initialState: {pageSize: 8},
  }, useSortBy, usePagination);

  const saveAction = async (e, id, value) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.put(`/api/users/${id}`, {isAdmin: value});
      console.log("Response at isAdmin: ", response);
      alert("User role updated successfully");
    }catch(err){
      console.log("Error save isAdmin: ", err);
    }
  }
  const deleteAction = async (e, id) => {
    e.preventDefault();
    alert("deleting...");
    try{
      const response = await axiosInstance.delete(`/api/users/${id}`);
      alert(response.data?.message);
      setUsers(users => users.filter(user => user.id !== id));
    }catch(err){
      console.log("Error save delete user: ", err);
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
        <div className='flex-1 p-1'>
                <div className='font-bold text-3xl p-4'>User Management</div>
                <div>
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
                        {/* <tr>
                            <th>User Id</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr> */}
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
                          // users.map(user => {
                          // return (
                          //     <tr key={user?.id}>
                          //       <td>{user?.id}</td>
                          //       <td>{user?.user_name}</td>
                          //       <td>{user?.email}</td>
                          //       <td>
                          //         <select className='px-2 py-1 cursor-pointer' onChange={(e) => saveAction(user?.id,e.target.value)}>
                          //           <option value="admin" selected={user?.isAdmin}>Admin</option>
                          //           <option value="user" selected={!user?.isAdmin}>User</option>
                          //         </select>
                          //       </td>
                          //       <td>{getDate(new Date(user?.createdAt))}</td>
                          //       <td className='cursor-pointer'>
                          //         <span className='text-red-500' onClick={() => deleteAction(user?.id)}>Delete</span>
                          //       </td>
                          //     </tr>
                          // )
                          // })
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
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UserManagement;
