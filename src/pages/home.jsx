import Navbar from "../components/navbar"
import "./home.css"
import Footer from "../components/footer"
function Home() {
    return<div>
        <Navbar />
        <div className="content">
            <div className="homepage">
                <div className="text-content">
                <h2 className="title">Your Daily Freshness,Just a Click Away.</h2>
                <h3 className="subtitle">From farm-fresh vegetables to daily essentials and bakery delights, get everything you need delivered right to your doorstep.</h3>
                <button className="cta-button">Start Shopping Now</button>
                </div>
    
   
            <img className="side-image" src=".\Bread.jpeg" alt="Fresh Bread" />
            </div>
            <div className="content2">
                <div className="text-content">
                    <h1 className="title">Why You'll Love Shopping With Us</h1>
                    <h3 className="subtitle">Farm-Fresh Quality</h3>
                    <h3 className="subtitle">We partner with local farmers and trusted suppliers to bring you the freshest produce, ensuring every bite is healthy and delicious.</h3>
                    <button className="cta-button">Start Shopping Now</button>
                    

                </div>
                <img className="fruits" src=".\fruits.jpeg" />
            </div>
            <div className="homepage">
                <div className="text-content">
                    <h1 className="title">Lightning-Fast Delivery</h1>
                    <h3 className="subtitle">No more waiting. Place your order and get everything you need delivered safely to your home in record time.</h3>
                     <button className="cta-button">Order Now</button>
                </div>
                <img src="/deleivery.jpeg" alt="" />

            </div>
        </div>
        <Footer/>

    </div>

        
        

    
}

export default Home