import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Details from "./components/Details";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:entryId" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;