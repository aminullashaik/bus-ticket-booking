const twilio = require('twilio');

// Initialize client only if credentials exist
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_FROM_PHONE; // Example: '+1234567890'
const fromWhatsApp = process.env.TWILIO_FROM_WHATSAPP; // Example: 'whatsapp:+14155238886'

let client = null;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

const sendSMS = async (to, message) => {
    if (!client) {
        console.log(`[SIMULATED SMS] To: ${to} | Msg: ${message}`);
        return { success: true, simulated: true };
    }

    try {
        const response = await client.messages.create({
            body: message,
            from: fromPhoneNumber,
            to: to
        });
        console.log(`[TWILIO SMS] Sent to ${to}. SID: ${response.sid}`);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error(`[TWILIO SMS ERROR] ${error.message}`);
        return { success: false, error: error.message };
    }
};

const sendWhatsApp = async (to, message) => {
    if (!client) {
        console.log(`[SIMULATED WHATSAPP] To: ${to} | Msg: ${message}`);
        return { success: true, simulated: true };
    }

    try {
        const response = await client.messages.create({
            from: fromWhatsApp,
            body: message,
            to: `whatsapp:${to}`
        });
        console.log(`[TWILIO WHATSAPP] Sent to ${to}. SID: ${response.sid}`);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error(`[TWILIO WHATSAPP ERROR] ${error.message}`);
        return { success: false, error: error.message };
    }
};

module.exports = { sendSMS, sendWhatsApp };
