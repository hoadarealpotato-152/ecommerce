import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPInput from "./pages/OTPInput";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPass from "./pages/ResetPass";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CommonBreadcrumb from "./components/breadcrumb/Breadcrumb";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import ReturnPolicy from "./pages/ReturnPolicy";
import WarrantyPolicy from "./pages/WarrantyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="size-full bg-white min-h-96">
        <CommonBreadcrumb />
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/verifyCodeInput" element={<OTPInput />}></Route>
          <Route path="/forgotPass" element={<ForgotPassword />}></Route>
          <Route path="/resetPass" element={<ResetPass />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/book/:id" element={<BookDetail />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route
            path="/dieu-khoan-su-dung"
            element={<TermsOfService />}
          ></Route>
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />}></Route>
          <Route path="/gioi-thieu" element={<AboutUs />}></Route>
          <Route
            path="/chinh-sach-doi-tra-hoan-tien"
            element={<ReturnPolicy />}
          ></Route>
          <Route
            path="/chinh-sach-bao-hanh"
            element={<WarrantyPolicy />}
          ></Route>
          <Route
            path="/chinh-sach-van-chuyen"
            element={<ShippingPolicy />}
          ></Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
