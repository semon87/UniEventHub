import { Router } from "express";
import { initPayment, paymentSuccess, paymentFail, paymentCancel } from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/init", protect, initPayment);
router.post("/success/:tran_id", paymentSuccess);
router.post("/fail/:tran_id", paymentFail);
router.post("/cancel/:tran_id", paymentCancel);

export default router;
