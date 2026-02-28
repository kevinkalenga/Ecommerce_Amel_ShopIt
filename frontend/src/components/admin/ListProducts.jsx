import React, {useEffect} from 'react'
import {useGetAdminProductsQuery, useDeleteProductMutation} from '../../redux/api/productsApi'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'
import MetaData from "../layout/MetaData"
import {MDBDataTable} from 'mdbreact'
import Loader from '../layout/Loader'
import AdminLayout from '../layout/AdminLayout'



const ListProducts = () => {
  
    const {data, isLoading, error} = useGetAdminProductsQuery()
    console.log(data)

    const [deleteProduct, {isLoading:isDeleteLoading, error: deleteError}] = useDeleteProductMutation()
    
   useEffect(() => {
      
    if(error) {
        toast.error(error?.data?.message)
    }
    if(deleteError) {
        toast.error(deleteError?.data?.message)
    }
}, [error, deleteError])
  
   const deleteProductHandler = async (id) => {
    try {
       await deleteProduct(id).unwrap()
       toast.success("Product Deleted")
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed")
    }
   }



     const setProducts = () => {
       const products = {
        columns: [
          {label: "ID", field: "id", sort:"asc"},
          {label: "Name", field: "name", sort:"asc"},
          {label: "Stock", field: "stock", sort:"asc"},
          {label: "Actions", field: "actions", sort:"asc"},
        ],
        rows: []
    };

    data?.product?.forEach((p) => {
        products.rows.push({
            id: p?._id,
            name: `${p?.name?.substring(0,20)}...`,
            stock: p?.stock,
            actions: (
                <>
                    <Link to={`/admin/products/${p?._id}`} className='btn btn-outline-primary btn-sm'>
                      <i className='fa fa-pencil'></i>
                    </Link>
                    <Link to={`/admin/products/${p?._id}/upload_images`} className='btn btn-outline-success btn-sm ms-2'>
                      <i className='fa fa-image'></i>
                    </Link>
                    <Link className='btn btn-outline-danger btn-sm ms-2'
                      onClick={() => deleteProductHandler(p?._id)}
                      disabled={isDeleteLoading}
                    >
                      <i className='fa fa-trash'></i>
                    </Link>
                </>
            )
        })
    })
    return products
   }

   if(isLoading) return <Loader />
  
  
    return (
    <AdminLayout>
       <MetaData title={'All Products'} />
       <h1 className='my-5'>{data?.product?.length} Products</h1>
       <MDBDataTable 
        data={setProducts()}
        className='px-3'
        bordered
        striped
        hover
      />
    </AdminLayout>
  )
}

export default ListProducts



