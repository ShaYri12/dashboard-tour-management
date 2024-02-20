import User from '../models/User.js'
import bcrypt from 'bcryptjs';

//update
export const updateUser = async(req, res) =>{

    const id = req.params.id;

    try{
        const updatedUser = await User.findByIdAndUpdate(id,{
            $set: req.body
        }, {new:true})

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to update",
        });
    }
}

//delete
export const deleteUser = async(req, res) =>{
    const id = req.params.id;

    try{
        await User.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to delete",
        });
    }
}

//get Single User
export const getSingleUser = async(req, res) =>{
    const id = req.params.id;

    try{
        const user = await User.findById(id)

        res.status(200).json({
            success: true,
            message: "Successfully found",
            data: user,
        });
    }
    catch(err){
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}

//get all Users
export const getAllUser = async(req, res) =>{

    try{
        const users = await User.find({role:'user'})

        res.status(200).json({
            success: true,
            count: users.length,
            message: "Successfully found Users",
            data: users,
        });
    }
    catch(err){
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}

//get all Admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });

        res.status(200).json({
            success: true,
            count: admins.length,
            message: "Successfully found Admins",
            data: admins,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const changePassowrd = async(req, res) =>{
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(id);

    // Check if old password matches
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ 
        success:false,
        message: 'Old password is incorrect.' });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
        success: true,
        message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
