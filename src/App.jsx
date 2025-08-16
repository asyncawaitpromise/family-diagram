import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./routes/Home.jsx";
import Reference from "./routes/Reference.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<Reference />} />
        <Route path="*" element={<>Error!!!</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;