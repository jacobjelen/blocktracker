import axios from "axios";

const fetchBlockNumber = async () => {
  const url = "https://eth.blockscout.com/api/eth-rpc";
  const requestData = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log(response.data);
    const blockNumber = parseInt(response.data.result, 16);
    return blockNumber; //should return block number int
  } catch (error) {
    console.error("There was a problem with the axios request:", error);
  }
};

const fetchBlockTransactions = async (blockNumber) => {
  const url = `https://eth.blockscout.com/api/v2/blocks/${blockNumber}/transactions`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
    });

    //   console.dir(response.data);
    return response.data; //should return transactions object
  } catch (error) {
    console.error("There was a problem with the axios request:", error.response.data);
  }
};

const fetchAllBlockTransactions = async (blockNumber) => {
  const baseURL = `https://eth.blockscout.com/api/v2/transactions?block_number=${blockNumber}`
  const items_count = 50; // Number of transactions per page, as per the API documentation
  let index = 0;
  let allTransactions = [];
  let hasMoreTransactions = true;

  try {
    // while (hasMoreTransactions) {
      // const url = `${baseURL}&index=${index}&items_count=${items_count}`;
      const url = `https://eth.blockscout.com/api/v2/transactions?block_number=20298243&index=0&items_count=50`;

      console.log(url);

      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
        },
      });

      console.log(response.data.next_page_params);
      console.log(response.data.items.length);

    //   const transactions = response.data.items;

    //   if (transactions.length === 0) {
    //     hasMoreTransactions = false;
    //   } else {
    //     allTransactions = allTransactions.concat(transactions);
    //     //   page += 1;
    //   }
    // }

    // console.log(allTransactions);
    // return allTransactions;
  } catch (error) {
    console.error("There was a problem with the axios request:", error.response.data);
  }
};

const main = async () => {
  const blockNumber = await fetchBlockNumber();
  const transactions = await fetchAllBlockTransactions(blockNumber);
  //   console.log(transactions["items"].length);
  //   console.log(transactions);
};

// Usage example
main();
