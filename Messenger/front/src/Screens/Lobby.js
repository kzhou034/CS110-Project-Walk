import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
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


    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} onClick={() => alert(room)}>{room}</Button>
                }) : "loading..."}
                {/* write codes to enable user to create a new room*/}
                <form action="http://localhost:3001/api/rooms/create" method="POST">
                    <div>
                        <label>Create a New Room</label>
                        <input></input>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                {/* write codes to join a new room using room id */}
                <form action="http://localhost:3001/api/rooms/join" method="POST">
                    <div>
                        <label>Join an Existing Room</label>
                        <input></input>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default Lobby;