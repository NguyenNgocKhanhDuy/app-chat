import Button from "./Button";
import '../assets/css/modalRoom.scss';
import {useEffect, useRef} from "react";
import WebSocketService from "../webSocket/webSocketService";
import avatar from "../assets/img/avatar.png";

export default function ModalChat(props : any) {
    const  inputMessRef = useRef<HTMLTextAreaElement>(null);
    const  inputNameRef = useRef<HTMLInputElement>(null);


    useEffect(() => {

        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {

        })

    }, []);
    const handleSendChat = () => {
        const name = inputNameRef.current ? inputNameRef.current.value : "";
        var mess = ""
        if (inputMessRef.current) {
            mess = inputMessRef.current.value
            console.log("log: " + mess)
            WebSocketService.sendMessage(
                {
                    action: "onchat",
                    data: {
                        event: "SEND_CHAT",
                        data: {
                            type: "people",
                            to: name,
                            mes: mess
                        }
                    }
                }
            )
        }
            // inputMessRef.current.value = ""
        // handleGetChat()
        else {
            console.log("Input null")
        }
        handleCloseModal();
    }

    const handleCloseModal = () => {
        props.onClose();
    }

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                <h2 className={"title"}>{props.modalText}</h2>
                <input ref={inputNameRef} type="text" placeholder={"Input username"}/>
                <textarea ref={inputMessRef} className={"text_message"} placeholder="Type your message here..."></textarea>
                <Button className="btn" text={props.btnText} onClick={handleSendChat}/>
            </div>
        </div>
    )
}