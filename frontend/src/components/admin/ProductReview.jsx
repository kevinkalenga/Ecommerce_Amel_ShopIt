import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'

import {MDBDataTable} from 'mdbreact'
import Loader from '../layout/Loader'
import { useLazyGetProductReviewsQuery } from '../../redux/api/productsApi'
import AdminLayout from '../layout/AdminLayout'

const ProductReview = () => {
  
  const [productId, setProductId] = useState("")

  const [getProductReviews, {data, isLoading, error}] = useLazyGetProductReviewsQuery()

  useEffect(() => {
    if(error) {
      toast.error(error?.data?.message)
    }
  }, [error])
  
  const submitHandler = (e) => {
    e.preventDefault()
    getProductReviews(productId)
  }
    
  
   
    const setReviews = () => {
          const reviews = {
           columns: [
             {label: "Review ID", field: "id", sort:"asc"},
             {label: "Rating", field: "rating", sort:"asc"},
             {label: "Comment", field: "comment", sort:"asc"},
             {label: "User", field: "user", sort:"asc"},
             {label: "Actions", field: "actions", sort:"asc"},
           ],
           rows: []
           }
       
          data?.reviews?.forEach((review) => {
           reviews.rows.push({
               id: review?._id,
               rating: review?.rating,
               comment: review?.comment,
               user: review?.user?.name || review?.name || review?.user || "N/A",
               actions: (
                   <>
                       
                       <Link className='btn btn-outline-danger btn-sm ms-2'
                        // onClick={() => deleteUserHandler(user?._id)} 
                        // disabled={isDeleteLoading}
                       >
                         <i className='fa fa-trash'></i>
                       </Link>
                   </>
               )
           })
         })
       return reviews
       
       
       
       };
  
   if(isLoading) return <Loader />
  
  
  return (
    <AdminLayout>
           <div className="row justify-content-center my-5">
      <div className="col-6">
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label for="productId_field" className="form-label">
              Enter Product ID
            </label>
            <input
              type="text"
              id="productId_field"
              className="form-control"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <button
            id="search_button"
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
        </form>
      </div>
    </div>
    
    {/* <table className="table table-bordered table-striped mt-5">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table> */}
    {
      data?.reviews?.length > 0 ? (
         
            <MDBDataTable 
             data={setReviews()}
             className='px-3'
             bordered
             striped
             hover
          />
      ) : (
        <p className='mt-5 text-center'>No Reviews</p>
      )
    }
  </AdminLayout>
  )
}

export default ProductReview