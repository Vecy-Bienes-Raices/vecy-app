import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Introduction from './pages/Introduction';
import { Problem, Solution, Tools, Templates } from './pages/Placeholders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Introduction />} />
          <Route path="problem" element={<Problem />} />
          <Route path="solution" element={<Solution />} />
          <Route path="tools" element={<Tools />} />
          <Route path="templates" element={<Templates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;