function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className='flex justify-center gap-4 py-8'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='bg-green-500 px-4 py-2 rounded disabled:opacity-50'
      >
        Previous
      </button>

      <span className='text-white'>
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='bg-green-500 px-4 py-2 rounded disabled:opacity-50'
      >
        Next
      </button>
    </div>
  )
}

export default Pagination