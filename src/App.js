import Category from "./components/administrator/Category";
import Company from "./components/administrator/Company";
import DisplayAllCompanies from "./components/administrator/DisplayAllCompanies";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Company/>} path={"/company"}/>
          <Route element={<DisplayAllCompanies/>} path={"/displayallcompanies"}/>
          <Route element={<Category/>} path={"/category"}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
