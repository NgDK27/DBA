import Customer from './Pages/Customer';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Seller from './Pages/Seller';
import WarehouseAdmin from './Pages/WarehouseAdmin';
import "./style.css"
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/customer" element ={<Customer/>}/>
        <Route path="/seller" element ={<Seller/>}/>
        <Route path="/customer" element ={<WarehouseAdmin/>}/>
        <Route path="/register" element ={<Register/>}/>
        <Route path="/login" element ={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
