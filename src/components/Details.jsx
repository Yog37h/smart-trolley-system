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
        className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <p className="text-red-400 text-sm sm:text-base md:text-lg mb-4">
          No entry data found. Please go back and try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-white text-blue-900 font-semibold py-2 px-4 sm:px-6 rounded-full hover:bg-gray-200 transition duration-300"
          style={{ textTransform: "uppercase" }}
        >
          GO BACK
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-blue-900 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* L-shaped lines for top-left corner - Hidden on mobile */}
      <div
        className="hidden sm:block absolute top-4 left-4 sm:top-8 sm:left-8 lg:top-16 lg:left-16 w-20 h-20 sm:w-40 sm:h-40 lg:w-80 lg:h-80"
        style={{
          borderTop: "4px solid white",
          borderLeft: "4px solid white",
        }}
      ></div>

      {/* L-shaped lines for bottom-right corner - Hidden on mobile */}
      <div
        className="hidden sm:block absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-16 lg:right-16 w-20 h-20 sm:w-40 sm:h-40 lg:w-80 lg:h-80"
        style={{
          borderBottom: "4px solid white",
          borderRight: "4px solid white",
        }}
      ></div>

      {/* Output Tracker Section */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-[100px] text-center">
          OUTPUT TRACKER
        </h2>

        {/* Date and Time Section */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between w-full sm:w-[500px] md:w-[600px] lg:w-[700px] mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <label className="text-lg sm:text-xl md:text-2xl font-semibold">
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
              className="w-32 sm:w-36 md:w-40 p-1 bg-white text-blue-900 rounded text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <label className="text-lg sm:text-xl md:text-2xl font-semibold">
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
              className="w-32 sm:w-36 md:w-40 p-1 bg-white text-blue-900 rounded text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Tracker Data Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 w-full sm:w-[400px] md:w-[500px] lg:w-[600px] mt-6 sm:mt-8 md:mt-10 lg:mt-[60px] text-center">
          {/* No of Bundles */}
          <div>
            <p className="text-lg sm:text-xl md:text-2xl mb-2">
              NO OF BUNDLES
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {entry.field1 || "0"}
            </p>
          </div>

          {/* Total Pieces */}
          <div>
            <p className="text-lg sm:text-xl md:text-2xl mb-2">
              TOTAL PIECES
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {entry.field2 || "0"}
            </p>
          </div>

          {/* Out Pieces */}
          <div>
            <p className="text-lg sm:text-xl md:text-2xl mb-2">OUT PIECES</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {entry.field3 || "0"}
            </p>
          </div>

          {/* In Pieces */}
          <div>
            <p className="text-lg sm:text-xl md:text-2xl mb-2">IN PIECES</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {entry.field5 || "0"}
            </p>
          </div>

          {/* Damage Pieces */}
          <div className="col-span-1 sm:col-span-2">
            <p className="text-lg sm:text-xl md:text-2xl mb-2">
              DAMAGE PIECES
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {entry.field4 || "0"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-center">
            {error}
          </p>
        )}

        {/* Save & Exit Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 sm:mt-8 mb-8 sm:mb-12 bg-white text-blue-900 font-semibold py-2 px-4 sm:px-6 rounded-full hover:bg-gray-200 transition duration-300"
          style={{ textTransform: "uppercase" }}
        >
          SAVE & EXIT
        </button>
      </div>
    </div>
  );
};

export default Details;