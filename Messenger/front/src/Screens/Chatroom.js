import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import {io} from 'socket.io-client'
import "./Chatroom.css"
// import room from "../../../back/model/room";

class Chatroom extends React.Component{
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
                this.setState({messages: data.messages})
                this.setState({room: data.room})
            })
        }).then(() => {
            this.socket.on("incomingMessage", this.incomingMessage);
        });
    }

    incomingMessage = (message) => {
        const newMessage = {
            message: {
                text: message.text,
            },
            room: message.room,
            sender: message.sender,
        }
        const updatedMessageList = [...this.state.messages, newMessage];
        this.setState({ messages: updatedMessageList });
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
            console.log(this.props)
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
        const messageList = this.state.messages;
        var messageBody = document.querySelector(".messages");
        return(
            <div>
                {/* show chats */}
                {/* show chat input box*/}
                <nav>
                    <Button id="returnLobby" onClick={this.returnToLobby}>Return to Lobby</Button>
                </nav>
                
                <h1>Current Chatroom: {this.props.roomID}</h1>
                <div className="messageContainer">
                    <div className="messages">
                        {messageList.map((message) => {
                            return <div className="messagePost" {...messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight}>
                                <ul>
                                    <strong>{message.sender}: </strong>
                                    {message.message.text}
                                </ul>
                            </div> 
                        })}
                    </div>
                    <form id="content" onSubmit={this.handleSubmit}>
                        <div id="textStuff">
                            <input id="newPost_text" type="text" placeholder='Send a message...' onChange={this.handleChange}></input>
                            <button id="newPost_submit">Send Message</button>
                        </div>
                    </form>
                </div>
                
                
            </div>
        );
    }
}

export default Chatroom;