const express = require('express');
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
    console.log('Received POST body:', req.body); 
  const { email, prompt, imageUrl } = req.body;

  if (!email || !prompt || !imageUrl) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Thanks for reporting content on GenAI!',
    html: `
      <h2>Hi there 👋</h2>
      <p>Thanks for helping us improve GenAI.</p>
      <p><strong>Prompt:</strong> ${prompt}</p>
      <p><strong>Image:</strong><br/><img src="${imageUrl}" width="300"/></p>
      <p>We’re reviewing the content and will take appropriate action.</p>
      <p>– The GenAI Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
