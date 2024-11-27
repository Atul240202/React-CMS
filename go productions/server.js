import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies (if needed)
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);

app.post('/send-whatsapp', async (req, res) => {
  const { name, email, content, number } = req.body;

  try {
    const message = await client.messages.create({
      from: 'whatsapp:', // Twilio's WhatsApp sandbox number
      to: 'whatsapp:',
      contentSid: '',

      body: `New Contact Form Submission:
      Name: ${name}
      Email: ${email}
      Phone: ${number}
      Content: ${content}`,
    });

    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
