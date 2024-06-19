import '../assets/css/base.scss'

export default function Chat() {
    return(
        <div className={"container"}>
            <div className="left">
                <div className="top">
                    <div className="logo">
                        PiCHAT
                    </div>
                    <div className="account">
                        <img src="../assets/img/avatar.png" className={"avatar"} alt="avatar"/>
                    </div>
                </div>
                <div className="search">
                    <input type="text" placeholder={"Search for groups and events"}/>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="chat-list">
                    <div className="item">
                        <img src="" alt="" className="item-img"/>
                        <div className="item-content">
                            <div className="title">
                                <p className="name">Welcome to Picnic</p>
                                <i className="fa-regular fa-comment-dots"></i>
                            </div>
                            <p className="desc">I want to ask about the group chat</p>
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
                    <div className="chat-room"></div>
                    <div className="event"></div>
                    <div className="location"></div>
                </div>
                <div className="chat-content"></div>
            </div>
        </div>
    )
}