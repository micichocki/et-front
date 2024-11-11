import React from "react";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

function ParentProfile() {
  const location = useLocation();
  const { user } = location.state || {};
  return (
    <section className="container mx-auto px-8 py-10">
      <Card shadow={false} className="border border-gray-300 rounded-2xl">
        <CardHeader shadow={false} className="h-60 !rounded-lg">
          <img
            src="../assets/images/background-image.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </CardHeader>
        <CardBody>
          <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <Typography color="blue-gray" variant="h6">
                  {user ? user.first_name : "[Parent's First Name]"}{" "}
                  {user ? user.last_name : "[Parent's Last Name]"}  - Parent's Account
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-gray-600"
                >
                  {user ? user.email : "[Parent's Email]"}
                </Typography>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
 
            </div>
          </div>

        </CardBody>
      </Card>
      <main>
      <h1 className="text-2xl font-bold text-center mt-8 mb-4">To continue using the app please fill additional credentials.</h1>
            <form className="mt-4">
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