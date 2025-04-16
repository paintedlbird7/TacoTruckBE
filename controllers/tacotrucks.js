// controllers/tacotrucks.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Tacotruck = require("../models/tacotruck.js");
const router = express.Router();

// add routes here
router.post("/", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id;
      const tacotruck = await Tacotruck.create(req.body);
      tacotruck._doc.author = req.user;
      res.status(201).json(tacotruck);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });  

//   GET /tacotrucks - READ Route "Protected"
router.get("/", verifyToken, async (req, res) => {
    try {
      const tacotrucks = await Tacotruck.find({})
        .populate("author")
        .sort({ createdAt: "desc" });
      res.status(200).json(tacotrucks);
    } catch (err) {
        console.log(error)
      res.status(500).json({ err: err.message });
    }
  });
  
  //GET /tacotrucks/:htacotruckId
router.get("/:tacotruckId", verifyToken, async (req, res) => {
    try {
    //   const tacotruck = await Tacotrucks.findById(req.params.tacotruckId).populate("author");
      // populate author of tacotrucks and comments
      const tacotruck = await Tacotruck.findById(req.params.tacotruckId).populate([
        'author',
        'comments.author',
      ]);  
    res.status(200).json(tacotruck);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

  //PUT /tacotrucks/:tacotruckId
router.put("/:tacotruckId", verifyToken, async (req, res) => {
    try {
      // Find the tacotruck:
      const tacotruck = await Tacotruck.findById(req.params.tacotruckId);
  
      // Check permissions:
      if (!tacotruck.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      // Update tacotruck:
      const updatedTacotruck = await Tacotruck.findByIdAndUpdate(
        req.params.tacotruckId,
        req.body,
        { new: true }
      );
  
      // Append req.user to the author property:
      updatedTacotruck._doc.author = req.user;
  
      // Issue JSON response:
      res.status(200).json(updatedTacotruck);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });


  //DELETE /tacotrucks/:tacotruckId
router.delete("/:tacotruckId", verifyToken, async (req, res) => {
    try {
      const tacotruck = await Tacotruck.findById(req.params.tacotruckId);
  
      if (!tacotruck.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedTacotruck = await Tacotruck.findByIdAndDelete(req.params.tacotruckId);
      res.status(200).json(deletedTacotruck);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
  //POST /tacotrucks/:tacotruckId/comments
router.post("/:tacotruckId/comments", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id; // adding requested user as the author
      const tacotruck = await Tacotruck.findById(req.params.tacotruckId); 
      tacotruck.comments.push(req.body);
      await tacotruck.save();
  
      // Find the newly created comment:
      const newComment = tacotruck.comments[tacotruck.comments.length - 1];
  
      newComment._doc.author = req.user; // add requesting user's details
  
      // Respond with the newComment:
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
module.exports = router;
