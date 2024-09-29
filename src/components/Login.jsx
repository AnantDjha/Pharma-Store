import axios from "axios"
import "./Login.css"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { userContext } from "../context/UserContext"
export default function Login() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm()
    const { user, setUser } = useContext(userContext)
    const [temp, setTemp] = useState(null)
    const onSubmit = (data) => {
        axios.defaults.withCredentials = true
        axios.post("https://backendofmedify.onrender.com/login", data, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            withCredentials: true
        })
            .then((response) => {

                setTemp(response.data)
                if (response.data.message == "succesfull") {
                    localStorage.setItem("token", response.data.token)
                    setUser(response.data.user)
                    navigate("/")
                }
            })
            .catch((e) => {
                console.log(e);
                setTemp({completed:false , message:"Something went wrong"})
            })
    }
    return (
        <div className="main-login">
      {temp && <p style={{width:"100%" ,maxWidth:"400px", padding:"0.5rem 0" , textAlign:"center" , color:"white", margin:"1rem 0" , borderRadius:"5px" , backgroundColor:"#32aeb1"}}>{temp.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <p>Enter Your Email</p>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="field">
          <p>Password</p>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <input type="submit" value="Submit" disabled={isSubmitting} />
      </form>

      <div className="navi">
        <span>Dont't have an Account?</span> <Link to="/register" >Register</Link>
        <p>If you are loged out and dont want to register than simply visit home page and refresh</p>
      </div>
    </div>

    )
}