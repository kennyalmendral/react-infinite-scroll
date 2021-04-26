import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)

    let cancel

    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {
        q: query,
        page: pageNumber
      },
      cancelToken: new axios.CancelToken(token => cancel = token)
    }).then(res => {
      setBooks(prevBooks => {
        return [...new Set([
          ...prevBooks,
          ...res.data.docs.map(book => book.title)
        ])] // Return only unique values using Set
      })

      setHasMore(res.data.docs.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return

      setError(true)
    })

    return () => cancel()
  }, [query, pageNumber]) // Runs every time the query prop or pageNumber prop is mutated

  return { loading, error, books, hasMore }
}