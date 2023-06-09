import react from "react";
import { Button } from '@mui/material';
import {io} from 'socket.io-client'
// import room from "../../../back/model/room";

class Chatroom extends react.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001', {
            cors: {
                origin: 'http://localhost:3001',
                credentials: true
            }, transports: ['websocket']
        });
        this.state = {
            messages: [],
            text: '',
            room: null,
        }
    }

    componentDidMount() {
        fetch(this.props.server_url + `/api/rooms/` + this.props.roomID, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({room: data})
            })
        });
    }

    returnToLobby = () => {
        this.props.changeScreen("lobby");
    };

    handleChange = (e) => {
        this.setState({ text: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.text.trim() != "") {
            console.log(this.props.username)
            const newMessage = {
                text: this.state.text,
                sender: this.props.username,
                room: this.state.room._id
            };
            this.socket.emit("sendMessage", newMessage);
            this.setState({text: ""});
        }
    }

    render(){
        return(
            <div>
                {/* show chats */}
                {/* show chat input box*/}
                <Button onClick={this.returnToLobby}>Return to Lobby</Button>
                <h1>Current Chatroom: {this.props.roomID}</h1>
                <ul>
                    {this.state.messages.map((message) => <li> {message.message.text} </li>)}
                </ul>
                <form id="content" onSubmit={this.handleSubmit} >
                    <input id="newPost_text" type="text" placeholder='Send a message...' onChange={this.handleChange}></input>
                    <button id="newPost_submit" >Submit</button>
                </form>
            </div>
        );
    }
}

export default Chatroom;