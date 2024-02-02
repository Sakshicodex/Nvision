
  
  import React, { useState } from 'react';

const AbstractSubmissionForm = () => {
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    registrationNumber: '',
    email: '',
  });
  const [isValidRegistration, setIsValidRegistration] = useState(false);
  const [abstractDetails, setAbstractDetails] = useState({
    title: '',
    authors: '',
    guide: '',
    abstractText: '',
  });
  const [abstractType, setAbstractType] = useState('');
  const [subTheme, setSubTheme] = useState('');

  const [submissionTypes, setSubmissionTypes] = useState({
    Paper: false,
    Poster: false,
    Concept: false,
  });
  
  const validateAbstractLength = (text) => {
    // Remove commas and extra spaces, then split by spaces to get words
    const words = text.replace(/,+/g, '').replace(/\s+/g, ' ').trim().split(' ');
    // Count the number of words
    return words.filter(Boolean).length; // filter(Boolean) removes any empty strings that may result from multiple spaces
  };
  
  const handleAbstractChange = (e) => {
    const newText = e.target.value;
    const wordCount = validateAbstractLength(newText);
  
    if (wordCount <= 400) {
      setAbstractDetails({ ...abstractDetails, abstractText: newText });
    } else {
      // If the word count is over 400, you may want to notify the user
      alert('Your abstract exceeds the 400-word limit. Please shorten it.');
      // Optionally, you could also trim the text to the first 400 words:
      // const trimmedText = newText.split(' ').slice(0, 400).join(' ');
      // setAbstractDetails({ ...abstractDetails, abstractText: trimmedText });
    }
  };

  const handleRegistrationNumberChange = async (e) => {
    const { value } = e.target;
    setPersonalDetails({ ...personalDetails, registrationNumber: value });
  
    const isValid = value.startsWith('NV24KSH') && value.length === 11 && /^\d+$/.test(value.substring(7));
    setIsValidRegistration(isValid);
  
    if (isValid) {
      try {
        const response = await fetch('https://octopus-app-9nth2.ondigitalocean.app/check-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ registrationNumber: value }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Response Data:', responseData); // Log the response data to check its structure
  
        // Use optional chaining to safely access the properties
        const updatedSubmissionTypes = {
          Paper: responseData.submissionTypes?.Paper || false,
          Poster: responseData.submissionTypes?.Poster || false,
          Concept: responseData.submissionTypes?.Concept || false,
        };
        setSubmissionTypes(updatedSubmissionTypes);
      } catch (error) {
        console.error('Error when checking submission:', error);
        setSubmissionTypes({ Paper: false, Poster: false, Concept: false });
      }
    } else {
      // If the registration number is not valid, reset submission types
      setSubmissionTypes({ Paper: false, Poster: false, Concept: false });
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Format the data as an array of arrays
    const formattedData = [
      [
        personalDetails.fullName,
        personalDetails.registrationNumber,
        personalDetails.email,
        abstractType,
        subTheme,
        abstractDetails.title,
        abstractDetails.authors,
        abstractDetails.guide,
        abstractDetails.abstractText
      ]
    ];
    console.log('Sending data:', formattedData);
  
    try {
      const response = await fetch('https://octopus-app-9nth2.ondigitalocean.app/submit-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formattedData }) // Send formattedData directly
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        
      }
      window.location.href = '/abstract-success';

  
      // TODO: Update UI to reflect successful submission
      console.log('Submission successful');
      alert('Submission successful'); // User feedback
    } catch (error) {
      // TODO: Update UI to show error message
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.'); // User feedback
    }
  };
  


  // ...

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Abstract Submission</h1>
      <div className="mb-4 p-4 border-l-4 border-purple-600 bg-purple-100">
        <p className="text-sm text-purple-700">
          Kindly note: One delegate is permitted a maximum number of one submission in each presentation category.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Full Name (to be printed on certificate)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={personalDetails.fullName}
            onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Conference Registration no.
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={personalDetails.registrationNumber}
            onChange={handleRegistrationNumberChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Email ID
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={personalDetails.email}
            onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
            required
          />
        </div>

        {isValidRegistration && (
  <>
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700">
        Abstract Submission
      </label>
      <div className="flex gap-4">
        <label>
        <input type="radio" name="abstractType" value="Paper" onChange={(e) => setAbstractType(e.target.value)} disabled={submissionTypes.Paper} 

 />
          Paper Abstract Submission
        </label>
        <label>
        <input type="radio" name="abstractType" value="Poster" onChange={(e) => setAbstractType(e.target.value)} disabled={submissionTypes.Poster} 
 />
          Poster Abstract Submission
        </label>
        <label>
        <input type="radio" name="abstractType" value="Concept" onChange={(e) => setAbstractType(e.target.value)} disabled={submissionTypes.Concept} />
          Concept Paper Abstract Submission
        </label>
      </div>
    </div>
    {/* Further form elements based on abstractType will go here */}



  <div>
    <label className="block mb-2 text-sm font-bold text-gray-700">
      Select the sub-theme (select any 1)
    </label>
    <select 
      className="w-full p-2 border rounded"
      value={subTheme} 
      onChange={(e) => setSubTheme(e.target.value)}
    >
      <option value="">--Select Sub-theme--</option>
  <option value="Cancer Research">Cancer Research</option>
  <option value="Nutrition and Lifestyle Diseases">Nutrition and Lifestyle Diseases</option>
  <option value="Implementation Sciences">Implementation Sciences</option>
  <option value="Oral Health and Advancements">Oral Health and Advancements</option>
  <option value="Sports Medicine">Sports Medicine</option>
  <option value="Pre-habilitation and Rehabilitation Studies">Pre-habilitation and Rehabilitation Studies</option>
  <option value="Infectious Diseases">Infectious Diseases</option>
  <option value="Polytrauma Surgeries">Polytrauma Surgeries</option>
  <option value="Mental Health">Mental Health</option>
  <option value="Sustainable Healthcare">Sustainable Healthcare</option>
  <option value="Social Markers in Maternal Health">Social Markers in Maternal Health</option>
  <option value="Robotics and AI">Robotics and AI</option>
      {/* ... other sub-theme options ... */}
    </select>
  </div>


  <div>
    <h2 className="text-2xl font-bold mb-4">Abstract Details</h2>
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700">
        Title
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={abstractDetails.title}
        onChange={(e) => setAbstractDetails({ ...abstractDetails, title: e.target.value })}
        required
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700">
        Authors &amp; Co-Authors
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={abstractDetails.authors}
        onChange={(e) => setAbstractDetails({ ...abstractDetails, authors: e.target.value })}
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700">
        Guide
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={abstractDetails.guide}
        onChange={(e) => setAbstractDetails({ ...abstractDetails, guide: e.target.value })}
      />
    </div>
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-700">
        Abstract (400 words limit)
      </label>
      <textarea
  className="w-full p-2 border rounded"
  value={abstractDetails.abstractText}
  onChange={handleAbstractChange}
  rows="6"
  placeholder="Enter your abstract here (max 400 words)"
></textarea>
    </div>
  </div>
  </>
)}

<button
  type="submit"
  className="px-6 py-2 mt-4 text-white bg-purple-600 rounded hover:bg-purple-700"
>
  Submit Abstract
</button>



      </form>
    </div>
  );
};

export default AbstractSubmissionForm;
