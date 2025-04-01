import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feeds, setFeeds] = useState([]); // Store ThingSpeak feeds
  const navigate = useNavigate();

  // Function to fetch ThingSpeak data
  const fetchThingSpeakData = async () => {
    try {
      const response = await axios.get(
        "https://api.thingspeak.com/channels/2827873/feeds.json?api_key=8OZZD00KZ0E6QLOK"
      );
      setFeeds(response.data.feeds);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    }
  };

  // Fetch data initially and set up polling
  useEffect(() => {
    fetchThingSpeakData(); // Initial fetch

    const interval = setInterval(fetchThingSpeakData, 10000); // Fetch every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleProceed = () => {
    if (!orderNo) {
      setError("Please enter an order number.");
      return;
    }

    setLoading(true);
    setError(null);

    // Find the entry matching the entered entry_id
    const matchingEntry = feeds.find(
      (feed) => feed.entry_id === parseInt(orderNo)
    );

    if (!matchingEntry) {
      setError("No entry found for the provided order number.");
      setLoading(false);
      return;
    }

    // Navigate to the Details screen with the matching entry data
    navigate(`/details/${orderNo}`, { state: { entry: matchingEntry } });
    setLoading(false);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* L-shaped lines for top-left corner */}
      <div
        className="absolute top-4 left-4 sm:top-8 sm:left-8 lg:top-16 lg:left-16 w-20 h-20 sm:w-40 sm:h-40 lg:w-80 lg:h-80"
        style={{
          borderTop: "4px solid white",
          borderLeft: "4px solid white",
        }}
      ></div>

      {/* L-shaped lines for bottom-right corner */}
      <div
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-16 lg:right-16 w-20 h-20 sm:w-40 sm:h-40 lg:w-80 lg:h-80"
        style={{
          borderBottom: "4px solid white",
          borderRight: "4px solid white",
        }}
      ></div>

      {/* Content Container */}
      <div className="flex flex-col items-center w-full max-w-3xl">
        {/* Welcome Text */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-center">
          WELCOME TO
        </h3>
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-[60px] text-center">
          SMART TROLLEY SYSTEM
        </h2>
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">
          RAJSUJEE INTERNATIONALS
        </h1>

        {/* Order Number Input */}
        <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 w-full sm:w-auto">
          <label className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-0 sm:mr-4">
            ORDER NO:
          </label>
          <input
            type="text"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Enter the order no"
            className="w-full sm:w-48 md:w-64 h-10 px-3 text-black rounded-md focus:outline-none bg-gray-300 placeholder-gray-600"
            style={{ border: "none" }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 mb-4 text-sm sm:text-base md:text-lg text-center">
            {error}
          </p>
        )}

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={loading}
          className="bg-white text-blue-900 font-semibold py-2 px-4 sm:px-6 rounded-full hover:bg-gray-200 transition duration-300 disabled:opacity-50"
          style={{ textTransform: "uppercase" }}
        >
          {loading ? "LOADING..." : "PROCEED"}
        </button>
      </div>
    </div>
  );
};

export default Home;