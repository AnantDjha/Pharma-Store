import { useEffect, useState, useContext } from 'react';
import NavBar from './components/NavBar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Product from "./components/Product"
import Search from './components/Search';
import Tags from './components/Tags';
import ProductDetail from './components/ProductDetail';
import { productContext } from './context/ProductContext';
import axios from 'axios';
import Cart from './components/Cart';
import { userContext } from './context/UserContext';
import Login from './components/Login';
import Payment from './components/Payment';
import CompletePayment from './components/CompletePayment';
import Orders from './components/Orders';
import OrderDetail from './components/OrderDetail';
import Register from './components/Register';

function App() {
  const { length, setLength } = useContext(productContext);
  const { user, setUser } = useContext(userContext)
  const [prod, setProd] = useState([]);




  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "")
    }
    axios.defaults.withCredentials = true
    axios.get("http://localhost:5000/user", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then((res) => {
        if (res.data.token)
          localStorage.setItem("token", res.data.token)
        setUser(res.data);
      })
      .catch((e) => {
        setUser({ valid: false })
        console.log(e);
      });
  }, [])

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.post("http://localhost:5000/getCart", { email: user?.value?.email },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")

        }
      }
    )
      .then((response) => {
        let list = response.data
        localStorage.setItem("cartItems", JSON.stringify(list))
        setLength(list)

      })
      .catch((e) => {
        console.log(e);
      })
  } , [user])

  const router = createBrowserRouter([
    { path: "/", element: <><Home /><Search /><NavBar /></> },
    { path: "/products/:value", element: <><Tags /><Product /><Search /><NavBar /></> },
    { path: "/products", element: <><Tags /><Product /><Search /><NavBar /></> },
    { path: "/productdetail/:id", element: <><ProductDetail value={{ prod, setProd }} /><Search /><NavBar /></> },
    { path: "/cart", element: <><Cart value={{ prod, setProd }} /><Search /><NavBar /></> },
    { path: "/login", element: <><Login /><NavBar /></> },
    { path: "/payment", element: <><Payment /></> },
    { path: "/completePayment", element: <><Payment /><CompletePayment /></> },
    { path: "/orders", element: <><Orders /><Search /><NavBar /></> },
    { path: "/order-detail/:id", element: <><OrderDetail /><Search /><NavBar /></> },
    { path: "/register", element: <><Register /><NavBar /></> },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;


// http://localhost:5000