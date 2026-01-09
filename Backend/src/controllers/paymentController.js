import SSLCommerzPayment from "sslcommerz-lts";
import Event from "../models/Event.js";
import Student from "../models/Student.js";
import { v4 as uuidv4 } from "uuid";

const store_id = "emni684e61caa0afe";
const store_passwd ="emni684e61caa0afe@ssl";
const is_live = false; // Set to true for live

const SERVER_URL = "https://unieventhub-production.up.railway.app";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// @desc    Initialize Payment
// @route   POST /api/payment/init
// @access  Private
export const initPayment = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if already paid/joined
    if (event.goingStudents.includes(userId)) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    const tran_id = uuidv4();

    const data = {
      total_amount: event.entryFee,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${SERVER_URL}/api/payment/success/${tran_id}`,
      fail_url: `${SERVER_URL}/api/payment/fail/${tran_id}`,
      cancel_url: `${SERVER_URL}/api/payment/cancel/${tran_id}`,
      ipn_url: `${SERVER_URL}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: event.title,
      product_category: "Event Ticket",
      product_profile: "general",
      cus_name: student.name,
      cus_email: student.email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: student.name,
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
      value_a: eventId, // Passing metadata
      value_b: userId,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    
    if(apiResponse?.GatewayPageURL) {
        res.status(200).json({ url: apiResponse.GatewayPageURL });
    } else {
        res.status(400).json({ message: "Payment Session Failed" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Payment Success Callback
// @route   POST /api/payment/success/:tran_id
export const paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.params;
    // SSLCommerz sends POST data to this URL
    // We can also validate using val_id from body if needed
    
    // value_a = eventId, value_b = userId passed during init
    const { value_a: eventId, value_b: userId } = req.body;

    if (!eventId || !userId) {
        return res.redirect(`${CLIENT_URL}/payment/fail?message=Invalid Metadata`);
    }

    const event = await Event.findById(eventId);
    if (!event) return res.redirect(`${CLIENT_URL}/payment/fail?message=Event Not Found`);

    // Add student to event if not already
    if (!event.goingStudents.includes(userId)) {
        event.goingStudents.push(userId);
        await event.save();
    }

    res.redirect(`${CLIENT_URL}/payment/success?tran_id=${tran_id}`);

  } catch (error) {
    console.error(error);
    res.redirect(`${CLIENT_URL}/payment/fail?message=Server Error`);
  }
};

// @desc    Payment Fail Callback
// @route   POST /api/payment/fail/:tran_id
export const paymentFail = async (req, res) => {
  res.redirect(`${CLIENT_URL}/payment/fail?message=Payment Failed`);
};

// @desc    Payment Cancel Callback
// @route   POST /api/payment/cancel/:tran_id
export const paymentCancel = async (req, res) => {
  res.redirect(`${CLIENT_URL}/payment/cancel`);
};
