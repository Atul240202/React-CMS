import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/send-whatsapp', async (req, res) => {
  const { name, email, content, number } = req.body;

  try {
    const message = await client.messages.create({
      body: `New contact form submission:
Name: ${name}
Email: ${email}
Phone: ${number}
Message: ${content}`,
      from: process.env.VITE_TWILIO_PHONE_NUMBER,
      to: process.env.VITE_YOUR_WHATSAPP_NUMBER,
    });

    console.log('Message sent:', message.sid);
    res.json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
