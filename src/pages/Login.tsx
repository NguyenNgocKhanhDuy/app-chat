import Button from "../component/Button";
import {Link} from "react-router-dom";
import '../css/login.css'

export default function Login() {
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
                          <input type="text" placeholder={"Username"}/>
                      </div>
                  </div>
                  <div className="wrapper">
                      <label>Password</label>
                      <div className="holder">
                          <i className="fa-solid fa-lock"></i>
                          <input type="password" placeholder={"Password"}/>
                      </div>
                  </div>
              </div>
              <div className="forgot-pass">
                  <Link to={"forget-pass"}>Forgot your password?</Link>
              </div>
              <Button text={"Login"}/>
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