import React from "react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import DatePickerComponent from './DatePickerComponent';


function TutorProfile({ user }) {

  const [userData, setUserData] = useState(user);
  const [error, setError] = useState("");
  const [availableHours, setAvailableHours] = useState("");
  const [initialAvailableHours, setInitialAvailableHours] = useState([]);
  const [success, setSuccess] = useState([]);
  const [invalidTimes, setInvalidTimes] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

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
    if (userData && userData.tutor_profile && userData.tutor_profile.available_hours) {
      setInitialAvailableHours(userData.tutor_profile.available_hours);
    }
  }, [userData]);

  user = userData;

  useEffect(() => {
    axios.get('/api/tutoring/subjects/')
        .then(response => {
          setSubjects(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the subjects!", error);
        });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (invalidTimes) {
      setError("Please correct the invalid time ranges before submitting.");
      return;
    }
    const form = event.target;
    const formData = new FormData(form);

    const updatedWorkingExperience = userData?.tutor_profile?.working_experience.map((_, index) => ({
      position: formData.get(`experience-title-${index}`),
      description: formData.get(`experience-description-${index}`),
      start_date: formData.get(`experience-start-date-${index}`),
      end_date: formData.get(`experience-end-date-${index}`),
    }));

    const data = {
      bio: formData.get("bio"),
      available_hours: availableHours,
      subjects: selectedSubjects,
      working_experience: updatedWorkingExperience,
    };

    try {
      const response = await axios.put(`/api/tutoring/tutors/${user.tutor_profile.id}/`, data);
      setSuccess("Profile updated successfully!");
      setUserData((prevUserData) => ({
        ...prevUserData,
        tutor_profile: { ...prevUserData.tutor_profile, ...data },
      }));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error submitting form');
      }
      console.error('Error submitting form:', error);
    }
  };

  const mainMessage = user && user.tutor_profile && user.tutor_profile.bio ?
    "Update your credentials below to keep your profile up to date." : 
    "To continue using the app, please fill in the additional credentials below.";


  return (
    <section className="container mx-auto px-8 py-10">
  <div className="border border-gray-300 rounded-2xl shadow-md">
    <div className="h-48 bg-indigo-600 rounded-t-2xl flex flex-col justify-center items-center text-white relative">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white absolute top-10">
        <img
          src={user?.avatar || "/path/to/default-avatar.jpg"}
          alt="Tutor''s Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-2xl font-semibold mt-24">
        {user ? user.first_name : "[Tutor's First Name]"}{" "}
        {user ? user.last_name : "[Tutor's Last Name]"}
      </h4>
      <p className="text-lg font-light">
        {user ? user.email : "[Tutor's Email]"}
      </p>
    </div>
    <div className="p-6 space-y-4">
      <div className="border border-indigo-300 p-4 rounded-lg">
        <p className="text-gray-600 text-sm">
          <strong>Bio:</strong> {user?.tutor_profile?.bio || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Working experience:</strong>
          {user?.tutor_profile?.working_experience?.length > 0 ? (
              user.tutor_profile.working_experience.map((experience, index) => (
                  <div key={index}>
                    <p>Title: {experience.title}</p>
                    <p>Company: {experience.company}</p>
                    <p>Duration: {experience.duration}</p>
                    <p>Description: {experience.description}</p>
                  </div>
              ))
          ) : (
              "N/A"
          )}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Subjects:</strong> {user?.tutor_profile?.subjects || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Available Hours: </strong>
          <br/> {user?.tutor_profile?.available_hours?.map(hour => `${hour.day_of_week}: ${hour.start_time} - ${hour.end_time}`).join(", ") || "N/A"}

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
                defaultValue={user?.tutor_profile?.bio || ""}
            />
          </div>
          <div className="mb-6">
            <label
                htmlFor="tasks"
                className="block text-lg font-semibold text-gray-800 mb-4"
            >
              Describe Your Working Experience
            </label>
            {userData?.tutor_profile?.working_experience?.map(
                (experience, index) => (
                    <div
                        key={index}
                        className="relative mb-6 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full max-w-lg mx-auto"
                    >
                      {/* Delete Button */}
                      <button
                          type="button"
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                          onClick={() => {
                            const updatedExperiences =
                                userData.tutor_profile.working_experience.filter(
                                    (_, idx) => idx !== index
                                );
                            setUserData({
                              ...userData,
                              tutor_profile: {
                                ...userData.tutor_profile,
                                working_experience: updatedExperiences,
                              },
                            });
                          }}
                      >
                        ✕
                      </button>

                      <div className="mb-4">
                        <label
                            htmlFor={`experience-title-${index}`}
                            className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                            type="text"
                            id={`experience-title-${index}`}
                            name={`experience-title-${index}`}
                            placeholder="e.g., Software Developer"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            defaultValue={experience.title}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                            htmlFor={`experience-description-${index}`}
                            className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                            id={`experience-description-${index}`}
                            name={`experience-description-${index}`}
                            placeholder="Briefly describe your role and responsibilities"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            rows="3"
                            defaultValue={experience.description || ""}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                            htmlFor={`experience-start-date-${index}`}
                            className="block text-sm font-medium text-gray-700"
                        >
                          Start Date
                        </label>
                        <input
                            type="date"
                            id={`experience-start-date-${index}`}
                            name={`experience-start-date-${index}`}
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            defaultValue={experience.start_date}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                            htmlFor={`experience-end-date-${index}`}
                            className="block text-sm font-medium text-gray-700"
                        >
                          End Date
                        </label>
                        <input
                            type="date"
                            id={`experience-end-date-${index}`}
                            name={`experience-end-date-${index}`}
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            defaultValue={experience.end_date}
                        />
                      </div>
                    </div>
                )
            )}
            <button
                type="button"
                className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none block mx-auto"
                onClick={() => {
                  setUserData({
                    ...userData,
                    tutor_profile: {
                      ...userData.tutor_profile,
                      working_experience: [
                        ...userData.tutor_profile.working_experience,
                        {
                          title: "",
                          company: "",
                          duration: "",
                          description: "",
                        },
                      ],
                    },
                  });
                }}
            >
              + Add Experience
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
              Please select the subjects you are specialized in
            </label>
            <div
                className="mt-1 block px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md mx-auto">
              {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`subject-${subject.id}`}
                        name="subjects"
                        value={subject.name}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={selectedSubjects.includes(subject.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubjects([...selectedSubjects, subject.name]);
                          } else {
                            setSelectedSubjects(selectedSubjects.filter(s => s !== subject.name));
                          }
                        }}
                    />
                    <label htmlFor={`subject-${subject.id}`} className="ml-2 block text-sm text-gray-900">
                      {subject.name}
                    </label>
                  </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="available-hours" className="block text-sm font-medium text-gray-700">
              Select approximate time you are available
            </label>
            <DatePickerComponent onChange={setAvailableHours} initialHours={initialAvailableHours}
                                 setInvalidTimes={setInvalidTimes}/>
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

export default TutorProfile;