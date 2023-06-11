const express = require('express');
const User = require('../model/user');
const router = express.Router();

module.exports = router;

router.post('/'), async (req, res) => {
    const {session} = req;
    if(session.authenticated){
      res.json({msg: username, status: true});
    }
    else{
      res.json({msg: "Not logged in", status: false})
    }
  };

router.post('/login', async (req, res) => {
    const {session} = req;
    const { username, password } = req.body;

    console.log("this is session:" + req)
    console.log("this is reqbody:" + req.body)
    
    // check if user in database
    const user = await User.findOne({ username });
    
    if (!user)
      return res.json({ msg: "Incorrect Username ", status: false });
    else if (user.password !== password)
      return res.json({ msg: "Incorrect Password", status: false });
    else {
      session.authenticated = true;
      console.log("\n");
      console.dir(session, {depth:null})
      console.log("\n");
      console.log("\n");
      session.username = username;
      res.json({ msg: "Logged in", status: true, username: username });
      console.log("logged in!!!")
    }
});

// Set up a route for the logout page
router.get('/logout', (req, res) => {
  // Clear the session data and redirect to the home page
  req.session.destroy();
  res.send({msg: "Logged out", status: true})
});

router.post('/signup', async (req, res)=>{
  console.log("user is trying to signup")
  const {username, password, name} = req.body;
  console.log("this is the req.body: " + req.body)
  console.log(username, password, name)

  //prevents duplicate user names
  const userExists = await User.findOne({ username }); //search if user is in database
  if (!userExists) { 
    //if user does NOT exist, create one
    const user = new User ({
      username: username,
      password: password,
      name: name
    })
    //save the user to database
    try{
      const dataSaved = await user.save();
      console.log("datasaved: " + dataSaved)
      res.status(200).json(dataSaved);
    }
    catch (error){
        console.log(error);
        res.send("ERROR!")
    }
    
    console.log("user created")
  }
  else {
    console.log("user exists")
    return res.json({ msg: "User already taken", status: false });
  }

});