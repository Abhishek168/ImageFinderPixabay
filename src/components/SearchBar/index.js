import axios from 'axios'
import { useState } from 'react'
import NoImage from '../../Assets/Image/no-image-icon.png'
import { saveAs } from 'file-saver'
require('./style.css')

const SearchBar = () => {
  const [storedData, setStoredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [modal, setModal] = useState(null)

  const downloadImage = (ImageData, id) => {
    saveAs(ImageData, `${id}_image.jpg`)
  }

  const searchTextHandler = (e) => {
    setSearchText(e.target.value)
  }
  const getResults = async () => {
    if (searchText.length) {
      const results = await axios(
        `${process.env.REACT_APP_API_URL}?key=${process.env.REACT_APP_API_KEY}&q=${searchText}&image_type=photo&per_page=15&safesearch=true`,
      )
      setStoredData(results.data.hits)
    } else {
      setSearchText('')
      setStoredData([])
    }
  }

  const openModal = (content) => {
    console.log("Hoo open")
    setModal(content)
  }

  return (
    <>
      <div className='container input-group mt-5 w-100'>
        <input
          className='form-control border-end-0 border rounded-pill'
          type='text'
          name='searchText'
          placeholder='search Image.  ex:Car'
          id='example-search-input'
          value={searchText}
          onChange={searchTextHandler}
        />
        <button onClick={getResults}>SEARCH</button>
      </div>
      <h2 className='m-5'>Responsive card deck example</h2>
      {modal && <div className="modal-backdrop opacity-50">
      </div>}
      <div
        className={`modal ${modal ? 'show ' : ''}`}
        id='exampleModalCenter'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalCenterTitle'
      >
        <div className='modal-dialog modal-dialog-centered' role='document'>
          <div className='modal-content backgroundChange'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalCenterTitle'>
                <img
                  src={modal?.largeImageURL}
                  alt="Pixabay Large"
                  height='552px'
                  width='830px'
                  onError={(e) => {
                    e.target.src = NoImage
                  }}
                />
              </h5>
            </div>
            <div className='modal-body'>{modal?.tags}</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
                onClick={() => setModal(null)}
              >
                Close
              </button>
              <button type='button'
                onClick={() => downloadImage(modal?.largeImageURL, modal?.id)}
                className='btn btn-primary'>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='m-5 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5'>
        {storedData &&
          storedData.map((content) => {
            return (
              <div key={content.id} className='col mb-4'>
                <div className='card'>
                  <img
                    height='150'
                    src={content.previewURL}
                    onError={(e) => {
                      e.target.src = NoImage
                    }}
                    onClick={() => openModal(content)}
                    className='content-img card-img-top'
                    alt='content from Pixabay.'
                  />
                  <div className='card-body '>
                    <h5 className='card-title text-truncate'>
                      {content.tags}
                    </h5>
                    <p className='card-text'>by {content.user}</p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default SearchBar
