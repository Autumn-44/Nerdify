export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getFromLocalStorage = key => {
  const item = localStorage.getItem(key)

  return item ? JSON.parse(item) : null
}

export const removeFromLocalStorage = key => {
  localStorage.removeItem(key)
}