import React, { useContext, useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import Avatar from '../../assets/images/avatar.jpg';
import './my-account.css';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import { Image, Transformation } from 'cloudinary-react';


const MyAccount = () => {

  const [activeTab, setActiveTab] = useState('bookings');
  const [editMode, setEditMode] = useState(false);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleEditModeToggle = () => {
      setEditMode(!editMode);
    }
    const handleCancel = async(bookingId) => {
      try {
        const response = await fetch(`${BASE_URL}/booking/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({status: 'Cancelled'}),
        });
  
        const { message } = await response.json();      
        
        if (!response.ok) {
          toast.error(message);
          return;
        }
        toast.info('Successfully Cancelled Booking.');
        setTimeout(() => {
          window.location.reload(); // Reload the page after a slight delay
        }, 1000);
  
      } catch (err) {
        toast.error('Error during Cancellation.');
        console.error(err);
      }
    };

  
  
  const navigate = useNavigate();

  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);

        try {
          const res = await fetch(url, {
            method: "GET",
            credentials:'include',
          });
          if (!res.ok) {
            throw new Error(`Failed to fetch data from ${url}. Status: ${res.status} - ${res.statusText}`);
          }
          
          const result = await res.json();
          setData(result.data);


        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [url]);

    return { data, loading, error };

  }

  const {dispatch} = useContext(AuthContext)
  const {id} = useParams();
  const {data: userinfo, loading: loading, error: error} = useFetch(`${BASE_URL}/users/${id}`);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    photo: ''
  });
  
  useEffect(() => {
    setUserData({ username: userinfo?.username, email: userinfo?.email, photo: userinfo?.photo });
  }, [userinfo]);
  
  const handleChange = e =>{
    setUserData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }
  
  const handlePasswordChange = e =>{
    setPassword(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const {data: userBooking, loading: LoadingBooking, errorBooking} = useFetch(`${BASE_URL}/booking/${id}`);

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const handleChangePassword = async (e) =>{
    e.preventDefault();
    if (password.oldPassword && password.newPassword && password.confirmPassword) {
      try{
      const response = await fetch(`${BASE_URL}/users/${id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(password),
      });

      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }
      toast.success(message);
      dispatch({ type: "LOGOUT" });
      navigate('/login')
    }catch(err){
      console.log(err)
      toast.error("Internal Sever Error.")
    }
    }
    else{
    toast.error("All fields are required.")
  }
}

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
      });
      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
      } else {
        dispatch({ type: "LOGOUT" });
        toast.info(message);
        navigate("/register");
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  const cloudinaryConfig = {
    cloudName: 'dazko9ugd',
    apiKey: '229314452358913',
    apiSecret: 'a60Y6vKeapSAgxHNtGpOsPhwNGY',
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (userData.photo) {
        const formData = new FormData();
        formData.append('file', userData.photo);
  
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload?upload_preset=qsimo6w7`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryResponse.json();
        userData.photo = cloudinaryData.secure_url;
      }

      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
  
      const { message } = await response.json();
  
      if (!response.ok) {
        toast.error(message);
        return;
      }
  
      setEditMode(false);
      toast.success("Profile updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error("Error updating profile.");
      console.error(err);
    }
  };
  
 
  return (
    <div className='container  my-5 pt-5'>
      <div className='row shadow-lg'>
        <div className='col-md-3 col-12 align-items-center justify-content-start d-flex flex-column mt-5 pt-5 profile mb-5'>
        <img
          src={userData.photo || Avatar}
          alt="Profile"
          className='profile-pic img-fluid rounded-circle border border-2'
        />

          <h2 className='mt-3'>{
            loading && 'loading...'
          }
          {
            error && <span>{error}</span>
          } 
          {
            !loading && !error && userData.username
          }</h2>
          <p>
          {
            loading && 'loading.......'
          }
          {
            error && <span>{error}</span>
          } 
          {
            !loading && !error && userData.email
          }
          </p>
        </div>
        <div className='col-md-9 col-12 mt-3'>
          <div className='profile-navigation p-3 border border-2'>
            <button
              className={`my-booking-btn btn btn-light border border-3 ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => handleTabChange('bookings')}
            >
              My Bookings
            </button>
            <button
              className={`account-setting-btn btn btn-light border border-3 ${activeTab === 'accountSettings' ? 'active' : ''}`}
              onClick={() => handleTabChange('accountSettings')}
            >
              Account Setting
            </button>
          </div>
          <div>
          <div className='table-box border border-2 p-3 mb-3'>
            {activeTab === 'bookings' && userBooking.length !== 0 ? (
            
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col" className='text-center'>#</th>
                        <th scope="col">Tour</th>
                        <th scope="col">Person</th>
                        <th scope="col">Guest Size</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Booked At</th>
                        <th scope="col" className='text-center'>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      LoadingBooking && <h4>Loading.......</h4>
                    }
                    {
                      errorBooking && <h4>{errorBooking}</h4>
                    }
                    {!LoadingBooking && !errorBooking &&
                        userBooking?.map((booking,index)=>(
                    <tr key={booking._id}>
                        <th scope="row" className='text-center'>{index+1}</th>
                        <td>{booking?.tourName}</td>
                        <td>{booking?.fullName}</td>
                        <td>{booking?.guestSize}</td>
                        <td>{booking?.phone}</td>
                        <td>
                        {(() => {
                          const createdAtDate = new Date(booking.createdAt);
                          const formattedDate = createdAtDate.toDateString();
                          const options = { hour: "numeric", minute: "numeric", hour12: true };
                          const time = createdAtDate.toLocaleTimeString("en-US", options);
                  
                          return `${formattedDate} - ${time}`;
                        })()}
                        </td>
                        <td className='text-center'>
                        {booking.status === 'Confirmed' ? (
                          <button type="button" className='cancel-btn btn btn-success' disabled>Booked</button>
                        ) : (
                          booking.status === 'Cancelled' ? (
                            <button type="button" className='cancel-btn btn btn-secondary' disabled>Booking Cancelled </button>
                          ) : (
                            <button type="button" className='cancel-btn btn btn-danger' onClick={() => handleCancel(booking?._id)}>Cancel booking</button>
                          )
                        )}
                      </td>                      
                    </tr>
                  ))}
                    </tbody>
                </table>
            ): activeTab === 'bookings' ? (
              <h5>No Booking Found</h5>
          ) : null}
            {activeTab === 'accountSettings' && (
            <form className='account-setting mt-3' onSubmit={handleSaveProfile}>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">Username</span>
                  <input
                    type="text"
                    id="username"
                    className={`form-control ${editMode ? '' : 'readonly'}`}
                    placeholder="Username"
                    value={userData.username}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">Email</span>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${editMode ? '' : 'readonly'}`}
                    placeholder="Email"
                    value={userData.email}
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>
                 {/* Button trigger modal*/}
                 <div className="input-group mb-3">
                 <span className="input-group-text" id="basic-addon1">Password</span>
                <button type="button" className="edit-profile btn btn-light " data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                  Change Password
                </button>
                </div>
                
                {/* Modal*/}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Change Password</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                      
                        <div className="mb-3">
                          <label htmlFor="old-password" className="col-form-label">Old Password</label>
                          <input type="password" className="form-control" id="oldPassword" onChange={handlePasswordChange}/>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="new-password-text" className="col-form-label">New Password</label>
                          <input type="password" className="form-control" id="newPassword" onChange={handlePasswordChange}/>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirm-password" className="col-form-label">Confirm Password</label>
                          <input type="password" className="form-control" id="confirmPassword" onChange={handlePasswordChange}/>
                        </div>
                      
                    </div>
              
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="edit-profile btn btn-light" data-bs-dismiss="modal" onClick={handleChangePassword}>Save</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="inputGroupFile01">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile01 photo"
                    accept=".png, .jpg, .jpeg"
                    disabled={!editMode}
                    onChange={(e) => setUserData({ ...userData, photo: e.target.files[0] })}
                  />
                </div>
                  <div className='d-flex'>
                  
                    <button
                        type="submit"
                        className='edit-profile btn btn-light'
                        onClick={handleEditModeToggle}
                        disabled={editMode}
                    >
                        <i className="ri-edit-2-line"></i> Edit Profile
                    </button>
                    <button
                        type="submit"
                        className={`edit-profile btn btn-light ${editMode ? 'd-block':'d-none'}`}
                        disabled={!editMode}
                        onClick={handleSaveProfile}
                    >
                        <i className="ri-edit-2-line"></i> Save Profile
                    </button>
                  
                  </div>
                  <button type="button" className='btn btn-danger mt-5' onClick={deleteAccount}>Delete Account</button>
            </form>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MyAccount;

                