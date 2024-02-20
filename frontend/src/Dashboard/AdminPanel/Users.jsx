import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/config';
import Avatar from '../../assets/images/avatar.jpg';
import updateData from '../../hooks/useUpdate'
import deleteData from '../../hooks/useDelete'

const Users = () => {

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

   const handleChangeRole = (userId, value)=>{
     updateData(`${BASE_URL}/users/${userId}`,'role', value);
   }
   
   const handleDelete = (userId)=>{
    deleteData(`${BASE_URL}/users/${userId}`);
   }
   
const {data: users, loading, error} = useFetch(`${BASE_URL}/users`);

  return (
    <div className='data-box container pt-4 mt-5'>
      <div className='row align-item-center justify-content-center'>
        <h1>Users</h1>
        <h5 className='ps-3 pt-2'>All Users</h5>
        <div className='col-12 table-box'>
        <table className="table tours-table shadow-lg">
          <thead>
            <tr>
              <th scope="col" className='text-center'>#</th>
              <th scope="col">Id</th>
              <th scope="col">Profile Pic</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Bookings</th>
              <th scope="col">Role</th>
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
              users?.map((user,index)=>(
            <tr key={user._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <td>{user._id}</td>
              <td><img src={user.photo || Avatar} className='profileimg img-fluid rounded-circle border border-2' style={{width:'60px', height:'60px' , objectFit:'cover'}} alt="profile-img"/></td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>3</td>
              <td>
              <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) => handleChangeRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className='text-center'>
                  <button className='btn btn-light action-btn' type="button" onClick={()=> handleDelete(user._id)}>
                    <i className="ri-delete-bin-line action-icon delete-icon"></i>
                  </button>
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

export default Users