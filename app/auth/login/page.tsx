import React from "react";
import { FaUser } from "react-icons/fa6";
import LoginForm from "./loginform";

const Login = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 ">
      <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 w-full max-w-md h-full max-h-md md:p-5">
        <div className="flex flex-col justify-center items-center">
          <img src="/icon-144x144.png" className="h-24" alt="Logo" />
          <h3 className="text-lg font-bold text-gray-800 ">
            Log in to your Account
          </h3>
          <p className="mt-2 text-xs font-medium uppercase text-gray-500 ">
            Welcome back! Please enter your details.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
