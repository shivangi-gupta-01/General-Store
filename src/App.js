import Category from "./components/administrator/Category";
import Company from "./components/administrator/Company";
import DisplayAllCompanies from "./components/administrator/DisplayAllCompanies";
import Product from "./components/administrator/Product"
import DisplayAllProducts from "./components/administrator/DisplayAllProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/administrator/AdminLogin";
import ListProducts from "./components/administrator/ListProducts"
import DashBoard from "./components/administrator/DashBoard";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Company />} path={"/company"} />
          <Route element={<DisplayAllCompanies />} path={"/displayallcompanies"} />
          <Route element={<Category />} path={"/category"} />
          <Route element={<Product />} path={"/product"}></Route>
          <Route element={<DisplayAllProducts />} path={"/displayallproducts"}></Route>
          <Route element={<AdminLogin />} path={"/adminlogin"} />
          <Route element={<ListProducts />} path={"/listproducts"} />
          <Route element={<DashBoard />} path={"/dashboard/*"} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
