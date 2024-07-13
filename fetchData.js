// Queue to store the last 100 blocks
let blockQueue = [];
let transactions = [];

// Function to get the latest block
async function getLatestBlock() {
  const provider = new ethers.JsonRpcProvider(
    `https://eth.blockscout.com/api/eth-rpc`
  );
  try {
    const block = await provider.send("eth_getBlockByNumber", ["latest", true]);
    return block;
  } catch (error) {
    console.error("Error fetching the latest block:", error);
    return null;
  }
}

// Function to calculate gas usage percentage
function calculateGasUsagePercentage(gasLimit, gasUsed) {
  if (gasLimit === BigInt(0)) {
    throw new Error("Gas limit cannot be zero");
  }
  const percentage = (gasUsed * BigInt(100)) / gasLimit;
  return Number(percentage);
}

// Function to format BigInt values using ethers.js utilities
function formatBigIntValue(value, unit) {
  return ethers.formatUnits(value.toString(), unit);
}

// Function to extract values from the block and add them to the array
function extractValues(block) {
  if (!block.transactions || block.transactions.length === 0) {
    console.log("No transactions in the latest block.");
    return;
  }

  let totalGasPrice = BigInt(0);
  let minGasPrice = BigInt(block.transactions[0].gasPrice || 0);
  let maxGasPrice = BigInt(block.transactions[0].gasPrice || 0);

  let totalNonce = 0;
  let minNonce = block.transactions[0].nonce || 0;
  let maxNonce = block.transactions[0].nonce || 0;

  let totalValue = BigInt(0);
  let maxValue = BigInt(block.transactions[0].value || 0);

  block.transactions.forEach((tx) => {
    if (!tx) return;

    const gasPrice = BigInt(tx.gasPrice || 0);
    const nonce = tx.nonce || 0;
    const value = BigInt(tx.value || 0);

    // Gas price stats
    totalGasPrice += gasPrice;
    if (gasPrice < minGasPrice) minGasPrice = gasPrice;
    if (gasPrice > maxGasPrice) maxGasPrice = gasPrice;

    // Nonce stats
    totalNonce += nonce;
    if (nonce < minNonce) minNonce = nonce;
    if (nonce > maxNonce) maxNonce = nonce;

    // Value stats
    totalValue += value;
    if (value > maxValue) maxValue = value;
  });

  const averageGasPrice = totalGasPrice / BigInt(block.transactions.length);
  const averageNonce = totalNonce / block.transactions.length;
  const averageValue = totalValue / BigInt(block.transactions.length);

  const gasUsed = BigInt(block.gasUsed);
  const gasLimit = BigInt(block.gasLimit);
  const gasUsagePercentage = calculateGasUsagePercentage(gasLimit, gasUsed);

  const extractedData = {
    "block-number": parseInt(block.number, 16),
    "block-timestamp": new Date(
      parseInt(block.timestamp, 16) * 1000
    ).toLocaleString(),
    "transaction-count": block.transactions.length,
    "gas-usage-percentage": gasUsagePercentage.toFixed(2) + "%",
    "average-gas-price": formatBigIntValue(averageGasPrice, "gwei"),
    "min-gas-price": formatBigIntValue(minGasPrice, "gwei"),
    "max-gas-price": formatBigIntValue(maxGasPrice, "gwei"),
    "average-nonce": averageNonce,
    "max-nonce": parseInt(maxNonce, 16),
    "average-tx-value": formatBigIntValue(averageValue, "ether"),
    "max-tx-value": formatBigIntValue(maxValue, "ether"),
    "total-tx-value": formatBigIntValue(totalValue, "ether"),
  };

  // Add to the queue
  blockQueue.push(extractedData);
  if (blockQueue.length > 100) {
    blockQueue.shift(); // Remove the oldest block
  }
}

// Function to update the display with the latest block data
function updateDisplay(array) {
  const latestBlock = array[array.length - 1];
  const blockInfoDiv = document.getElementById("block-info");
  blockInfoDiv.innerHTML = ""; // Clear previous content

  for (const [key, value] of Object.entries(latestBlock)) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${key.replace(/-/g, " ")}:</strong> ${value}`;
    blockInfoDiv.appendChild(p);
  }
}

function updateTxList(transactions) {
  const txListDiv = document.getElementById("tx-list");
  txListDiv.innerHTML = ""; // Clear previous content

  for (const tx of transactions) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>Value:</strong> ${formatBigIntValue(
      tx.value,
      "ether"
    )}`;
    txListDiv.appendChild(p);
  }
}

async function main() {
  const block = await getLatestBlock();
  if (block) {
    // Process block data
    extractValues(block);
    updateDisplay(blockQueue);
    updateTxList(block.transactions);

    // Convert and map transactions to new format
    const processedData = block.transactions.map((transaction) => {
      return {
        value: parseFloat(formatBigIntValue(transaction.value))
      };
    });

    // Log the processed data to verify
    console.log('Processed Data:', processedData);

    // Define the dimensions of the SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    document.getElementById("chart").innerHTML = "";
    const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Example scales (adjust as needed for your data)
    const x = d3.scaleBand()
      .domain(processedData.map((d, i) => i))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value)]) // Use value for the y-axis
      .nice()
      .range([height, 0]);

    // Append axes (optional)
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // Plot data (example: bar chart)
    svg.selectAll(".bar")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.value)) // Use value for the bar height
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value)); // Use value for the bar height
  }
}

// Run the main function every 12 seconds
setInterval(main, 12000);

// Initial fetch
main();