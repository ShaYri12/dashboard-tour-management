import express from 'express'
import {createBooking, getBooking, getAllBooking, updateBooking, deleteBooking } from './../controllers/bookingConrtoller.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//create booking
router.post("/", verifyUser, createBooking);

//get single booking
router.get("/:id", verifyUser, getBooking);

//update Single booking
router.put("/:id", verifyAdmin, updateBooking);

//delete Single booking
router.delete("/:id", verifyAdmin, deleteBooking);

//get all bookings
router.get("/", verifyAdmin, getAllBooking);




export default router;