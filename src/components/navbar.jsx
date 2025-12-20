import "./nav.css"
import { Link } from "react-router-dom"
import {CircleUser} from "lucide-react"

export default function Navbar(){
    return <>
    <div className="name">
        <div className="image1"><img src="/Grocers.png" /></div>
          <div className="text">
            <Link to="/" className="text">Home</Link></div>
       
        <div className="text">
            <Link to="/cakes" className="text">Cakes</Link></div>
         <div className="text">
            <Link to="/cakes" className="text">Grocery</Link></div>
         <div className="text">
            <Link to="/cakes" className="text">Vegies</Link></div>
       
        <div className="left-side">
            
        <Link to="/account"><CircleUser/></Link>
        <div className="image">
            <Link to="/cart">
                <img src="/cart.png" alt="cart" />
            </Link>
        </div>
        <button className="field" >
           <Link className="link" to="/login">Login</Link> </button>
        <button className="field">
            <Link className="link" to="/signup">SignUp</Link></button>

        </div>
        
    </div>
    </>
}