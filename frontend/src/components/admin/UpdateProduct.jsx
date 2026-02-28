import React, {useEffect, useState} from 'react'
import {useGetProductDetailsQuery, useUpdateProductMutation} from '../../redux/api/productsApi'
import toast from 'react-hot-toast'
import {useNavigate, useParams} from 'react-router-dom'
import MetaData from "../layout/MetaData"
import {PRODUCT_CATEGORIE} from '../../constants/constants'
import AdminLayout from '../layout/AdminLayout'



const UpdateProduct = () => {
  
  const navigate = useNavigate()
  const params = useParams()
  
  const [product, setProduct] = useState({
    name:"",
    description: "",
    price:"",
    category:"",
    stock : "",
    seller: "" 
  })

  const {name, description, price, category, stock, seller} = product

 
  const [updateProduct, {isLoading, error, isSuccess}] = useUpdateProductMutation()
  
  const {data, refetch} = useGetProductDetailsQuery(params?.id)
  useEffect(() => {
    if(data?.product) {
        setProduct({
            name: data?.product?.name,
            description: data?.product?.description,
            price: data?.product?.price,
            category: data?.product?.category,
            stock: data?.product?.stock,
            seller: data?.product?.seller
        })
    }
  }, [data])
  
  
  
  useEffect(() => {
     if(error) {
      toast.error(error?.data?.message)
     }

     if(isSuccess) {
      toast.success("Product Created")
      // navigate('/admin/products')
     }
  }, [error, isSuccess, navigate])

  const onChange = (e) => {
    setProduct({...product, [e.target.name]:e.target.value})
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    try {
        const res = await updateProduct({id:params?.id, body: product}).unwrap()
        toast.success("Product Updated")
        setProduct(res.product)
        await refetch()
        navigate('/admin/products')
    } catch (err) {
        toast.error(err?.data?.message || "Update failed")
    }
  }


  return (
    <AdminLayout>
        <MetaData title={"Update Product"} />
    <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form onSubmit={submitHandler} className="shadow rounded bg-body">
          <h2 className="mb-4">New Product</h2>
          <div className="mb-3">
            <label for="name_field" className="form-label"> Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label for="description_field" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description_field"
              rows="8"
              name="description"
              value={description}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label for="price_field" className="form-label"> Price </label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                name="price"
                 value={price}
                 onChange={onChange}
              />
            </div>

            <div className="mb-3 col">
              <label for="stock_field" className="form-label"> Stock </label>
              <input
                type="number"
                id="stock_field"
                className="form-control"
                name="stock"
                 value={stock}
                 onChange={onChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col">
              <label for="category_field" className="form-label"> Category </label>
              <select className="form-select" 
              id="category_field"
               name="category"
                value={category}
                onChange={onChange}
               >
                {
                  PRODUCT_CATEGORIE?.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))
                }
              </select>
            </div>
            <div className="mb-3 col">
              <label for="seller_field" className="form-label"> Seller Name </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={seller}
                onChange={onChange}
              />
            </div>
          </div>
          <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
             {
              isLoading ? "Updating..." : "Update"
             }
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
}

export default UpdateProduct