function Button({
  children,
  text,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-lg font-semibold text-white ${className}`}
      {...props}
    >
      {children ?? text}
    </button>
  )
}

export default Button