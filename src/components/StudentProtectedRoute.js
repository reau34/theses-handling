import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({isLoggedIn,role,children}){
    if(!(isLoggedIn && role==="student")){
        return <Navigate to="/" replace />
    }
    return children
}
