import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import {useEffect, useRef, useState} from "react";
import "../assets/css/chatContent.scss"
import WebSocketService from "../webSocket/webSocketService";
import convertTime, {getHourMinute} from "../utils/convertTime";
import {getChat, removeChat, saveChat} from "../Store/LocalStorage";

interface ChatMessage {
    name: "",
    type: "",
    to: "",
    mes: "",
    createAt: ""
}

export default function ChatContent(props : any) {



    const chatListRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);

    const [mess, setMess] = useState<ChatMessage[]>([]);
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


    let page2 = 1;
    // console.log("Prop: "+props.page)
    console.log("Pageoy:"+page2)
    useEffect(() => {
        handleGetChat()
        // page2.current = 1;

        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data : any) => {
            console.log(data.length)
            if (data.length > 0) {
                setMess((preData) => {
                    return [...preData, ...data]
                })
                console.log("Page: "+page2)
                console.log(data)
                console.log(mess)
            //
                page2++;
                handleGetChat()
            }else {
                console.log("ok")
                console.log(mess)
                console.log("Page OK: "+page2)
            //     handleAddInHtml(mess)
            }
        })

        // WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', (data : any) => {
        //     console.log(data.length)
        //     if (data.length > 0) {
        //         setMess(data)
        //
        //         plus()
        //         handleGetChat()
        //     }else {
        //         console.log("ok")
        //         handleAddInHtml(mess)
        //     }
        //     // isSeen = getChat(user, userChatTo) == "" ? true : false;
        //     // var htmlItem = ``
        //     //
        //     // for (let i = 0; i < data.length; i++) {
        //     //     var time =  getHourMinute(convertTime(data[i].createAt))
        //     //
        //     //     if (data[i].to != user){
        //     //         if (i==0) {
        //     //             if (isSeen) {
        //     //                 htmlItem += "<div class='status'>Đã xem</div>"
        //     //             }else {
        //     //                 htmlItem += "<div class='status'>Đã gửi</div>"
        //     //             }
        //     //         }
        //     //         console.log("U: "+user)
        //     //         htmlItem += `<div class="item my-chat">
        //     //                         <div class="text">
        //     //                             ${data[i].mes}
        //     //                             <span class="time">${time}</span>
        //     //                         </div>
        //     //                     </div>`
        //     //     }else {
        //     //         htmlItem += `<div class="item">
        //     //                         <div class="user">
        //     //                             <img src=${avatar} class="avatar"/>
        //     //                             <p class="name">${data[i].name}</p>
        //     //                         </div>
        //     //                         <div class="text">
        //     //                             ${data[i].mes}
        //     //                             <span class="time">${time}</span>
        //     //                         </div>
        //     //                     </div>`
        //     //     }
        //     //     if ((i < data.length - 1) && (data[i].createAt.substring(0, 10) != data[i+1].createAt.substring(0, 10))) {
        //     //         htmlItem += `<span class="date">${data[i].createAt.substring(0, 10)}</span>`
        //     //     }else if (i == data.length - 1) {
        //     //         htmlItem += `<span class="date">${data[i].createAt.substring(0, 10)}</span>`
        //     //     }
        //     //
        //     // }
        //     //
        //     // if (chatListRef.current) {
        //     //     chatListRef.current.innerHTML = htmlItem;
        //     // }
        // })

        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
            handleGetChat()
            handleUpdateListUser(data.name)

        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }
    }, []);

    useEffect(() => {
        console.log("Updated messages: ", mess);
        handleAddInHtml(mess);
    }, [mess]);

    useEffect(() => {
        setMess([]);
        handleGetChat();
    }, [userChatTo]);

    const handleAddInHtml = (data : ChatMessage[]) => {
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
    }

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
                        page:page2
                    }
                }
            }
        )
        console.log("PageGet: "+page2)
    }



    // const inputMessRef = useRef<HTMLInputElement>(null);

    const handleSeenInputClick = () => {
        const existingUserIndex = newestChat.findIndex((user:any) => user.name == userChatTo);
        if (existingUserIndex !== -1) {
            removeChat(userChatTo, user)
            props.onRemoveFromNewestChat(userChatTo)
        }
    }

    const handleSendChat = () => {
        var mess = ""
        if (textareaRef.current) {
            mess = textareaRef.current.value
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
            textareaRef.current.value = ""
            saveChat(user, userChatTo)
            handleGetChat()
        }else{
            console.log("Input null")
        }
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea && wrapperRef.current) {
            var text = textarea.value.length
            console.log(text)
            if (text > 80) {
                textarea.style.height = 'auto';
                const newHeight = Math.min(textarea.scrollHeight, 100);
                textarea.style.height = `${newHeight}px`;
                wrapperRef.current.style.height = "calc(100% + 50px)"
            }
        }
    };

    

    return (
        <div className="wrapper" ref={wrapperRef}>
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
                    <textarea ref={textareaRef} onInput={handleInput} className={"input-mess"} onClick={handleSeenInputClick} placeholder={"Type here"}></textarea>
                    {/*<input type="text" placeholder={"Type here"} ref={inputMessRef} onClick={handleSeenInputClick}/>*/}
                    <i className="fa-solid fa-paperclip"></i>
                </div>
                <Button text={"Send"} className={"send"} onClick={handleSendChat}/>
            </div>
        </div>
    );
}