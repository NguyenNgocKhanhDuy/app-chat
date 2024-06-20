import '../assets/css/chat.scss'
import avatar from  '../assets/img/avatar.png';
import Button from "../component/Button";
import {useState} from "react";
import ChatWelcome from "../component/ChatWelcome";
import ChatContent from "../component/ChatContent";

export default function Chat() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => setIsChatOpen(true);

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
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                    <div className="item" onClick={toggleChat}>
                        <div className="item-info">
                            <img src={avatar} className="item-img"/>
                            <div className="item-content">
                                <div className="title">
                                    <p className="name">Welcome to Picnic</p>
                                    <i className="fa-regular fa-comment-dots"></i>
                                </div>
                                <p className="desc">I want to ask about the group chat</p>
                            </div>
                        </div>
                        <div className="item-status">
                            <p className="time">Just now</p>
                            <p className="amount">1</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="top">
                    <div className="action">
                        <Button icon={<i className="fa-solid fa-location-dot"></i>} text={"Chat Rooms"}
                                    className={"chat-room"}/>
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
                    {isChatOpen ? <ChatContent/> : <ChatWelcome/>}
                </div>
            </div>
        </div>
    )
}