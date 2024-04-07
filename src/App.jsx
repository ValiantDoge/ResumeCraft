import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ResumeForm from './pages/ResumeForm.jsx';
import Error404 from './pages/Error404.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/resumeform/:tempId" element={<ResumeForm />} />
            <Route path='*' element={<Error404/>}></Route>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
