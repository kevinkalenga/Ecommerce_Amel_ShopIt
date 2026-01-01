import React, {useEffect, useState} from 'react';
import {useLoginMutation} from '../../redux/api/authApi';
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom';
import MetaData from '../layout/MetaData'

const Login = () => {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [login, {isLoading, error, data}] = useLoginMutation()

  useEffect(() => {
    if(error) {
      toast.error(error?.data?.message)
    }
  }, [error])

  const submitHandler = (e) => {
    e.preventDefault();

    const loginData = {email, password}

    login(loginData)
  }
  
  
  return (
    <>
      <MetaData title={'Login'} />
      <div className="row wrapper">
       <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Login</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
               name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Link className="float-end mb-4" to="/password/forgot">Forgot Password?</Link>
          <button disabled={isLoading} id="login_button" type="submit" className="btn w-100 py-2">
            {isLoading ? "Authenticating..." :  "Login"}
          </button>

          <div className="my-3">
            <Link className="float-end" to="/register">New User?</Link>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login