import React,{useState, useEffect, useContext} from 'react'
import '../styles/login.css';
import {Link, useNavigate, Navigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {BASE_URL} from './../utils/config'
import { toast } from 'react-toastify';

import LoginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  },[]);

  const [credentials,setCredentials] = useState({
    email:undefined,
    password:undefined
  });

  const { dispatch, role } = useContext(AuthContext)
  const navigate = useNavigate();
  
  const handleChange= e =>{
    setCredentials(prev=>({...prev, [e.target.id]:e.target.value}))
  }

  const handleClick = async e =>{
    e.preventDefault();
    dispatch({type:'LOGIN_START'})
    
    try{
      const res = await fetch(`${BASE_URL}/auth/login`,{
        method:'post',
        headers:{
          'content-type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(credentials)
      })

      const result = await res.json()

      if(!res.ok){
        return toast.error(result.message)
      }
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });
      toast.success(result.message);

      {
        role === "admin" ? <Navigate to="/dashboard"/> : navigate("/");
      }
      
    }catch (error){
      dispatch({type:'LOGIN_FAILURE', payload:error.message}) 
    }
  }
  return (
    <section>
      <div className='container'>
        <div className='row'> 
          <div className='col-lg-8 m-auto col-12'>
            <div className='login-container d-flex justify-content-between'>
              <div className='login-img d-flex justify-content-center'>
                <img src={LoginImg} alt=""/>
              </div>
              <div className='login-form '>
                <div className='user '>
                  <img className='' src={userIcon} alt=""/>
                </div>
                <h2>Login</h2>

                <form onSubmit={handleClick}>
                  <div className='form-group mb-3'> 
                    <input type="email" placeholder='Email' required id="email" onChange={handleChange}/>
                  </div>
                  <div className='form-group mb-3'> 
                    <input type="password" placeholder='password' required id="password" onChange={handleChange}/>
                  </div>
                  <button className='btn btn-secondary auth-btn' type="submit" >Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Create</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login