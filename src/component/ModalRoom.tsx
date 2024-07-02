import Button from "./Button";
import '../assets/css/modalRoom.scss';
import React, {useEffect} from "react";
import WebSocketService from "../webSocket/webSocketService";
import {useState} from "react";

export default function ModalRoom(props : any) {
    const [inputValue, setInputValue] = useState("");


    const handleCloseModal = () => {
        props.onClose();
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const error = document.querySelector(".error") as HTMLDivElement;
        setInputValue(event.target.value);
        error.style.display = "none"
    };
    const handleButtonClick = () => {
        props.onButtonClick(inputValue);
        const modalRoomText = props.modalRoomText
        let action =""
        if(modalRoomText==="Create Room") {
             action = "CREATE_ROOM"
        } else if (modalRoomText==="Join Room") {
            action ="JOIN_ROOM"
        }
        WebSocketService.registerCallback(action, (data : any) => {
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
            if(data === "Room Exist" || data === "Room not found") {
                errorText.innerText = data;
                error.style.display = "flex"
            } else {
                handleCloseModal()
            }
        })

    }

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                <h2 className={"title"}>{props.modalText}</h2>
                <input type="text" placeholder={"Name"} value={inputValue} onChange={handleInputChange}/>
                <div className="error">
                    <i className="fa-solid fa-circle-info"></i>
                    <p className={"error-text"}></p>
                </div>
                <Button className={"btn"} text={props.btnText} onClick={handleButtonClick}/>
            </div>
        </div>
    )
}