import { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)

  const observer = useRef()

  const lastBookElementRef = useCallback(node => {
    if (loading) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })

    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const searchTitle = event => {
    setQuery(event.target.value)
    setPageNumber(1)
  }

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <h4>React Infinite Scroll</h4>
        </div>

        <div className="card-body">
          <label htmlFor="keyword">Enter keyword</label>
          <input type="text" className="form-control" id="keyword" name="keyword" onChange={searchTitle} value={query} />

          <div className="books-container">
            <h4>Results</h4>
            
            {books.length > 0 && (
              <div>
                {books.map((book, index) => {
                  // eslint-disable-next-line no-lone-blocks
                  {/* Get reference to the very last book */}
                  if (books.length === index + 1) {
                    return <div ref={lastBookElementRef} key={book}>{book}</div>
                  } else {
                    return <div key={book}>{book}</div>
                  }
                })}

                {loading && (
                  <div className="loader text-muted">
                    <i className="fa fa-spinner fa-spin" />
                    <span>Loading...</span>
                  </div>
                )}

                {error && (
                  <div>Something went wrong.</div>
                )}
              </div>
            )}

            {books.length === 0 && <div>No results found</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App