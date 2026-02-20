const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type!!!`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({fromUserId: 1});



const ConnectionRequest = new mongoose.model(
  "Connection",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
