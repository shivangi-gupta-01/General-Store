import Category from "./components/administrator/Category";
import Company from "./components/administrator/Company";
import DisplayAllCategories from "./components/administrator/DisplayAllCategories";
import DisplayAllCompanies from "./components/administrator/DisplayAllCompanies";
import Product from "./components/administrator/Product"
import DisplayAllProducts from "./components/administrator/DisplayAllProducts";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import AdminLogin from "./components/administrator/AdminLogin";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Company/>} path={"/company"}/>
          <Route element={<DisplayAllCompanies/>} path={"/displayallcompanies"}/>
          <Route element={<Category/>} path={"/category"}/>
          <Route element={<DisplayAllCategories/>} path={"/displayallcategories"}/>
          <Route element={<Product/>} path={"/product"}></Route>
          <Route element={<DisplayAllProducts/>} path={"/displayallproducts"}></Route>
          <Route element={<AdminLogin/>} path={"/adminlogin"}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
