import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import {useEffect, useRef} from "react";
import "../assets/css/chatContent.scss"
import WebSocketService from "../webSocket/webSocketService";

export default function ChatContent(props : any) {
    const chatListRef = useRef<HTMLDivElement>(null);
    const user = props.user.user;

    useEffect(() => {
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data : any) => {
            console.log(data)

            var htmlItem = ``

            for (let i = 0; i < data.length; i++) {
                if (data[i].to != user){
                    console.log(user)
                    htmlItem += `<div class="item my-chat">
                                    <div class="text">
                                        ${data[i].mes}
                                        <span class="time">${data[i].createAt}</span>
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
                                        <span class="time">${data[i].createAt}</span>
                                    </div>
                                </div>`
                }
            }

            if (chatListRef.current) {
                chatListRef.current.innerHTML = htmlItem;
            }
        })

        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
            handleGetChat()
        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }
    }, []);

    const handleGetChat = () => {
        var host = ""
        if (user == "21130035") {
            host = "duy035"
            console.log("host")
        }else {
           host = "21130035"
        }

        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: host,
                        page:1
                    }
                }
            }
        )

    }

    handleGetChat()

    const inputMessRef = useRef<HTMLInputElement>(null);
    const handleSendChat = () => {
        var userChatTo = ""
        if (user == "21130035") {
            userChatTo = "duy035"
        }else {
            userChatTo = "21130035"
        }
        var mess = ""
        if (inputMessRef.current) {
            mess = inputMessRef.current.value
            console.log("log: "+mess)
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
                        <p className="name">Santosa Yoga Health</p>
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

            {/*<div className="content" ref={chatListRef}>*/}
            {/*    <div className="item">*/}
            {/*        <div className="user">*/}
            {/*            <img src={avatar} className={"avatar"}/>*/}
            {/*            <p className="name">Monica22</p>*/}
            {/*        </div>*/}
            {/*        <div className="text">*/}
            {/*            Hi, how's going?*/}
            {/*            <span className={"time"}>2024-06-21 11:40:12</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="item">*/}
            {/*        <div className="user">*/}
            {/*            <img src={avatar} className={"avatar"}/>*/}
            {/*            <p className="name">Monica22</p>*/}
            {/*        </div>*/}
            {/*        <div className="text">*/}
            {/*            Hi, how's going?*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="item my-chat">*/}
            {/*        <div className="text">*/}
            {/*            Yes, you can swap with paying you network power.*/}
            {/*            <span className={"time"}>2024-06-21 11:40:12</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="item my-chat">*/}
            {/*        <div className="text">*/}
            {/*            Hi, how's going?*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="item">*/}
            {/*        <div className="user">*/}
            {/*            <img src={avatar} className={"avatar"}/>*/}
            {/*            <p className="name">Monica22</p>*/}
            {/*        </div>*/}
            {/*        <div className="text">*/}
            {/*            Hi, how's going?*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="item">*/}
            {/*        <div className="user">*/}
            {/*            <img src={avatar} className={"avatar"}/>*/}
            {/*            <p className="name">Monica22</p>*/}
            {/*        </div>*/}
            {/*        <div className="text">*/}
            {/*            Hi, how's going?*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="chat-action">
                <div className="holder">
                    <input type="text" placeholder={"Type here"} ref={inputMessRef}/>
                    <i className="fa-solid fa-paperclip"></i>
                </div>
                <Button text={"Send"} className={"send"} onClick={handleSendChat}/>
            </div>
        </div>
    );
}