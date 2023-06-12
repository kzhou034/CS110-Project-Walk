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
            scroll: undefined,
            edit: false,
            editMessage: null,
            editMessageText: '',
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
        }).then(() => {
            this.socket.on("incomingEditedMessage", this.incomingEditedMessage);
        });
    }

    incomingEditedMessage = (message) => {
        for(let i = 0; i < this.state.messages.length; ++i) {
            if(message._id === this.state.messages[i]._id) {
                this.state.messages[i].message.text = message.message.text;
                this.setState({ messages: this.state.messages });
            }
        }
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

    handleEdit = (sender, message) => {
        if (this.props.username != sender)
            alert("You can only edit your own messages!");
        else {
            if (this.state.edit)
                this.setState({edit: false});
            else  {
                this.setState({edit: true});
                this.setState({editMessage: message});
                this.setState({editMessageText: message.message.text})
            }
        }
    }

    handleEditChange = (e) => {
        this.setState({ editMessageText: e.target.value });
    }

    handleEditSubmit = (e) => {
        e.preventDefault();
        if(this.state.editMessageText.trim() != "") {
            const editedMessage = {
                _id : this.state.editMessage._id,
                message: {
                    text: this.state.editMessageText,
                },
                room: this.state.editMessage.room,
                sender: this.state.editMessage.sender,
            };
            this.socket.emit("editMessage", editedMessage);
        }
    }

    render(){
        const messageList = this.state.messages;
        var messageBody = document.querySelector(".messages");
        return(
            <div id="chatroom-display">
                {/* show chats */}
                {/* show chat input box*/}
                <div id="chatroom-nav">
                    <Button id="returnLobby" onClick={this.returnToLobby}>Return to Lobby</Button>
                </div>
                
                <div id="curr-chat">
                    <h1 id="chat-header">Current Chatroom: {this.props.roomID}</h1>
                </div>
                <div className="messageContainer">
                    <div className="messages">
                        {messageList.map((message) => {
                            return <div className="messagePost" {...messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight}>
                                <ul>
                                    <strong>{message.sender}: </strong>
                                    {message.message.text}
                                    <Button id="editMessage" onClick={() => this.handleEdit(message.sender, message)}>Edit</Button>
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
                
                <div id="edit-form">
                { this.state.edit && 
                    <div id="theform">
                        <form id="content" onSubmit={this.handleEditSubmit}>
                            <div id="textStuff">
                                <input id="newPost_text" type="text" placeholder='Edit message...' defaultValue={this.state.editMessageText} onChange={this.handleEditChange}></input>
                                <button id="newPost_submit">Edit Message</button>
                            </div>
                        </form>
                    </div>
                }
                </div>

            </div>
        );
    }
}

export default Chatroom;