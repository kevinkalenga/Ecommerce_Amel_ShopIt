import {useEffect} from 'react'

const MetaData = ({title}) => {
  
  useEffect(() => {
     document.title = `${title} - ShopIT`
  }, [title])
  
    return null
}

MetaData.defaultProps = {
    title: "Buy Your Product On line"
}


export default MetaData