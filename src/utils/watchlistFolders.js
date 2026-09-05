const FOLDERS_KEY = 'nerdify_watchlist_folders'
const FOLDER_ITEMS_KEY = 'nerdify_watchlist_folder_items'

// Default folders
export const DEFAULT_FOLDERS = [
  { id: 'all', name: 'All Movies', isDefault: true, icon: '🎬' },
  { id: 'thriller', name: 'Thriller', isDefault: true, icon: '🔪' },
  { id: 'mystery', name: 'Mystery', isDefault: true, icon: '🔍' },
  { id: 'action', name: 'Action', isDefault: true, icon: '💥' },
  { id: 'comedy', name: 'Comedy', isDefault: true, icon: '😂' },
  { id: 'horror', name: 'Horror', isDefault: true, icon: '👻' },
  { id: 'romance', name: 'Romance', isDefault: true, icon: '💕' },
  { id: 'scifi', name: 'Sci-Fi', isDefault: true, icon: '🚀' },
  { id: 'drama', name: 'Drama', isDefault: true, icon: '🎭' },
]

// Get all folders (default + custom)
export const getAllFolders = () => {
  try {
    const customFolders = JSON.parse(localStorage.getItem(FOLDERS_KEY)) || []
    return [...DEFAULT_FOLDERS, ...customFolders]
  } catch {
    return DEFAULT_FOLDERS
  }
}

// Get custom folders only
export const getCustomFolders = () => {
  try {
    return JSON.parse(localStorage.getItem(FOLDERS_KEY)) || []
  } catch {
    return []
  }
}

// Create a new custom folder
export const createFolder = (name, icon = '📁') => {
  const customFolders = getCustomFolders()
  const newFolder = {
    id: `custom_${Date.now()}`,
    name,
    icon,
    isDefault: false,
    createdAt: new Date().toISOString()
  }
  customFolders.push(newFolder)
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(customFolders))
  return newFolder
}

// Rename a custom folder
export const renameFolder = (folderId, newName) => {
  const customFolders = getCustomFolders()
  const folder = customFolders.find(f => f.id === folderId)
  if (folder && !folder.isDefault) {
    folder.name = newName
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(customFolders))
    return true
  }
  return false
}

// Delete a custom folder
export const deleteFolder = (folderId) => {
  const customFolders = getCustomFolders()
  const filtered = customFolders.filter(f => f.id !== folderId)
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered))
  
  // Remove all items from this folder
  const folderItems = getFolderItems()
  delete folderItems[folderId]
  localStorage.setItem(FOLDER_ITEMS_KEY, JSON.stringify(folderItems))
}

// Get all folder items (mapping of folderId -> [movieIds])
export const getFolderItems = () => {
  try {
    return JSON.parse(localStorage.getItem(FOLDER_ITEMS_KEY)) || {}
  } catch {
    return {}
  }
}

// Add movie to folder(s)
export const addMovieToFolders = (movieId, folderIds) => {
  const folderItems = getFolderItems()
  
  folderIds.forEach(folderId => {
    if (!folderItems[folderId]) {
      folderItems[folderId] = []
    }
    if (!folderItems[folderId].includes(movieId)) {
      folderItems[folderId].push(movieId)
    }
  })
  
  localStorage.setItem(FOLDER_ITEMS_KEY, JSON.stringify(folderItems))
}

// Remove movie from folder
export const removeMovieFromFolder = (movieId, folderId) => {
  const folderItems = getFolderItems()
  if (folderItems[folderId]) {
    folderItems[folderId] = folderItems[folderId].filter(id => id !== movieId)
    localStorage.setItem(FOLDER_ITEMS_KEY, JSON.stringify(folderItems))
  }
}

// Get movies in a specific folder
export const getMoviesInFolder = (folderId) => {
  const folderItems = getFolderItems()
  return folderItems[folderId] || []
}

// Get all folders containing a movie
export const getFoldersForMovie = (movieId) => {
  const folderItems = getFolderItems()
  const folders = []
  
  Object.keys(folderItems).forEach(folderId => {
    if (folderItems[folderId].includes(movieId)) {
      folders.push(folderId)
    }
  })
  
  return folders
}

// Check if movie is in any folder
export const isMovieInAnyFolder = (movieId) => {
  const folderItems = getFolderItems()
  return Object.values(folderItems).some(items => items.includes(movieId))
}

// Made with Bob
