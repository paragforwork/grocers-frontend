import { useState,useEffect } from "react";
import {Navigate,Outlet} from "react-router-dom"


export default function PrivateRoute(){
    const [isAuthenticated,setisAuthenticated] = useState(null);

    useEffect(()=>{
        const verifyAuth =async()=>{
            try{
                const response = await fetch("http://localhost:8080/api/check-auth",{
                    method:"GET",
                    credentials:"include"
                });


                const data =await response.json();
                if(data.isAuthenticated){
                    setisAuthenticated(true);
                }
                else{
                    setisAuthenticated(false);
                        
                }

            }
            catch(error){
                setisAuthenticated(false);
            }
        };
        verifyAuth();

    },[]);

    if(isAuthenticated === null) {
        return <div style={{textAlign: "center", marginTop: "50px"}}>Loading...</div>; 
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}