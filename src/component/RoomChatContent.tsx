import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import React, {useEffect, useRef, useState} from "react";
import "../assets/css/chatContent.scss"
import WebSocketService from "../webSocket/webSocketService";
import convertTime, {getHourMinute} from "../utils/convertTime";
import {getChat, removeChat, saveChat} from "../Store/LocalStorage";
import EmojiPicker, {Emoji} from "emoji-picker-react";
import ReactDOM from "react-dom/client";



interface ChatMessage {
    name: "",
    type: "",
    to: "",
    mes: "",
    createAt: ""
}

export default function RoomChatContent(props : any) {

    const chatListRef = useRef<HTMLDivElement>(null);

    const [mess, setMess] = useState<ChatMessage[]>([]);
    const user = props.user;
    const userChatTo = props.userChatTo;
    const newestChat = props.newestChat;
    var isSeen = true;
    const page2Ref = useRef(1);
    let isFirst = true;
    const [end, isEnd] = useState(false)
    const [isOnline, setOnline] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)


    useEffect(() => {
        const handleStorageChange = () => {
            handleGetChat(1)
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    useEffect(() => {
        if (isFirst) {
            handleReset()
        }

    }, [userChatTo]);

    const handleReset = () => {
        console.log(userChatTo)
        // console.log(mess)
        console.log("start")
        if (chatListRef.current) {
            chatListRef.current.innerHTML = "";
        }
        page2Ref.current = 1
        console.log("ends: "+end)
        // setMess([])
        isFirst = false
        handleGetChat(1)
    }


    useEffect(() => {
        WebSocketService.registerCallback('GET_ROOM_CHAT_MES',  (data : any) => {
            console.log(data)
            console.log("LEN :"+data.chatDatalength)
            console.log("u: "+userChatTo)
            if (data.chatData.length > 0) {
                if (isFirst) {
                    isFirst = false
                    console.log("first false")
                }else {
                    console.log('ok')
                    // setMess((preData) => [...preData, ...data]);
                    handleAddInHtml(data.chatData)
                }
            }
        })


        WebSocketService.registerCallback('SEND_CHAT',  (data: any) => {
            console.log('SEND_CHAT')
            // handleReset();
            handleUpdateListUser(data.name, data.to, data.type);

        })

        WebSocketService.registerCallback('CHECK_USER', (data:any) => {
            // console.log(data)
            setOnline(data.status)
        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }



    }, [userChatTo]);




    useEffect(() => {
        handleCheckOnline()
    });

    const onlineRef = useRef<HTMLParagraphElement>(null);
    const handleSetOnlineUI = () => {
        if (onlineRef.current) {
            onlineRef.current.innerHTML = isOnline ? "Online" : 'Offline';
        }
    }

    useEffect(() => {
        handleSetOnlineUI()
    }, [isOnline]);

    const handleCheckOnline = () => {
        WebSocketService.sendMessage(
            {
                action: "onchat",
                data: {
                    event: "CHECK_USER",
                    data: {
                        user: userChatTo
                    }
                }
            }
        )
    }



    const handleAddInHtml = (data : ChatMessage[]) => {
        // console.log('update')
        if (chatListRef.current) {
            if (!(chatListRef.current.scrollHeight + chatListRef.current.scrollTop > 320 && chatListRef.current.scrollHeight + chatListRef.current.scrollTop < 330)){
                chatListRef.current.innerHTML = ""
            }
            // console.log(chatListRef.current.textContent)
        }
        isSeen = getChat(user, userChatTo) == "" ? true : false;
        var htmlItem = ``

        for (let i = 0; i < data.length; i++) {
            var time =  getHourMinute(convertTime(data[i].createAt))
            var messTokens = data[i].mes.split("|")
            var mess = "";
            for (let j = 0; j < messTokens.length; j++) {
                if (messTokens[j].substring(0, 29) == "https://cdn.jsdelivr.net/npm/") {
                    mess += `<img src="${messTokens[j]}" alt="grin" class="epr-emoji-img epr_-a3ewa5 epr_-tul3d0 epr_xfdx0l epr_-u8wwnq epr_dkrjwv __EmojiPicker__ epr_-dyxviy epr_-w2g3k2 epr_-8yncdp epr_szp4ut" loading="eager" style="font-size: 32px; height: 32px; width: 32px;"/>`
                }else {
                    mess += `<p>${messTokens[j]}</p>`;
                }
            }

            if (data[i].name == user){
                if (i==0) {
                    if (isSeen) {
                        htmlItem += "<div class='status'>Đã xem</div>"
                    }else {
                        htmlItem += "<div class='status'>Đã gửi</div>"
                    }
                }
                htmlItem += `<div class="item my-chat">
                                    <div class="text">
                                        ${mess}
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
                                        ${mess}
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
            // console.log('add in')
            chatListRef.current.innerHTML += htmlItem;
            // console.log(chatListRef.current.textContent)
        }

    }


    const handleUpdateListUser = (username : string, userChatTo:string, type:number)=>{
        if (chatListRef.current) {
            console.log("end end: " + end)
            // console.log(chatListRef.current.textContent)
            chatListRef.current.innerHTML = "";
            props.onUpdateUser(username, userChatTo, type);
            chatListRef.current.innerHTML = "";
            handleGetChat(1)
        }
    }



    const handleGetChat = (page:number) => {
        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'GET_ROOM_CHAT_MES',
                    data: {
                        name: userChatTo.toLowerCase(),
                        page: page
                    }
                }
            }
        )
    }

    const handleScroll = () => {
        // console.log('scr')
        if (chatListRef.current) {
            // console.log(chatListRef.current.scrollHeight)
            // console.log(chatListRef.current.scrollTop)
            if (chatListRef.current.scrollHeight + chatListRef.current.scrollTop > 320 && chatListRef.current.scrollHeight + chatListRef.current.scrollTop < 330){
                // console.log('up')
                page2Ref.current++
                handleGetChat(page2Ref.current)
            }
        }
    }




    const handleSeenInputClick = () => {
        const existingUserIndex = newestChat.findIndex((user:any) => user.name == userChatTo);
        if (existingUserIndex !== -1) {
            removeChat(userChatTo, user)
            props.onRemoveFromNewestChat(userChatTo)
        }
    }

    const [chatMess, setChatMess] = useState("")


    const handleSendChat = () => {
        var mess = ""
        if (textareaRef.current) {

            mess = chatMess


            WebSocketService.sendMessage(
                {
                    action: "onchat",
                    data: {
                        event: "SEND_CHAT",
                        data: {
                            type: "room",
                            to: userChatTo,
                            mes: mess
                        }
                    }
                }
            )
            textareaRef.current.value = ""
            setChatMess("")
            if (showEmoji) {
                setShowEmoji(!showEmoji)
            }
            saveChat(user, userChatTo)
            isEnd(!end)
            // console.log("End: "+end)
            handleReset()
            props.updateUserList(userChatTo);
            // setIconFirst(false)

        }else{
            console.log("Input null")
        }
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea && wrapperRef.current) {

            // console.log('ch')
            var value = textarea.value;
            setChatMess(value)

            var text = textarea.value.length
            if (text > 80) {
                textarea.style.height = 'auto';
                const newHeight = Math.min(textarea.scrollHeight, 100);
                textarea.style.height = `${newHeight}px`;
                wrapperRef.current.style.height = "calc(100% + 50px)"
            }else {
                textarea.style.height = 'auto';
                wrapperRef.current.style.height = "calc(100% + 100px)"
            }
        }
    };



    const handeleKeyDown =(event: React.KeyboardEvent<HTMLElement>)=>{
        if(event.key== 'Enter' && ! event.shiftKey){
            event.preventDefault();
            handleSendChat();
        }
    };
    const handleGetEmoji = (e : any) => {
        if (textareaRef.current) {
            if (chatMess.length > 0) {
                var value = chatMess + `|${e.imageUrl}`
                setChatMess(value)
                var valueShow = textareaRef.current.value
                textareaRef.current.value = valueShow + e.emoji
            }else {
                textareaRef.current.value = e.emoji
                setChatMess(`|${e.imageUrl}`)
            }
        }
    }
    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key === 'Enter' && chatMess.trim() !==""){
            e.preventDefault();
            handleSendChat()
        }
    }

    const handleOpenInfo = () => {
        props.handleOpenInfo()
    }
    
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
                        <p ref={onlineRef}></p>
                    </div>
                </div>
                <div className="action">
                    <i className="fa-solid fa-phone"></i>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <i className="fa-solid fa-ellipsis-vertical" onClick={handleOpenInfo}></i>
                </div>
            </div>
            <div className="content" ref={chatListRef} onScroll={handleScroll} >

            </div>


            <div className="chat-action">
                <div className="holder">
                    <textarea ref={textareaRef} onInput={handleInput} className={"input-mess"}
                              onClick={handleSeenInputClick} placeholder={"Type here"} onKeyPress={handleKeyPress}></textarea>
                    {/*<input type="text" placeholder={"Type here"} ref={inputMessRef} onClick={handleSeenInputClick}/>*/}
                    <i className="fa-regular fa-face-smile" onClick={()=>{setShowEmoji(!showEmoji)}}></i>
                    {showEmoji ? <EmojiPicker className={"emoji"} onEmojiClick={handleGetEmoji}/> : ""}
                </div>
                <Button text={"Send"} className={"send"} onClick={handleSendChat}/>
            </div>
        </div>
    );
}