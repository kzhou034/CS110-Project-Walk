const express = require('express');
const Room = require('../model/room');
const User = require('../model/user');
const router = express.Router()
// TODO: add rest of the necassary imports


module.exports = router;

// temporary rooms


//Get all the rooms
router.get('/all', async (req, res) => {
    let ourRooms = [];
    let user = await User.findOne({username: req.session.username});
    // console.log("saokdo" + user.rooms.length);
    for(let i=0; i<user.rooms.length; i++){
        ourRooms.push(user.rooms[i]/*.name*/);
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
    
    const room1 = await Room.findOne({name});

    try{
        if (!room1) {
            //looks through users folder in database and gets the rooms field to update
            let user = await User.findOne({username: req.session.username});
            user.rooms.push(name);
            user = await user.save();
            const dataSaved = await room.save();
            // console.log("username: " + req.session.username);
            // rooms.push(room);
            // console.log("THE ROOM IS SIZE:" + rooms.length);
            // console.log("datasaved: " + dataSaved)
            res.status(200).json(user);
        }
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
});


router.post('/join', async (req, res) => {
    // TODO: write necassary codes to join a new room
    const {name} = req.body;
    try{
        let user = await User.findOne({username: req.session.username});
        user.rooms.push(name);
        user = await user.save();
        res.status(200).json(user);
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
    console.log("join");
});

router.delete('/leave', async (req, res) => {
    // TODO: write necassary codes to delete a room
    const {name} = req.body;
    try{
        let user = await User.findOne({username: req.session.username});

        for(let i=0; i<user.rooms.length; i++){
            if (name == user.rooms[i])
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