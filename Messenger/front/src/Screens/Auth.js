import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";
import {io} from "socket.io-client";
import "./Auth.css"

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.socket = io("http://localhost:3001", {
            cors: {
                origin: "http://localhost:3001",
                credentials: true,
            },
            transports: ["websocket"],
        });
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        // TODO: write codes to login
        fetch(this.props.server_url + '/api/auth/login', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(data),
        }).then((res) => {
            res.json().then((data) => {
                if(data.msg == "Logged in") {
                    this.props.changeScreen("lobby");
                    this.props.setUsername(data.username);
                }
                else {
                    alert(data.msg);
                }
            });
        });
    }

    register = (data) => {
        // TODO: write codes to register
        fetch(this.props.server_url + '/api/auth/signup', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data),
        }).then((res) => {
            res.json().then((data) => {
                console.log(data.msg)
                if(data.msg !== "User already taken") {
                    alert("User registered. Proceed to Login page")
                    this.props.changeScreen("auth");
                }
                else {
                    alert(data.msg);
                }
            });
        });
        console.log(data);
    }

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['username', 'password'];
                display = <Form id="form-auth-display" fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'password', 'name'];
                display = <Form id="form-auth-display" fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
            }   
        }
        else{
            display = <div className="first-options">
                <Button id="options" onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                
                <Button id="options" onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
                </div>              
        }
        return(
            <div id="auth-header">
                <h1> Welcome to our Chat App! </h1>
                {display}
            </div>
        );
    }
}

export default Auth;