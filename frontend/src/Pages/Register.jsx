import logo from '../Image/lazadaLogo.png';
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
  
const Register = () => {
  const [Customer,setCustomers] = useState(
    {
      username: "",
      email:"",
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
      await axios.post("http://localhost:8080/customers/register", Customer)
      navigate("/login")
      console.log(Customer)
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
      <h1 className='reg-header'>Create Your Lazada Account</h1>
      <input type="text" placeholder= "username" name="username" onChange ={handleChange} style={{height: "30px"}}/>
      <input type="text" placeholder= "email" name="email" onChange ={handleChange} style={{height: "30px"}}/>
      <input type="text" placeholder = "password" name="password" onChange ={handleChange} style={{height: "30px"}}/>
      <button className= "formButton" onClick={handleClick} >Sign Up</button>
      <button className="LinkBtn">Register As Seller ? Click here</button>
      <button className="LinkBtn">Register As AdminWH ? Click here</button>
      <button className="LinkBtn"> <Link to = {'/login'}>Already member? Login here</Link></button>
    </form>
    </div>
    </h1>
  )
}

export default Register