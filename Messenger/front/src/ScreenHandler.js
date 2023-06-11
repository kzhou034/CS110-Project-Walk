import react from "react";
import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js";
import { Button } from '@mui/material';
import "./ScreenHandler.css"

const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{
    constructor(props){
        super(props);

        this.state = {
            screen: undefined,
            roomID: undefined,
            username: undefined,
        }
    }

    componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
        fetch(server_url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.message == "logged in"){
                    this.setState({screen: "lobby"});
                    this.setUsername(data.username);
                }
                else{
                    this.setState({screen: "auth"});
                }
            });
        });
    }

    changeScreen = (screen) => {
        this.setState({screen: screen});
    }

    changeRoom = (roomID) => {
        this.setState({roomID: roomID});
    }

    setUsername = (username) => {
        this.setState({username: username});
    }

    logout = (data) => {
        fetch(server_url + '/api/auth/logout', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
            
        }).then((res) => {
            res.json().then((data) => {
                if (data.message == "logged in"){
                    this.setState({screen: "lobby"});
                }
                else{
                    this.setState({screen: "auth"});
                }
            });
        });
        console.log("server url:" + server_url)
    }

    render(){
        let display = "loading...";
        if (this.state.screen == "auth"){
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen} setUsername={this.setUsername}/>
        }
        else if (this.state.screen == "lobby"){
            display = 
            <div>
                <div id="logout">
                    <Button id="logout-button" onClick={this.logout}>Logout</Button>
                </div>
                
                <Lobby server_url = {server_url} changeScreen={this.changeScreen} changeRoom={this.changeRoom} roomID={this.state.roomID}/>
            </div>
        }
        else if (this.state.screen == "chatroom"){
            display = <Chatroom server_url = {server_url} changeScreen={this.changeScreen} changeRoom={this.changeRoom} roomID={this.state.roomID} username={this.state.username}/>
        }
        return(
            <div>
                {display} 
            </div>
        );
    }
}

export default ScreenHandler;
