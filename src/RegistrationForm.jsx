import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from './1.png'
import { useNavigate } from 'react-router-dom';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    prefix: '',
    fullName: '',
    gender: '',
    mobile: '',
    email: '',
    kmcNumber: '',
    institution: '',
    city: '',
    state: '',
    category: '',
    registrationCategory: '',
    workshopMorning: [],
    workshopAfternoon: [],
    totalAmount: 0,
  });

  const workshops = {
    morning: [
      "Theatre of Oppressed: Breaking Patterns, Creating Change",
      "Revitalizing Respiratory Medicine: An Outlook on Diagnosis and Emergencies",
      "Anybody Can Do Research (ABCDR)",
      "ABCs of Injuries and Fractures: A Novice's Guide to Orthopaedics",
      "Healing Realities: A Virtual Workshop (Basics)"
    ],
    afternoon: [
      "A Doctor's Guide to Smart Financing",
      "Legal Battles of Innovation: Navigating the Crossroads of Emerging Ideas",
      "The Dead Tell Tales: From Case Scene to Courtroom",
      "Healing Realities: A Virtual Workshop (Orthopaedics)",
      "Antimicrobial Resistance"
    ]
  };
  
  const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
    "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const [selectedMorningWorkshop, setSelectedMorningWorkshop] = useState("");
  const [selectedAfternoonWorkshop, setSelectedAfternoonWorkshop] = useState("");
  const handleMorningCheckboxChange = (event) => {
    const { value } = event.target;
    // If the checkbox being clicked is already selected, unselect it, otherwise select the new one
    setSelectedMorningWorkshop(selectedMorningWorkshop === value ? "" : value);
  };

  const handleAfternoonCheckboxChange = (event) => {
    const { value } = event.target;
    // If the checkbox being clicked is already selected, unselect it, otherwise select the new one
    setSelectedAfternoonWorkshop(selectedAfternoonWorkshop === value ? "" : value);
  };


  const updateTotalAmount = () => {
    let total = 0;
    const conferencePrices = {
      'UG and Interns': 1500,
      'PG and PhD': 2000,
      'Faculty, Consultant and Others': 2000
    };

    // Update the base price based on the selected category
    const basePrice = conferencePrices[formData.category] || 0;

    // Define workshop prices
    const workshopPrice = formData.registrationCategory === 'Conference + Workshop' ? 400 : 1000;

    // Add the base price if "Conference only" is selected
    if (formData.registrationCategory === 'Conference only') {
      total += basePrice;
    }

    // Add workshop prices if "Workshop only" or "Conference + Workshop" is selected
    if (formData.registrationCategory === 'Workshop only' || formData.registrationCategory === 'Conference + Workshop') {
      let workshopCount = 0;

      // If a morning workshop is selected, add to the workshop count
      if (selectedMorningWorkshop) {
        workshopCount += 1;
      }

      // If an afternoon workshop is selected, add to the workshop count
      if (selectedAfternoonWorkshop) {
        workshopCount += 1;
      }

      // Calculate the total based on the number of workshops and add base price if "Conference + Workshop" is selected
      total += workshopPrice * workshopCount;
      if (formData.registrationCategory === 'Conference + Workshop') {
        total += basePrice;
      }
    }

    // Update the formData state with the new total amount
    setFormData({ ...formData, totalAmount: total });
  };
  const [screenshot, setScreenshot] = useState(null);




  useEffect(() => {
    updateTotalAmount();
  }, [
    formData.category,
    formData.registrationCategory,
    selectedMorningWorkshop,
    selectedAfternoonWorkshop
  ]);


  const handleFileChange = (event) => {
    setScreenshot(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked, value } = event.target;

    // If the checkbox is being checked (not unchecked), update the state
    if (checked) {
      setFormData(prevFormData => {
        // Map through the keys of prevFormData
        const newFormData = Object.keys(prevFormData).reduce((data, key) => {
          // If the key is 'workshopMorning' or 'workshopAfternoon',
          // and it's the same as the name of the checkbox being changed,
          // set its value to an array with the newly checked value.
          // Otherwise, keep its original value (which clears any other checked boxes).
          if ((key === 'workshopMorning' || key === 'workshopAfternoon') && key === name) {
            data[key] = [value];
          } else {
            data[key] = prevFormData[key];
          }
          return data;
        }, {});

        return newFormData;
      });
    } else {
      // If the checkbox is being unchecked, remove its value from the respective array
      setFormData(prevFormData => {
        const workshopArray = prevFormData[name].filter(item => item !== value);
        return { ...prevFormData, [name]: workshopArray };
      });
    }
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const screenshotFilename = `screenshot_${formData.fullName}_${Date.now()}.png`;
    const formDataToSend = new FormData();
    formDataToSend.append("registrationData", JSON.stringify({ ...formData, screenshotFilename }));
    if (screenshot) {
      formDataToSend.append("screenshot", screenshot, screenshotFilename);
    }

    try {
      const response = await fetch('http://localhost:3000/submit-registration', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        // If response is successful
        navigate('/success');
      } else {
        // Handle server-side validation errors or other non-2xx responses
        console.error('Submission error:', await response.text());
      }
    } catch (error) {
      // Handle network errors or issues with the fetch request
      console.error('Network error:', error);
    }
    setIsLoading(false); // Stop loading after submission is complete or fails

  };





  return (
    <motion.div  id="registration-form-section"
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 z-20"
    >
      <div
        className="bg-white py-8 px-4 shadow-lg rounded-lg max-w-lg w-full mx-auto"
        style={{
          maxWidth: '600px',
          margin: 'auto',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          transform: 'rotateY(20deg)', // Rotate the div for a 3D effect
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Register for NVision-24</h1>
          <p className="text-md text-gray-500">Fill in the details below to participate</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mt-6">
          <div className="flex w-full justify-between mb-4">

            {/* Form fields */}
            {/* Prefix */}
            <select name="prefix" onChange={handleInputChange} className="mb-4 p-3 rounded-lg border border-gray-300 w-80" >
              <option value="">Select Prefix</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
            {/* Full Name */}
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} className="mb-4 p-3 rounded-lg border border-gray-300 w-80" required />
          </div>
          {/* Gender */}
          <select name="gender" onChange={handleInputChange} className="mb-4 p-3 rounded-lg border border-gray-300 w-80" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          {/* Other fields */}
          {/* Mobile Number */}
          <input
            type="tel"
            name="mobile"
            placeholder="Mob. No. (WhatsApp)"
            onChange={handleInputChange}
            className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
            required
          />

          {/* Email ID */}
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            onChange={handleInputChange}
            className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
            required
          />

          {/* KMC Number */}
          <input
            type="text"
            name="kmcNumber"
            placeholder="KMC Number (if not there please write NA)"
            onChange={handleInputChange}
            className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
            required
          />

          {/* Name of the Institution */}
          <input
            type="text"
            name="institution"
            placeholder="Name of the Institution"
            onChange={handleInputChange}
            className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
            required
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleInputChange}
            className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
            required
          />

          {/* State */}
          <select 
  name="state" 
  onChange={handleInputChange} 
  className="mb-4 p-3 rounded-lg border border-gray-300 w-80"
  required
>
  <option value="">Select State</option>
  {statesOfIndia.map((state, index) => (
    <option key={index} value={state}>{state}</option>
  ))}
</select>
          <select name="category" onChange={handleInputChange} className="mb-4 p-3 rounded-lg border border-gray-300 w-80" required>
            <option value="">Select Category</option>
            <option value="UG and Interns">UG and Interns</option>
            <option value="PG and PhD">PG and PhD</option>
            <option value="Faculty, Consultant and Others">Faculty, Consultant and Others</option>
          </select>

          {/* ... */}
          {/* Registration Category */}
          <select name="registrationCategory" onChange={handleInputChange} className="mb-4 p-3 rounded-lg border border-gray-300 w-80" required>
            <option value="">Select Registration Category</option>
            <option value="Conference only">Conference only</option>
            <option value="Workshop only">Workshop only </option>
            <option value="Conference + Workshop">Conference + Workshop</option>
          </select>
          {formData.registrationCategory === 'Workshop only' || formData.registrationCategory === 'Conference + Workshop' ? (
            <>
              {/* Morning Workshops */}
             {/* Morning Workshops */}
             <div className="workshop-section mb-8">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Morning Workshops</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {workshops.morning.map((workshop, index) => (
      <div key={`morning-${index}`} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="workshopMorning"
            value={workshop}
            checked={selectedMorningWorkshop === workshop}
            onChange={handleMorningCheckboxChange}
            className="form-checkbox h-5 w-5 text-purple-600 mt-1"
          />
          <span className="text-md font-medium text-gray-700">{workshop}</span>
        </label>
      </div>
    ))}
  </div>
</div>


              {/* Afternoon Workshops */}
              {/* Afternoon Workshops */}
              <div className="workshop-section">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Afternoon Workshops</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {workshops.afternoon.map((workshop, index) => (
      <div key={`afternoon-${index}`} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="workshopAfternoon"
            value={workshop}
            checked={selectedAfternoonWorkshop === workshop}
            onChange={handleAfternoonCheckboxChange}
            className="form-checkbox h-5 w-5 text-purple-600 mt-1"
          />
          <span className="text-md font-medium text-gray-700">{workshop}</span>
        </label>
      </div>
    ))}
  </div>
</div>


            </>
          ) : null}


          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Total Amount to be Paid:</h3>
            <div className="bg-yellow-100 p-2 rounded-md flex items-center justify-center">
              <p className="text-xl font-bold text-purple-700">
                Rs. {formData.totalAmount}
              </p>
            </div>
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !screenshot}
            className={`w-full py-4 text-white font-medium text-lg rounded-lg cursor-pointer transition duration-300 ease-in-out ${isLoading || !screenshot ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;
