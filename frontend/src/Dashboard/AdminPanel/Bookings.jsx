import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/config';
import { toast } from 'react-toastify';

const Bookings = () => {
  

  const [status, setStatus] = useState('')

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
  
  const {data: bookings, loading, error} = useFetch(`${BASE_URL}/booking?status=${status}`);

  const handleAction = async(bookingId,newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({status: newStatus}),
      });

      const { message } = await response.json();      
      
      if (!response.ok) {
        toast.error(message);
        return;
      }
      toast.success('Successfully Updated.');
      setTimeout(() => {
        window.location.reload(); // Reload the page after a slight delay
      }, 1000);

    } catch (err) {
      toast.error('Error during updating.');
      console.error(err);
    }
  };

  return (
    <div className='data-box container pt-4 mt-5'>
      <div className='row align-item-center justify-content-center'>
        <h1>Bookings</h1>
        <div className='d-flex align-item-center justify-content-between'>
          <div>
            <h5 className='ps-3 pt-2'>All Bookings</h5>
          </div>
          <div>
            <button className={`filter-btn btn btn-light ${status === '' ? 'active' : ''}`} onClick={()=>{setStatus('')}}>All</button>
            <button className={`filter-btn btn btn-light ${status === 'Confirmed' ? 'active' : ''}`} onClick={()=>{setStatus('Confirmed')}}>Confirmed</button>
            <button className={`filter-btn btn btn-light ${status === 'Cancelled' ? 'active' : ''}`} onClick={()=>{setStatus('Cancelled')}}>Cancelled</button>
          </div>
        </div>
        <div className='col-12 table-box'>
        <table className="table tours-table shadow-lg">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Tour</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Guest Size</th>
              <th scope="col">Phone</th>
              <th scope="col">Book At</th>
              <th scope="col">Status</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            loading && <tr><td colSpan={9}>Loading.......</td></tr>
          }
          {
            error && <tr><td colSpan={9}>{error}</td></tr>
          }
          {!loading && !error &&
              bookings?.map((booking,index)=>(
            <tr key={booking._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <td>{booking.tourName}</td>
              <td>{booking.fullName}</td>
              <td>{booking.userEmail}</td>
              <td>{booking.guestSize}</td>
              <td>{booking.phone}</td>
              <td>
              {(() => {
                const createdAtDate = new Date(booking.createdAt);
                const formattedDate = createdAtDate.toDateString();
                const options = { hour: "numeric", minute: "numeric", hour12: true };
                const time = createdAtDate.toLocaleTimeString("en-US", options);
        
                return `${formattedDate} - ${time}`;
              })()}
              </td>
              <td>{booking.status}</td>
              <td className='text-center'>
              {booking.status == 'Pending' ? (<>
                <button className='btn btn-light action-btn' onClick={() => handleAction(booking?._id, "Confirmed")} type="button">
                  <i className="ri-check-line action-icon"></i>
                  </button>
                   / 
                  <button className='btn btn-light action-btn' onClick={() => handleAction(booking?._id,"Cancelled")} type="button">
                    <i className="ri-close-line action-icon"></i>
                  </button>
                  </>
                  ):('')}
                </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

export default Bookings