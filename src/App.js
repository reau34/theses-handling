import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";
import ReviewerPage from "./pages/ReviewerPage";
import PromoterPage from "./pages/PromoterPage";
import {LoginContext} from "./components/LoginContext"
import LecturerProtectedRoute from "./components/LecturerProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";

export default function App() {
  const[user,setUser]=useState(
    JSON.parse(localStorage.getItem("user"))
  )
  const[auth,setAuth]=useState(
    JSON.parse(localStorage.getItem("auth",false))
  )
  const[reservation,setReservation]=useState(
    JSON.parse(localStorage.getItem("reservation",false))
  )
  const[role,setRole]=useState(
    JSON.parse(localStorage.getItem("role"))
  )
  useEffect(()=>{
    localStorage.setItem("user",JSON.stringify(user))
    localStorage.setItem("auth",JSON.stringify(auth))
    localStorage.setItem("reservation",JSON.stringify(reservation))
    localStorage.setItem("role",JSON.stringify(role))
  },[user,auth,reservation,role])
  return (
    <div>
      <Router>
        <LoginContext.Provider value={{user,setUser, auth, setAuth, reservation, setReservation, setRole,role}}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="reviewerpage" element={<LecturerProtectedRoute isLoggedIn={auth} role={role}><ReviewerPage /></LecturerProtectedRoute>} />
            <Route path="/promoterpage" element={<LecturerProtectedRoute isLoggedIn={auth} role={role}><PromoterPage /></LecturerProtectedRoute>} />
            <Route path="/studentpage" element={<StudentProtectedRoute isLoggedIn={auth} role={role}><StudentPage /></StudentProtectedRoute>} />
          </Routes>
        </LoginContext.Provider>
      </Router>
    </div>
  );
}


