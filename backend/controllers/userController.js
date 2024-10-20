import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';
// api logic for user to login register book appointment payment 

//api to register user:
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Saving user to database
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();
        // Generating token for user

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ success: true, token })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message });
    }
}


// API for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Incorrect password" });
        }
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message });
    }
}

// API to get user profile data

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        return res.json({ success: true, userData });
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message });
    }
}

// API to update user profile

const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }
        return res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message });
    }
}


// API to book the appointment with the doctor

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" })
        }
        let slots_booked = docData.slots_booked;

        // Checking for slots availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        // Getting user data
        const userData = await userModel.findById(userId).select('-password');

        //delete docData.slots_booked
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        }
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new Slots data in doctors data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        return res.json({ success: true, message: 'Appointment booked' })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// API to get user appointments for front-end my appointments page

const listAppointments = async (req, res) => {

    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });

        return res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}


// API to cancel appointment

const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'You are not authorized to cancel this appointment' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Remove this entry from doctor's slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        return res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// API to make online payment using razorpay
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorpay = async (req, res) => {

    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment not found or cancelled" })
        }

        // Creating options for Razorpay payment
        const options = {
            "amount": appointmentData.amount * 100,
            "currency": process.env.CURRENCY,
            receipt: appointmentId,
        }
        //Creation of an order
        const order = await razorpayInstance.orders.create(options)

        return res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }

}

// API to verify payment of Razorpay
const verifyRazorpay = async (req,res)=>{
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status ==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            return res.json({success:true,message:'Payment successful'});
        }else{
            return res.json({success:false,message:'Payment failed'});
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay }