import { getImageUrl } from "../config";
import "./cakecard.css"
export default function({imgsrc,price,name}){
    return <div className="cake-card">
            <img src={getImageUrl(imgsrc)} className="cake-img"></img>
            <div className="card-info">
                <h3 className="cake-name">{name}</h3>
                <p className="cake-price">{price}</p>
            </div>

    </div>
}