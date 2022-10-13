const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async(req,res)=>{
    const user = {name:"users"};
    res.json(user);
})

module.exports = router;