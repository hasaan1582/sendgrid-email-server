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
  subject: 'Thanks for reporting content on GenAI',
  html: `
    <h2>Hi there 👋</h2>

    <p>Thank you for reporting content in the GenAI app. We appreciate your help in making the community safe and respectful for everyone.</p>

    <p><strong>Reported Prompt:</strong><br/>${prompt}</p>

    <p><strong>Reported Image:</strong><br/>
      <img src="${imageUrl}" width="300" style="border:1px solid #ddd; margin-top:10px;"/>
    </p>

    <p>Our moderation team will review this submission and take appropriate action in accordance with our content guidelines.</p>

    <p>We’re constantly working to improve the experience for all users. Your feedback helps us get better every day.</p>

    <p>Thanks again,<br/><strong>The GenAI Team</strong></p>

    <hr/>
    <p style="font-size:12px; color:#888;">If you believe this message was sent in error, please contact us at support@yourdomain.com.</p>
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
