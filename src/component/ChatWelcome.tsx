import bg from '../assets/img/bg.png';
import "../assets/css/chatWelcome.scss"
export default function ChatWelcome(){
    return (<div className={"welcome"}>
                <img src={bg} className={"bg"}/>
                <h2 className={"title"}>Hi, Welcome back</h2>
                <p className={"desc"}>Ready to chat with everyone and join your favourite events in this year? Let's chat with everyone</p>
            </div>)
}