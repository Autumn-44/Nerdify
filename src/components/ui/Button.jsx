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
      className={`bg-primary-500 hover:bg-primary-600 transition px-5 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children ?? text}
    </button>
  )
}

export default Button