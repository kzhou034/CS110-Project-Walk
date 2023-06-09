const express = require('express');
const Room = require('../model/room');
const User = require('../model/user');
const router = express.Router()
const Message = require("../model/messages")
// TODO: add rest of the necassary imports


module.exports = router;

// temporary rooms


//Get all the rooms
router.get('/all', async (req, res) => {
    let ourRooms = [];
    let user = await User.findOne({username: req.session.username});
    for(let i=0; i<user.rooms.length; i++){
        ourRooms.push(user.rooms[i].name);
    }
    res.send(ourRooms);
});


router.post('/create', async (req, res) => { 
    // TODO: write necassary codesn to Create a new room
    console.log("create!"); 
    console.log("user " + req.session.username +" is trying to create room");
    var {name} = req.body;
    name = name.toLowerCase();
    // console.log("this is the req.body: " + req.body)
    console.log("roomName: " + req.body.name)
    const room = new Room (
        
        {
            name: name,
        }

    );
    
    //look through rooms folder in database and finds one room with the name "name"
    //set room1 equal to that room
    const room1 = await Room.findOne({name});

    console.log("room1 name: " + room1)

    try{
        if (!room1) { //if room1 is null, run this
            //looks through users folder in database and gets the rooms field to update
            let user = await User.findOne({username: req.session.username});
            user.rooms.push(room);
            user = await user.save();
            const dataSaved = await room.save();
            res.status(200).json(user);
        }
        else {
            console.log("room already exists")
        }
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
});


router.post('/join', async (req, res) => {
    // TODO: write necassary codes to join a new room
    var {name} = req.body;
    name = name.toLowerCase();
    //look through rooms folder in database and finds one room with the name "name"
    //set room1 equal to that room
    const room1 = await Room.findOne({name});

    console.log("room1 name: " + room1)
    try{
        if (room1) {//if room exists
            let user = await User.findOne({username: req.session.username});
            let inRoom = false;
            for(let i=0; i<user.rooms.length; i++){
                if (name == user.rooms[i].name)
                    inRoom = true;
            }
            if (inRoom) {//if user is already in the room
                console.log("user is already in room")
            }
            else { //otherwise, push the room in
                user.rooms.push(room1);
                user = await user.save();
                res.status(200).json(user);
                console.log("user joined room")
            }
            
        }
        else { //else, room doesn't exist
            console.log("room does not exist")
        }
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
    console.log("join finished");
});

router.delete('/leave', async (req, res) => {
    // TODO: write necassary codes to delete a room
    const {name} = req.body;
    try{
        let user = await User.findOne({username: req.session.username});

        for(let i=0; i<user.rooms.length; i++){
            if (name == user.rooms[i].name)
                user.rooms.splice(i, 1);
        }
        
        user = await user.save();
        res.status(200).json(user);
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
    console.log("leave");
});

router.get('/:roomID', async (req, res) => {
    const roomID = req.params.roomID;
    const room = await Room.findOne({ name: roomID });
    if(room) {
        const id = room._id;
        const messages = await Message.find({room: id});
        res.json({messages: messages, room: room});
    }
});
