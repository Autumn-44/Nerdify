/**
 * Letterboxd Import Utility
 * Parses Letterboxd CSV exports and converts them to Nerdify format
 */

/**
 * Parse CSV text into array of objects
 */
const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = values[index]
      })
      data.push(obj)
    }
  }

  return data
}

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values
}

/**
 * Parse Letterboxd diary export
 * Expected columns: Date, Name, Year, Letterboxd URI, Rating, Rewatch, Review, Tags, Watched Date
 */
export const parseLetterboxdDiary = (csvText) => {
  const data = parseCSV(csvText)
  
  return data.map(entry => ({
    title: entry.Name || entry.name || '',
    year: entry.Year || entry.year || '',
    rating: entry.Rating ? parseFloat(entry.Rating) * 2 : null, // Convert 5-star to 10-point
    watchedDate: entry['Watched Date'] || entry.Date || '',
    review: entry.Review || '',
    rewatch: entry.Rewatch === 'Yes',
    tags: entry.Tags ? entry.Tags.split(',').map(t => t.trim()) : [],
    letterboxdUri: entry['Letterboxd URI'] || '',
  }))
}

/**
 * Parse Letterboxd ratings export
 * Expected columns: Date, Name, Year, Letterboxd URI, Rating
 */
export const parseLetterboxdRatings = (csvText) => {
  const data = parseCSV(csvText)
  
  return data.map(entry => ({
    title: entry.Name || entry.name || '',
    year: entry.Year || entry.year || '',
    rating: entry.Rating ? parseFloat(entry.Rating) * 2 : null, // Convert 5-star to 10-point
    ratedDate: entry.Date || '',
    letterboxdUri: entry['Letterboxd URI'] || '',
  }))
}

/**
 * Parse Letterboxd watchlist export
 * Expected columns: Date, Name, Year, Letterboxd URI
 */
export const parseLetterboxdWatchlist = (csvText) => {
  const data = parseCSV(csvText)
  
  return data.map(entry => ({
    title: entry.Name || entry.name || '',
    year: entry.Year || entry.year || '',
    addedDate: entry.Date || '',
    letterboxdUri: entry['Letterboxd URI'] || '',
  }))
}

/**
 * Parse Letterboxd watched films export
 * Expected columns: Date, Name, Year, Letterboxd URI
 */
export const parseLetterboxdWatched = (csvText) => {
  const data = parseCSV(csvText)
  
  return data.map(entry => ({
    title: entry.Name || entry.name || '',
    year: entry.Year || entry.year || '',
    watchedDate: entry.Date || '',
    letterboxdUri: entry['Letterboxd URI'] || '',
  }))
}

/**
 * Detect which type of Letterboxd export based on headers
 */
export const detectLetterboxdExportType = (csvText) => {
  const firstLine = csvText.split('\n')[0].toLowerCase()
  
  if (firstLine.includes('review') || firstLine.includes('rewatch')) {
    return 'diary'
  } else if (firstLine.includes('rating') && !firstLine.includes('review')) {
    return 'ratings'
  } else if (firstLine.includes('watchlist') || (firstLine.includes('name') && firstLine.includes('year') && !firstLine.includes('rating'))) {
    return 'watchlist'
  } else {
    return 'watched'
  }
}

/**
 * Parse any Letterboxd export and auto-detect type
 */
export const parseLetterboxdExport = (csvText) => {
  const type = detectLetterboxdExportType(csvText)
  
  switch (type) {
    case 'diary':
      return { type, data: parseLetterboxdDiary(csvText) }
    case 'ratings':
      return { type, data: parseLetterboxdRatings(csvText) }
    case 'watchlist':
      return { type, data: parseLetterboxdWatchlist(csvText) }
    case 'watched':
      return { type, data: parseLetterboxdWatched(csvText) }
    default:
      throw new Error('Unknown Letterboxd export type')
  }
}

export default {
  parseLetterboxdDiary,
  parseLetterboxdRatings,
  parseLetterboxdWatchlist,
  parseLetterboxdWatched,
  parseLetterboxdExport,
  detectLetterboxdExportType,
}

// Made with Bob