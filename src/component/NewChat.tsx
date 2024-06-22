import avatar from "../assets/img/avatar.png";
import Button from "./Button";
import {useEffect, useRef} from "react";
import "../assets/css/chatContent.scss"

export default function NewChat() {
    const chatListRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight });
        }
    }, []);
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
                <div className="item">
                    <div className="user">
                        <img src={avatar} className={"avatar"}/>
                        <p className="name">Monica22</p>
                    </div>
                    <div className="text">
                        Hi
                    </div>
                </div>
                <div className="item my-chat">
                    <div className="text">
                       What's up bro?
                    </div>
                </div>
                <div className="item">
                    <div className="user">
                        <img src={avatar} className={"avatar"}/>
                        <p className="name">Monica22</p>
                    </div>
                    <div className="text">
                        Hi, how's going?
                    </div>
                </div>


                <div className="item my-chat">
                    <div className="text">
                        Hi, how's going?
                    </div>
                </div>
                <div className="item">
                    <div className="user">
                        <img src={avatar} className={"avatar"}/>
                        <p className="name">Monica22</p>
                    </div>
                    <div className="text">
                        Hi, how's going?
                    </div>
                </div>
                <div className="item">
                    <div className="user">
                        <img src={avatar} className={"avatar"}/>
                        <p className="name">Monica22</p>
                    </div>
                    <div className="text">
                        Hi, how's going?
                    </div>
                </div>
            </div>
            <div className="chat-action">
                <div className="holder">
                    <input type="text" placeholder={"Type here"}/>
                    <i className="fa-solid fa-paperclip"></i>
                </div>
                <Button text={"Send"} className={"send"}/>
            </div>
        </div>
    );
}