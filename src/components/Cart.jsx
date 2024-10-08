import { productContext } from "../context/ProductContext";
import "./Cart.css"
import { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faDownLeftAndUpRightToCenter, faDumpster, faHandsAmericanSignLanguageInterpreting, faRemove, faRemoveFormat, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { userContext } from "../context/UserContext";
import axios from "axios";
import { products } from "./product";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import emptyCart from "../assets/emptyCart.png"


export default function Cart() {

    // const { products, setProducts } = useContext(productContext);
    const { user, setUser } = useContext(userContext)
    const [prod, setProd] = useState([])
    const [cartProduct, setCart] = useState([]);
    const [price, setPrice] = useState([])
    const navigate = useNavigate()
    const [loadingDec , setLoadingDec] = useState(-1)
    const [loadingInc , setLoadingInc] = useState(-1)
    const [loading , setLoading] = useState(false)
    const {length , setLength} = useContext(productContext)


    const fetcher = ()=>{
        
        if( user && !user.valid)
            {
                let list = JSON.parse(localStorage.getItem("cartItems") || "[]")
                // console.log(list);
                        setProd(list)

                
                const updatedCart = list.map(element => {
    
                    return products.find(a => a.id === element.id);
                }).filter(item => item !== undefined); // Filter out undefined items if any product is not found
    
                setCart(updatedCart);

            }
        else if(user && user.valid){

        
        axios.defaults.withCredentials = true;
        axios.post("https://backendofmedify.onrender.com/getCart", { email: user.value.email },
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
                setLength(list);
                setProd(list)

                const updatedCart = list.map(element => {
    
                    return products.find(a => a.id === element.id);
                }).filter(item => item !== undefined); // Filter out undefined items if any product is not found
    
                setCart(updatedCart);
                
              
            })
            .catch((e) => {
                console.log(e);
            })
        }
    }
    useEffect(() => {
        if(!user)
            {
                navigate("/");
                navigate("/cart")
                
            }

        fetcher()
    }, [user]);

 

    useEffect(()=>{
       
        let getPrice = 0;
        prod.forEach(e =>{
            getPrice = getPrice + (products.find(a => a.id == e.id).price * e.quantity)
        })
        setPrice(getPrice)
    },[prod])


    const handleIncrease = (itemId)=>{

        if(!user.valid) return

        setLoadingInc(itemId)
        axios.defaults.withCredentials = true;
        axios.post("https://backendofmedify.onrender.com/increaseQuantity", {email:user.value.email , id:itemId},
           { headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("token")

            }}
        )
        .then((response)=>{
            fetcher()
            setLoadingInc(-1)
        })
        .catch((e)=>{
            setLoadingInc(-1)
            console.log(e);
        })

    }

    const handleDecrease = (itemId)=>{
        if(!user.valid) return

        setLoadingDec(itemId)
        axios.defaults.withCredentials = true;
        axios.post("https://backendofmedify.onrender.com/decreaseQuantity", {email:user.value.email , id:itemId},
           { headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("token")

            }}
        )
        .then((response)=>{
            fetcher()
            setLoadingDec(-1)
        })
        .catch((e)=>{
            setLoadingDec(-1)
            console.log(e);
        })
    }

    const handleRemove = (itemId)=>{

        setLoading(true)
        if(!user.valid) return
        axios.defaults.withCredentials = true;
        axios.post("https://backendofmedify.onrender.com/remove", {email:user.value.email , id:itemId},
           { headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("token")

            }}
        )
        .then((response)=>{
            fetcher()
            setLoading(false)
        })
        .catch((e)=>{
            setLoading(false)
            console.log(e);
        })
    }


    if (cartProduct.length == 0) {
        return (
            <div className="cartEmpty" style={{ height: "100vh", width: "100vw", backgroundColor: "#F8F8F8" ,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <img src={emptyCart} alt="" />
                <button className="btnAddMore" onClick={()=>{
                    navigate("/")
                }}>ADD PRODUCTS</button>
            </div>
        )
    }

        return (
            loading ? <div className="loading">
                <div ></div>
            </div> :
            <div className="mainCart">
                <h3>Order Summary</h3>
                <div className="cartContent">
                    <div className="itemSummary">
                        <p><b>Products</b></p>
                        <div className="item">
                            {cartProduct.map((item , i) => {
                                return (<div className="itemBoxCart" key={item.id}>
                                    <div className="temper">
                                       <img src={item.url} alt="" />
                                        <Link to = {`/productDetail/${item.id}`} className="itemDetailCart" style={{color:"black", textDecoration:"none"}}>
                                            <h4>{item.name} - {item.quantity}</h4>
                                            <span >{item.detail}</span>
                                            <h3>₹ {item.price}</h3>
                                            <span><i>save {item.discount}</i></span>
                                            <h5>Delevery within two days</h5>
                                        </Link>
                                    </div>
                                    <div className="buttonToIncrease">

                                        <FontAwesomeIcon icon={faTrashAlt} onClick={()=>{handleRemove(item.id)}} style={{cursor:"pointer"}}/>

                                        <div className="buttons">
                                            <button onClick={()=>{
                                                if(prod.find(a => a.id == item.id).quantity >1)
                                                    {
                                                        handleDecrease(item.id)

                                                    }
                                                    else{
                                                        handleRemove(item.id)
                                                    }
                                                }} className={loadingDec == item.id ? "loader" :""}>-</button>
                                            <b>{prod.find(a => a.id == item.id).quantity}</b>
                                            <button  onClick={()=>{handleIncrease(item.id)}} className={loadingInc == item.id ? "loader" :""}>+</button>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                        <p className="ulta" onClick={()=>{
                            navigate("/products")
                        }}><b>Add more product</b><b style={{marginRight:"1rem"}}>+</b></p>
                    </div>
                    <div className="priceSummary">
                        <div className="priceDetail">
                            <h5>PAYMENT DETAIL</h5>
                            <ul>
                                <li><b>MRP Total</b> <span>₹ {(price + (12/100)*price).toFixed(2)}</span></li>
                                <li><b>Additional Discount</b> <span>₹ {((12/100)*price).toFixed(2)}</span></li>
                                <li><b>Total Amount</b> <span>₹ {price.toFixed(2)}</span></li>
                                <li><b>Shiping/ Delivery charge</b> <span>₹ 0.00</span></li>
                            </ul>

                            <p ><b>Total Payable</b><span style={{fontWeight:"bold"}}>₹ {price.toFixed(2)}</span></p>

                            <span><p><i>Payable amount</i><b>₹{price.toFixed(2)}</b></p> <Link to={user && user.valid ? "/payment":"/login"} state={{price,cartProduct,prod}}>Proceed</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


