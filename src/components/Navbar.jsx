import React, { useState, useEffect } from 'react';
import avatarImage from '../assets/images/avatar.png';

const Navbar = ({ user, notificationCount }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img className="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company"></img>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {user && user.parent_profile && user.parent_profile.id && (
                                    <a href="/parent-dashboard"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Parent
                                        Dashboard</a>
                                )}
                                {user && user.tutor_profile && user.tutor_profile.id && (
                                    <a href="/tutor-dashboard"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Tutor
                                        Dashboard</a>
                                )}
                                {user && user.student_profile && user.student_profile.id && (
                                    <a href="/student-dashboard"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Student
                                        Dashboard</a>
                                )}
                                {user && user.parent_profile && user.parent_profile.id && (
                                    <a href="/parent-profile"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Parent
                                        Profile</a>
                                )}
                                {user && user.tutor_profile && user.tutor_profile.id && (
                                    <a href="/tutor-profile"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Tutor
                                        Profile</a>
                                )}
                                {user && user.student_profile && user.student_profile.id && (
                                    <a href="/student-profile"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Student
                                        Profile</a>
                                )}
                                {((user && user.student_profile && user.student_profile.id) || (user && user.parent_profile && user.parent_profile.id)) && (
                                    <a href="/search"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Find Tutors</a>
                                )}
                                {((user && user.student_profile && user.student_profile.id) || (user && user.parent_profile && user.parent_profile.id)) && (
                                    <a href="/pending-lessons"
                                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Pending Lessons</a>
                                )}
                                <a href="/logout"
                                   className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Logout</a>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="border border-indigo-500 rounded-md px-3 py-2 text-indigo-600">
                            {currentTime.toLocaleTimeString()}
                        </div>
                        <button type="button"
                                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white">
                            <span className="absolute -inset-1.5"></span>
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                 aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                            </svg>
                            {notificationCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                    {notificationCount}
                                </span>
                            )}
                        </button>

                        <div className="relative ml-3">
                            <div>
                                <button type="button" className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src={user?.avatar || avatarImage} alt=""></img>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {user && user && user.parent_profile && user.parent_profile.id && (
                        <a href="/parent-dashboard"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Parent
                            Dashboard</a>
                    )}
                    {user && user.tutor_profile && user.tutor_profile.id && (
                        <a href="/tutor-dashboard"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Tutor
                            Dashboard</a>
                    )}
                    {user && user.student_profile && user.student_profile.id && (
                        <a href="/student-dashboard"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Student
                            Dashboard</a>
                    )}
                    {user && user.parent_profile && user.parent_profile.id && (
                        <a href="/parent-profile"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Parent
                            Profile</a>
                    )}
                    {user && user.tutor_profile && user.tutor_profile.id && (
                        <a href="/tutor-profile"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Tutor
                            Profile</a>
                    )}
                    {user && user.student_profile && user.student_profile.id && (
                        <a href="/student-profile"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Student
                            Profile</a>
                    )}
                    {user && user.tutor_profile && user.tutor_profile.id && (
                        <a href="/create-lesson"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Create New Lesson</a>
                    )}
                    {((user && user.student_profile && user.student_profile.id) || (user && user.parent_profile && user.parent_profile.id)) && (
                        <a href="/pending-lessons"
                           className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Pending Lessons</a>
                    )}
                    <a href="/logout"
                       className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black">Logout</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;