const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../schemas/message");

router.get("/:userID", async (req, res) => {
    try {
        const currentUser = new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789012345"); // test tạm
        const userID = new mongoose.Types.ObjectId(req.params.userID);

        const messages = await Message.find({
            $or: [
                { from: currentUser, to: userID },
                { from: userID, to: currentUser }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const currentUser = new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789012345"); // test tạm

        const { to, type, text } = req.body;

        const newMessage = new Message({
            from: currentUser,
            to: new mongoose.Types.ObjectId(to),
            messageContent: {
                type: type,
                text: text
            }
        });

        await newMessage.save();

        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const currentUser = new mongoose.Types.ObjectId("65f1a2b3c4d5e6f789012345"); // test tạm

        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { from: currentUser },
                        { to: currentUser }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        user: {
                            $cond: [
                                { $eq: ["$from", currentUser] },
                                "$to",
                                "$from"
                            ]
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;