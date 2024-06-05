import Home from "./pages/Home";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllProducts from "./pages/AllProducts";
import Product from "./pages/Product";
import AddProduct from "./pages/AddProduct";
// import { useEffect, useState } from "react";
// import { auth } from "./assets/firebase";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import Category from "./pages/Category";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import WishList from "./pages/WishList";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          <Route exact path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>  {/* TODO : CHANGE THE PROTECTED ROUTE */}
          <Route exact path="/login" element={<Login/>}/> {/* user!=null ?<Navigate to="/"/>: */}
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/products" element={<ProtectedRoute><AllProducts/></ProtectedRoute>}/>
          <Route exact path="/wishList" element={<ProtectedRoute><WishList/></ProtectedRoute>}/>
          <Route exact path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>
          <Route exact path="/category/:categoryId" element={<ProtectedRoute><Category/></ProtectedRoute>}/>
          <Route exact path="/products/:productId" element={<ProtectedRoute><Product/></ProtectedRoute>}/>
          <Route exact path="/admin/add-product" element={<ProtectedAdminRoute><AddProduct/></ProtectedAdminRoute>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
