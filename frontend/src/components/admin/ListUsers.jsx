
import React, {useEffect} from 'react'
import {useGetAdminUsersQuery} from '../../redux/api/userApi'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'
import MetaData from "../layout/MetaData"
import {MDBDataTable} from 'mdbreact'
import Loader from '../layout/Loader'
import AdminLayout from '../layout/AdminLayout'

const ListUsers = () => {
  
  const {data, isLoading, error} = useGetAdminUsersQuery();
  console.log(data)

    useEffect(() => {
              
            if(error) {
                toast.error(error?.data?.message)
            }
          
        }, [error])

      const setUsers = () => {
       const users = {
        columns: [
          {label: "ID", field: "id", sort:"asc"},
          {label: "Name", field: "name", sort:"asc"},
          {label: "Email", field: "email", sort:"asc"},
          {label: "Role", field: "role", sort:"asc"},
          {label: "Actions", field: "actions", sort:"asc"},
        ],
        rows: []
      }
    
       data?.users?.forEach((user) => {
        users.rows.push({
            id: user?._id,
            name: user?.name,
            email: user?.email,
            role: user?.role,
            actions: (
                <>
                    <Link to={`/admin/users/${user?._id}`} className='btn btn-outline-primary btn-sm'>
                      <i className='fa fa-pencil'></i>
                    </Link>
                    <Link className='btn btn-outline-danger btn-sm ms-2'
                      
                    >
                      <i className='fa fa-trash'></i>
                    </Link>
                </>
            )
        })
    })
    return users
    
    
    
    };

     if (isLoading) return <Loader />
  
  
  return (
    <AdminLayout>
          <MetaData title={'All Users'} />
            <h1 className='my-5'>{data?.users?.length} Users</h1>
            <MDBDataTable 
             data={setUsers()}
             className='px-3'
             bordered
             striped
             hover
          />
    </AdminLayout>
  )
}

export default ListUsers