import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Customer = () => {
  const [Products, setProducts] = useState([]);
  const location = useLocation();
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:5000/api";

  useEffect(() => {
    const fecthAllProducts = async () => {
      try {
        // Send a POST request to the login route with the customer's credentials
        await axios.post("http://localhost:8080/login", location.state.CustomerUser);
        // Send a GET request to the getAllProducts route
        const res = await axios.get("http://localhost:8080/customers/getAllProducts");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fecthAllProducts();
  }, [location.state.CustomerUser]);

  return (
    <div>
      <h1>Product Details </h1>
      <div className="products">
        {Products.map((product) => (
          <div className="product" key={product.product_id}>
            <img src= {`http://localhost:8080/images/${product.image}`} alt=""/>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span>{product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer