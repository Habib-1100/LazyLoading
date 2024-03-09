import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles.css'; // Import custom CSS file

const APIList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10); // Define the page size here
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://restcountries.com/v3.1/all?page=${page}&pageSize=${pageSize}`);
        setCountries(prevCountries => [...prevCountries, ...response.data]);
        setLoading(false);
        setHasMore(response.data.length >= pageSize); // Check if there are more items to load
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Error fetching countries. Please try again later.');
        setLoading(false);
      }
    };

    if (page === 1) {
      fetchData(); // Fetch initial data only on first render
    }
  }, [page, pageSize]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && hasMore && observer.current) {
      observer.current.observe(document.querySelector('.infinite-scroll'));
    }
  }, [loading, hasMore]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Countries</h2>
      <div className="row">
        {error ? (
          <p className="text-danger">{error}</p>
        ) : countries.map((country, index) => (
          <div key={index} className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title">{country.name.common}</h3>
                <p className="card-text">Capital: <span className="font-weight-bold">{country.capital}</span></p>
                <p className="card-text">Population: <span className="font-italic">{country.population}</span></p>
                <p className="card-text">Region: <span className="text-info">{country.region}</span></p>
                <p className="card-text">Subregion: <span className="text-success">{country.subregion}</span></p>
                {/* Add more details as needed */}
              </div>
            </div>
          </div>
        ))}
        {loading && <p className="text-center">Loading...</p>}
        {!loading && !hasMore && <p className="text-center">No more countries to load</p>}
        <div className="infinite-scroll" style={{ height: '10px' }}></div>
      </div>
    </div>
  );
};

export default APIList;
