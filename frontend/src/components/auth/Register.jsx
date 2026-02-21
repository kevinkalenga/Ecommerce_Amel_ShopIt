import React, {useEffect, useState} from 'react';
import {useRegisterMutation} from '../../redux/api/authApi';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom';
import MetaData from '../layout/MetaData'
import { useSelector } from 'react-redux';

const Register = () => {
  const {isAuthenticated} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  const [user, setUser] = useState({
     name: '',
     email: '',
     password: ''
   })

  const {name, email, password} = user
  
   const [register, {isLoading, error}] = useRegisterMutation()

  
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, error, navigate])
  
 

  const submitHandler = async(e) => {
    e.preventDefault();

      // Validation frontend
  if (!name || !email || !password) {
    toast.error("All fields are required");
    return;
  }
    
    
  


    try {
         await register({ name, email, password }).unwrap();

         toast.success("Registered successfully!");
         navigate('/login');

      } catch (err) {
         toast.error(err?.data?.message || "Registration failed");
      }

   
  }
  
  const onChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value})
  }
  
  
  return (
   <>
    <MetaData title={'Register'} />
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Register</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
               value={password}
              onChange={onChange}
            />
          </div>

          <button disabled={isLoading} id="register_button" type="submit" className="btn w-100 py-2">
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  </>
  )
}

export default Register