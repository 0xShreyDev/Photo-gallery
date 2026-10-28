import { useState, useReducer, useEffect, useMemo, useCallback } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import {
  favouritesReducer,
  loadFavourites,
  STORAGE_KEY,
} from '../reducers/favouritesReducer'
import PhotoCard from './PhotoCard'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [query, setQuery] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])


  const handleSearch = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', id })
  }, [])


  const filteredPhotos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return photos.filter((photo) => photo.author.toLowerCase().includes(q))
  }, [photos, query])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Photo Gallery</h1>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by author name"
        aria-label="Search photos by author name"
        className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-gray-500 focus:outline-none sm:max-w-sm"
      />

      {loading && (
        <div className="flex justify-center py-16" role="status" aria-label="Loading photos">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          Could not load photos: {error}. Check your connection and refresh the page.
        </p>
      )}

      {!loading && !error && filteredPhotos.length === 0 && (
        <p className="text-gray-600">No photos found for "{query}".</p>
      )}

      {!loading && !error && filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </main>
  )
}
