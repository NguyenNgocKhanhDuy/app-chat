import '../assets/css/button.css'
export default function Button(props : any) {
    return (<button className={props.className} onClick={props.onClick}>{props.text}</button>)
}