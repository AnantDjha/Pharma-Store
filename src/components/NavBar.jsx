import "./NavBar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartFlatbed, faCartShopping, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { userContext } from "../context/UserContext"
import axios from "axios"
import { faCartFlatbedSuitcase } from "@fortawesome/free-solid-svg-icons/faCartFlatbedSuitcase"
import { productContext } from "../context/ProductContext"


export default function NavBar()
{
    const [prod,setProd] = useState([])
    const navigate = useNavigate()
    const { length, setLength } = useContext(productContext);

    const menuRef = useRef();
    const {user,setUser} = useContext(userContext)

    const andarLe = ()=>{
        menuRef.current.className = "linksToMove"
    }

    useEffect(()=>{
        if(!user)
            {
                return
            }
        if(!user.valid)
            {
                
                let list = JSON.parse(localStorage.getItem("cartItems") || "[]")
                // console.log(list);
                        setProd(list)
            }
        else
       { axios.defaults.withCredentials = true;
        axios.post("http://localhost:5000/getCart", { email: user.value.email },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("token")

                }
            }
        )
            .then((response) => {
                let list = response.data
                localStorage.setItem("cartItems",JSON.stringify(list))
                setLength(list)

            })
            .catch((e) => {
                console.log(e);
            })}
    },[])

    return (
        <div className="mainNav">
            <nav>
                <div className="brandName">
                <FontAwesomeIcon className="menu" icon={faBars} onClick={()=>{
                    menuRef.current.className = "linksToMove insideOut"
                }} />
                    <span>MEDIFY</span>
                </div>

                <div className="linksToMove" ref={menuRef}>
                    <p>MEDIFY <FontAwesomeIcon icon={faMultiply} onClick={()=>{
                    menuRef.current.className = "linksToMove"
                }} /></p>
                <ul>
                    <Link to="/"  onClick={andarLe}><li>Home</li></Link>
                    <Link to = "/products" onClick={andarLe}><li>Products</li></Link>
                    <Link to = "https://en.wikipedia.org/wiki/Pharmacy_(shop)" target="_blank" onClick={andarLe}><li>About</li></Link>
                    <Link to = "/orders" onClick={andarLe}><li>My Orders</li></Link>
                </ul>
                <div className="login">
                    <Link onClick={()=>{
                      localStorage.setItem("token" , "abc");
                      andarLe()
                      navigate("/login")
                      setLength([])
                      
                    }} >{user && (user.valid && user.value.email == "anantjha0112@gmail.com" ? "Login" : "Logout")}</Link>
                </div>
                </div>
                

                <div className="cart">
                    <Link to="/cart"><FontAwesomeIcon icon={faCartShopping} style={{color:"white",fontSize:"20px"}}/><b>{length.length}</b></Link>
                </div>
            </nav>
        </div>
    )
}