import React from 'react'
import AdminRouters from '../../router/AdminRouters'
import Sidebar from '../../Dashboard/AdminPanel/component/Sidebar'

const AdminLayout = () => {
  return (
    <>
    <div className='d-sm-none d-block container'><h1>You Cannot View The Admin Panel On Small Devices</h1></div>
    <div className='d-sm-block d-none '>
        <div className="d-flex">
            <Sidebar />
            <AdminRouters/>
        </div>  
    </div>
    </>
  )
}

export default AdminLayout