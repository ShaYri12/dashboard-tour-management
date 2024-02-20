import React, { useState } from 'react';
import './create-tour.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../utils/config';

export const CreateTour = () => {
  const [tourData, setTourData] = useState({
    title: '',
    city: '',
    desc: '',
    address: '',
    price: 0,
    maxGroupSize: 1,
    photo: '',
    distance: 0,
    featured: false
  })

  const navigate = useNavigate()

  const handleChange = e =>{
    setTourData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const cloudinaryConfig = {
    cloudName: 'dazko9ugd',
    apiKey: '229314452358913',
    apiSecret: 'a60Y6vKeapSAgxHNtGpOsPhwNGY',
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    if (!tourData.title || !tourData.city || !tourData.price || !tourData.address || !tourData.desc || !tourData.maxGroupSize || !tourData.distance || !tourData.photo) {
      toast.error("Please fill in all required fields.");
      return;
    }else{
  
    try {
      if (tourData.photo) {
        const formData = new FormData();
        formData.append('file', tourData.photo);
  
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload?upload_preset=qsimo6w7`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryResponse.json();
        tourData.photo = cloudinaryData.secure_url;
      }

      const response = await fetch(`${BASE_URL}/tours`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(tourData),
      });
  
      const { message } = await response.json();
  
      if (!response.ok) {
        toast.error(message);
        return;
      }
  
      toast.success("Successfully created a new tour.");
      navigate('/all-tours')
    } catch (err) {
      toast.error("Error creating tour.");
      console.error(err);
    }
  }
  };

  return (
    <>
    <div className='d-flex w-100 align-items-center justify-content-center vh-100'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 shadow-lg rounded-2'>
            <h1 className='text-center mb-5 mt-3'>Create A New Tour</h1>
            
            <form onSubmit={handleCreateTour}>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Tour Title:</span>
                <input type="text" name="title" className="form-control" placeholder="Title of the tour" onChange={handleChange} />
                <span className="input-group-text">City:</span>
                <input type="text" name="city" className="form-control" placeholder="City of the tour" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Price:</span>
                <input type="number" name="price" className="form-control" placeholder="Price per person in dollar" onChange={handleChange} />
                <span className="input-group-text">Max Peoples:</span>
                <input type="number" name="maxGroupSize" className="form-control" placeholder="Maximum Peoples" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Distance:</span>
                <input type="number" name="distance" className="form-control" placeholder="Distance in k/m" />
                <span className="input-group-text">Address:</span>
                <input type="text" name="address" className="form-control" placeholder="Address of the tour" onChange={handleChange}/>
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Description:</span>
                <textarea  rows="5" name="desc" className="form-control" placeholder="Description of the tour" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Featured:</span>
                <select name="featured" className='rounded-2' onChange={handleChange} >
                  <option value="false">&nbsp;No&nbsp;</option>
                  <option value="true">&nbsp;Yes&nbsp;</option>
                </select>
              </div>
              <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="inputGroupFile01">Tour Picture</label>
                  <input
                  type="file"
                  className="form-control"
                  name="photo"
                  id="inputGroupFile01 photo"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setTourData({ ...tourData, photo: e.target.files[0] })}
                />
              </div>
              <div className='justify-content-end d-flex'>
                <button type="submit" onClick={handleCreateTour} className='btn btn-light create-tour-btn mb-3'> <i className="ri-file-add-line"></i>   Create Tour</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
