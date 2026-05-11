function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='w-full bg-[#1c1f26] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500'
        {...props}
      />
      {error ? <p className='mt-2 text-sm text-red-400'>{error}</p> : null}
    </div>
  )
}

export default Input