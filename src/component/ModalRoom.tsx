import Button from "./Button";
import '../assets/css/modalRoom.scss';
import React, {useEffect} from "react";
import WebSocketService from "../webSocket/webSocketService";
import {useState} from "react";

export default function ModalRoom(props : any) {
    const [inputValue, setInputValue] = useState("");
    interface ModalRoomProps {
        onClose: () => void;
        modalText: string;
        btnText: string;
        onButtonClick: (inputValue: string) => void;
    }

    const handleCloseModal = () => {
        props.onClose();
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };
    const handleButtonClick = () => {
        props.onButtonClick(inputValue);
        handleCloseModal();
    }
    useEffect(() => {
        WebSocketService.registerCallback('CREATE_ROOM', (data : any) => {
            console.log(`CREATEROOM response: ${data}`)
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
        })
    }, []);

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                <h2 className={"title"}>{props.modalText}</h2>
                <input type="text" placeholder={"Name"} value={inputValue} onChange={handleInputChange}/>
                <Button className={"btn"} text={props.btnText} onClick={handleButtonClick}/>
            </div>
        </div>
    )
}