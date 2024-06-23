import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import {useEffect, useRef} from "react";
import "../assets/css/chatContent.scss"
import WebSocketService from "../webSocket/webSocketService";
import convertTime, {getHourMinute} from "../utils/convertTime";
import {getChat, removeChat, saveChat} from "../Store/LocalStorage";

export default function ChatContent(props : any) {
    const chatListRef = useRef<HTMLDivElement>(null);
    const user = props.user;
    const userChatTo = props.userChatTo;
    const newestChat = props.newestChat;
    var isSeen = true;

    useEffect(() => {
        const handleStorageChange = () => {
            console.log("storage")
            handleGetChat()
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    useEffect(() => {

        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data : any) => {
            isSeen = getChat(user, userChatTo) == "" ? true : false;
            var htmlItem = ``

            for (let i = 0; i < data.length; i++) {
                var time =  getHourMinute(convertTime(data[i].createAt))

                if (data[i].to != user){
                    if (i==0) {
                        if (isSeen) {
                            htmlItem += "<div class='status'>Đã xem</div>"
                        }else {
                            htmlItem += "<div class='status'>Đã gửi</div>"
                        }
                    }
                    console.log("U: "+user)
                    htmlItem += `<div class="item my-chat">
                                    <div class="text">
                                        ${data[i].mes}
                                        <span class="time">${time}</span>
                                    </div>
                                </div>`
                }else {
                    htmlItem += `<div class="item">
                                    <div class="user">
                                        <img src=${avatar} class="avatar"/>
                                        <p class="name">${data[i].name}</p>
                                    </div>
                                    <div class="text">
                                        ${data[i].mes}
                                        <span class="time">${time}</span>
                                    </div>
                                </div>`
                }
                if ((i < data.length - 1) && (data[i].createAt.substring(0, 10) != data[i+1].createAt.substring(0, 10))) {
                    htmlItem += `<span class="date">${data[i].createAt.substring(0, 10)}</span>`
                }else if (i == data.length - 1) {
                    htmlItem += `<span class="date">${data[i].createAt.substring(0, 10)}</span>`
                }

            }

            if (chatListRef.current) {
                chatListRef.current.innerHTML = htmlItem;
            }
        })

        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
            handleGetChat()
            handleUpdateListUser(data.name)

        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }
    }, [isSeen]);





    const handleUpdateListUser = (username : string)=>{
        props.onUpdateUser(username);
    }

    const handleGetChat = () => {
        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: userChatTo,
                        page:1
                    }
                }
            }
        )

    }

    handleGetChat()

    const inputMessRef = useRef<HTMLInputElement>(null);

    const handleSeenInputClick = () => {
        const existingUserIndex = newestChat.findIndex((user:any) => user.name == userChatTo);
        if (existingUserIndex !== -1) {
            removeChat(userChatTo, user)
            props.onRemoveFromNewestChat(userChatTo)
        }
    }

    const handleSendChat = () => {
        var mess = ""
        if (inputMessRef.current) {
            mess = inputMessRef.current.value
            WebSocketService.sendMessage(
                {
                    action: "onchat",
                    data: {
                        event: "SEND_CHAT",
                        data: {
                            type: "people",
                            to: userChatTo,
                            mes: mess
                        }
                    }
                }
            )
            inputMessRef.current.value = ""
            saveChat(user, userChatTo)
            handleGetChat()
        }else{
            console.log("Input null")
        }
    }

    return (
        <div className="wrapper">
            <div className="header">
                <div className="info">
                    <img src={avatar}/>
                    <div className="title">
                        {/*<p className="name">Santosa Yoga Health</p>*/}
                        <p className="name">{userChatTo}</p>
                        <p className="locate">
                            <i className="fa-solid fa-location-dot"></i>
                            San Juan, Puerto Rico
                        </p>
                    </div>
                </div>
                <div className="action">
                    <i className="fa-solid fa-phone"></i>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div className="content" ref={chatListRef}>

            </div>

            <div className="chat-action">
                <div className="holder">
                    <input type="text" placeholder={"Type here"} ref={inputMessRef} onClick={handleSeenInputClick}/>
                    <i className="fa-solid fa-paperclip"></i>
                </div>
                <Button text={"Send"} className={"send"} onClick={handleSendChat}/>
            </div>
        </div>
    );
}