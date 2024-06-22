import Button from "./Button";
import '../assets/css/modalRoom.scss';

export default function ModalRoom(props : any) {
    const handleCloseModal = () => {
        props.onClose();
    }

    const  handleCreateNewRoom = () =>{
        props.onConfirm();
    }

    return (
        <div className={"modal"}>
            <div className="modal-container">
                <i className="fa-solid fa-xmark close" onClick={handleCloseModal}></i>
                {/*<h2 className={"title"}>{props.modalText}</h2>*/}
                <h2 className="title">Create New Chat</h2>

                <input type="text" placeholder={"Input username"}/>
                {/*<Button className={"btn"} text={props.btnText}/>*/}
                <Button className="btn" text={props.btnText} onClick={handleCreateNewRoom}/>
            </div>
        </div>
    )
}