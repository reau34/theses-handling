import React from "react"
import "./../css/navbar.css"
import { useNavigate,useLocation } from "react-router-dom"
import logo from "./../logo.png"
import { LoginContext } from "./LoginContext"
import { useContext } from "react"
import Axios from "axios"

export default function LecturerNavbar(){
    const{setAuth}=useContext(LoginContext)
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
    const promoterRedirect=()=>{
        navigate("/promoterpage")
    }
    const reviewerRedirect=()=>{
        navigate("/reviewerpage")
    }
    return(
        <header>
            {currentLocation.pathname==="/home"?
                <nav className="nav">
                    <img src={logo} alt="Logo" width="60px"/>
                    <h1>Tematy prac dyplomowych</h1>
                    <ul className="nav-items">
                        <li><button className="nav-button" onClick={reviewerRedirect}>Recenzent</button></li>
                        <li><button className="nav-button" onClick={promoterRedirect}>Konto</button></li>
                        <li><button className="nav-button" onClick={logout}>Wyloguj</button></li>
                    </ul>
                </nav>:currentLocation.pathname==="/promoterpage"?
                <nav className="nav">
                    <img src={logo} alt="Logo" width="60px"/>
                    <h1>Konto</h1>
                    <ul className="nav-items">
                        <li><button className="nav-button" onClick={reviewerRedirect}>Recenzent</button></li>
                        <li><button className="nav-button" onClick={homeRedirect}>Home</button></li>
                        <li><button className="nav-button" onClick={logout}>Wyloguj</button></li>
                    </ul>
                </nav>:
                <nav className="nav">
                    <img src={logo} alt="Logo" width="60px"/>
                    <h1>Panel recenzenta</h1>
                    <ul className="nav-items">
                        <li><button className="nav-button" onClick={homeRedirect}>Home</button></li>
                        <li><button className="nav-button" onClick={promoterRedirect}>Konto</button></li>
                        <li><button className="nav-button" onClick={logout}>Wyloguj</button></li>
                    </ul>
                </nav>
            }
        </header>
    )
}