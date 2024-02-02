import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Success from './Success'; // Import the Success component
import AbstractSubmissionForm from './Abstract';
import WorkshopRegistrationForm from './Workshop';
import SuccessPage from './Success2';
import Success3 from './Succes3';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} /> {/* Define the /success route */}
        <Route path="/abstract-submission" element={<AbstractSubmissionForm />} /> {/* Define the /success route */}
        <Route path="/workshop-registration" element={<WorkshopRegistrationForm />} /> {/* Define the /success route */}
        <Route path="/successfull" element={<SuccessPage />} /> {/* Define the /success route */}
        <Route path="/abstract-success" element={<Success3 />} /> {/* Define the /success route */}




      </Routes>
    </Router>
  );
}

export default App;
