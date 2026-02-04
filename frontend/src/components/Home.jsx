import { useEffect } from "react"
import MetaData from "./layout/MetaData"
import {useGetProductsQuery} from "../redux/api/productsApi"
import ProductItem from "./product/ProductItem"
import Loader from './layout/Loader'
import toast from 'react-hot-toast'
import CustomPagination from './layout/CustomPagination'
import Filter from "./layout/Filter"
import { useSearchParams } from "react-router-dom"
const Home = () => {
  let [searchParams] = useSearchParams()
  
  const page = Number(searchParams.get("page")) || 1
  const keyword = searchParams.get("keyword") || ""
  const category = searchParams.get("category") || ""
  const rating = searchParams.get("ratings");
  // recherche de valeur min et max
  const rawMin = searchParams.get("min");
  const rawMax = searchParams.get("max");
  // const rawMin = searchParams.get("price[gte]");
  // const rawMax = searchParams.get("price[lte]");

   const min = rawMin !== null ? Number(rawMin) : undefined
   const max = rawMax !== null ? Number(rawMax) : undefined
  
  //  filtre
  const params = {
    page,
    keyword,
    ...(min !== undefined && {"price[gte]":min}),
    ...(max !== undefined && {"price[lte]":max}),
    ...(rating && { ratings: rating }),
    ...(category && {category})

  }


//  Filtrer pour eviter des valeurs undefined
const cleanParams = Object.fromEntries(
  Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
)
  
  
  
  const {data, isLoading, error, isError} = useGetProductsQuery(cleanParams);
  console.log(data)

   useEffect(() => {
     if(isError) {
       toast.error(error?.data?.message || "Error is occured")
     }
   }, [isError])
   
   const columnSize = keyword ? 4:3;
   
   if(isLoading) return <Loader />
  
  return (
      
    <> 
      <MetaData title="Buy Your Product On line" />
      <div className="row">
        {
          keyword && (
            <div className="col-6 col-md-3 mt-5">
               <Filter />
            </div>
          )
        }
        
        <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">
             {keyword ? `${data?.products?.length} Products found with keyword: ${keyword}`: "Latest Products"}
          </h1>

          <section id="products" className="mt-5">
            <div className="row">
            
             {
               data?.products?.map((product) => (
                <ProductItem product={product} columnSize={columnSize} />
               ))
             }
             
            </div>
          </section>
          <CustomPagination resPerPage={data?.resPerPage} filteredProductsCount={data?.filteredProductsCount} />
        </div>
      </div>
    </> 
  )
}

export default Home