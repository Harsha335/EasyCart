import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import AdminNavbar from "../../Components/Admin/AdminNavbar";

const OrderManagement = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col lg:flex-row">
        <AdminNavbar/>
        <div>
          orders management
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderManagement;
