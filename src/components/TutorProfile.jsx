import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import DatePickerComponent from './DatePickerComponent';


function TutorProfile({ user }) {

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios.get("/tutoring/api/subjects")
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the subjects!", error);
      });
  }, []);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const subjectOptions = subjects.map(subject => (
    <div key={subject.name} className="flex items-center">
      <input
        id={subject.name.toLowerCase()}
        name="subjects"
        type="checkbox"
        value={subject.name.toLowerCase()}
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label htmlFor={subject.name.toLowerCase()} className="ml-2 block text-sm text-gray-900">
        {capitalize(subject.name)}
      </label>
    </div>
  ));


  return (
    <section className="container mx-auto px-8 py-10">
      <Card shadow={false} className="border border-gray-300 rounded-2xl">
        <CardHeader shadow={false} className="h-60 !rounded-lg"></CardHeader>
        <CardBody>
          <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar src="/img/avatar1.jpg" alt="avatar" variant="rounded" />
              <div>
                <Typography color="blue-gray" variant="h6">
                  {user ? user.first_name : "[Tutor's First Name]"}{" "}
                  {user ? user.last_name : "[Tutor's Last Name]"} - Student's Account
                </Typography>
                <Typography variant="small" className="font-normal text-gray-600">
                  {user ? user.email : "[Tutor's Email]"}
                </Typography>
              </div>
     
            </div>
            <div className="flex flex-wrap items-center gap-2"></div>
          </div>
          <Typography variant="small" className="font-normal text-gray-600 mt-6">
            {user && user.bio ? user.bio : ""}
          </Typography>
        </CardBody>
      </Card>

      <main>
        <h1 className="text-2xl font-bold text-center mt-8 mb-4">To continue using the app please fill additional credentials.</h1>
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
              Select subjects you are specializing in
            </label>
            <div id="subjects" className="mt-1">
            <subjectOptions />
            </div>
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

export default TutorProfile;