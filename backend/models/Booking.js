import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    guestSize:{
        type: Number,
        requierd:true
    },
    phone:{
        type: Number,
        requierd:true
    },
    bookAt:{
        type: Date,
        requierd:true
    },
    status:{
        type: String,
        default:"Pending"
    },
  },
  { timestamps: true }
);

export default mongoose.model("booking", bookingSchema);
