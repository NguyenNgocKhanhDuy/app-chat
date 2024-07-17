import '../assets/css/chat.scss'
import avatar from '../assets/img/avatar.png';
import roomchat from '../assets/img/roomchat.png';
import Button from "../component/Button";
import React, {useEffect, useRef, useState} from "react";
import ChatWelcome from "../component/ChatWelcome";
import ChatContent from "../component/ChatContent";
import RoomChatContent from "../component/RoomChatContent";
import ModalRoom from "../component/ModalRoom";
import {useSelector} from "react-redux";
import WebSocketService from "../webSocket/webSocketService";
import ModalChat from "../component/ModalChat";
import {removeChat} from "../Store/LocalStorage";
import webSocketService from "../webSocket/webSocketService";
import {useNavigate} from "react-router-dom";
import internal from "node:stream";
import InfomationChat from "../component/InfomationChat";


interface User {
    name: string;
    type: number;
    actionTime: string;
}

interface UserRoom {
    id: string
    name: string;
}

export default function Chat() {
    const navigate = useNavigate();
    // const [modalInputValue, setModalInputValue] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isModalRoomOpen, setIsModalRoomOpen] = useState(false);
    const [modalRoomText, setModalRoomText] = useState("");
    const [modalRoomBtnText, setModalRoomBtnText] = useState("");
    const [isModalChatOpen, setIsModalChatOpen] = useState(false);
    const [modalChatText, setModalChatText] = useState("");
    const [modalChatBtnText, setModalChatBtnText] = useState("");
    const [newestChat, setNewestChat] = useState<User[]>([]);
    const [room, isRoom] = useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [isFirst, setIsFirst] = useState(false)
    const [userOnlineStatus, setUserOnlineStatus] = useState<{ [key: string]: boolean }>({});
    const indexRef = useRef<number>(-1);
    const isInitialized = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Sử dụng NodeJS.Timeout cho TypeScript
    const toggleChat = (username: string, type: number) => {
        handleCloseInfo();
        (type === 1 ? isRoom(true) : isRoom(false))

        setUsername(username);

        removeChat(username, userHost)

        setNewestChat(preList => {
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

    const handleCreateModalRoom = () => {
        setModalRoomText("Create Room");
        setModalRoomBtnText("Create");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleCreateModalChat = () => {
        setModalChatText("Create New Chat");
        setModalChatBtnText("Send");
        setIsModalChatOpen(!isModalChatOpen);

    }

    // console.log(users)
    const handleJoinModalRoom = () => {
        setModalRoomText("Join Room");
        setModalRoomBtnText("Join");
        setIsModalRoomOpen(!isModalRoomOpen);
    }

    const handleCloseModal = () => {
        setIsModalRoomOpen(!isModalRoomOpen);
    }
    const handleCloseModalChat = () => {
        setIsModalChatOpen(!isModalChatOpen);
    }

    const handleButtonClick = (inputValue: string) => {
        let action = ""
        if (modalRoomText === "Create Room") {
            action = "CREATE_ROOM"
            handleCreateRoom(inputValue);
        } else {
            action = "JOIN_ROOM"
            handleJoinRoom(inputValue);
        }
        WebSocketService.registerCallback(action, (data: any) => {
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
            if (data === "Room Exist" || data === "Room not found") {
                errorText.innerText = data;
                error.style.display = "flex"
            } else {
                updateUsersList(userHost, inputValue, 1)
                handleCloseModal()
            }
        })

    }

    const handleJoinRoom = (name: string) => {
        WebSocketService.sendMessage(
            {
                "action": "onchat",
                "data": {
                    "event": "JOIN_ROOM",
                    "data": {
                        "name": name
                    }
                }
            }
        )
    }
    const handleCreateRoom = (name: string) => {
        WebSocketService.sendMessage(
            {
                "action": "onchat",
                "data": {
                    "event": "CREATE_ROOM",
                    "data": {
                        "name": name
                    }
                }
            }
        )
    }


    const userHost = useSelector((state: any) => state.user)
    // console.log("this is name  " +userHost)
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
        // console.log( searchUsers)
        indexRef.current = 0;
        handleGetUserList();
        WebSocketService.registerCallback('GET_USER_LIST', (data: any) => {
            const updatedUserData: User[] = data;
            setUsers(updatedUserData);
        })
    }, []);

    const [start, isStart] = useState(false)

    useEffect(() => {
        if (room == false && isChatOpen == false)
            WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
                const userNewChat = data.name;
                const userNewChatTo = data.to;
                console.log("TEST: " + userNewChat + ", " + userNewChatTo + ", " + data.type);
                updateUsersList(userNewChat, userNewChatTo, data.type)
                // // setUsername(userNewChatTo)
                // isStart(true)
                // const loopFuntion = setInterval(handleCheckOnline, 3000);
                // return () => clearInterval(loopFuntion);

            })
        if (users.length > 0 && !isInitialized.current && indexRef.current !== -1) {
            handleCheckOnline();
            isInitialized.current = true; // Đánh dấu đã khởi tạo handleCheckOnline
        }
    }, [users]);


    const updateUsersList = (userNewChat: string, userNewChatTo: string, userType: number) => {
        console.log('upChatList')
        console.log("userNew: " + userNewChat)
        console.log("userToNew: " + userNewChatTo)
        setUsers(prevUsers => {
            var existingUserIndex: number
            // const existingUserIndex = prevUsers.findIndex(user => user.name === userNewChat);
            if (userType == 0) {
                existingUserIndex = prevUsers.findIndex(user => user.name === userNewChat);
                if (existingUserIndex !== -1) {
                    const updatedUsers = [...prevUsers];
                    const [user] = updatedUsers.splice(existingUserIndex, 1);
                    updatedUsers.unshift(user);
                    return updatedUsers;
                } else {
                    const newUser = {name: userNewChat, type: userType, actionTime: ""};
                    return [newUser, ...prevUsers];
                }
            } else {
                existingUserIndex = prevUsers.findIndex(user => user.name === userNewChatTo);
                if (existingUserIndex !== -1) {
                    const updatedUsers = [...prevUsers];
                    const [user] = updatedUsers.splice(existingUserIndex, 1);
                    updatedUsers.unshift(user);
                    return updatedUsers;
                } else {
                    const newUser = {name: userNewChatTo, type: userType, actionTime: ""};
                    return [newUser, ...prevUsers];
                }
            }

        });

        setNewestChat(preList => {
            var existingUserIndex: number;
            // const existingUserIndex = preList.findIndex(user => user.name === userNewChat);
            if (userType == 0) {
                console.log('0')
                console.log("userNew0: " + userNewChat)
                console.log("userToNew0: " + userNewChatTo)
                existingUserIndex = preList.findIndex(user => user.name === userNewChat);
                if (existingUserIndex == -1) {
                    const newUser = {name: userNewChat, type: userType, actionTime: ""};
                    return [...preList, newUser];
                } else {
                    return preList
                }
            } else {
                console.log('1')
                console.log("userNew1: " + userNewChat)
                console.log("userToNew1: " + userNewChatTo)

                users.map(u => {
                    console.log(u.name)
                })
                existingUserIndex = preList.findIndex(user => user.name === userNewChatTo);
                if (existingUserIndex == -1) {
                    const newUser = {name: userNewChatTo, type: userType, actionTime: ""};
                    return [...preList, newUser];
                } else {
                    return preList
                }
            }

        });
    };

    const removeFromNewest = (username: string) => {
        // setNewestChat(preList=> {
        //     const existingUserIndex = preList.findIndex(user => user.name === username);
        //     if (existingUserIndex != -1) {
        //         const [newChat] = newestChat.splice(existingUserIndex, 1);
        //         return [...preList, newChat];
        //     } else {
        //         return preList
        //     }
        // });
        setNewestChat(preList => {
            const existingUserIndex = preList.findIndex(user => user.name === username);
            if (existingUserIndex !== -1) {
                const updatedUsers = [...preList];
                const [user] = updatedUsers.splice(existingUserIndex, 1);
                return updatedUsers;
            } else {
                return preList;
            }
        });
    }

    const handleGetNewChat = (username: string) => {
        setUsername(username)
        setIsChatOpen(true)
    }
    const handleLogOut = () => {
        setUserOnlineStatus({});
        setUsers([]);
        indexRef.current = -1
        isInitialized.current = false;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        WebSocketService.sendMessage(
            {
                "action": "onchat",
                "data": {
                    "event": "LOGOUT"
                }
            }
        )
        WebSocketService.registerCallback("LOGOUT", (data: any) => {
            // WebSocketService.unregisterCallback('CHECK_USER');

            navigate('/login')

        })
    }


    const [searchUsers, setSearchUsers] = useState<User[]>([]);

    const handleSearch = (e: any) => {
        console.log(e.target.value)
        setSearchInput(e.target.value)
        const filteredUsers = users.filter(user => {
            return user.name.toLowerCase().includes(e.target.value.toLowerCase());
        });
        // searchUsers = users.filter(user => {
        //     return user.name.toLowerCase().includes(searchInput.toLowerCase())
        // });
        // searchUsers.map(u => {
        // })
        setSearchUsers(filteredUsers)
    }
    const [ownRoom, setOwnRoom] = useState("");
    const [usersRoom, setUsersRoom] = useState<UserRoom[]>([]);
    const [nameRoom, setNameRoom] = useState("");
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleOpenInfo = function () {
        const mainchat = document.querySelector(".main-chat-content") as HTMLDivElement;
        const info = document.querySelector(".info-content") as HTMLDivElement;
        mainchat.style.width = "75%";
        info.style.width = "25%";
        handleGetListUserOfRoom(username)
        WebSocketService.registerCallback("GET_ROOM_CHAT_MES", (data: any) => {
            setOwnRoom(data.own)
            setUsersRoom(data.userList)
            setNameRoom(data.name)
            setIsInfoOpen(true)
        })

    }
    const handleCloseInfo = function () {
        const mainchat = document.querySelector(".main-chat-content") as HTMLDivElement;
        const info = document.querySelector(".info-content") as HTMLDivElement;
        mainchat.style.width = "100%";
        info.style.width = "0%";
        setIsInfoOpen(false)

    }

    const handleGetListUserOfRoom = (nameRoom: string) => {
        WebSocketService.sendMessage(
            {
                "action": "onchat",
                "data": {
                    "event": "GET_ROOM_CHAT_MES",
                    "data": {
                        "name": nameRoom,
                        "page": 1
                    }
                }
            }
        )
    }


    const handleUpdateUserListForSend = (userChatTo:string) => {
        console.log('spli')
        setUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(user => user.name === userChatTo);
            const updatedUsers = [...prevUsers];
            const [user] = updatedUsers.splice(existingUserIndex, 1);
            updatedUsers.unshift(user);
            return updatedUsers;
        });
    }


    // const intervalId = setInterval(() => {
    //         handleCheckOnline(0);
    // }, 3000);
    // const loopFuntion = setInterval(handleCheckOnline(0), 3000);
    // return () => clearInterval(intervalId);

    // const [userOnl, setUserOnl] = useState("");
    //
    // setTimeout(() => handleCheckOnline(0), 2000);
    // const handleCheckOnline = (index : number) => {
    //     console.log("Ham nay duoc goi mot lan nua")
    //     console.log(users)
    //     var n = index
    //     if (index >= users.length) {
    //         console.log("ham nay da dung lai")
    //
    //         return; // Kết thúc khi đã duyệt qua tất cả users
    //     }
    //     const user = users[index];
    //         WebSocketService.sendMessage({
    //             action: "onchat",
    //             data: {
    //                 event: "CHECK_USER",
    //                 data: {
    //                     user: user.name
    //                 }
    //             }
    //         });
    //             setUserOnl(user.name);
    //         setTimeout(() => {
    //             handleCheckOnline(n + 1);
    //         }, 1000);
    //
    // }
    // WebSocketService.registerCallback('CHECK_USER', (data:any) => {
    //     updateStateonline(userOnl, data.status)
    // })
    //
    // const updateStateonline = (userName: string, isOnl : boolean) => {
    //     setUsers(prevUsers => {
    //         const updatedUsers = [...prevUsers];
    //         const existingUserIndex = updatedUsers.findIndex(u => u.name === userName);
    //         if (existingUserIndex !== -1) {
    //             // Tạo một đối tượng user mới với thuộc tính cần thay đổi
    //             const updatedUser = { ...updatedUsers[existingUserIndex], isOnl: isOnl};
    //             // Cập nhật lại phần tử trong mảng updatedUsers
    //             updatedUsers[existingUserIndex] = updatedUser;
    //
    //         }
    //         return updatedUsers;
    //
    //     });

    const handleCheckOnline = () => {
        timeoutRef.current = setTimeout(() => {
            var index = indexRef.current;
        console.log("Ham handlecheck duoc goi", index)
        if (index === -1 ||  users.length === 0) {
            return;
        }
        if ((index >= users.length)) {
            indexRef.current = 0
            index = indexRef.current;
        }


        const user = users[index];
        console.log("Gửi yêu cầu CHECK_USER cho người dùng ",user.name);

        WebSocketService.sendMessage({
            action: "onchat",
            data: {
                event: "CHECK_USER",
                data: {
                    user: user.name
                }
            }
        });
        // Đăng ký callback để nhận phản hồi từ WebSocket
        WebSocketService.registerCallback('CHECK_USER', (data:any) => {
            userOnlineStatus[user.name] = data.status;
        });
        // Lưu tên người dùng đang xét để cập nhật trạng thái online
        // setUserOnl(user.name);



            indexRef.current = index + 1;
            handleCheckOnline(); // Gọi lại hàm với index tiếp theo

        }, 100);

    };

    // const updateStateonline = (userName : string, isOnl:boolean) => {
    //     console.log("ham update duoc goi")
    //     setUsers((prevUsers) => {
    //         return prevUsers.map((prevUser) => {
    //             if (prevUser.name === userName) {
    //                 return { ...prevUser, isOnl: isOnl };
    //             }
    //             return prevUser;
    //         });
    //     });
    // };

    //  useEffect(() => {
    //      console.log("User online status changed:", userOnlineStatus);
    // }, [userOnlineStatus]);


    return(
        <div className={"chat"}>
            <div className="left">
                <div className="top">
                    <div className="logo">
                        NLUCHAT
                    </div>
                    <div className="account">
                        <img src={avatar} className={"avatar"} alt="avatar"/>
                    </div>
                </div>
                <div className="search">

                    <input type="text" placeholder={"Search for groups and events"} value={searchInput} onChange={handleSearch}/>

                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                {searchInput === "" ? (
                    <div className="chat-list">
                        {users.length > 0 ? (
                            // }
                                users.map((user) => (
                                    <div className={`item ${user.name == username ? "isUserSelect" : ""}`}
                                         onClick={() => toggleChat(user.name, user.type)} key={user.name}>
                                        <div className="item-info">
                                            {user.type === 0 ? (
                                                <img src={avatar} className="item-img" alt="Avatar"/>
                                            ) : (
                                                <img src={roomchat} className="item-img" alt="Avatar"/>
                                            )}
                                            <div className="item-content">
                                                <div className="title">
                                                    {user.name !== userHost ? (
                                                        <p className="name">
                                                            {user.name}
                                                        </p>
                                                    ) : (
                                                        <p className="name">
                                                            {"Myself"}
                                                        </p>
                                                    )}
                                                    {/*<i className="fa-regular fa-comment-dots"></i>*/}
                                                    {/*{user.type === 0 ? (*/}
                                                    {/*    userOnlineStatus[user.name] ? (*/}
                                                    {/*        // <i className="fa-solid fa-circle" id="onl-true"></i>*/}
                                                    {/*        <div>{userOnlineStatus[user.name]}</div>*/}

                                                    {/*    ) : (*/}
                                                    {/*        // <i className="fa-solid fa-circle" id="onl-false"></i>*/}
                                                    {/*        <div>{userOnlineStatus[user.name]}</div>*/}
                                                    {/*    )*/}
                                                    {/*) : null}*/}
                                                    {user.type === 0 ? (
                                                        userOnlineStatus[user.name] !== undefined ? (
                                                            userOnlineStatus[user.name] ? (
                                                                <>
                                                                    <i className="fa-solid fa-circle" id="onl-true"></i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="fa-solid fa-circle" id="onl-false"></i>
                                                                </>
                                                            )
                                                        ) : (
                                                            <div>Loading...</div>
                                                        )
                                                    ) : null}
                                                </div>
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
                    ) : (
                        <div className="chat-list">
                            {searchUsers.length > 0 ? (
                                searchUsers.map((user) => (
                                    <div className={`item ${user.name == username ? "isUserSelect" : ""}`}
                                         onClick={() => toggleChat(user.name, user.type)} key={user.name}>
                                        <div className="item-info">
                                            {user.type === 0 ? (
                                                <img src={avatar} className="item-img" alt="Avatar"/>
                                            ) : (
                                                <img src={roomchat} className="item-img" alt="Avatar"/>
                                            )}
                                            <div className="item-content">
                                                <div className="title">
                                                    {user.name !== userHost ? (
                                                        <p className="name">
                                                            {user.name}
                                                        </p>
                                                    ) : (
                                                        <p className="name">
                                                            {"Myself"}
                                                        </p>
                                                    )}
                                                    {/*<i className="fa-regular fa-comment-dots"></i>*/}
                                                    {/*{user.type === 0 ? (*/}
                                                    {/*    userOnlineStatus[user.name] ? (*/}
                                                    {/*        // <i className="fa-solid fa-circle" id="onl-true"></i>*/}
                                                    {/*        <div>{userOnlineStatus[user.name]}</div>*/}

                                                    {/*    ) : (*/}
                                                    {/*        // <i className="fa-solid fa-circle" id="onl-false"></i>*/}
                                                    {/*    <div>{userOnlineStatus[user.name]}</div>*/}
                                                    {/*    )*/}
                                                    {/*    ) : null}*/}
                                                    {user.type === 0 ? (
                                                        userOnlineStatus[user.name] !== undefined ? (
                                                            userOnlineStatus[user.name] ? (
                                                                <>
                                                                    <i className="fa-solid fa-circle" id="onl-true"></i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="fa-solid fa-circle" id="onl-false"></i>
                                                                </>
                                                            )
                                                        ) : (
                                                            <div>Loading...</div>
                                                        )
                                                    ) : null}
                                                </div>
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
                                <p>Not found users</p>
                            )}
                        </div>
                    )}
                </div>
                <div className={`right ${isChatOpen ? "rightCalc" : "rightFull"}`}>
                    <div className="top">
                        <div className="action">
                            <Button text={"New Room"} className={"chat-room"} onClick={handleCreateModalRoom}/>
                            <Button text={"Join Room"} className={"chat-room"} onClick={handleJoinModalRoom}/>
                            <Button text={"New Chat"} className={"chat-room"} onClick={handleCreateModalChat}/>
                            <Button text={"Events"} className={"event"}/>
                            <Button text={"log out"} className={"logout"} onClick={handleLogOut}/>

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
                    <div className={"main-chat-content"}>
                        {isChatOpen ?
                            (room ?
                                    <RoomChatContent page={1}
                                                     onRemoveFromNewestChat={(usrn: string) => removeFromNewest(usrn)}
                                                     newestChat={newestChat}
                                                     onUpdateUser={(usern: string, usernTo:string, type:number) => updateUsersList(usern, usernTo,type)}
                                                     listUsers={users} user={userHost} userChatTo={username} handleOpenInfo={handleOpenInfo}
                                                     updateUserList={(u:string) => handleUpdateUserListForSend(u)}/>
                                    :<ChatContent page={1} onRemoveFromNewestChat={(usrn: string) => removeFromNewest(usrn)}
                                             newestChat={newestChat} isFirst={true}
                                             onUpdateUser={(usern: string, usernTo:string, type:number) => updateUsersList(usern, usernTo,type)} listUsers={users}
                                             user={userHost} userChatTo={username} isStart={start}
                                             updateUserList={(u:string) => handleUpdateUserListForSend(u)}/>
                            )
                            : <ChatWelcome/>}
                        <div className="info-content">
                            {isInfoOpen && (
                                <InfomationChat handleCloseInfo={handleCloseInfo} usersRoom={usersRoom} ownRoom={ownRoom} nameRoom={nameRoom} toggleChat={toggleChat}/>
                            )}
                        </div>
                    </div>

                </div>

                {isModalRoomOpen ?
                    <ModalRoom onClose={handleCloseModal} modalText={modalRoomText} btnText={modalRoomBtnText}
                               onButtonClick={handleButtonClick} modalRoomText={modalRoomText}/> : ""}

                {isModalChatOpen ?
                    <ModalChat onHandleGetChat={(user: string) => handleGetNewChat(user)} user={userHost}
                               onUpdateListUser={handleGetUserList} onUpdateUser={(usern : string) => updateUsersList(usern,"", 0)} onClose={handleCloseModalChat} modalText={modalChatText} btnText={modalChatBtnText}/> : ""}
            </div>
        </div>

    )
    }