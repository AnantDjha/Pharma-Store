import "./ProductDetail.css"
import { useNavigate, useParams } from "react-router-dom"
import { products } from "./product.js";
import { useContext, useState, useEffect, useRef } from "react";
import { productContext } from "../context/ProductContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import wellnesImg from "../assets/placeholder.svg"
import { faCheckCircle, faLaptopMedical } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { userContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductDetail() {

    const [isInCart, setIsInCart] = useState(JSON.parse(localStorage.getItem("cartItems") || "[]"))
    const { user, setUser } = useContext(userContext)
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false)
    const [reRender , setRerender] = useState(true)

    const addToCart = () => {
        
        setLoading(true)
        axios.defaults.withCredentials = true;
        axios.post("https://backendofmedify.onrender.com/cart", { email: user.value?.email, id: parseInt(param.id), quantity: 1 }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("token")
            },
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.message == "succesfull") {

                    setLoading(false)
                    navigate("/cart");
                    navigate(-1)
                    setRerender(!reRender)
                }

            })
            .catch((e) => {
                alert("something went wrong")
                setLoading(false)
            })


    }

    const param = useParams();
    const [paramProduct, setParamProduct] = useState(null)
    const handleAdd = () => {
        const paramId = parseInt(param.id, 10);
        const list = JSON.parse(localStorage.getItem("cartItems") || '[]');

        if (list.length == 0) {
            localStorage.setItem("cartItems", JSON.stringify([{ id: paramId, quantity: 1 }]));
        } else if (list.find(a => a.id === paramId)) {
            navigate("/cart")
            return;
        } else {
            list.push({ id: paramId, quantity: 1 });
            localStorage.setItem("cartItems", JSON.stringify(list));
        }
        navigate("/cart")
        navigate(-1)
        // setRerender(!reRender)

    };

    
    useEffect(() => {
        setParamProduct(products.find(a => a.id === parseInt(param.id)))
    }, [])

    // useEffect(()=>{
    //     axios.defaults.withCredentials = true;
    //     axios.post("https://backendofmedify.onrender.com/getCart", { email: user.value?.email },
    //         {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization" : "Bearer " + localStorage.getItem("token")

    //             }
    //         }
    //     )
    //         .then((response) => {
    //             let list = response.data
    //             localStorage.setItem("cartItems",JSON.stringify(list))
    //             isInCart(list)

    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         })
    //     }, [reRender])

    return (
        !paramProduct || loading ? (
           <div className="loading">
                <div ></div>
            </div> 
        ) : (
            <div className="mainDetail">
                <div className="detailBox">
                    <h5 className="absoluter">Medify:{">" + paramProduct.name + " - " + paramProduct.quantity}</h5>
                    <div className="image">
                        <LazyLoadImage src={paramProduct.url} alt={"loading......"} effect="blur" placeholderSrc={wellnesImg} />
                    </div>
                    <div className="text">
                        <h2>{paramProduct.name} - {paramProduct.quantity}</h2>
                        <span className="tagHai">{paramProduct.tag[0]}</span>
                        <h4>{paramProduct.detail}</h4>

                        <p><b>Brand: </b>{paramProduct.brand}</p>

                        <h1>
                            ₹ {paramProduct.price} <span>M.R.P</span>
                        </h1>

                        <p id="discount"> <i>Get upto </i> {paramProduct.discount}</p>
                        <p>{paramProduct.star.map((starP, j) => {
                            if (starP === 1) {
                                return (

                                    <span key={j}><i className="fa fa-star fa-sm"></i></span>
                                )
                            }
                            else if (starP === 0) {
                                return (

                                    <span key={j}><i className="fa fa-star-half-o fa-sm"></i></span>
                                )
                            }
                            else {
                                return (

                                    <span key={j}><i className="fa fa-star-o fa-sm"></i></span>
                                )
                            }
                        })}</p>

                        <h3>About this product</h3>
                        <ul>
                            {paramProduct.about.map((q, i) => {
                                return <li key={i}> {q}</li>
                            })}
                        </ul>

                        <button onClick={() => {
                            if (!user.valid) {
                                handleAdd()
                            }
                            else {
                                addToCart()
                            }
                        }
                        } disabled = {isInCart.find(b => b.id === paramProduct.id) != null}>{isInCart.find(b => b.id === paramProduct.id) ? <b><FontAwesomeIcon icon={faCheckCircle} style={{color:"green"}}/> Added to Cart</b> : "Add to cart"}</button>
                    </div>
                </div>
            </div>
        )




    )
}