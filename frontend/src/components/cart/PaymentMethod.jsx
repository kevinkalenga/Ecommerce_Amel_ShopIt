import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import MetaData from '../layout/MetaData'
import { useSelector } from 'react-redux';
import { calculateOrderCost } from '../../helpers/helpers';
import {toast} from "react-hot-toast"
import CheckoutSteps from './CheckoutSteps';
import { useCreateNewOrderMutation } from '../../redux/api/orderApi';

const PaymentMethod = () => {
  
  const [method, setMethod] = useState("");

  const {shippingInfo, cartItems} = useSelector((state) => state.cart)

  const [createNewOrder, {error, isSuccess}] = useCreateNewOrderMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if(error) {
      toast.error(error?.data?.message)
    }
    if(isSuccess) {
      navigate('/')
    }
  }, [error, isSuccess, navigate])

  
  
  
  const submitHandler = (e) => {
     e.preventDefault()
     if(!method) {
       toast.error("Please choose the payment method")
       return;
     }
     const {itemsPrice, shippingPrice, taxPrice, totalPrice} = calculateOrderCost(cartItems)

     const orderItems = cartItems.map((item, index) => {
        const productId = item.product || item._id 
        if(!productId) {
          console.warn(`No product found for cartItem[${index}] :`, item)
        } else {
          console.log(`cartItem[${index}] - product ID :`, productId)
        }

        return {
          name:item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: productId
        }
     })
     
     
     if(method === "COD") {
        const orderData = {
          shippingInfo,
          orderItems,
          itemsPrice,
          shippingAmount:shippingPrice,
          taxAmount: taxPrice,
          totalAmount:totalPrice,
          paymentInfo: {
            status:"Not Paid"
          },
          paymentMethod: "COD"
        }
        createNewOrder(orderData)
     }

     if(method === "Card") {
      // Stripe Checkout
      alert("Card")
     }
  }
  
  
  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
         
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e) => setMethod("COD")}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
                  onChange={(e) => setMethod("Card")}
            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    
    </>
  )
}

export default PaymentMethod