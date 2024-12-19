import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Orders from './pages/Orders';
import UploadProduct from './pages/UploadProduct';
import ProductDetail from './pages/ProductDetail';
import MyAccount from './pages/MyAccount';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ViewProfile from './pages/ViewProfile';
import MyPurchase from './pages/Cart';
import NotFound from './pages/NotFound';
import Transactions from './pages/Transactions';
import SellerHistory from './pages/SellerHistory';
import BuyerHistory from './pages/BuyerHistory';
import Cart from './pages/Cart';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoutes from './components/ProtectedRoutes';
import MyProducts from './pages/MyProduct';
import CheckLogIn from './components/CheckLogIn';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
           <Route path="/signup" element={<CheckLogIn><Signup /></CheckLogIn>} />
          <Route path="/login" element={<CheckLogIn><Login /></CheckLogIn>} />
          <Route path="/" element={<CheckLogIn><Welcome /></CheckLogIn>} />

          <Route path='/home' element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
          <Route path="/sell-product" element={<ProtectedRoutes><UploadProduct /></ProtectedRoutes>} />
          <Route path="/orders" element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
          <Route path="/:productname/:productId" element={<ProtectedRoutes><ProductDetail /></ProtectedRoutes>} />
          <Route path="/my-account" element={<ProtectedRoutes><MyAccount /></ProtectedRoutes>} />
          <Route path="/cart" element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
          <Route path="/myProducts" element={<ProtectedRoutes><MyProducts /></ProtectedRoutes>} />
          <Route path="/transaction" element={<ProtectedRoutes><Transactions /></ProtectedRoutes>} />
          <Route path="/buyerhistory" element={<ProtectedRoutes><BuyerHistory /></ProtectedRoutes>} />
          <Route path="/sellerhistory" element={<ProtectedRoutes><SellerHistory /></ProtectedRoutes>} />

          <Route path='/ViewProfile/:ViewName/:userId' element={<ProtectedRoutes><ViewProfile /></ProtectedRoutes>} />


          
          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
