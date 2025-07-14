// Simple OTP generation and storage (for development/testing)
// In production, use a proper SMS service like Twilio, MessageBird, or similar

const otpStorage = new Map(); // In production, use Redis or database

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = (phoneNumber, otp) => {
  otpStorage.set(phoneNumber, {
    otp,
    timestamp: Date.now(),
    attempts: 0
  });
  
  // Auto-expire OTP after 5 minutes
  setTimeout(() => {
    otpStorage.delete(phoneNumber);
  }, 5 * 60 * 1000);
};

const verifyOTP = (phoneNumber, otp) => {
  const stored = otpStorage.get(phoneNumber);
  
  if (!stored) {
    return { success: false, message: 'OTP expired or not found' };
  }
  
  if (stored.attempts >= 3) {
    otpStorage.delete(phoneNumber);
    return { success: false, message: 'Too many attempts. Please request new OTP' };
  }
  
  stored.attempts++;
  
  if (stored.otp === otp) {
    otpStorage.delete(phoneNumber);
    return { success: true, message: 'OTP verified successfully' };
  }
  
  return { success: false, message: 'Invalid OTP' };
};

// Mock SMS sending function (replace with actual SMS service)
const sendSMS = async (phoneNumber, message) => {
  console.log(`SMS to ${phoneNumber}: ${message}`);
  // In production, integrate with SMS service API
  return { success: true };
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendSMS
};
