export const corsConfig = {
  origin: [
    "https://mango.goprobaba.com",
    "http://mango.goprobaba.com.s3-website-us-east-1.amazonaws.com",
    "http://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
