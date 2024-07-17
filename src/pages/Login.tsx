import Button from "../component/Button";
import {Link, useNavigate} from "react-router-dom";
import '../assets/css/login.scss'
import {useEffect} from "react";
import WebSocketService from "../webSocket/webSocketService";
import {useDispatch} from "react-redux";
import {setCode, setUser} from "../Store/Action";
import {saveCode, saveUser} from "../Store/LocalStorage";


export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSetUser = (username : string, code : string) => {
        dispatch(setUser(username));
        dispatch(setCode(code))
    };

    useEffect(() => {
        WebSocketService.connect("ws://140.238.54.136:8080/chat/chat")
        WebSocketService.registerCallback('LOGIN', (data : any) => {
            // console.log(`Login response: ${data}`)
            const code = data
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
            localStorage.setItem("id", data)
            data = data.substring(0, 3) == 'nlu' ? '' : data;
            if (data != ''){
                errorText.innerText = data;
                error.style.display = "flex"
            }else {
                const inputUserName = document.querySelector("#username") as HTMLInputElement;
                const username = inputUserName.value;
                handleSetUser(username, code);
                saveUser(username)
                saveCode(code)
                navigate('/chat')
            }
        })
    }, []);

    const handleLogin = (user:string, pass:string) => {
        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'LOGIN',
                    data: {
                        user: user,
                        pass: pass
                    }
                }
            }
        )

    }

    const handleValidate = () => {
        const inputUserName = document.querySelector("#username") as HTMLInputElement;
        const inputPass = document.querySelector("#password") as HTMLInputElement;
        const error = document.querySelector(".error") as HTMLDivElement;
        const username = inputUserName.value;
        const pass = inputPass.value;

        if (username.length == 0 || pass.length == 0){
            error.style.display = "flex";
        }else {
            handleLogin(username, pass)
        }
    }

    const handleHideError = () => {
        const error = document.querySelector(".error") as HTMLDivElement;
        error.style.display = "none"
    }

    return (
      <div className={"container"}>
          <div className="box">
              <div className="form">
                  <h3 className="title">Hi, Welcome back</h3>
                  <p className="sub_title">Enter your username and password to sign in</p>
                  <div className="wrapper">
                      <label>Username</label>
                      <div className="holder">
                          <i className="fa-solid fa-user"></i>
                          <input onChange={handleHideError} type="text" placeholder={"Username"} id={"username"}/>
                      </div>
                  </div>
                  <div className="wrapper">
                      <label>Password</label>
                      <div className="holder">
                          <i className="fa-solid fa-lock"></i>
                          <input onChange={handleHideError} type="password" placeholder={"Password"} id={"password"}/>
                      </div>
                  </div>
              </div>
              <div className="error">
                  <i className="fa-solid fa-circle-info"></i>
                  <p className={"error-text"}>Please enter login information.</p>
              </div>

              {/*<div className="forgot-pass">*/}
              {/*    <Link to={"forget-pass"}>Forgot your password?</Link>*/}
              {/*</div>*/}
              <Button onClick={handleValidate} text={"Login"}/>
              <div className="register">
                  <p>
                      Not register yet?
                      <Link to={"/register"}> Create an Account</Link>
                  </p>
              </div>
          </div>
      </div>
    );
}