import Button from "../component/Button";
import {Link, useNavigate} from "react-router-dom";
import '../css/register.css'
import {useEffect} from "react";
import WebSocketService from "../webSocket/webSocketService";

export default function Register() {
    const navigate = useNavigate();
    useEffect(() => {
        WebSocketService.connect("ws://140.238.54.136:8080/chat/chat")
        WebSocketService.registerCallback('REGISTER', (data : any) => {
            console.log(`Register response: ${data}`)
            const error = document.querySelector(".error") as HTMLDivElement;
            const errorText = document.querySelector(".error .error-text") as HTMLParagraphElement;
            data = data.substring(0, 3) == 'nlu' ? '' : data;
            if (data != ''){
                errorText.innerText = data;
                error.style.display = "flex"
            }else {
                navigate('/chat')
            }
        })
    }, []);

    const handlerRegister = (user:string, pass:string) => {
        WebSocketService.sendMessage(
            {
                action: 'onchat',
                data: {
                    event: 'REGISTER',
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
        const inputConfirmPass = document.querySelector("#confirmPassword") as HTMLInputElement;
        const inputemail = document.querySelector("#email") as HTMLInputElement;

        const error = document.querySelector(".error") as HTMLDivElement
        const errorConfirmPassword = document.querySelector(".error-password-confirm") as HTMLDivElement;

        const username = inputUserName.value;
        const pass = inputPass.value;
        const confirmPass = inputConfirmPass.value;
        const email = inputemail.value;


        if (username.length == 0 || pass.length == 0 || email.length == 0){
            error.style.display = "flex";
        } else if (pass !== confirmPass) {
            errorConfirmPassword.style.display = "flex";

        }
         else {
            handlerRegister(username, pass)
        }
    }

    const handleHideError = () => {
        const error = document.querySelector(".error") as HTMLDivElement;
        const errorConfirmPassword = document.querySelector(".error-password-confirm") as HTMLDivElement;
        error.style.display = "none"
        errorConfirmPassword.style.display = "none";

    }

    return (
      <div className={"container"}>
          <div className="box">
              <div className="form">
                  <h3 className="title">Let`s get started</h3>
                  <p className="sub_title">Join us here, a better place for every conversation</p>
                  <div className="wrapper">
                      <label>Username</label>
                      <div className="holder">
                          <i className="fa-solid fa-user"></i>
                          <input onChange={handleHideError} type="text" placeholder={"Username"} id={"username"}/>
                      </div>
                  </div>
                  <div className="wrapper">
                      <label>Email Address</label>
                      <div className="holder">
                          <i className="fa-regular fa-envelope"></i>
                          <input onChange={handleHideError} type="text" placeholder={"Email@example.com"} id={"email"}/>
                      </div>
                  </div>
                  <div className="wrapper">
                      <label>Password</label>
                      <div className="holder">
                          <i className="fa-solid fa-lock"></i>
                          <input onChange={handleHideError} type="password" placeholder={"Password"} id={"password"}/>
                      </div>
                  </div>
                  <div className="wrapper">
                      <label>Confirm Password</label>
                      <div className="holder">
                          <i className="fa-solid fa-lock"></i>
                          <input onChange={handleHideError} type="password" placeholder={"Confirm password"}
                                 id={"confirmPassword"}/>
                      </div>
                  </div>
              </div>
              <div className="error">
                  <i className="fa-solid fa-circle-info"></i>
                  <p className={"error-text"}>Please enter register information.</p>
              </div>
              <div className="error-password-confirm">
                  <i className="fa-solid fa-circle-info"></i>
                  <p className={"error-text"}>Password and confirm password do not match. Please try again.</p>
              </div>
              <div className="accept">
                  <p>I accept the <Link to={"register"}>Terms of service</Link> and <Link to={"register"}>Privacy
                      policy</Link></p>
              </div>
              <Button onClick={handleValidate} text={"Sign up"}/>
              <div className="login">
                  <p>
                      Already a Member?
                      <Link to={"/login"}>Login</Link>
                  </p>
              </div>
          </div>
      </div>
    );
}