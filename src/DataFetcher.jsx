import React, { useState, useEffect } from 'react';

// Define the DataFetcher component that takes apiUrl as a prop
const DataFetcher = ({ apiUrl }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (error) {
      setError('Failed to load data');
    }
  };

  // Effect to fetch data when the component mounts or apiUrl changes
  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  // Render the data or error message
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <pre>{data ? JSON.stringify(data, null, 2) : 'No data available'}</pre>
      )}
    </div>
  );
};

export default DataFetcher;