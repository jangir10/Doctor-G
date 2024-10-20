import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';
export const DoctorContext = createContext()
export const DoctorContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');

    const [appointments, setAppointments] = useState([]);

    const [dashData, setDashData] = useState(false);

    const [profileData, setProfileData] = useState(false);
    // API call to get the appointments

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/appointments', { headers: { dToken } });
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // API call to complete appointments

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // API call to cancel appointments

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // API to get doctor dashboard data

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/dashboard', { headers: { dToken } });
            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    const getProfileData = async ()=>{
        try {
            
            const {data} = await axios.get(backendURL+'/api/doctor/profile',{headers:{dToken}});
            if(data.success){
                setProfileData(data.profileData);
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }


    const value = {
        dToken, setDToken,
        backendURL,
        appointments, setAppointments, getAppointments,
        cancelAppointment, completeAppointment,
        dashData,setDashData, getDashData,
        profileData, setProfileData, getProfileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider