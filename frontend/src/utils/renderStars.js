// fonction permettant de recevoir une note
const renderStars = (rating, setRating) => {
  return (
    <>
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1

        return (
          <span
            key={i}
            onClick={() => setRating(starValue)}
            style={{
              cursor: 'pointer',
              color: starValue <= rating ? '#ffb829' : '#e4e5e9',
              fontSize: '22px'
            }}
          >
            ★
          </span>
        )
      })}
    </>
  )
}

export default renderStars
