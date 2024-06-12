import {createBrowserRouter, Navigate} from "react-router-dom"
import App from "../App";
import Error from "../pages/Error";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <Error/>,
        children: [
            {
              path:'/',
              element: <Navigate to={"/login"}/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Register/>
            },
            {
                path: 'chat',
                element: <Chat/>
            }
        ]
    }
])