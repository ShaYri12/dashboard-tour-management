import React,{useState, useEffect, useContext} from 'react'
import '../styles/login.css';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {BASE_URL} from './../utils/config'
import { toast } from 'react-toastify';

import RegisterImg from '../assets/images/register.png'
import userIcon from '../assets/images/user.png'

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, -1);
  },[]);

  const [credentials, setCredentials] = useState({
    username:undefined,
    email:undefined,
    password:undefined
  });

  const {dispatch} = useContext(AuthContext)

  const navigate = useNavigate();
  
  const handleChange= e =>{
    setCredentials(prev=>({...prev, [e.target.id]:e.target.value}))
  }

  const handleClick = async e =>{
    e.preventDefault();
    try{
      const res = await fetch(`${BASE_URL}/auth/register`,{
        method:'post',
        headers:{
          'content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      const result = await res.json()
      
      if(!res.ok) {
        return toast.error(result.message)
      }
      toast.success(result.message)
      dispatch({type:'REGISTER_SUCCESS'})
      navigate("/login");

    }catch (error){
      console.log(error.message)
      toast.error("Registeration Failed")
    }
    
  }
  return (
    <section>
      <div className='container'>
        <div className='row'> 
          <div className='col-lg-8 m-auto'>
            <div className='login-container d-flex justify-content-between'>
              <div className='login-img d-flex justify-content-center'>
                <img src={RegisterImg} alt=""/>
              </div>
              <div className='login-form'>
                <div className='user'>
                  <img src={userIcon} alt=""/>
                </div>
                <h2>Register</h2>

                <form onSubmit={handleClick}>
                  <div className='form-group mb-3'> 
                    <input type="text" placeholder='Username' required id="username" onChange={handleChange}/>
                  </div>
                  <div className='form-group mb-3'> 
                    <input type="email" placeholder='Email' required id="email" onChange={handleChange}/>
                  </div>
                  <div className='form-group mb-3'> 
                    <input type="password" placeholder='Password' required id="password" onChange={handleChange}/>
                  </div>
                  <button className='btn btn-secondary auth-btn' type="submit" >Create Account</button>
                </form>
                <p>Already have an account? <Link to="/Login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register