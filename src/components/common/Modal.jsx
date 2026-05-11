function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
      <div className='bg-[#1c1f26] p-6 rounded-lg w-[500px] relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-white'
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}

export default Modal
