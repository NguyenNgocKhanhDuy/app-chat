import '../assets/css/button.css'
export default function Button(props : any) {
    return (<button onClick={props.onClick}>{props.text}</button>)
}