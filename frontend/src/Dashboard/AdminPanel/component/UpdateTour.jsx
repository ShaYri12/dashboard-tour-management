import React, { useEffect, useState } from 'react';
import './create-tour.css'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../utils/config';
import useFetch from '../../../hooks/useFetch';

export const UpdateTour = () => {
  

  const {id} = useParams();
  const{data: tour, loading, error}= useFetch(`${BASE_URL}/tours/${id}`)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if the tour data has been fetched
    if (tour) {
      setTourData({
        title: tour.title || '',
        city: tour.city || '',
        desc: tour.desc || '',
        address: tour.address || '',
        price: tour.price || 0,
        maxGroupSize: tour.maxGroupSize || 1,
        photo: tour.photo || '',
        distance: tour.distance || 0,
        featured: tour.featured || false,
      });
    }
  }, [tour]);

  const [tourData, setTourData] = useState({
    title: tour.title ||'',
    city: tour.city || '',
    desc: tour.desc || '',
    address: tour.address || '',
    price: tour.price || 0,
    maxGroupSize: tour.maxGroupSize || 1,
    photo: tour.photo || '',
    distance: tour.distance || 0,
    featured: tour.featured || false
  })

  
console.log(tour.featured)
  const handleChange = e =>{
    setTourData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const cloudinaryConfig = {
    cloudName: 'dazko9ugd',
    apiKey: '229314452358913',
    apiSecret: 'a60Y6vKeapSAgxHNtGpOsPhwNGY',
  };

  const handleUpdateTour = async (e) => {
    e.preventDefault();
    if (!tourData.title || !tourData.city || !tourData.price || !tourData.address || !tourData.desc || !tourData.maxGroupSize || !tourData.distance || !tourData.photo) {
      toast.error("Please fill in all required fields.");
      return;
    }
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

      const response = await fetch(`${BASE_URL}/tours/${id}`, {
        method: "PUT",
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
  
      toast.success("Successfully Updated The Tour.");
      navigate('/all-tours')
    } catch (err) {
      toast.error("Error updating tour.");
      console.error(err);
    }
  };

  return (
    <>
    <div className='d-flex w-100 align-items-center justify-content-center vh-100'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 shadow-lg rounded-2'>
            <form>
              <h1 className='text-center mb-5 mt-3'>Create A New Tour</h1>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Tour Title:</span>
                <input type="text" name="title" className="form-control" value={tourData.title} placeholder="Title of the tour" onChange={handleChange} />
                <span className="input-group-text">City:</span>
                <input type="text" name="city" className="form-control" value={tourData.city} placeholder="City of the tour" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Price:</span>
                <input type="number" name="price" className="form-control" value={tourData.price} placeholder="Price per person in dollar" onChange={handleChange} />
                <span className="input-group-text">Max Peoples:</span>
                <input type="number" name="maxGroupSize" className="form-control" value={tourData.maxGroupSize} placeholder="Maximum Peoples" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Distance:</span>
                <input type="number" name="distance" className="form-control" value={tourData.distance} placeholder="Distance in k/m" onChange={handleChange} />
                <span className="input-group-text">Address:</span>
                <input type="text" name="address" className="form-control" value={tourData.address} placeholder="Address of the tour" onChange={handleChange}/>
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Description:</span>
                <textarea  rows="5" name="desc" className="form-control" value={tourData.desc} placeholder="Description of the tour" onChange={handleChange} />
              </div>
              <div className="input-fields input-group mb-3">
                <span className="input-group-text">Featured:</span>
                <select name="featured" className='rounded-2'value={tourData.featured} onChange={handleChange} >
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
                  id="inputGroupFile01"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setTourData({ ...tourData, photo: e.target.files[0] })}
                />
              </div>
              <div className='justify-content-end d-flex'>
                <button type="submit" onClick={handleUpdateTour} className='btn btn-light create-tour-btn mb-3'> <i className="ri-file-add-line"></i>   Update Tour</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
