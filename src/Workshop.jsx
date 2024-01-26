import React, { useState } from 'react';
import logo from './1.png'
import Navbar from './Navbar';

const WorkshopRegistration = () => {
  const [selection, setSelection] = useState(null);
  const [conferenceNumber, setConferenceNumber] = useState('');
  const [isValidConferenceNumber, setIsValidConferenceNumber] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState({
    fullName: '',
    email: '',
    Conference: '',
    morningWorkshop: '',
    afternoonWorkshop: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const costPerWorkshop = 400;

  const handleFileChange = (event) => {
    setScreenshot(event.target.files[0]);
  };

  const validateConferenceNumber = () => {
    // Add your validation logic here
    const isValid = conferenceNumber.startsWith('NV24KSH') && conferenceNumber.length === 11 && /^\d+$/.test(conferenceNumber.substring(7));
    setIsValidConferenceNumber(isValid);
  };

  const handleConferenceSubmit = (e) => {
    e.preventDefault();
    validateConferenceNumber();
  };

  const redirectToRegistration = () => {
    window.location.href = '/'; // Adjust this URL as needed
  };
  const calculateTotalAmount = () => {
    const morningWorkshopCost = registrationDetails.morningWorkshop ? costPerWorkshop : 0;
    const afternoonWorkshopCost = registrationDetails.afternoonWorkshop ? costPerWorkshop : 0;
    return morningWorkshopCost + afternoonWorkshopCost;
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationDetails({ ...registrationDetails, [name]: value });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('registrationData', JSON.stringify(registrationDetails));
    formData.append('screenshot', screenshot);
  
    try {
      const response = await fetch('http://139.59.71.172:3000/submit-workshop', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        window.location.href = '/successfull';
        console.log('Registration and file upload successful');
        // Handle success (e.g., showing a success message)
      } else {
        console.error('Registration failed');
        // Handle failure (e.g., showing an error message)
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., showing an error message)
    }
  };
  const morningWorkshops = [
    "Theatre of Oppressed: Breaking Patterns, Creating Change",
    "Revitalizing Respiratory Medicine: An Outlook on Diagnosis and Emergencies",
    "Anybody Can Do Research (ABCDR)",
    "ABCs of Injuries and Fractures: A Novice's Guide to Orthopaedics",
    "Healing Realities: A Virtual Workshop (Basics)"
  ];

  const afternoonWorkshops = [
    "A Doctor's Guide to Smart Financing",
    "Legal Battles of Innovation: Navigating the Crossroads of Emerging Ideas",
    "The Dead Tell Tales: From Case Scene to Courtroom",
    "Healing Realities: A Virtual Workshop (Orthopaedics)",
    "Antimicrobial Resistance"
  ];
  
  const totalAmount = calculateTotalAmount();

  return (

    <div className="container mx-auto p-4 sm:p-8 max-w-2xl bg-white rounded-lg shadow-md">
        
      <h1 className="text-2xl font-semibold text-purple-600 mb-6 text-center">Workshop Registration</h1>

      {!selection && (
        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={() => setSelection('withConference')} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">With Conference</button>
          <button onClick={redirectToRegistration} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">Workshop Only</button>
        </div>
      )}

      {selection === 'withConference' && !isValidConferenceNumber && (
        <form onSubmit={handleConferenceSubmit} className="mb-6">
          <input
            type="text"
            value={conferenceNumber}
            onChange={(e) => setConferenceNumber(e.target.value)}
            placeholder="Enter Conference Number"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-purple-700 transition duration-300">Validate</button>
        </form>
      )}

      {isValidConferenceNumber && (
        <form onSubmit={handleRegistrationSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="fullName"
              value={registrationDetails.fullName}
              onChange={handleRegistrationChange}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={registrationDetails.email}
              onChange={handleRegistrationChange}
              placeholder="Email ID"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="Conference"
              value={registrationDetails.Conference}
              onChange={handleRegistrationChange}
              placeholder="Conference Registration Number"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
      <label className="block mb-2 font-bold">Morning Workshop:</label>
      <div className="flex flex-col space-y-2">
        {morningWorkshops.map((workshop, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name="morningWorkshop"
              value={workshop}
              checked={registrationDetails.morningWorkshop === workshop}
              onChange={handleRegistrationChange}
              className="form-radio text-purple-600 mr-2"
            />
            {workshop}
          </label>
        ))}
      </div>
    </div>
           <div className="mb-4">
      <label className="block mb-2 font-bold">Afternoon Workshop:</label>
      <div className="flex flex-col space-y-2">
        {afternoonWorkshops.map((workshop, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              name="afternoonWorkshop"
              value={workshop}
              checked={registrationDetails.afternoonWorkshop === workshop}
              onChange={handleRegistrationChange}
              className="form-radio text-purple-600 mr-2"
            />
            {workshop}
          </label>
        ))}
      </div>
      <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Total Amount</h2>
            <p className="text-gray-600">Total: Rs. {totalAmount}</p>
          </div>
            <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Bank Details</h2>
            <p className="text-gray-600 mb-1">Account Number: 02452200055610</p>
            <p className="text-gray-600 mb-1">IFSC Code: CNRB0010245</p>
            <p className="text-gray-600 mb-4">Bank Name: Canara Bank</p>
            <div className="text-center">
              <img src={logo} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Upload Payment Screenshot</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-md text-gray-500
           file:mr-4 file:py-2 file:px-4
           file:rounded-full file:border-0
           file:text-sm file:font-semibold
           file:bg-purple-50 file:text-purple-700
           hover:file:bg-purple-100 mb-5
         "/>
          </div>
          </div>
          
          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-purple-700 transition duration-300">Register for Workshop</button>
        </form>
      )}
    </div>
  );
};

export default WorkshopRegistration;
