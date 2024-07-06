import '../assets/css/infomationChat.scss'
import avatar from  '../assets/img/avatar.png';
import roomchat from '../assets/img/roomchat.png';
import React, {useState} from "react";
export default function InfomationChat(props : any) {
    const typeChat = props.type;
    const handleCloseInfo = () => {
        props.handleCloseInfo()
    }
    return (
        <div className={"info-chat-room"}>
            <div className={"chat-bar"}>
                <i className="fa-regular fa-circle-xmark" onClick={handleCloseInfo}></i>
                <p>Edit profile</p>
                <div className={"leave-btn"}>
                    <p>Leave group</p>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </div>
            </div>
            <div className={"avatar-chat"}>
                <img src={roomchat} alt={"anh dai dien"}/>
            </div>
            <p>{props.nameOfUserChat}</p>
            <h4>Leader</h4>
            <div className={"leader"}>
                <div className={"item"}>
                    <div className="item-info">
                        <img src={avatar} className="item-img" alt="Avatar"/>
                        <div className="title">
                            <p className="name">Leader Of team</p>
                        </div>
                    </div>
                </div>
            </div>
            <h4>Member</h4>
            <div className={"member"}>
                <div className={"item"}>
                    <div className="item-info">
                        <img src={avatar} className="item-img" alt="Avatar"/>
                        <div className="title">
                            <p className="name">Member</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}