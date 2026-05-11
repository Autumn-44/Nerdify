function MovieBanner({ backdrop, title }) {
  return (
    <div
      className='h-[400px] bg-cover bg-center flex items-end p-10'
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      <h1 className='text-5xl font-bold'>{title}</h1>
    </div>
  )
}

export default MovieBanner