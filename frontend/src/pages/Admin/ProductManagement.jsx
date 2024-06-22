import React from 'react'
import Navbar from '../../Components/Navbar';
import AdminNavbar from '../../Components/Admin/AdminNavbar';
import Footer from '../../Components/Footer';

const ProductManagement = () => {
  return (
    <>
      <Navbar/>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <AdminNavbar/>
        <div>
          products management
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ProductManagement
