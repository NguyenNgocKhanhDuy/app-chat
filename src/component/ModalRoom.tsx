import Button from "./Button";
import '../assets/css/modalRoom.scss';
import {useEffect} from "react";
import WebSocketService from "../webSocket/webSocketService";

export default function ModalRoom(props : any) {
    const handleCloseModal = () => {
        props.onClose();
    }

    useEffect(() => {
        WebSocketService.registerCallback('LOGIN', (data : any) => {
            console.log(`Login response: ${data}`)
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
        })
    }, []);

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                <h2 className={"title"}>{props.modalText}</h2>
                <input type="text" placeholder={"Name"}/>
                <Button className={"btn"} text={props.btnText}/>
            </div>
        </div>
    )
}