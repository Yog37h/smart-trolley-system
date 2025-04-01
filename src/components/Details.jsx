import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { entry: initialEntry } = location.state || {};
  const [entry, setEntry] = useState(initialEntry);
  const [error, setError] = useState(null);

  // Function to fetch ThingSpeak data
  const fetchThingSpeakData = async () => {
    try {
      const response = await axios.get(
        "https://api.thingspeak.com/channels/2827873/feeds.json?api_key=8OZZD00KZ0E6QLOK"
      );
      const feeds = response.data.feeds;

      // Find the entry matching the current entry_id
      const updatedEntry = feeds.find(
        (feed) => feed.entry_id === parseInt(entry?.entry_id)
      );

      if (updatedEntry) {
        setEntry(updatedEntry); // Update the entry if it has changed
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch updated data.");
      console.error(err);
    }
  };

  // Fetch data periodically
  useEffect(() => {
    if (!entry) return; // Don't fetch if there's no entry

    fetchThingSpeakData(); // Initial fetch

    const interval = setInterval(fetchThingSpeakData, 10000); // Fetch every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [entry]);

  // If no entry data is passed, show an error message
  if (!entry) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <p className="text-red-400 text-xs sm:text-sm md:text-base mb-2 sm:mb-4">
          No entry data found. Please go back and try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-white text-blue-900 font-semibold py-1 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-gray-200 transition duration-300"
          style={{ textTransform: "uppercase" }}
        >
          GO BACK
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* L-shaped lines for top-left corner - Hidden on mobile */}
      <div
        className="hidden sm:block absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-8 lg:left-8 w-16 h-16 sm:w-32 sm:h-32 lg:w-64 lg:h-64"
        style={{
          borderTop: "4px solid white",
          borderLeft: "4px solid white",
        }}
      ></div>

      {/* L-shaped lines for bottom-right corner - Hidden on mobile */}
      <div
        className="hidden sm:block absolute bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-8 lg:bottom-8 w-16 h-16 sm:w-32 sm:h-32 lg:w-64 lg:h-64"
        style={{
          borderBottom: "4px solid white",
          borderRight: "4px solid white",
        }}
      ></div>

      {/* Output Tracker Section */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 md:mb-6 lg:mb-8 text-center">
          OUTPUT TRACKER
        </h2>

        {/* Date and Time Section */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between w-full sm:w-[400px] md:w-[500px] lg:w-[600px] mb-2 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              DATE :
            </label>
            <input
              type="text"
              value={
                entry.created_at
                  ? new Date(entry.created_at).toLocaleDateString()
                  : ""
              }
              readOnly
              className="w-24 sm:w-28 md:w-32 p-1 bg-white text-blue-900 rounded text-xs sm:text-sm"
            />
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <label className="text-sm sm:text-base md:text-lg font-semibold">
              TIME :
            </label>
            <input
              type="text"
              value={
                entry.created_at
                  ? new Date(entry.created_at).toLocaleTimeString()
                  : ""
              }
              readOnly
              className="w-24 sm:w-28 md:w-32 p-1 bg-white text-blue-900 rounded text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Tracker Data Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full sm:w-[350px] md:w-[450px] lg:w-[550px] mt-2 sm:mt-4 md:mt-6 lg:mt-8 text-center">
          {/* No of Bundles */}
          <div>
            <p className="text-sm sm:text-base md:text-lg mb-1">
              NO OF BUNDLES
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold">
              {entry.field1 || "0"}
            </p>
          </div>

          {/* Total Pieces */}
          <div>
            <p className="text-sm sm:text-base md:text-lg mb-1">
              TOTAL PIECES
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold">
              {entry.field2 || "0"}
            </p>
          </div>

          {/* Out Pieces */}
          <div>
            <p className="text-sm sm:text-base md:text-lg mb-1">OUT PIECES</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold">
              {entry.field3 || "0"}
            </p>
          </div>

          {/* In Pieces */}
          <div>
            <p className="text-sm sm:text-base md:text-lg mb-1">IN PIECES</p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold">
              {entry.field5 || "0"}
            </p>
          </div>

          {/* Damage Pieces */}
          <div className="col-span-1 sm:col-span-2">
            <p className="text-sm sm:text-base md:text-lg mb-1">
              DAMAGE PIECES
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold">
              {entry.field4 || "0"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-center">
            {error}
          </p>
        )}

        {/* Save & Exit Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-2 sm:mt-4 mb-4 sm:mb-6 bg-white text-blue-900 font-semibold py-1 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-gray-200 transition duration-300"
          style={{ textTransform: "uppercase" }}
        >
          SAVE & EXIT
        </button>
      </div>
    </div>
  );
};

export default Details;