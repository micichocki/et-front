import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from "react-router-dom";

const CommonRegister = () => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [roles, setRole] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm_password) {
            setError('Passwords do not match');
            return;
        }
        const capitalizedFirstName = first_name.charAt(0).toUpperCase() + first_name.slice(1);
        const capitalizedLastName = last_name.charAt(0).toUpperCase() + last_name.slice(1);
        try {
            const response = await axios.post(`${config.backendUrl}/api/register/`, {
                username,
                first_name: capitalizedFirstName,
                last_name: capitalizedLastName,
                password,
                roles,
                date_of_birth,
                phone_number,
                city,
            });
            if (response.status === 201) {
                navigate('/', { state: { message: response.data.message } });
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
            <div className="flex flex-col items-center justify-center px-1 py-5 mx-auto  lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="pt-0 px-6 py-2 space-y-2 md:space-y-6 sm:p-4 mt-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="first-name" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <div className="mt-2">
                                    <input
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={first_name}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                <div className="mt-2">
                                    <input
                                        id="last-name"
                                        name="last-name"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={last_name}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="date-of-birth" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
                                <div className="mt-2">
                                    <input
                                        id="date-of-birth"
                                        name="date-of-birth"
                                        type="date"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={date_of_birth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone-number" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number
                                    <br/>
                                    <small>  Format: 123-456-789</small>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone-number"
                                        name="phone-number"
                                        type="tel"
                                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={phone_number}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="city" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                <div className="mt-2">
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <div className="mt-2">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        value={confirm_password}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Type</label>
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        <input
                                            id="student"
                                            name="role"
                                            type="radio"
                                            value="Student"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <label htmlFor="student" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Student
                                        </label>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="parent"
                                            name="role"
                                            type="radio"
                                            value="Parent"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <label htmlFor="parent" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Parent
                                        </label>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="tutor"
                                            name="role"
                                            type="radio"
                                            value="Tutor"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <label htmlFor="tutor" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Tutor
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 text-indigo-600 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800" required=""></input>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Terms and Conditions
                                    </a></label>
                                </div>
                            </div>
                            {error && (
                                <div className="text-red-500 text-md">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign up
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?  <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">Click here to Login</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
    );
};

export default CommonRegister;