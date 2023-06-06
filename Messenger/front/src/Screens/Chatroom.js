import react from "react";
import {io} from 'socket.io-client'

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
            text: ''
        }
    }

    componentDidMount() {
        console.log("rooms: " + this.props.rooms);
        let data = {};
        data["roomID"] = this.props.roomID
        console.log("roomID: " + data["roomID"])
        fetch(this.props.server_url + '/api/rooms/' + data["roomID"], {
            method: "POST",
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

    render(){
        return(
            <div>
                {/* show chats */}
                {/* show chat input box*/}
                Chatroom
                <ul>
                    {this.state.messages.map((message) => <li> (message.message.text) </li>)}
                </ul>
            </div>
        );
    }
}

export default Chatroom;