import React from "react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import avatarImage from "../assets/images/avatar.png";

function ParentProfile({ user }) {
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

  user = userData
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData =  new FormData(document.getElementById("child_form"));
    const data = {
      children: [formData.get("email")],
    };

    try {
      const response = await axios.put(`/api/tutoring/parents/${user.parent_profile.id}/`, data);
    } catch (error) {
    }
  };


 
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

          <div className="p-6 space-y-4 grid grid-cols-1 lg:grid-cols-1 gap-6">

            <div className="space-y-4">
              <div className="border border-indigo-300 p-4 rounded-lg">
                <h5 className="text-indigo-600 font-bold text-lg">Bio</h5>
                <p className="mt-2 text-gray-600 text-sm">{userData?.tutor_profile?.child_email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
              <main>
                <h1 className="text-2xl font-bold text-center mt-8 mb-4">To continue using the app please fill
                  additional credentials.</h1>
                <form className="mt-4" id="child_form">
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Child's Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-64 mx-auto"
                        required
                    />
                  </div>

                  <button
                      onClick={handleSubmit}
                      type="submit"
                      className="flex mx-auto w-50 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Submit
                  </button>
                </form>

              </main>
      </section>
);
}

export default ParentProfile;