// Default token address (you can change this to your preferred default)
const DEFAULT_TOKEN_ADDRESS = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set default values
    document.getElementById('tokenAddress').value = DEFAULT_TOKEN_ADDRESS;
    document.getElementById('rpcUrl').value = "https://clean-frosty-sunset.solana-mainnet.quiknode.pro/bd89be36d2411a1939eced1e8d6598c7a7bd1b13";
    // Load the initial chart
    loadChart();
});

function loadChart() {
    const tokenAddress = document.getElementById('tokenAddress').value;
    
    if (!tokenAddress) {
        alert('Please enter a token address');
        return;
    }

    // Clear the container
    const container = document.getElementById('price-chart-widget-container');
    container.innerHTML = '';

    // Create and load the widget
    (function () {
        function loadWidget() {
            if (typeof window.createMyWidget === "function") {
                window.createMyWidget("price-chart-widget-container", {
                    width: "100%",
                    height: "620px",
                    chainId: "solana",
                    tokenAddress: tokenAddress,
                    defaultInterval: "1D",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Etc/UTC",
                    theme: "moralis",
                    locale: "en",
                    backgroundColor: "#071321",
                    gridColor: "#0d2035",
                    textColor: "#68738D",
                    candleUpColor: "#4CE666",
                    candleDownColor: "#E64C4C",
                    hideLeftToolbar: false,
                    hideTopToolbar: false,
                    hideBottomToolbar: false,
                });
            } else {
                console.error("createMyWidget function is not defined.");
            }
        }

        if (!document.getElementById("moralis-chart-widget")) {
            var script = document.createElement("script");
            script.id = "moralis-chart-widget";
            script.src = "https://moralis.com/static/embed/chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.onload = loadWidget;
            document.body.appendChild(script);
        } else {
            loadWidget();
        }
    })();
}

// Function to update the chart when the button is clicked
function updateChart() {
    loadChart();
} 