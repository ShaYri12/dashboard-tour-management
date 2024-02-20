import React, { useState } from 'react'
import './styles/data-table.css'
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import calculateAvgRating from '../../utils/avgRating';
import deleteData from '../../hooks/useDelete';
import { Link } from 'react-router-dom';


const AllTours = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const {data: tours, loading, error} = useFetch(`${BASE_URL}/tours?page=${currentPage-1}`)
  const {data: tourCount} = useFetch(`${BASE_URL}/tours/search/getTourCount`)
  const totalPages = Math.ceil(tourCount / 8);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  
  
  
  return (
    <div className='data-box container pt-4 mt-5'>
      <div className='row align-item-center justify-content-center'>
        <h1>Tours</h1>
        <div className='d-flex align-item-center justify-content-between'>
          <div>
            <h5 className='ps-3 pt-2'>All Tours</h5>
          </div>
          <div className='me-3'>
            <Link className='add-tour-btn btn btn-light' to="/createtour"><i className="ri-file-add-line"></i> Create Tour</Link>
          </div>
        </div>
        <div className='col-12 table-box '>
        <table className="table tours-table shadow-lg">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Tour</th>
              <th scope="col">City</th>
              <th scope="col">Distance</th>
              <th scope="col">Rating</th>
              <th scope="col">Amount</th>
              <th scope="col">Featured</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>  
          {
            loading && <tr><td colSpan={7}>Loading.......</td></tr>
          }
          {
            error && <tr><td colSpan={7}>{error}</td></tr>
          }
          {!loading && !error &&
              tours?.map((tour,index)=>(
            <tr key={tour._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <AllToursData tour={tour}/>
            </tr>
          ))}
          </tbody>
        </table>
 
        </div>
        <div className='pagination d-flex align-items-center justify-content-center mt-2 mb-5 gap-3'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active-page' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
      </div>
    </div>
  )
}

export default AllTours;


export const AllToursData = ({tour}) => {

  
  const {_id, title, city, photo, price, featured, reviews, distance, address} = tour;
  
  const handleDelete = (tourId) => {
    deleteData(`${BASE_URL}/tours/${tourId}`);
  };
   
  const {totalRating, avgRating} = calculateAvgRating(reviews);

  return (
    <>
    
              <td><img  className='img-fluid rounded-2' src={photo} style={{width: '100px'}}/> {title}</td>
              <td>{city}</td>
              <td>{distance} k/m</td>
              
              <td>
              {avgRating === 0 ? null : avgRating}
                    {totalRating === 0 ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Not Rated</span>:(
                        <span>({reviews.length})</span>
                    )}
              </td>
              <td>$ {price}</td>
              <td>{featured? ('Yes'):('No')}</td>
              <td className='text-center'>
                <Link className='btn btn-light action-btn' to={`/updatetour/${_id}`}>
                  <i className="ri-edit-box-line action-icon edit-icon"></i>
                  </Link>
                   / 
                  <button className='btn btn-light action-btn' type="button" onClick={() => handleDelete(_id)}>
                    <i className="ri-delete-bin-line action-icon delete-icon"></i>
                  </button>
                </td>
    </>
  )
}

