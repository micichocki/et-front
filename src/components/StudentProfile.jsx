import React from "react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";

import DatePickerComponent from './DatePickerComponent';

function StudentProfile({ user }) {
  
  const [userData, setUserData] = useState(user);
  const [error, setError] = useState("");
  const [availableHours, setAvailableHours] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [initialAvailableHours, setInitialAvailableHours] = useState([]);
  const [success, setSuccess] = useState([]);
  const [invalidTimes, setInvalidTimes] = useState(false);
  
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

  useEffect(() => {
    if (userData && userData.student_profile && userData.student_profile.education_level) {
      setEducationLevel(userData.student_profile.education_level.level);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.student_profile && userData.student_profile.available_hours) {
      setInitialAvailableHours(userData.student_profile.available_hours);
    }
  }, [userData]);

  user = userData;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (invalidTimes) {
      setError("Please correct the invalid time ranges before submitting.");
      return;
    }
    const form = event.target;
    const formData = new FormData(form);

    if (!availableHours) {
      setError("Please select your available hours.");
      return;
    }

    const data = {
      bio: formData.get("bio"),
      tasks_description: formData.get("tasks"),
      goal: formData.get("goal"),
      education_level: formData.get("education-level"),
      available_hours: availableHours,
    };

    try {
      const response = await axios.put(`/api/tutoring/students/${user.student_profile.id}/`, data);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error submitting form');
      }
      console.error('Error submitting form:', error);
    }
  };
  const mainMessage = user && user.student_profile && user.student_profile.education_level ? 
    "Update your credentials below to keep your profile up to date." : 
    "To continue using the app, please fill in the additional credentials below.";
  

  return (
    <section className="container mx-auto px-8 py-10">
  <div className="border border-gray-300 rounded-2xl shadow-md">
    <div className="h-48 bg-indigo-600 rounded-t-2xl flex flex-col justify-center items-center text-white relative">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white absolute top-10">
        <img
          src={user?.student_profile?.avatar || "/path/to/default-avatar.jpg"}
          alt="Student's Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-2xl font-semibold mt-24">
        {user ? user.first_name : "[Student's First Name]"}{" "}
        {user ? user.last_name : "[Student's Last Name]"}
      </h4>
      <p className="text-lg font-light">
        {user ? user.email : "[Student's Email]"}
      </p>
    </div>
    <div className="p-6 space-y-4">
      <div className="border border-indigo-300 p-4 rounded-lg">
        <p className="text-gray-600 text-sm">
          <strong>Bio:</strong> {user?.student_profile?.bio || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Tasks Description:</strong> {user?.student_profile?.tasks_description || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Goal:</strong> {user?.student_profile?.goal || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Education Level:</strong> {user?.student_profile?.education_level?.level || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Available Hours: </strong>    <br/>    {user?.student_profile?.available_hours?.map(hour => `${hour.day_of_week}: ${hour.start_time} - ${hour.end_time}`).join(", ") || "N/A"}

        </p>
      </div>
    </div>
  </div>
      <main>
        <h1 className="text-2xl font-bold text-center mt-8 mb-4">{mainMessage}</h1>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Tell something about yourself
            </label>
            <textarea
              id="bio"
              name="bio"
              className="mt-1 block px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md h-28 mx-auto"
              required
              defaultValue={user && user.student_profile.bio ? user.student_profile.bio : ""}
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
              defaultValue={user && user.student_profile.tasks_description ? user.student_profile.tasks_description : ""}
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
              defaultValue={user && user.student_profile.goal ? user.student_profile.goal : ""}
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
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
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
            <DatePickerComponent onChange={setAvailableHours} initialHours={initialAvailableHours} setInvalidTimes={setInvalidTimes} />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="flex mx-auto w-50 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
          {success && (
            <div className="mb-4 text-green-500 text-sm">
              {success}
            </div>
          )}
        </form>
      </main>
    </section>
  );
}

export default StudentProfile;