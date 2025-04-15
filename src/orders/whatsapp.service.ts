import twilio from 'twilio';

const fromNumber = 'whatsapp:+14155238886'; // Twilio Sandbox WhatsApp number

export function sendWhatsAppMessage(phone: string, message: string) {

  const accountSid = process.env.TWILIO_SID || '';
  const authToken = process.env.TWILIO_TOKEN || '';

  if (!accountSid.startsWith('AC')) {
    console.error('❌ Invalid or missing TWILIO_SID in .env');
    return;
  }

  const client = twilio(accountSid, authToken); // ✅ Now created safely after env check
  //const to = `whatsapp:+91${phone}`;
  const to = `whatsapp:+918830997757`;

  client.messages
    .create({
      body: message,
      from: fromNumber,
      to: to,
    })
    .then((msg: any) => {
      console.log(`✅ WhatsApp message sent to ${to}: SID = ${msg.sid}`);
    })
    .catch((err: any) => {
      console.error(`❌ Failed to send WhatsApp message:`, err.message);
    });
}
