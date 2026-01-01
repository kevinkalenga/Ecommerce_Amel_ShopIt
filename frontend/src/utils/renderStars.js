// fonction permettant de recevoir une note
const renderStars = (rating) => {
  // arrondir le nombre
    const fullStars = Math.round(rating)
    return(
      <>
        {
          // Création d'un tableau de 5 elements
            [...Array(5)].map((_, i)=>(
                <span
                 key={i}
                 style={{
                    color: i < fullStars ? '#ffb829':'#e4e5e9',
                    fontSize: '20px'
                 }}
                >
                  ★
                </span>
            ))
        }
      </>
    )
}
export default renderStars