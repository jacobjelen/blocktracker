import React from 'react';
import Block from './Block';
import DataFetcher from './DataFetcher';

import './App.css';

// List of chains with their properties
const chains = [
  // {
  //   name: "ethereum",
  //   apiUrl: "https://eth.blockscout.com/api/v2/blocks?type=block",
  //   blockTime: 12000,
  // },
  {
    name: "optimism",
    apiUrl: `https://optimism.blockscout.com/api/v2/blocks?type=block&apikey=${import.meta.env.VITE_BLOCKSCOUT_API_KEY}`,
    blockTime: 2000,
  },
  // {
  //   name: "arbitrum",
  //   apiUrl: "https://arbitrum.blockscout.com/api/v2/blocks?type=block",
  //   blockTime: 250,
  // },
];

const App = () => {
  return (
    <div>
      <p>Blocks</p>
      {/* {chains.map((chain) => (
        <Block
          key={chain.name}
          chain={chain.name}
          apiUrl={chain.apiUrl}
          blockTime={chain.blockTime}
        />
      ))} */}
      <p>Transactions</p>
      <DataFetcher apiUrl={`https://eth.blockscout.com/api/v2/transactions?filter=pending%20%7C%20validated&type=token_transfer%2Ccontract_creation%2Ccontract_call%2Ccoin_transfer%2Ctoken_creation&method=approve%2Ctransfer%2Cmulticall%2Cmint%2Ccommit&apikey=${import.meta.env.VITE_BLOCKSCOUT_API_KEY}`}/>

    </div>
  );
};

export default App;