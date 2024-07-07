import '../assets/css/infomationChat.scss'
import avatar from  '../assets/img/avatar.png';
import roomchat from '../assets/img/roomchat.png';
import React, {useEffect, useState} from "react";
import WebSocketService from "../webSocket/webSocketService";
interface UserRoom {
    id: string;
    name: string;

}
export default function InfomationChat(props : any) {
    const [ownRoom, setOwnRoom] = useState("");
    const [usersRoom, setUsersRoom] = useState<UserRoom[]>([]);
    const [nameRoom, setNameRoom] = useState("");

    const handleCloseInfo = () => {
        props.handleCloseInfo()
    }
    useEffect(() => {
        setUsersRoom(props.usersRoom)
        setOwnRoom(props.ownRoom)
        setNameRoom(props.nameRoom)
    }, [usersRoom]);
    // useEffect(() => {
    //     setUsersRoom(props.usersRoom)
    //     setOwnRoom(props.ownRoom)
    //     setNameRoom(props.nameRoom)
    // }, []);
   const toggleChat = (username : string, type:number) =>{
       props.toggleChat(username, type)
    }
    return (
        <div className={"info-chat-room"}>
            <div className={"chat-bar"}>
                <i className="fa-regular fa-circle-xmark" onClick={handleCloseInfo}></i>
                <p>Edit profile</p>
                <div className={"leave-btn"}>
                    <p>Leave group</p>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </div>
            </div>
            <div className={"avatar-chat"}>
                <img src={roomchat} alt={"anh dai dien"}/>
            </div>
            <p>{nameRoom}</p>
            <h4>Leader</h4>
            <div className={"leader"}>
                <div className={"item"}>
                    <div className="item-info">
                        <img src={avatar} className="item-img" alt="Avatar"/>
                        <div className="title">
                            <p className="name">{ownRoom}</p>
                        </div>
                    </div>
                </div>
            </div>
            <h4>Member</h4>
            {usersRoom.map((user) => (
            <div className={"member"}>
                <div className={"item"} onClick={() => toggleChat(user.name, 0)} key={user.name}>
                    <div className="item-info">
                        <img src={avatar} className="item-img" alt="Avatar"/>
                        <div className="title">
                            <p className="name">{user.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    )
}