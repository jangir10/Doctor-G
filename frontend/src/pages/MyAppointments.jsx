import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const months = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const getUserAppointment = async () => {
    try {

      const { data } = await axios.get(backendURL + '/api/user/appointments', { headers: { token } });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token])



  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendURL + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order._id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendURL + '/api/user/verify-razorpay', { response }, { headers: { token } });
          if (data.success) {
            getUserAppointment();
            navigate('/my-appointments');
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  const appointmentRazorpay = async (appointmentId) => {
    return toast.error("Feature is disabled in demo")
    try {
      const { data } = await axios.post(backendURL + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } });
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error("wrong razorpay credentials")
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData?.image} alt="Doctor" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData?.name || "Name not available"}</p>
              <p>{item.docData?.speciality || "Speciality not available"}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData?.address?.line1 || "Line 1 not available"}</p>
              <p className='text-xs'>{item.docData?.address?.line2 || "Line 2 not available"}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment &&  !item.isCompleted && <button className='sm:min-w-48 py-2 border text-stone-500 bg-indigo-50'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
            </div>

           


          </div>
        ))}

      </div>
    </div>

  )
}

export default MyAppointments