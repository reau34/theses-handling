import React, { useState, useContext, useEffect } from "react"
import "./../css/login.css"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import { LoginContext } from "./LoginContext"

export default function LoginForm(){
    const[email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const[loginMsg,setLoginMsg]=useState("")
    const {user,setUser,setReservation,setAuth,setRole,role,auth}=useContext(LoginContext)
    let navigate = useNavigate()

    const login =()=>{
        Axios.post("http://localhost:3001/login",{email:email,password:password}).then((response)=>{
            if(response.data.msg){
                setLoginMsg(response.data.msg)
            }else{
                setLoginMsg("Pomyślnie zalogowano")
                setUser(response.data.result)
                setRole(response.data.result[0].role)
                setAuth(true)
                Axios.post("http://localhost:3001/havethesis",{id:response.data.result[0].iduser}).then((response)=>{
                    if(response.data.length===0){
                        setReservation(false)
                    }else{
                        setReservation(true)
                    }
                })

                navigate("/home")

            }
        })
    }
    useEffect(()=>{
        if(auth){
            navigate("/home")
        }
    },[loginMsg])
    return(
        <div>
            <div className="login-content">
                <h1>Logowanie</h1>
            </div>
            <div className="center">
                <input type="text" placeholder="E-mail" onChange={(e)=>{
                    setEmail(e.target.value);
                }}/>
            </div>
            <div className="center">
                <input type="password" placeholder="Hasło" onChange={(e)=>{
                    setPassword(e.target.value);
                }}/>
            </div>
            <div className="center">
                <button className="login-button" onClick={login}>Zaloguj</button>
            </div>
            <h2 className="login-status">{loginMsg}</h2>
        </div>        
    )
}
