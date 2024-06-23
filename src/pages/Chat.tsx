import '../assets/css/chat.scss'
import avatar from  '../assets/img/avatar.png';
import Button from "../component/Button";
import {useEffect, useState} from "react";
import ChatWelcome from "../component/ChatWelcome";
import ChatContent from "../component/ChatContent";
import ModalRoom from "../component/ModalRoom";

import {useSelector} from "react-redux";

import WebSocketService from "../webSocket/webSocketService";
import ModalChat from "../component/ModalChat";
import {removeChat} from "../Store/LocalStorage";


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

        removeChat(username, userHost)

        setNewestChat(preList=> {
            const existingUserIndex = preList.findIndex(user => user.name === username);
            if (existingUserIndex !== -1) {
                const updatedUsers = [...preList];
                const [user] = updatedUsers.splice(existingUserIndex, 1);
                return updatedUsers;
            } else {
                return preList;
            }
        });
        setIsChatOpen(true);

    }

    const [isModalRoomOpen, setIsModalRoomOpen] = useState(false);
    const [modalRoomText, setModalRoomText] = useState("");
    const [modalRoomBtnText, setModalRoomBtnText] = useState("");

    const [isModalChatOpen, setIsModalChatOpen] = useState(false);
    const [modalChatText, setModalChatText] = useState("");
    const [modalChatBtnText, setModalChatBtnText] = useState("");

    const [newestChat, setNewestChat] = useState<User[]>([]);


    const handleCreateModalRoom = () => {
        setModalRoomText("Create Room");
        setModalRoomBtnText("Create");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleCreateModalChat=()=>{
        setModalChatText("Create New Chat");
        setModalChatBtnText("Send");
        setIsModalChatOpen(!isModalChatOpen);

    }


    const handleJoinModalRoom = () => {
        setModalRoomText("Join Room");
        setModalRoomBtnText("Join");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleCloseModal = () => {
        setIsModalRoomOpen(!isModalRoomOpen);
    }
    const  handleCloseModalChat=()=>{
        setIsModalChatOpen(!isModalChatOpen);
    }


    const userHost = useSelector((state:any) => state.user)

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
    useEffect(() => {


        handleGetUserList();
        WebSocketService.registerCallback('GET_USER_LIST', (data : any) => {
            const userData: User[] = data;
            setUsers(userData);
        })

    }, []);
    useEffect(() => {
        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
            const userNewChat = data.name;
            updateUsersList(userNewChat)
        })
    }, [users, newestChat]);



    const updateUsersList = (userNewChat: string) => {
        setUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(user => user.name === userNewChat);
            if (existingUserIndex !== -1) {
                const updatedUsers = [...prevUsers];
                const [user] = updatedUsers.splice(existingUserIndex, 1);
                updatedUsers.unshift(user);
                return updatedUsers;
            } else {
                const newUser = { name: userNewChat, type: 0, actionTime: "", mes: "" };
                return [newUser, ...prevUsers];
            }
        });

        setNewestChat(preList=> {
            const existingUserIndex = preList.findIndex(user => user.name === userNewChat);
            if (existingUserIndex == -1) {
                const newUser = { name: userNewChat, type: 0, actionTime: "", mes: "" };
                return [...preList, newUser];
            } else {
                return preList
            }
        });
    };

    const removeFromNewest = (username:string) => {
        setNewestChat(preList=> {
            const existingUserIndex = preList.findIndex(user => user.name === username);
            if (existingUserIndex != -1) {
                const [newChat] = newestChat.splice(existingUserIndex, 1);
                return [...preList, newChat];
            } else {
                return preList
            }
        });
    }

    const handleGetNewChat = (username:string) => {
        setUsername(username)
        setIsChatOpen(true)
    }

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
                            <div className={`item ${user.name == username ? "isUserSelect" : ""}`} onClick={() => toggleChat(user.name)} key={user.name}>
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
                                    {/*<p className="time">Just now</p>*/}
                                    {newestChat.length > 0 ? (
                                        newestChat.map((u) => (
                                            u.name == user.name ? <p className="amount"></p> : ""
                                        ))
                                    ) : ""}
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
                        <Button text={"New Chat"} className={"chat-room"} onClick={handleCreateModalChat}/>
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
                    {isChatOpen ? <ChatContent onRemoveFromNewestChat={(usrn:string)=>removeFromNewest(usrn)} newestChat={newestChat} onUpdateUser={(usern : string) => updateUsersList(usern)} listUsers={users} user={userHost} userChatTo={username}/> : <ChatWelcome/>}
                </div>
            </div>

            {isModalRoomOpen ? <ModalRoom onClose={handleCloseModal} modalText={modalRoomText} btnText={modalRoomBtnText}/> : ""}

            {isModalChatOpen ? <ModalChat onHandleGetChat={(user:string)=>handleGetNewChat(user)} user={userHost} onUpdateListUser={handleGetUserList} onUpdateUser={(usern : string) => updateUsersList(usern)} onClose={handleCloseModalChat} modalText={modalChatText} btnText={modalChatBtnText}/> : ""}
        </div>
    )
}