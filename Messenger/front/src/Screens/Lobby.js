import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";
import "./Lobby.css"
// const socketIO = require('socket.io');
import {io} from "socket.io-client";
const socket = io.connect("http://localhost:3001");

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
            user: undefined,
            showForm: false,
            selectedForm: undefined,
        }
    }

    componentDidMount(){
        // TODO: write codes to fetch all rooms from server
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({rooms:data})
            })
        });
    }
    
    create = (data) => {
        // TODO: write codes to register
        fetch(this.props.server_url + '/api/rooms/create', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data),
        });
        this.state.rooms.push(data.name);
        this.setState({ rooms: this.state.rooms });
    }

    join = (data) => {
        // TODO: write codes to join room
        fetch(this.props.server_url + '/api/rooms/join', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data),
        });
        this.state.rooms.push(data.name);
        this.setState({ rooms: this.state.rooms });
    }
    
    leave = (data) => {
        // TODO: write codes to join room
        fetch(this.props.server_url + '/api/rooms/leave', {
            method: "DELETE",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data),
        });
        //button to join room disappears upon submission
        this.state.rooms.splice(this.state.rooms.indexOf(data), 1);
        this.setState({ rooms: this.state.rooms });
    }

    enterChat = (roomID) => {
        this.props.changeRoom(roomID)
        this.props.changeScreen("chatroom")
    };

    closeForm = () => {
        this.setState({showForm: false})
    }

    render(){
        let display = null;
        let fields = [];
        fields = ['name'];
        if (this.state.showForm){
            if (this.state.selectedForm === "create_room"){
                display = <Form id="formOptions" fields={fields} close={this.closeForm} type="Create Room" submit={this.create} key={this.state.selectedForm}/>
            }
            else if (this.state.selectedForm === "join_room"){
                display = <Form id="formOptions" fields={fields} close={this.closeForm} type="Join Room" submit={this.join} key={this.state.selectedForm}/>
            }
            else if (this.state.selectedForm === "leave_room"){
                display = <Form id="formOptions" fields={fields} close={this.closeForm} type="Leave Room" submit={this.leave} key={this.state.selectedForm}/>
            }
        }
        else{
            display = <div>
                <Button id="navOptions" onClick={() => this.setState({showForm: true, selectedForm:"create_room"})}> Create a Chatroom </Button>
                <Button id="navOptions" onClick={() => this.setState({showForm: true, selectedForm: "join_room"})}> Join a Chatroom </Button>
                <Button id="navOptions" onClick={() => this.setState({showForm: true, selectedForm: "leave_room"})}> Leave a Chatroom </Button>
            </div>
        }

        return(
            // <div>
            //     <h1>Lobby</h1>
            //     {this.state.rooms ? this.state.rooms.map((room) => {
            //         return <Button variant="contained" key={"roomKey"+room} onClick={() => this.enterChat(room)}>{room}</Button>
            //     }) : "loading..."}
            //     {/* write codes to enable user to create a new room*/}
            //         <Form fields={fields} close={this.closeForm} type="Create Room" submit={this.create} key={this.rooms}/>
            //     {/* write codes to join a new room using room id */}
            //         <Form fields={fields} type="Join Room" submit={this.join} key={this.rooms}/>
            //         <Form fields={fields} type="Leave Room" submit={this.leave} key={this.rooms}/>
            // </div> 
            <div id="lobby-bg">
                {display}
                <div id="lobby-display">
                    <div id="lobby-header"><h1>Lobby</h1></div>
                    <div id="yourchats">
                        <h3>Your Chatrooms: </h3>
                        {this.state.rooms ? this.state.rooms.map((room) => {
                            return <div className="room-buttons">
                                <div  id="roomButton">
                                    <Button variant="contained" key={"roomKey"+room} onClick={() => this.enterChat(room)}>{room}</Button>
                                </div>
                            </div>
                        }) : "loading..."}
                    </div>
                    
                </div>
                
                
            </div>
        )
    }
}

export default Lobby;