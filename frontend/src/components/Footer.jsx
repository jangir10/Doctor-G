import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* left */}
                <div >
                    <img className='mb-5 w-40' src={assets.logo} alt='logo' />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                </div>
                {/* center */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-3 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/* right */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-3 text-gray-600'>
                        <li>+91 1234567890</li>
                        <li>test@best.com</li>
                    </ul>
                </div>
                
            </div>
            {/* copyright text */}
            <div>
                    <hr />
                    <p className='py-5 text-sm text-center'>&copy; 2024 Doctor-G. All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer