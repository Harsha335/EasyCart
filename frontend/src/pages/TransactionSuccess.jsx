import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { Link } from 'react-router-dom'
import Confetti from 'react-confetti'

const TransactionSuccess = () => {
  const width = window.innerWidth || 300;
  const height = window.innerHeight || 700;
  return (
    <>
        <Confetti width={width-1} height={height-1} numberOfPieces={200}/>
        <Navbar/>
        <div className={`w-full h-full flex flex-col items-center justify-center gap-3`}>
            <span className='text-4xl font-semibold'>Transaction is Successful</span>
            <Link to="/orders" className='border-solid border-2 border-black p-3 bg-orange-600 text-white cursor-pointer hover:text-[1.09em] transition-all duration-200 ease-out '>View all Orders</Link> 
        </div>
        <Footer/>
    </>
  )
}

export default TransactionSuccess
