import {useRouteError} from "react-router-dom";
import  '../assets/css/error.scss'

export default function Error(){
    const error =useRouteError() as {statusMessage?: string, statusText ?: string};
    return (
        /*   <div>
               <h1>Lỗi</h1>
               <p>
                   <i>{error.statusMessage || error.statusText}</i>
               </p>
           </div>*/
        <div className="main">
            <div className="nav_w3l">
                <ul>
                    <li className="active"><a href="index.html">Home</a></li>
                    <li><a href="index.html" className="hvr-sweep-to-bottom">About Us</a></li>
                    <li><a href="index.html" className="hvr-sweep-to-bottom">Portfolio</a></li>
                    <li><a href="index.html" className="hvr-sweep-to-bottom">Services</a></li>
                    <li><a href="index.html" className="hvr-sweep-to-bottom">Mail Us</a></li>
                </ul>
            </div>
            <h1>404</h1>
            <h2>ooops, something goes wrong</h2>
            <div className="more_w3ls">
                <a href="index.html">Try Once Again</a>
            </div>
            <div className="wthree_social_icons">
                <div>
                    <a href="#"><span>Facebook</span></a>
                    <a href="#"><span>Twitter</span></a>
                    <a href="#"><span>Tumblr</span></a>
                    <a href="#"><span>LinkedIn</span></a>
                    <a href="#"><span>Vimeo</span></a>
                </div>
            </div>

        </div>

    );
}