import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from "./routes/Homepage.jsx";
import DiagramView from "./routes/DiagramView.jsx";
import Reference from "./routes/Reference.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/diagram/:diagramId" element={<DiagramView />} />
        <Route path="/help" element={<Reference />} />
        <Route path="*" element={<>Error!!!</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;