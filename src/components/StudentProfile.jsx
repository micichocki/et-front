import React from "react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import DatePickerComponent from './DatePickerComponent';



function StudentProfile({ user }) {


  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (!user) {
      axios.get('/api/tutoring/user/me/')
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the user data!", error);
        });
    }
  }, [user]);

  user = userData;

  return (
    <section className="container mx-auto px-8 py-10">
      <Card
        shadow={false}
        className="border border-gray-300 rounded-2xl"
      >
        <CardHeader shadow={false} className="h-60 !rounded-lg">
   
        </CardHeader>
        <CardBody>
          <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar src="/img/avatar1.jpg" alt="avatar" variant="rounded" />
              <div>
                <Typography color="blue-gray" variant="h6">
                  {user ? user.first_name : "[Student's First Name]"}{" "}
                  {user ? user.last_name : "[Student's Last Name]"}  - Student's Account
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-gray-600"
                >
                  {user ? user.email : "[Student's Email]"}
                </Typography>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
             
            </div>
          </div>
          <Typography
            variant="small"
            className="font-normal text-gray-600 mt-6"
          >
            {user && user.bio ? user.bio : ""}
          </Typography>
        </CardBody>
      </Card>

      <main>
      <h1 className="text-2xl font-bold text-center mt-8 mb-4">To continue using the app please fill additional credentials.</h1>
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="school-name" className="block text-sm font-medium text-gray-700">
              What is the name of your school?
            </label>
            <input
              type="text"
              id="school-name"
              name="school-name"
              className="mt-1 block px-3 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md mx-auto"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tasks" className="block text-sm font-medium text-gray-700">
              What kind of tasks do you need help with?
            </label>
            <textarea
              id="tasks"
              name="tasks"
              className="mt-1 block px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md h-28 mx-auto"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
              What is the goal you want to achieve?
            </label>
            <textarea
              id="goal"
              name="goal"
              className="mt-1 block px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md h-28 mx-auto"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="education-level" className="block text-sm font-medium text-gray-700">
              Select your educational level
            </label>
            <select
              id="education-level"
              name="education-level"
              className="mt-1 block w-full max-w-md px-3 py-0.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mx-auto"
              required
            >
              <option value="">Select level</option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="university">University</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="available-hours" className="block text-sm font-medium text-gray-700">
              Select approximate time you are available
            </label>
            <DatePickerComponent />
          </div>
          <button
            type="submit"
            className="flex mx-auto w-50 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </form>
      </main>

    </section>
  );
}

export default StudentProfile;