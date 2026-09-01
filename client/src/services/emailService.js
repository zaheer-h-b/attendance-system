import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOTPEmail = async (email, otp) => {
  try {
    const templateParams = {
      email: email,
      passcode: otp,
      time: "15 minutes",
    };

    console.log("EmailJS parameters:", templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("EmailJS response:", response);

    return response.status === 200;

  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};