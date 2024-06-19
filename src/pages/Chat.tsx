import '../assets/css/chat.scss'
import avatar from  '../assets/img/avatar.png'
import Button from "../component/Button";

export default function Chat() {
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
                    <div className="item">
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
                    <div className="content">
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

                        <div className="item my-chat">
                            <div className="text">
                                Yes, you can swap with paying you network power.
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
            </div>
        </div>
    )
}