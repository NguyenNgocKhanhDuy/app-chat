import Button from "./Button";
import '../assets/css/modalRoom.scss';

export default function ModalChat(props : any) {
    const handleCloseModal = () => {
        props.onClose();
    }

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                <h2 className={"title"}>{props.modalText}</h2>
                <input type="text" placeholder={"Input username"}/>
                {/*<textarea type="text_message" placeholder={"Type your message here..."}/>*/}

                <textarea className={"text_message"} placeholder="Type your message here..."></textarea>

                <Button className="btn" text={props.btnText}/>
            </div>
        </div>
    )
}