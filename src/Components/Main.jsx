import React, { useState, useEffect } from 'react';
import './Main.css';
import heart1 from './heart1.svg';
import heart from './heart.svg';
import removable from './removable.png';
import Logo2 from './Logo2.png'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [defaultSearchTerm] = useState('Avengers');
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [showCreateList, setShowCreateList] = useState(false);
  const [moviesSaved, setMoviesSaved] = useState(false);
  const [listNames, setListNames] = useState([]);
  const [listName, setListName] = useState('');

  const fetchMovies = (query) => {
    const apiUrl = `http://www.omdbapi.com/?s=${query}&apikey=8482baa5`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => {
        if (result.Search) {
          Promise.all(
            result.Search.map((movie) => {
              return fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=8482baa5`)
                .then((response) => response.json())
                .then((detailedMovieInfo) => detailedMovieInfo);
            })
          ).then((moviesWithDetails) => {
            setMovies(moviesWithDetails);
          });
        } else {
          setMovies([]);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };

  const generateIMDbLink = (imdbID) => {
    return `https://www.imdb.com/title/${imdbID}/`;
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      fetchMovies(searchTerm);
    } else {
      fetchMovies(defaultSearchTerm);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    fetchMovies(defaultSearchTerm);
  }, [defaultSearchTerm]);

  const handleIconClick = () => {
    setShowCreateList(!showCreateList);
  };

  const handleMovieClick = (title, year) => {
    const isMovieSelected = selectedMovies.some((movie) => movie.title === title && movie.year === year);

    if (isMovieSelected) {
      setSelectedMovies(selectedMovies.filter((movie) => !(movie.title === title && movie.year === year)));
    } else {
      setSelectedMovies([...selectedMovies, { title, year }]);
    }
  };

  const handleRemoveMovie = (title, year) => {
    setSelectedMovies(selectedMovies.filter((movie) => !(movie.title === title && movie.year === year)));
  };

  const handleCloseTab = () => {
    setShowCreateList(false);
    setMoviesSaved(true);
    setListName('');
  };

  const handleSaveList = () => {
    if (listName.trim() === '' || selectedMovies.length === 0) {
      return;
    }

    const newList = {
      name: listName,
      movies: [...selectedMovies],
    };
    setListNames([...listNames, newList]);
    setSelectedMovies([]);
    setMoviesSaved(true);
    setListName('');
  };

  const handleGoToList = (list) => {
    console.log('Go to List:', list);
  };

  return (
    <div>
      <header>
        <nav className='nav1'>
          <img src={Logo2} alt="Logo" className='logo'/>
          <p className='p1'>Movies</p>
          <p className='p2'>Lists</p>
          <p className='p2'>About</p>
          <p className='p2' onClick={handleIconClick}>More</p>
        </nav>
        <nav className='nav2'>
          <span className='slogan'>Everything you want to watch is just a click away.</span>
          <label className='search-label'>Search film or movie:</label>
          <input type="text" placeholder='Search' value={searchTerm} onChange={handleInputChange} className='search'/>
          <button onClick={handleSearch}>Search</button>
        </nav>
      </header>
      <div className='movies'>
        {movies.length === 0 ? (
          <p className="not-found">Not found!</p>
        ) : (
          movies.map((movie, index) => (
            <div key={index} className='movie-item'>

              <img src={movie.Poster !== "N/A" ? movie.Poster : removable} alt={movie.Title} className='movies-poster'/>
              <a href={generateIMDbLink(movie.imdbID)} className='details'>
                <h3 className='title'>{movie.Title}</h3>
              </a>

              {/* <p className='year'> <i>({movie.Year})</i></p> */}
              {selectedMovies.some((selectedMovie) => selectedMovie.title === movie.Title && selectedMovie.year === movie.Year) ? (
                
                <img
                  src={heart1}
                  alt='Liked'
                  className='like-icon'
                  onClick={() => handleMovieClick(movie.Title, movie.Year)}
                />
              ) : (
                <img
                  src={heart}
                  alt='Like'
                  className='dislike-icon'
                  onClick={() => handleMovieClick(movie.Title, movie.Year)}
                />
              )}
            </div>
          ))
        )}
      </div>
      {showCreateList && (
        <div className='create-list'>
          <p className='close-tab' onClick={handleCloseTab}>✖</p>
          <section className='form'>
            <h3 className='list'>Create New List</h3><br/>
            <input placeholder='New list' className='list-name' value={listName} onChange={(e) => setListName(e.target.value)} />
            <br/><br/>
            <ul className='like-list'>
              {selectedMovies.map((selectedMovie, index) => (
                <li key={index}>
                  {selectedMovie.title} - {selectedMovie.year}
                  <span className='delete-film' onClick={() => handleRemoveMovie(selectedMovie.title, selectedMovie.year)}><b>x</b></span>
                </li>
              ))}
            </ul>
            <br/>
            <div>
              <button className='save' onClick={handleSaveList} disabled={!listName.trim() || selectedMovies.length === 0}>Save</button>
              {moviesSaved && (
                <div>
                  {listNames.map((list, index) => (
                    <button key={index} className='go-to-list' onClick={() => handleGoToList(list)}>Go to List:{list.name}</button>
                    
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Header;



