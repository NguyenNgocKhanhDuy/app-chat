

import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import React, {useEffect, useRef, useState} from "react";
import "../assets/css/chatContent.scss"
import WebSocketService from "../webSocket/webSocketService";
import convertTime, {getHourMinute} from "../utils/convertTime";
import {getChat, removeChat, saveChat} from "../Store/LocalStorage";

import ReactDOM from "react-dom/client";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import InfomationChat from "./InfomationChat";

import EmojiPicker from "emoji-picker-react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../firebase/firebase";




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
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const [images, setImages] = useState<File[]>([]);
    const [urls, setUrls] = useState<String[]>([]);
    const [progress, setProgress] = useState(0);

    const handleChange = (e:any) => {
        if (e.target.files) {
            setImages([...e.target.files]);
        }
    };

    const handleUpload = () => {
        const promises: Promise<void>[] = [];
        images.forEach(image => {
            const uniqueId = "";
            const storageRef = ref(storage, `images/${uniqueId}-${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            promises.push(new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    error => {
                        console.log(error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const url = await getDownloadURL(storageRef);
                            setUrls(prevState => [...prevState, url]);
                            resolve();
                        } catch (error) {
                            console.log(error);
                            reject(error);
                        }
                    }
                );
            }));
        });

        Promise.all(promises)
            .then(() => console.log('All files uploaded'))
            .catch(err => console.log(err));
    };

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
        // console.log(userChatTo)
        // console.log(mess)
        // console.log("start")
        if (chatListRef.current) {
            console.log(chatListRef.current)
            chatListRef.current.innerHTML = "";
        }
        page2Ref.current = 1
        // console.log("ends: "+end)
        // setMess([])
        isFirst = false
        handleGetChat(1)
    }


    useEffect(() => {
        WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES',  (data : any) => {
            // console.log("LEN :"+data.length)
            // console.log(data)
            // console.log("u: "+userChatTo)
            if (data.length > 0) {
                if (isFirst) {
                    isFirst = false
                    // console.log("first false")
                }else {
                    // console.log('ok')
                    // setMess((preData) => [...preData, ...data]);
                    handleAddInHtml(data)
                }
            }
        })


        WebSocketService.registerCallback('SEND_CHAT',   (data: any) => {
            // console.log('SEND_CHAT')
            handleUpdateListUser(data.name, data.to, data.type);
            // await handleReset();

        })

        WebSocketService.registerCallback('CHECK_USER', (data:any) => {
            // console.log(data)
            setOnline(data.status)
        })


        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }

        return () => {
            WebSocketService.registerCallback('GET_PEOPLE_CHAT_MES', ()=>{})
        };

    }, [userChatTo]);



    // useEffect(() => {
    //     console.log("MESS: "+mess.length)
    //     if (mess.length > 0) {
    //         console.log('update')
    //         handleAddInHtml(mess)
    //         setMess([])
    //     }
    // }, [mess]);


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
            // console.log("LI: "+data[i].mes)
            var time =  getHourMinute(convertTime(data[i].createAt))
            var messTokens = data[i].mes.split("|")
            // console.log("MessTojken: "+messTokens)
            var mess = "";
            for (let j = 0; j < messTokens.length; j++) {
                if (messTokens[j].substring(0, 29) == "https://cdn.jsdelivr.net/npm/") {
                    // console.log("j="+j+" "+messTokens[j])
                    mess += `<img src="${messTokens[j]}" alt="grin" class="epr-emoji-img epr_-a3ewa5 epr_-tul3d0 epr_xfdx0l epr_-u8wwnq epr_dkrjwv __EmojiPicker__ epr_-dyxviy epr_-w2g3k2 epr_-8yncdp epr_szp4ut" loading="eager" style="font-size: 32px; height: 32px; width: 32px;"/>`
                }else {
                    mess += `<p>${messTokens[j]}</p>`;
                }
            }
            // console.log("AF: "+mess)

            if (data[i].to != user){
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
            // console.log("end end: " +end)
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
                    event: 'GET_PEOPLE_CHAT_MES',
                    data: {
                        name: userChatTo,
                        page: page
                    }
                }
            }
        )
        // page2++;
    }

    const handleScroll = () => {
        // console.log('scr')
        if (chatListRef.current) {
            // console.log(chatListRef.current.scrollHeight)
            // console.log(chatListRef.current.scrollTop)
            if (chatListRef.current.scrollHeight + chatListRef.current.scrollTop > 320 && chatListRef.current.scrollHeight + chatListRef.current.scrollTop < 330) {
                console.log('up')
                page2Ref.current++
                handleGetChat(page2Ref.current)
            }

            if (chatListRef.current) {
                const {scrollTop, scrollHeight, clientHeight} = chatListRef.current;
                // Kiểm tra nếu người dùng đã cuộn lên trên một khoảng nhất định
                if (scrollTop + clientHeight < scrollHeight - 200) {
                    setShowScrollToBottom(true);
                } else {
                    setShowScrollToBottom(false);
                }

                // // Logic tải thêm tin nhắn cũ
                // if (chatListRef.current.scrollTop < 10 && !end) {
                //     console.log('up');
                //     page2Ref.current++;
                //     handleGetChat(page2Ref.current);
                // }
            }
        }
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
            // const emojiRegEx = /\[([^\]]+)\]/g;
            // mess = mess.replace(emojiRegEx, (match, emojiChar) => {
            //     const emojiUnicode = unicodeToUnified(emojiChar);
            //     return emojiUnicode ? `<Emoji unified="1f9e5" size="25" />` : "ok";
            // });

            // console.log("Me: "+ mess)

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
            setChatMess("")
            if (showEmoji) {
                setShowEmoji(!showEmoji)
            }
            if (chatListRef.current) {
                chatListRef.current.innerHTML = ""
            }
            saveChat(user, userChatTo)
            // isEnd(false)
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
            // console.log(e)
            // console.log("ChatM: "+chatMess)
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

    function scrollToBottom() {
        if (chatListRef.current) {
            chatListRef.current.scrollTo({
                top: chatListRef.current.scrollHeight,
                behavior: 'smooth' });
        }
        setTimeout(() => {
            setShowScrollToBottom(false);
        }, 1000);


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
            <div className="content" ref={chatListRef} onScroll={handleScroll}>

            </div>
            <div className="chat-action">
                <div className="holder">
                    <textarea ref={textareaRef} onInput={handleInput} className={"input-mess"}
                              onClick={handleSeenInputClick} placeholder={"Type here"}
                              onKeyDown={handeleKeyDown}>
                    </textarea>
                    {/*<input type="text" placeholder={"Type here"} ref={inputMessRef} onClick={handleSeenInputClick}/>*/}
                    <i className="fa-regular fa-face-smile" onClick={() => {
                        setShowEmoji(!showEmoji)
                    }}></i>
                    {showEmoji ? <EmojiPicker className={"emoji"} onEmojiClick={handleGetEmoji}/> : ""}
                </div>
                <i className="fa-solid fa-image" onClick={handleUpload}></i>
                <Button text={"Send"} className={"send"} onClick={handleSendChat}/>
            </div>
            {showScrollToBottom && (
                <div className="scroll-to-bottom" onClick={scrollToBottom}>
                    <i className="fa-solid fa-arrow-down"></i>
                </div>
            )}
        </div>
    );
}
