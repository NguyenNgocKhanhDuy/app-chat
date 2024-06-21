import {useRouteError} from "react-router-dom";
import  '../assets/css/error.scss'

export default function Error(){
    const error = useRouteError() as {statusMessage?: string, statusText ?: string};
    return (
        <div className="main">
            <h1>404</h1>
            <h2>{error.statusMessage || error.statusText}</h2>
        </div>

    );
}