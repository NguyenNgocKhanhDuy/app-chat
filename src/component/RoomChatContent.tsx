import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import {useEffect, useRef, useState} from "react";
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

export default function ChatContent(props : any) {

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
            handleGetChat()
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
        // console.log(userChatTo)
        // console.log(mess)
        // console.log("start")
        page2Ref.current = 1
        // setMess([])
        isFirst = false
        handleGetChat()
    }


    useEffect(() => {
        const handleAddChat = (data:any) => {
            console.log(data)
            // console.log("LEN :"+data.length)
            if (data.chatData.length > 0) {
                if (isFirst) {
                    isFirst = false
                    console.log("first false")
                }else {
                    // console.log("userchatto: "+userChatTo)
                    console.log('ok')
                    // var chatData = data.chatData
                    setMess((preData) => [...preData, ...data.chatData]);
                    // console.log("PAGE1: " + page2Ref.current);
                    page2Ref.current++;
                    // console.log("PAGE2: " + page2Ref.current);
                    handleGetChat()
                }
            } else {
                // console.log("end1: "+end)
                console.log("No more data available for page " + page2Ref.current);
                isEnd(!end)
                // console.log("end2: "+end)
            }
        }


        WebSocketService.registerCallback('GET_ROOM_CHAT_MES', handleAddChat)


        WebSocketService.registerCallback('SEND_CHAT', (data: any) => {
            handleGetChat()
            handleUpdateListUser(data.name)

        })

        WebSocketService.registerCallback('CHECK_USER', (data:any) => {
            // console.log(data)
            setOnline(data.status)
        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }

        return () => {
            WebSocketService.registerCallback('GET_ROOM_CHAT_MES', ()=>{})
        };

    }, [userChatTo]);



    useEffect(() => {
        console.log("MESS: "+mess.length)
        if (mess.length > 0) {
            console.log('update')
            handleAddInHtml(mess)
            setMess([])
        }
    }, [end]);

    useEffect(() => {
        // console.log('End state changed:', end);
        if (end) {
            console.log('Reached end, no more data to fetch');
            // Handle end of chat messages scenario
        }
    }, [end]);

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
        // console.log('set')
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
        isSeen = getChat(user, userChatTo) == "" ? true : false;
        var htmlItem = ``

        for (let i = 0; i < data.length; i++) {
            // console.log("LI: "+data[i].mes)
            var time =  getHourMinute(convertTime(data[i].createAt))

            var mesChat1 = data[i].mes.split("|")[0]
            var mesChat2 = data[i].mes.split("|")[1]
            // console.log("Mes1: "+mesChat1)
            // console.log("Mes2: "+mesChat2)
            var check = false;
            var submes2 = ""
            if (mesChat2 != undefined) {
                console.log('Mes1: '+mesChat1)
                submes2 = mesChat2.substring(0, 29)
                if (submes2 == "https://cdn.jsdelivr.net/npm/") {
                    check = true;
                    console.log(check)
                }
                console.log('submes2: '+submes2)
                console.log("Mes2: "+mesChat2)
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
                                        ${check ?
                                        `${mesChat1} <img src="${mesChat2}" alt="grin" class="epr-emoji-img epr_-a3ewa5 epr_-tul3d0 epr_xfdx0l epr_-u8wwnq epr_dkrjwv __EmojiPicker__ epr_-dyxviy epr_-w2g3k2 epr_-8yncdp epr_szp4ut" loading="eager" style="font-size: 32px; height: 32px; width: 32px;">` 
                                        : data[i].mes
                                        }
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

    // Function to convert Unicode codes to emojis

    function convertSpecialCharacters(text:string) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/=/g, '&#61;');
    }

    const handleUpdateListUser = (username : string)=>{
        props.onUpdateUser(username, 1);
    }



    const handleGetChat = () => {
        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'GET_ROOM_CHAT_MES',
                    data: {
                        name: userChatTo.toLowerCase(),
                        page: page2Ref.current
                    }
                }
            }
        )
        // page2++;
    }



    // const inputMessRef = useRef<HTMLInputElement>(null);

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
            console.log("ME: "+mess)
            // const emojiRegEx = /\[([^\]]+)\]/g;
            // mess = mess.replace(emojiRegEx, (match, emojiChar) => {
            //     const emojiUnicode = unicodeToUnified(emojiChar);
            //     return emojiUnicode ? `<Emoji unified="1f9e5" size="25" />` : "ok";
            // });

            console.log("Me: "+ mess)

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
            // if (showEmoji) {
            //     setShowEmoji(!showEmoji)
            // }
            saveChat(user, userChatTo)
            isEnd(!end)
            console.log("End: "+end)
            handleReset()
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

            console.log('ch')
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

const [iconFirst, setIconFirst] = useState(false)


    const handleGetEmoji = (e : any) => {
        if (textareaRef.current) {
            console.log(e)
            console.log("ChatM: "+chatMess)
            if (chatMess.length > 0) {
                // console.log('1')
                var value = chatMess + `|${e.imageUrl}`
                setChatMess(value)
                var valueShow = textareaRef.current.value
                textareaRef.current.value = valueShow + e.emoji
            }else {
                // console.log('2')
                textareaRef.current.value = e.emoji
                setChatMess(`|${e.imageUrl}`)
                // setIconFirst(true)
            }
            // console.log(e)
        }
    }
    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key === 'Enter' && chatMess.trim() !==""){
            e.preventDefault();
            handleSendChat()
        }

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
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
            <div className="content" ref={chatListRef}>

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