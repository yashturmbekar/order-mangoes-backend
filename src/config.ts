export const corsConfig = {
  origin: [
    "https://mango.goprobaba.com",
    "http://mango.goprobaba.com.s3-website-us-east-1.amazonaws.com",
    "http://localhost:5173",
    "http://mangoes.atyourdoorstep.shop.s3-website-us-east-1.amazonaws.com",
    "https://mangoes.atyourdoorstep.shop",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
};
