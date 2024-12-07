import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import DatePickerComponent from './DatePickerComponent';
import avatarImage from "../assets/images/avatar.png";
import {useNavigate} from "react-router-dom";

function TutorProfile({ user }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableHours, setAvailableHours] = useState("");
  const [initialAvailableHours, setInitialAvailableHours] = useState([]);
  const [success, setSuccess] = useState([]);
  const [invalidTimes, setInvalidTimes] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectPrices, setSubjectPrices] = useState({});
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      axios.get('/api/tutoring/user/me/')
          .then(response => {
            if (!response.data.tutor_profile) {
              navigate('/dashboard');
            } else {
              setUserData(response.data);
              setLoading(false);
            }
          })
          .catch(error => {
            console.error("There was an error fetching the user data!", error);
            setLoading(false);
          });
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (userData && userData.tutor_profile && userData.tutor_profile.available_hours) {
      setInitialAvailableHours(userData.tutor_profile.available_hours);
    }
  }, [userData]);

  useEffect(() => {
    axios.get('/api/tutoring/subjects/')
        .then(response => {
          setSubjects(response.data);
          if (userData && userData.tutor_profile && userData.tutor_profile.subjects) {
            setSelectedSubjects(userData.tutor_profile.subjects.map(subject => subject.name || subject));
          }
          if (userData && userData.tutor_profile && userData.tutor_profile.subject_prices) {
            const prices = userData.tutor_profile.subject_prices.reduce((acc, { subject, price_min, price_max }) => {
              acc[subject.name] = { min: price_min, max: price_max };
              return acc;
            }, {});
            setSubjectPrices(prices);
          }
        })
        .catch(error => {
          console.error("There was an error fetching the subjects!", error);
        });
  }, [userData]);

  const handlePriceChange = (subjectName, priceType, value) => {
    setSubjectPrices(prevState => ({
      ...prevState,
      [subjectName]: {
        ...prevState[subjectName],
        [priceType]: value
      }
    }));
  };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (invalidTimes) {
      setError("Please correct the invalid time ranges before submitting.");
      return;
    }

    const priceErrors = selectedSubjects.filter(subject => {
      const prices = subjectPrices[subject];
      return !(prices && prices.min && prices.max && parseFloat(prices.min) <= parseFloat(prices.max));
    });

    if (priceErrors.length > 0) {
      setError("Please provide valid prices for all selected subjects.");
      return;
    }

    const form = event.target;
    const formData = new FormData(form);

    const updatedWorkingExperience = Array.isArray(userData?.tutor_profile?.working_experience)
        ? userData.tutor_profile.working_experience.map((_, index) => ({
          position: formData.get(`experience-title-${index}`),
          description: formData.get(`experience-description-${index}`),
          start_date: formData.get(`experience-start-date-${index}`),
          end_date: formData.get(`experience-end-date-${index}`),
        }))
        : undefined;

    const subjectPricesArray = selectedSubjects.map(subject => ({
      name: subject,
      min_price: subjectPrices[subject]?.min || "",
      max_price: subjectPrices[subject]?.max || "",
    }));

    const data = {
      bio: formData.get("bio"),
      available_hours: availableHours,
      subject_prices: subjectPricesArray,
      city: formData.get("city"),
      is_remote: formData.get("is_remote") === "on",
      ...(updatedWorkingExperience && { working_experience: updatedWorkingExperience }),
    };
    if (avatar) {
      const avatarFormData = new FormData();
      avatarFormData.append("avatar", avatar);

      await axios.post('/api/tutoring/upload-avatar/', avatarFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess("Profile and avatar updated successfully!");
    }
    try {
      if (userData && userData.tutor_profile) {
        await axios.put(`/api/tutoring/tutors/${userData.tutor_profile.id}/`, data);
        setSuccess("Profile updated successfully!");
        setUserData((prevUserData) => ({
          ...prevUserData,
          tutor_profile: { ...prevUserData.tutor_profile, ...data },
        }));
      } else {
        setError("User profile is not available.");
      }
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

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
      <section className="container mx-auto px-8 py-10">
        <div className="border border-gray-300 rounded-2xl shadow-md">
          <div className="relative bg-indigo-600 rounded-t-2xl p-6 text-center text-white">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white mx-auto shadow-lg">
                <img
                    src={user?.avatar || avatarImage}
                    alt="Tutor's Avatar"
                    className="w-full h-full object-cover"
                />
              </div>
              <div
                  className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-md"
              ></div>
            </div>
            <h4 className="mt-4 text-2xl font-bold">
              {userData ? `${userData.first_name} ${userData.last_name}` : "[Tutor's Name]"}
            </h4>
            <p className="text-lg font-light">{userData ? userData.email : "[Tutor's Email]"}</p>
          </div>

          <div className="p-6 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-indigo-300 p-4 rounded-lg">
              <h5 className="text-indigo-600 font-bold text-lg mb-4">Available Hours</h5>
              <ul className="space-y-2">
                {Array.isArray(userData?.tutor_profile?.available_hours)
                    ? userData.tutor_profile.available_hours.map((hour, index) => (
                        <li
                            key={index}
                            className="bg-indigo-50 border border-indigo-200 p-3 rounded-md shadow-sm text-gray-700 text-md"
                        >
                          <strong>{hour.day_of_week}:</strong> {hour.start_time} - {hour.end_time}
                        </li>
                    ))
                    : "N/A"}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="border border-indigo-300 p-4 rounded-lg">
                <h5 className="text-indigo-600 font-bold text-lg">Bio</h5>
                <p className="mt-2 text-gray-600 text-sm">{userData?.tutor_profile?.bio || "N/A"}</p>
              </div>

              <div className="border border-indigo-300 p-4 rounded-lg">
                <h5 className="text-indigo-600 font-bold text-lg">Working Experience</h5>
                {Array.isArray(userData?.tutor_profile?.working_experience) &&
                userData.tutor_profile.working_experience.length > 0 ? (
                    userData.tutor_profile.working_experience.map((experience, index) => (
                        <div key={index} className="mt-2 text-gray-600 text-sm">
                          <p>
                            <strong>Title:</strong> {experience.position || "N/A"}
                          </p>
                          <p>
                            <strong>Description:</strong> {experience.description || "N/A"}
                          </p>
                          <p>
                            <strong>Start Date:</strong> {experience.start_date || "N/A"}
                          </p>
                          {experience.end_date && (
                              <p>
                                <strong>End Date:</strong> {experience.end_date}
                              </p>
                          )}
                          <hr className="my-2"/>

                          <h5 className="text-indigo-600 font-bold text-lg">User Credentials</h5>
                          <p className="mt-1">
                            <strong>City:</strong> {userData.city}
                          </p>
                          <p className="mt-1">
                            <strong>Phone Number:</strong> {userData.phone_number || "N/A"}
                          </p>
                          <label htmlFor="is_remote" className="ml-2 mt-2 text-sm font-medium text-gray-700">
                            Willing to work remotely
                          </label>
                          <input
                              type="checkbox"
                              id="is_remote"
                              name="is_remote"
                              className="h-4 ml-2 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              disabled
                              defaultChecked={userData?.tutor_profile?.is_remote || false}
                          />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">N/A</p>
                )}
              </div>

              <div className="border border-indigo-300 p-4 rounded-lg">
                <h5 className="text-indigo-600 font-bold text-lg">Subjects</h5>
                <p className="mt-2 text-gray-600 text-sm">
                  {selectedSubjects.map((subject) =>
                      typeof subject === "string" ? subject : subject.name
                  ).join(", ") || "N/A"}
                </p>
              </div>

            </div>
          </div>
        </div>

        <main>
          <h1 className="text-2xl font-bold text-center mt-8 mb-4">{mainMessage}</h1>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Note:</p>
            <p>Filling in this data will increase your chances of being found by students!</p>
          </div>
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
                  defaultValue={userData?.tutor_profile?.bio || ""}
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
                              placeholder="e.g., Teacher in Mathematics"
                              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                              defaultValue={experience.position}
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
                              defaultValue={experience.end_date || null}
                          />
                          <small>Leave blank if time is present</small>
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
              <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 text-center">
                Please select the subjects you are specialized in and amount of money you want to charge for each hour
              </label>
              <div className="mt-4 space-y-6 flex flex-col items-center">
                {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between w-full max-w-lg">
                      <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            name="subjects"
                            value={subject.name}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={selectedSubjects.includes(subject.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubjects(prev => [...new Set([...prev, subject.name])]);
                              } else {
                                setSelectedSubjects(selectedSubjects.filter(s => s !== subject.name));
                              }
                            }}
                        />
                        <label htmlFor={`subject-${subject.id}`} className="text-sm text-gray-900">
                          {subject.name}
                        </label>
                      </div>
                      {selectedSubjects.includes(subject.name) && (
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="flex items-center space-x-1">
                              <input
                                  type="number"
                                  placeholder="Min Price"
                                  value={subjectPrices[subject.name]?.min || ""}
                                  onChange={(e) => handlePriceChange(subject.name, "min", e.target.value)}
                                  className="mt-1 w-28 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                  min="0"
                                  required
                              />
                              <span className="text-gray-500">PLN/h</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <input
                                  type="number"
                                  placeholder="Max Price"
                                  value={subjectPrices[subject.name]?.max || ""}
                                  onChange={(e) => handlePriceChange(subject.name, "max", e.target.value)}
                                  className="mt-1 w-28 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                  min="0"
                                  required
                              />
                              <span className="text-gray-500">PLN/h</span>
                            </div>
                            <input
                                type="hidden"
                                name={`subject-prices-${subject.name}-min`}
                                value={subjectPrices[subject.name]?.min || ""}
                            />
                            <input
                                type="hidden"
                                name={`subject-prices-${subject.name}-max`}
                                value={subjectPrices[subject.name]?.max || ""}
                            />
                          </div>
                      )}
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
            <div className="mt-4 space-y-6 flex flex-col items-center">
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    className="mt-1 block px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-md mx-auto"
                    defaultValue={userData?.city || ""}
                />
              </div>

              <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="is_remote"
                    name="is_remote"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    defaultChecked={userData?.tutor_profile?.is_remote || false}
                    disabled={!userData}
                />
                <label htmlFor="is_remote" className="ml-2 block text-sm font-medium text-gray-700">
                  Willing to work remotely
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Upload Avatar
              </label>
              <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  className="mt-1 block w-full max-w-md px-3 py-0.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mx-auto"
                  onChange={handleAvatarChange}
              />
            </div>
            {error && (
                <div className="mb-4 text-red-500 text-sm">
                  {error}
                </div>
            )}
            <button
                type="submit"
                className="flex mx-auto mt-4 w-50 justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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