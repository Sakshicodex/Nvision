require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      // Use the original file name, or append the correct file extension based on the MIME type
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



const app = express();
const corsOptions = {
  origin: 'https://nvision-24.vercel.app/', // or use a function to dynamically set the origin based on the request
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.options('*', cors(corsOptions));


app.use(cors(corsOptions));


app.use(express.json());

// Configure a JWT auth client
let jwtClient = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  
  process.env.GOOGLE_PRIVATE_KEY,// Replace escaped newlines
  ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
);

// Authenticate request
jwtClient.authorize(function (error) {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

// Google Drive: Upload function
async function uploadToDrive(filename, mimeType, buffer) {
  const drive = google.drive({ version: 'v3', auth: jwtClient });
  const fileMetadata = {
    name: filename,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] // Your Google Drive folder ID
  };
  const media = {
    mimeType: mimeType,
    body: buffer
  };
  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink'
  });
  
  // Set file as publicly readable (or set appropriate permissions)
  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      type: 'anyone',
      role: 'reader'
    }
  });
  
  return file.data.webViewLink;
}

// Google Sheets: Update function
async function appendToSheet(spreadsheetId, range, values) {
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [values] }
  });
}
async function appendToSheet2(spreadsheetId, range, values) {
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: values } // 'values' is now directly used
  });
}
async function readFromSheet(spreadsheetId, range) {
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return response.data.values;
}

// Express POST endpoint
app.post('/submit-registration', upload.single('screenshot'), async (req, res) => {
  try {
    // Assuming you have the file buffer and filename from the upload
    const { buffer, originalname, mimetype } = req.file; // Access file from req.file
    
    // Upload the file to Google Drive
    const webViewLink = await uploadToDrive(originalname, mimetype, buffer);
    
    // Prepare the form data, including the link to the uploaded file
    const registrationData = JSON.parse(req.body.registrationData);
const formDataWithLink = [...Object.values(registrationData).map(value => 
  Array.isArray(value) && value.length === 0 ? "None" : value
), webViewLink];
   
    // Append the form data to the Google Sheets
    await appendToSheet(process.env.GOOGLE_SHEETS_ID, 'A1', formDataWithLink);
    
    res.status(200).send('Registration and file upload successful');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

app.post('/check-submission', async (req, res) => {
  const { registrationNumber } = req.body;

  if (!registrationNumber) {
    return res.status(400).send('Registration number is required');
  }

  try {
    const range = 'Sheet1!A:E'; // Adjust the range to include all columns with data
    const submissionsData = await readFromSheet(process.env.GOOGLE_SHEETS_ID2, range);

    // Initialize the submission types
    let submissionTypes = {
      Paper: false,
      Poster: false,
      Concept: false // Assuming Concept is another type you might have
    };

    // Find rows with the given registration number and update the submission types
    submissionsData.forEach(row => {
      if (row[1] && row[1].trim().toUpperCase() === registrationNumber.trim().toUpperCase()) { // Case insensitive comparison
        const type = row[3]; // Type is in column D
        if (type && type.trim()) { // Check if type is not empty and trim any whitespace
          submissionTypes[type.trim()] = true; // Mark the type as true (submitted)
        }
      }
    });

    res.status(200).json({ submissionTypes });
  } catch (error) {
    console.error('Error during checking submission:', error);
    res.status(500).send('An error occurred during checking submission');
  }
});



app.post('/submit-workshop', upload.single('screenshot'), async (req, res) => {
  try {
    // Assuming you have the file buffer and filename from the upload
    const { buffer, originalname, mimetype } = req.file; // Access file from req.file
    
    // Upload the file to Google Drive
    const webViewLink = await uploadToDrive(originalname, mimetype, buffer);
    
    // Prepare the form data, including the link to the uploaded file
    const registrationData = JSON.parse(req.body.registrationData);
const formDataWithLink = [...Object.values(registrationData).map(value => 
  Array.isArray(value) && value.length === 0 ? "None" : value
), webViewLink];
   
    // Append the form data to the Google Sheets
    await appendToSheet(process.env.GOOGLE_SHEETS_ID3, 'A1', formDataWithLink);
    
    res.status(200).send('Registration and file upload successful');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});


app.post('/submit-abstract', cors(), async (req, res) => {
  try {
    const { data } = req.body; // 'data' should be an array of arrays
    console.log('Received data:', data);
    // Validate each row in the data
    if (!Array.isArray(data) || !data.every(row => validateRow(row))) {
      return res.status(400).send('Invalid data format or content');
    }

    // Directly append 'data' to the Google Sheets
    await appendToSheet2(process.env.GOOGLE_SHEETS_ID2, 'Sheet1', data); // Adjust the range if necessary
    res.status(200).send('Abstract submission successful');
  } catch (error) {
    console.error('Error during abstract submission:', error);
    res.status(500).send('An error occurred during abstract submission');
  }
});
const expectedLength = 9; // Adjust this to the expected number of columns in your sheet

function validateRow(row) {
  // Check if the row is an array and has the expected length
  if (!Array.isArray(row) || row.length !== expectedLength) {
    return false;
  }

  // Additional validation for each cell in the row
  for (let cell of row) {
    // Example validation rules:
    // - Check if the cell is not undefined or null
    // - Check if the cell is a string (you can adjust based on your data types)
    // - Optionally, check for empty strings if required
    if (cell === undefined || cell === null || typeof cell !== 'string' || cell.trim() === '') {
      return false;
    }
  }

  // If all checks pass, return true
  return true;
}


app.get('/', (req, res) => {
  res.send('Welcome to my website!');
});
app.get('/submit-abstract', (req, res) => {
  res.send('Welcome to my website!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

