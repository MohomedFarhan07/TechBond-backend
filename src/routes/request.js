const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId == toUserId) {
        throw new Error("Cannot send connection request to yourself");
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status type!!!");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found!!!");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection request already exists!!!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} ${req.user.lastName} is ${status} ${toUser.firstName} ${toUser.lastName}`,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return req.status(400).json({ message: "Status not allowed!" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found!" });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({ message: `Connection request ${status}`, data });
  },
);

module.exports = requestRouter;
