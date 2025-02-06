import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure you have this import if you are using Link from react-router-dom
import MaxWidthWrapper from '../../components/MaxWidthWrapper';
import axios from 'axios';
import { useUserContext } from '../../Context/UserProvider';
import { jwtDecode } from 'jwt-decode';
 // Adjust the import path according to your project structure

const Signup: React.FC = () => {
  const navigate = useNavigate(); // Ensure you have this import if you are using useNavigate()
  const {setAuthTokens, setUser} = useUserContext()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement)?.value;
    const password = (document.getElementById('password1') as HTMLInputElement)?.value;
    


    // Assuming you have an API endpoint to handle signup
    await axios.post('http://localhost:8000/signup', {
        username: username,
        password: password,
      }
    )
    .then(async response => {
      console.log(response);
      await axios.post("http://localhost:8000/login", {
          "username": username,
          "password": password,
      })
      .then(response => {
          setAuthTokens(response.data)
          setUser(jwtDecode(response.data.accessToken))
          localStorage.setItem('authTokens', JSON.stringify(response.data))
      })
      navigate('/')
      })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <MaxWidthWrapper className={'py-14 w-full'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <div className="mt-2">
                  <input type="text" name="username" id="username" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="password1" className="block text-sm font-medium leading-6 text-gray-900">password</label>
                <div className="mt-2">
                  <input id="password1" name="password1" type="password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">confirm password</label>
                <div className="mt-2">
                  <input name="password2" type="password" id="password2" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
  
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">Reset</button>
          <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
        </div>
      </form>
      <p>you have already an account? <Link to='/Login'>Login</Link></p>
    </MaxWidthWrapper>
  );
};


export default Signup;