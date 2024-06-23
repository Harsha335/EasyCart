import React, { useEffect, useMemo, useState } from 'react'
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { axiosInstance } from '../../Api_calls/API';
import AdminNavbar from '../../Components/Admin/AdminNavbar';
import {useTable, useSortBy, usePagination} from 'react-table';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ProductPopup from '../../Components/ProductPopup';

const ProjectManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [categories, setCategories] = useState({});
  useEffect(()=> {
    const getAllProducts = async () => {
      try{
        const res = await axiosInstance.get("/api/product/allProducts");
        console.log("Products : ", res.data?.products);
        setProducts(res.data?.products);
        setSearchedProducts(res.data?.products);
      }catch(err){
        console.log("Error at Products getting in products management ", err);
      }
    }
    const getCategory = async () => {
      try{
        const res = await axiosInstance.get("/api/product/all-categories");
        const data = res.data;
        const categoryValues = {};
        for(const category of data)
        {
          categoryValues[category._id] = category.title;
        }
        setCategories(categoryValues);
      }catch(err){
        console.log("Error at Category getting in products management ", err);
      }
    }
    getAllProducts();
    getCategory();
  },[]);

  const [productPopupItem, setProductPopupItem] = useState(null);
  const productPopupActivate = (product) => {
    setProductPopupItem(product);
  }

  useEffect(() => {
    const debounceFunc = setTimeout(() => {
      const currProducts = products.filter(product => product.title.toLowerCase().includes(searchText.toLowerCase()));
      setSearchedProducts(currProducts);
    },500); // milli sec.
    return () => clearTimeout(debounceFunc);
  },[products, searchText]);

// _id(optional),image_url[0],title,categoryId(optional),categoryTitle,quantity,price,discount,rating
  const columns = useMemo(() => [
    {
      Header: "Product Id",
      accessor: "_id",
      disableSortBy: true
    },
    {
      Header: "Image",
      accessor: "image_url",
      Cell: ({value}) => <img src={value} width="40px"/>,
      disableSortBy: true
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: ({value}) => (
        <div className='max-w-[15rem]'>{value}</div>
      )
    },
    {
      Header: "Category",
      accessor: "categoryTitle",
      Cell: ({value}) => (
        <div className='w-[5.5rem]'>{value}</div>
      )
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      Cell: ({value}) => (
        <div className='w-20'>{value}</div>
      )
    },
    {
      Header: "Price (₹)",
      accessor: "price",
      Cell: ({value}) => (
        <div className='w-20'>{value}</div>
      )
    },
    {
      Header: "Discount (%)",
      accessor: "discount",
      Cell: ({value}) => (
        <div className='w-20'>{value}</div>
      )
    },
    {
      Header: "Rating",
      accessor: "rating",
      Cell: ({value}) => (
        <div className='w-20'>{value?.toFixed(2)}</div>
      )
    },
    // {
    //   Header: "Action",
    //   accessor: "Action",
    //   Cell: ({ row }) => (
    //     <span 
    //       className='group cursor-pointer flex items-center justify-center relative' 
    //     >
    //       { row.original._id === enableEditId ?
    //         <span className='text-green-500'>Save</span>
    //         :
    //         <span>
    //           <span className='font-semibold text-xl '>:</span>
    //           <div className='absolute right-8 top-0  hidden group-hover:flex flex-col w-24 gap-1 bg-white border-2 border-black rounded-md'>
    //             <span  className='cursor-pointer text-blue-500 flex items-center justify-center' onClick={(e) => editAction(e,row.original._id)}>Edit</span>
    //             <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-black to-transparent'></div>
    //             <span className='cursor-pointer text-red-500 flex items-center justify-center' onClick={(e) => deleteAction(e,row.original._id)}>Delete</span>
    //           </div>
    //         </span>
    //       }
    //     </span>
    //   ),
    //   disableSortBy: true
    // },
  ], []);

  const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canPreviousPage, canNextPage, state:{pageIndex}, pageCount, gotoPage} = useTable({
      columns,
      data: searchedProducts,
      initialState: {pageSize: 5},
  }, useSortBy, usePagination);

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
        <div className='flex-1 flex flex-col gap-3 p-1'>
          <div className='font-bold text-3xl p-4'>Products Management</div>
          {/* SEARCH USING DEBOUNCING */}
          <div className='w-full'>
            <input type='text' placeholder='Search...' value={searchText} onChange={e => setSearchText(e.target.value)} className='border-2 border-black rounded-md px-2 py-1 w-96'/>
          </div>

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
                              <span>
                              </span>{header.isSorted && <span className='absolute top-6 right-3'>{header.isSortedDesc ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</span>}
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
                        <tr {...row.getRowProps()} className='cursor-pointer' onClick={() => productPopupActivate(row.original)}>
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
          {productPopupItem && <ProductPopup product={productPopupItem} categories={categories} setProductPopupItem={setProductPopupItem} setProducts={setProducts}/>}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProjectManagement;
