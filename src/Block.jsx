import React, { useState, useEffect } from 'react';

// Define the Block component that takes chain, apiUrl, and blockTime as props
const Block = ({ chain, apiUrl, blockTime }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch block data
  const fetchBlockData = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (error) {
      setError('Failed to load data');
    }
  };

  // Effect to handle periodic data fetching
  useEffect(() => {
    fetchBlockData(); // Fetch data initially
    const interval = setInterval(fetchBlockData, blockTime);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [apiUrl, blockTime]);

  // Render the block with error handling
  return (
    <div className="block">
      <h2>{chain}</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>{data ? JSON.stringify(data["items"][0]["height"]) : "No data available"}</p>
        // <p>{data["items"][0]["height"]}</p>
      )}
    </div>
  );
};

export default Block;