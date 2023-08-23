import logo from '../Image/lazadaLogo.png';
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [Customer,setCustomers] = useState(
        {
          username: "",
          password:"",
        }
      );
    
      const navigate = useNavigate()
    
      const handleChange = (e) =>{
        setCustomers(prev=>({...prev, [e.target.name]: e.target.value }));
      };
    
      const handleClick = async e =>{
        e.preventDefault()
        try {
          const res = await axios.post("http://localhost:8080/login", Customer);
          if (res.data.role === "customer"){
            navigate("/Customer")
          } else if (res.data.role === "seller"){
            navigate("/Seller")
          } else if (res.data.role === "warehouse_admin"){
            navigate("/WarehouseAdmin")
          }
        } catch (error) {
          console.log(error)
        }
      }
  return (
    <h1 className="header">
        WELCOME TO LAZADA &nbsp;
        <img src={logo} height={50} width={50} alt='LazadaLogo'/>
        <div className="form-container">
    <form className='register-form'>
      <h1 className='reg-header'>Welcome to Lazada! Please login.</h1>
      <input type="text" placeholder= "username" name="username" onChange ={handleChange} style={{height: "30px"}}/>
      <input type="text" placeholder = "password" name="password" onChange ={handleChange} style={{height: "30px"}}/>
      <button className= "formButton" onClick={handleClick}>Login</button>
      <button className="LinkBtn"><Link to ="/register">New member? Register here</Link></button>
    </form>
    </div>
    </h1>
  )
}

export default Login