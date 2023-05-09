import React,{useContext} from "react"
import StudentNavbar from "../components/StudentNavbar"
import HomeTable from "../components/HomeTable"
import {LoginContext} from "../components/LoginContext"
import LecturerNavbar from "../components/LecturerNavbar"

export default function HomePage(){
    const{user,role}=useContext(LoginContext)
    return(
        <>
            {role==="student"?<StudentNavbar />:<LecturerNavbar />}
            <HomeTable role={role}/>
        </>
    )
}