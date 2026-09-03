import Razorpay from "razorpay";

const  razorpay_instance = new Razorpay({
  key_id: process.env.ROZARPAY_KEY_ID,
  key_secret: process.env.ROZARPAY_KEY_SECRET,
});

export default razorpay_instance;