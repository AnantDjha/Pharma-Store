import axios from "axios";
import "./Login.css";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const [temp, setTemp] = useState(null);

  const onSubmit = (data) => {
    axios.defaults.withCredentials = true;
    axios
      .post("https://backendofmedify.onrender.com/register", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        withCredentials: true,
      })
      .then((response) => {
        setTemp(response.data);
      })
      .catch((e) => {
        console.log(e);
        setTemp({ completed: false, message: "Something went wrong" });
      });
  };

  return (
    <div className="main-login">
     {temp && <p style={{width:"100%" ,maxWidth:"400px", padding:"0.5rem 0" , textAlign:"center" , color:"white", margin:"1rem 0" , borderRadius:"5px" , backgroundColor:"#32aeb1"}}>{temp.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <p>Enter Your Name</p>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="field">
          <p>Enter Your Email</p>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="field">
          <p>Create Password</p>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <input type="submit" value="Submit" disabled={isSubmitting} />
      </form>

      <div className="navi">
        <span>Already have an Account?</span> <Link to="/login" >Login</Link>
      </div>
    </div>
  );
}
