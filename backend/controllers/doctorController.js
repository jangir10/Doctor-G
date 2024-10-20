import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req,res)=>{
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({success:true,message:'Availability Changed'});

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

//api:

const doctorList = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email']);
         return res.json({success:true,doctors});
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// API for doctor login

const loginDoctor = async (req,res)=>{
    try {
        const {email,password} =req.body;
        const doctor = await doctorModel.findOne({email});

        if(!doctor){
            return res.json({success:false, message:"Invalid Credentials"})
        }
        const isMatched = await bcrypt.compare(password,doctor.password);

        if(isMatched){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
            return res.json({success:true,token});
        }else{
            return res.json({success:false, message:"Incorrect Password"})
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// API to get the doctor's appointments for doctor panel

const appointmentsDoctor = async (req,res)=>{
    try {
        
        const {docId} = req.body;
        const appointments = await appointmentModel.find({docId});

        return res.json({success:true,appointments});
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// API to mark appointment completed for doctor panel

const appointmentComplete = async (req,res)=>{
    try {
        const {docId, appointmentId} = req.body;
        
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
            return res.json({success:true,message:"Appointment completed"});
        }else{
             return res.json({success:false, message:"Something went wrong"});
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}


// API to cancel appointment by doctor
const appointmentCancel = async (req,res)=>{
    try {
        const {docId, appointmentId} = req.body;
        
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
            return res.json({success:true,message:"Appointment cancelled"});
        }else{
             return res.json({success:false, message:"Something went wrong"});
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}


//API to get dashboard data for doctor

const doctorDashboard = async (req,res)=>{
    try {
        const {docId} = req.body;
        
        const appointments = await appointmentModel.find({docId});

        let earnings = 0;
        
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount;
            }
        });
        let patients = [];

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId);
            }
        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5),
        }

        return res.json({success:true,dashData});

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}


// API to get doctor profile

const doctorProfile = async (req,res)=>{
    try {
        const {docId} = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        return res.json({success:true, profileData})
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// API to update doctor profile data

const updateDoctorProfile = async (req,res)=>{
    try {
        const {docId,fees,address,available} = req.body;
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available});
        return res.json({success:true, message:"Profile Updated"});
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

export {changeAvailability,
    doctorList, 
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete, 
    appointmentCancel,
    doctorDashboard, 
    doctorProfile,
    updateDoctorProfile};