import '../assets/css/chat.scss'
import avatar from  '../assets/img/avatar.png';
import Button from "../component/Button";
import {useEffect, useState} from "react";
import ChatWelcome from "../component/ChatWelcome";
import ChatContent from "../component/ChatContent";
import ModalRoom from "../component/ModalRoom";

import {useSelector} from "react-redux";

import webSocketService from "../webSocket/webSocketService";
import WebSocketService from "../webSocket/webSocketService";


interface User {
    name: string;
    type: number;
    actionTime: string;
    mes: string;
}
export default function Chat() {


    const [isChatOpen, setIsChatOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const toggleChat = (username : string) => {
        setUsername(username)
        setIsChatOpen(true);
    }

    const [isModalRoomOpen, setIsModalRoomOpen] = useState(false);
    const [modalRoomText, setModalRoomText] = useState("");
    const [modalRoomBtnText, setModalRoomBtnText] = useState("");

    const handleCreateModalRoom = () => {
        setModalRoomText("Create Room");
        setModalRoomBtnText("Create");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleJoinModalRoom = () => {
        setModalRoomText("Join Room");
        setModalRoomBtnText("Join");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleCloseModal = () => {
        setIsModalRoomOpen(!isModalRoomOpen);
    }


    const userHost = useSelector((state:any) => state.user);


    useEffect(() => {
        
        const handleGetUserList = () => {
            WebSocketService.sendMessage(
                {
                    "action": "onchat",
                    "data": {
                        "event": "GET_USER_LIST"
                    }
                }
            )
        }
        handleGetUserList();
        WebSocketService.registerCallback('GET_USER_LIST', (data : any) => {
            console.log(`Login response: ${data}`)
                const userData: User[] = data;
                setUsers(userData);
        })
    }, []);




    return(
        <div className={"chat"}>
            <div className="left">
                <div className="top">
                    <div className="logo">
                        PiCHAT
                    </div>
                    <div className="account">
                        <img src={avatar} className={"avatar"} alt="avatar"/>
                    </div>
                </div>
                <div className="search">
                    <input type="text" placeholder={"Search for groups and events"}/>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="chat-list">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <div className="item" onClick={() => toggleChat(user.name)} key={user.name}>
                                <div className="item-info">
                                    <img src={avatar} className="item-img" alt="Avatar"/>
                                    <div className="item-content">
                                        <div className="title">
                                            <p className="name">{user.name}</p>
                                            <i className="fa-regular fa-comment-dots"></i>
                                        </div>
                                        <p className="desc">{user.mes}</p>
                                    </div>
                                </div>
                                <div className="item-status">
                                    <p className="time">Just now</p>
                                    <p className="amount">1</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users available</p>
                    )}
                </div>
            </div>
            <div className={`right ${isChatOpen ? "rightCalc" : "rightFull"}`}>
                <div className="top">
                    <div className="action">
                        <Button text={"New Room"} className={"chat-room"} onClick={handleCreateModalRoom}/>
                        <Button text={"Join Room"} className={"chat-room"} onClick={handleJoinModalRoom}/>
                        <Button text={"Events"} className={"event"}/>
                    </div>
                    <div className="location">
                        <div className="info">
                            <i className="fa-solid fa-location-dot"></i>
                            <div className="desc">
                                <p className="title">Current Location</p>
                                <p className="locate">San Juan, Puerto Rico</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
                <div className="chat-content">
                    {isChatOpen ? <ChatContent user={userHost} userChatTo={username}/> : <ChatWelcome/>}
                </div>
            </div>

            {isModalRoomOpen ? <ModalRoom onClose={handleCloseModal} modalText={modalRoomText} btnText={modalRoomBtnText}/> : ""}

        </div>
    )
}