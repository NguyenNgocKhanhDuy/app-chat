import Button from "../component/Button";
import {Link} from "react-router-dom";
import '../css/login.css'
import {Simulate} from "react-dom/test-utils";

export default function Login() {
    const handleValidate = () => {
        const inputUserName = document.querySelector("#username") as HTMLInputElement;
        const inputPass = document.querySelector("#password") as HTMLInputElement;
        const error = document.querySelector(".error") as HTMLDivElement;
        const username = inputUserName.value;
        const pass = inputPass.value;

        if (username.length == 0 || pass.length == 0){
            error.style.display = "flex";
        }
        console.log("1")
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
              <div className="forgot-pass">
                  <Link to={"forget-pass"}>Forgot your password?</Link>
              </div>
              <Button onClick={handleValidate} text={"Login"}/>
              <div className="register">
                  <p>
                      Not register yet?
                      <Link to={"register"}> Create an Account</Link>
                  </p>
              </div>
          </div>
      </div>
    );
}