// File: functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key); // Configure SendGrid API Key in Firebase config

// Generate and send OTP
exports.sendOtp = functions.https.onRequest(async (req, res) => {
  const { email } = req.body;
  if (!email.endsWith('@clarku.edu')) {
    return res.status(400).json({ error: 'Only @clarku.edu emails are allowed.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to Firestore with a TTL
  await admin.firestore().collection('otps').doc(email).set({
    otp,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const msg = {
    to: email,
    from: 'no-reply@clark-marketplace.com',
    subject: 'Your OTP for Clark Marketplace Registration',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});
