import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
            user: undefined
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
        console.log(data);
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
    }

    render(){
        let fields = [];
        fields = ['name'];
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} onClick={() => alert(room)}>{room}</Button>
                }) : "loading..."}
                {/* write codes to enable user to create a new room*/}
                    <Form fields={fields} type="Create Room" submit={this.create} key={this.rooms}/>
                {/* write codes to join a new room using room id */}
                    <Form fields={fields} type="Join Room" submit={this.join} key={this.rooms}/>
                    <Form fields={fields} type="Leave Room" submit={this.leave} key={this.rooms}/>
            </div>
        );
    }
}

export default Lobby;