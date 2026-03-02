import React, {useEffect} from 'react'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'
import MetaData from "../layout/MetaData"
import {MDBDataTable} from 'mdbreact'
import Loader from '../layout/Loader'
import AdminLayout from '../layout/AdminLayout'
import { useGetAdminOrdersQuery } from '../../redux/api/orderApi'

const ListOrders = () => {
  
        const {data, isLoading, error} = useGetAdminOrdersQuery()
        console.log(data)
    
        
        
       useEffect(() => {
          
        if(error) {
            toast.error(error?.data?.message)
        }
      
    }, [error])


    
     const setOrders = () => {
       const orders = {
        columns: [
          {label: "ID", field: "id", sort:"asc"},
          {label: "Payment Status", field: "paymentStatus", sort:"asc"},
          {label: "Order Status", field: "orderStatus", sort:"asc"},
          {label: "Actions", field: "actions", sort:"asc"},
        ],
        rows: []
      };

      data?.orders?.forEach((order) => {
             orders.rows.push({
                 id: order?._id,
                 paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
                 orderStatus: order?.orderStatus,
                 actions: (
                     <>
                         <Link to={`/admin/orders/${order?._id}`} className='btn btn-outline-primary btn-sm'>
                           <i className='fa fa-pencil'></i>
                         </Link>
                         <Link className='btn btn-outline-danger btn-sm ms-2'>
                           <i className='fa fa-trash'></i>
                         </Link>
                       
                     </>
                 )
             })
       })
        return orders
    }
  
    
    
    
    

    if (isLoading) return <Loader />

    return (
        <AdminLayout>
              <MetaData title={'All Orders'} />
                    <h1 className='my-5'>{data?.order?.length} Orders</h1>
                    <MDBDataTable 
                     data={setOrders()}
                     className='px-3'
                     bordered
                     striped
                     hover
                   />
        </AdminLayout>
    )



}
    
export default ListOrders