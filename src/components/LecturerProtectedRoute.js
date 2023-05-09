import { Navigate } from "react-router-dom";

export default function LecturerProtectedRoute({isLoggedIn,role,children}){
    if(!(isLoggedIn && role==="lecturer")){
        return <Navigate to="/" replace />
    }
    return children
}
