import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

//--------------------------------------------------------------------------------------------------------------
export const getAllUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find(); // users? it is the instance of the schema
    }
    catch(err){
        return console.log(err);
    } 
    //validation check
    if(!users){
        return res.status(500).json({ message: "Unexpected Error Occured" }); //500- internal server error
    }
    return res.status(200).json({ users }); //200- OK 
};
//----------------------------------------------------------------------------------------------------------------

export const singup = async (req, res, next) => {
    const { email, name, password } = req.body;
    //----- validation check
    if(!name && name.trim()==="" && !email && email.trim()==="" && !password && password.trim()==="")
    {
        return res.status(422).json({ message : "Invalid Inputs" }); //422- Unprocessable Entity
    }

    //---- create the new user now
    //--- store the encrypted password inside the database
    // bcryptjs- to encrypt/decrypt any password
    const hashedPassword = bcrypt.hashSync(password); //hashSync works synchronously- generates the hash for the given string
    let user; 
    try{
        user = new User({ name, email, password: hashedPassword }); //instance of the user is created
        user = await user.save(); //save a new document/record to the users collection
    } catch(err){
        return console.log(err);
    }
    //----- validation check
    if(!user){
        return res.status(500).json({ message: "Unexpected Error Occured" }); //500- internal server error
    }
    //console.log("New user added"); 
    return res.status(201).json({ user }); //201- Created successfully

};
//---------------------------------------------------------------------------------------------------

export const updateUser = async (req, res, next) => {
    const id = req.params.id; //getting id from the url
    const { email, name, password } = req.body;
    if(!name && name.trim()==="" && !email && email.trim()==="" && !password && password.trim()==="")
    {
        return res.status(422).json({ message : "Invalid Inputs" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    let user;
    try{
        user = await User.findByIdAndUpdate(id, { name, email, password : hashedPassword });
    } catch(err){
        return console.log(err); 
    }
    //validation check
    if(!user){
        return res.status(500).json({ message : "Something Went Wrong "});
    }
    return res.status(200).json({ message : "Updated Successfully "});
};
// //-----------------------------------------------------------------------------------------------------

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try{
        user = await User.findByIdAndDelete(id);
    } catch(err){
        return console.log(err); 
    }
    if(!user)
    {
        return res.status(500).json({ message : "Something Went Wrong "});
    }
    return res.status(200).json({ message : "Deleted Successfully "}); 
};
// //--------------------------------------------------------------------------------------------------------------

export const login = async(req, res, next) => {
    const { email, password } = req.body;
    if(!email && email.trim()==="" && !password && password.trim()==="")
    {
        return res.status(422).json({ message : "Invalid Inputs" });
    }

    let existingUser;
    try{
        existingUser = await User.findOne({ email });
    } catch(err){
        console.log(err);
    }

    if(!existingUser){
        return res.status(404).json({ message : "Unable to find user from this Email ID" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password); //returns a boolean value
    if(!isPasswordCorrect){
        return res.status(400).json({ message: "Password Incorrect"}); //400-unauthorized
    }

    return res.status(200).json({ message : "Login Successfull", id : existingUser._id});
};
// //--------------------------------------------------------------------------------------------------------------

export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;
    let bookings;
    try {
      bookings = await Bookings.find({ user: id })
        .populate("movie")
        .populate("user");
    } catch (err) {
      return console.log(err);
    }
    if (!bookings) {
      return res.status(500).json({ message: "Unable to get Bookings" });
    }
    return res.status(200).json({ bookings });
  };
//-------------------------------------------------------------------------------------------------------------------
export const getUserById = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try {
      user = await User.findById(id);
    } catch (err) {
      return console.log(err);
    }
    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({ user });
  };