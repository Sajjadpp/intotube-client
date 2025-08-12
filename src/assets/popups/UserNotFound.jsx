import { UserX, X } from 'lucide-react';
import { useState } from 'react';
import { GoogleAuth } from '../signupButton/SignupButton';

export default function UserNotFoundCard({setNoUserPopup}) {
  
  const handleLoginWithGoogle = (req, res) =>{

    GoogleAuth()  
  }
  return (
    <div className="absolute z-10 top-52 left-100 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-red-50 p-6 relative">
        <button 
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100"
          onClick={()=> setNoUserPopup(false)}
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <UserX className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800">User Not Found</h2>
        <p className="mt-2 text-center text-gray-600">
          We couldn't find your account in our system.
        </p>
        <p className="mt-4 text-center text-gray-600">
          Please check your credentials and try again or contact support if you continue to experience issues.
        </p>
        <div className="mt-6 flex justify-center">
          <button onClick={handleLoginWithGoogle} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}