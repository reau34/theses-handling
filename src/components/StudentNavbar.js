import React from "react"
import logo from "./../logo.png"
import "./../css/navbar.css"
import { useNavigate, useLocation } from "react-router-dom"
import Axios from "axios"
import { LoginContext } from "./LoginContext"
import { useContext } from "react"

export default function StudentNavbar(){
    const{setAuth,reservation}=useContext(LoginContext)
    const currentLocation=useLocation()
    let navigate=useNavigate()
    const logout=()=>{
        setAuth(false)
        localStorage.clear()
        Axios.post("http://localhost:3001/logout")
        navigate("/")
    }
    const homeRedirect =()=>{
        navigate("/home")
    }
    const studentRedirect=()=>{
        navigate("/studentpage")
    }
    return(
        <header>
                {currentLocation.pathname==="/home"?
                    <nav className="nav">
                    <img src={logo} alt="Logo" width="60px"/>
                        <h1>Tematy prac dyplomowych</h1>
                        <ul className="nav-items">
                            {reservation===true?<li><button className="nav-button" onClick={studentRedirect}>Moja praca</button></li>:<></>}
                            <li><button className="nav-button" onClick={logout}>Wyloguj</button></li>
                        </ul>
                    </nav>:
                    <nav className="nav">
                        <img src={logo} alt="Logo" width="60px"/>
                        <h1>Moja praca</h1>
                        <ul className="nav-items">
                            <li><button className="nav-button" onClick={homeRedirect}>Home</button></li>
                            <li><button className="nav-button" onClick={logout}>Wyloguj</button></li>
                        </ul>
                    </nav>
                }               
        </header>
    )
}