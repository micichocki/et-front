import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../axiosConfig";
import avatarImage from "../assets/images/avatar.png";

function ParentProfile({ user }) {
  const [userData, setUserData] = useState(user);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [children, setChildren] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!user) {
      axios.get('/api/tutoring/user/me/')
          .then(response => {
            setUserData(response.data);
            if (!response.data.parent_profile) {
              setRedirect(true);
            } else {
              setChildren(response.data.parent_profile.children || []);
            }
          })
          .catch(error => {
            console.error("There was an error fetching the user data!", error);
          });
    } else {
      if (!user.parent_profile) {
        setRedirect(true);
      } else {
        setChildren(user.parent_profile.children || []);
      }
    }
  }, [user]);

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      children: [formData.get("email")],
    };

    try {
      if(data.children[0] !== "") {
        await axios.put(`/api/tutoring/parents/${userData.parent_profile.id}/`, data);
        setSuccessMessage("Child added successfully!");
        setErrorMessage("");
        setChildren([...children, formData.get("email")]);
      }


      if (avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatar);

        await axios.post('/api/tutoring/upload-avatar/', avatarFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccessMessage("Profile and avatar updated successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Error submitting form');
      }
      console.error('Error submitting form:', error);
    }
  };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  return (
      <section className="container mx-auto px-8 py-10">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center text-white">
            <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                  src={user?.avatar || avatarImage}
                  alt="Parent's Avatar"
                  className="w-full h-full object-cover"
              />
            </div>
            <h4 className="mt-4 text-2xl font-semibold">
              {userData ? `${userData.first_name} ${userData.last_name}` : "[Parent's Name]"}
            </h4>
            <p className="text-lg font-light">{userData ? userData.email : "[Parent's Email]"}</p>
          </div>


          <div className="p-6 bg-gray-50">
            <h5 className="text-xl font-semibold text-gray-800">Children</h5>
            {children.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {children.map((child) => (
                      <li key={child.id} className="p-4 bg-white shadow rounded-md">
                        <h6 className="font-bold text-indigo-600">{child.user_full_name}</h6>
                        <p className="text-sm text-gray-600">{child.bio || "No bio provided"}</p>
                        <p className="text-sm text-gray-500">
                          <strong>Education Level:</strong> {child.education_level?.level?.toUpperCase() || "N/A"}
                        </p>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 mt-4">No children added yet.</p>
            )}
          </div>

        </div>

        <main className="mt-10">
          <h1 className="text-2xl font-bold text-center mb-6">Add Child's email or Update Your Avatar Image</h1>
          <form
              className="max-w-lg mx-auto bg-white p-6 shadow rounded-lg space-y-6"
              id="child_form"
              onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Child's Email
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Upload Avatar
              </label>
              <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleAvatarChange}
              />
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:outline-none"
            >
              Submit
            </button>
            {successMessage && (
                <div className="mt-4 text-green-500 text-center">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
            )}
          </form>
        </main>
      </section>
  );

}

export default ParentProfile;