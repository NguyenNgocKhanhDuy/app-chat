import Button from "./Button";
import '../assets/css/modalRoom.scss';

export default function ModalRoom(props : any) {
    const handleCloseModal = () => {
        props.onClose();
    }

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