import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/config';
import Avatar from '../../assets/images/avatar.jpg';
import updateData from '../../hooks/useUpdate'
import deleteData from '../../hooks/useDelete'

const Admins = () => {
  
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

  const handleChangeRole = (adminId, value)=>{
    updateData(`${BASE_URL}/users/${adminId}`,'role', value);
  }
  
  const handleDelete = (adminId)=>{
    deleteData(`${BASE_URL}/users/${adminId}`);
  }

  const {data: admins, loading, error} = useFetch(`${BASE_URL}/users/search/admins`);

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
              <th scope="col">Role</th>
              <th scope="col" className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            loading && <tr><td colSpan={6}>Loading.......</td></tr>
          }
          {
            error && <tr><td colSpan={6}>{error}</td></tr>
          }
          {!loading && !error &&
              admins?.map((admin,index)=>(
            <tr key={admin._id}>
              <th scope="row" className='text-center'>{index+1}</th>
              <td>{admin._id}</td>
              <td><img src={admin.photo || Avatar} className='profileimg img-fluid rounded-circle border border-2' style={{width:'60px', height:'60px', objectFit:'cover'}} alt="profile-img"/></td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>
              <select
                  className="form-select"
                  value={admin.role}
                  onChange={(e) => handleChangeRole(admin._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className='text-center'>
                <button className='btn btn-light action-btn' type="button" onClick={()=> handleDelete(admin._id)}>
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

export default Admins