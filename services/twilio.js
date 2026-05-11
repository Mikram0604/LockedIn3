const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'placeholder_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'placeholder_token';
const client = twilio(accountSid, authToken);

const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

async function sendWhatsAppMessage(to, body) {
  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const message = await client.messages.create({
      body: body,
      from: whatsappNumber,
      to: formattedTo
    });
    console.log(`Message sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    // Return true even on error so that the webhook always returns 200 during local dev
    return { error: error.message }; 
  }
}

module.exports = {
  sendWhatsAppMessage,
  client
};
