import { useState, useEffect } from "react";
import { X, User, Zap, Building2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { merchPurchaseSchema, type MerchPurchaseFormData } from "../../schemas/merchSchema";
import { useAuth } from "../../hooks/useAuth";
import { initiatePayment, verifyPayment } from "../../api/payment";
import { toast } from "react-toastify";
import PaymentProcessingModal from "../PaymentProcessingModal";

interface MerchBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  productSize?: string;
}

const MerchBuyModal = ({
  isOpen,
  onClose,
  productName,
  productPrice,
  productSize,
}: MerchBuyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const { user } = useAuth(); // Get user details

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MerchPurchaseFormData>({
    resolver: zodResolver(merchPurchaseSchema),
    defaultValues: {
      size: productSize as MerchPurchaseFormData['size'],
    },
  });

  // Update form values when user loads or size changes
  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("collegeName", user.college || "");
      // Only set if size is provided (passed prop)
      if (productSize) setValue("size", productSize as MerchPurchaseFormData['size']);
    }
  }, [user, isOpen, productSize, setValue]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data: MerchPurchaseFormData) => {
    setIsSubmitting(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsSubmitting(false);
        return;
      }

      // 1. Initiate Payment
      const orderData = await initiatePayment({
        registrationId: 'merch-tshirt',
        size: data.size,
        semester: data.semester,
        branch: data.branch
      });


      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: `T-Shirt (${data.size})`, // Show size in description at least
        order_id: orderData.orderId,
        prefill: {
          name: data.name,
          email: user?.email,
          contact: user?.phoneNumber
        },
        notes: {
          size: data.size,
          usn: data.usn,
          branch: data.branch,
          semester: data.semester,
          college: data.collegeName
        },
        handler: async function (response: any) {
          setShowProcessingModal(true);
          try {
            // Trigger verification backend side so DB updates
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }).catch(e => console.error(e));
          } catch (e) {
            console.error("Verification trigger failed", e);
          }
        },
        theme: {
          color: "#5924ae"
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        toast.error(response.error.reason || "Payment Failed");
      });
      rzp1.open();

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when modal closes manually
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-6 bg-black/50 backdrop-blur-sm overflow-y-auto py-4 sm:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-full max-w-sm sm:max-w-md flex-shrink-0 my-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LiquidGlassCard className="relative p-4 sm:p-6 max-h-[95vh] overflow-y-auto w-full">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors z-10 cursor-pointer cursor-target"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>

                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {productName}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Complete your details to proceed
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-[#5924ae]/10 to-[#4a1d91]/10 border border-[#5924ae]/30 rounded-lg flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Order Total</span>
                    <span className="text-xl font-bold text-[#bca4ff]">
                      ₹{productPrice}
                    </span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-1 overflow-y-auto px-1 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <User className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          Name
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Enter your name"
                          readOnly
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/20 text-white text-xs placeholder-gray-500/70 border border-white/10 transition-all focus:outline-none opacity-70 cursor-not-allowed`}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* USN */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <Zap className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          USN
                        </label>
                        <input
                          {...register("usn")}
                          type="text"
                          placeholder="e.g., NNMXXYYZZZ"
                          className={`w-full px-4 py-2.5 rounded-xl bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border text-white text-xs placeholder-gray-500/70 transition-all focus:outline-none ${errors.usn
                            ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                            : "border-white/20 focus:bg-white/15 focus:border-[#bca4ff]/50"
                            }`}
                        />
                        {errors.usn && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.usn.message}</p>
                        )}
                      </div>
                    </div>

                    {/* College Name & Branch - Combined Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* College Name */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <Building2 className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          College
                        </label>
                        <input
                          {...register("collegeName")}
                          type="text"
                          placeholder="College Name"
                          readOnly
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/20 text-white text-xs placeholder-gray-500/70 border border-white/10 transition-all focus:outline-none opacity-70 cursor-not-allowed`}
                        />
                        {errors.collegeName && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.collegeName.message}</p>
                        )}
                      </div>

                      {/* Branch */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <Building2 className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          Branch
                        </label>
                        <select
                          {...register("branch")}
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border text-white text-xs transition-all focus:outline-none appearance-none cursor-pointer ${errors.branch
                            ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                            : "border-white/10 focus:bg-white/5 focus:border-[#bca4ff]/50"
                            }`}
                        >
                          <option value="">Select Branch</option>
                          <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                          <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                          <option value="Biotechnology">Biotechnology</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Computer & Communication Engineering">Computer & Communication Engineering</option>
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Computer Science & Engineering (Cyber Security)">Computer Science & Engineering (Cyber Security)</option>
                          <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                          <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                          <option value="Electronics Engineering (VLSI Design & Technology)">Electronics Engineering (VLSI Design & Technology)</option>
                          <option value="Electronics & Communication (Advanced Communication Technology)">Electronics & Communication (Advanced Communication Technology)</option>
                          <option value="Information Science & Engineering">Information Science & Engineering</option>
                          <option value="Robotics & Artificial Intelligence">Robotics & Artificial Intelligence</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                        </select>
                        {errors.branch && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.branch.message}</p>
                        )}
                      </div>
                    </div>

                    {/* T-Shirt Size & Semester */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Size */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <Package className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          Size
                        </label>
                        <select
                          {...register("size")}
                          // If passed via props, should be disabled/readonly or just pre-filled?
                          // User requirement: "Make the sizes option selectable, and when clicked on buy now button it must pass the value."
                          // It's passed.
                          disabled // Disable size selection here since it's passed from main page
                          className={`w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#bca4ff]/50 transition-all appearance-none cursor-not-allowed opacity-70 ${errors.size ? "border-red-500/50" : ""
                            }`}
                        >
                          <option value="">Select Size</option>
                          <option value="XS">XS</option>
                          <option value="S">Small (S)</option>
                          <option value="M">Medium (M)</option>
                          <option value="L">Large (L)</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        {errors.size && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.size.message}</p>
                        )}
                      </div>

                      {/* Semester */}
                      <div>
                        <label className="flex items-center text-xs font-bold text-white tracking-tight mb-1.5">
                          <Zap className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                          Sem
                        </label>
                        <select
                          {...register("semester")}
                          className={`w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#bca4ff]/50 transition-all appearance-none cursor-pointer ${errors.semester ? "border-red-500/50" : ""
                            }`}
                        >
                          <option value="">Select Sem</option>
                          <option value="1">1st</option>
                          <option value="2">2nd</option>
                          <option value="3">3rd</option>
                          <option value="4">4th</option>
                          <option value="5">5th</option>
                          <option value="6">6th</option>
                          <option value="7">7th</option>
                          <option value="8">8th</option>
                        </select>
                        {errors.semester && (
                          <p className="text-red-400 text-[10px] mt-1">{errors.semester.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={handleClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-gray-200 font-bold text-xs hover:bg-white/10 transition-all cursor-pointer cursor-target"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4a1d91] to-[#5924ae] text-white font-bold text-xs transition-all shadow-lg hover:shadow-[0_0_30px_rgba(89,36,174,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer cursor-target"
                      >
                        {isSubmitting ? "Processing..." : "Pay Now"}
                      </motion.button>
                    </div>
                  </form>

                  <p className="text-[10px] text-gray-500 text-center mt-3">
                    ✓ Secure payment
                  </p>
                </div>
              </LiquidGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentProcessingModal
        isOpen={showProcessingModal}
        onClose={() => {
          setShowProcessingModal(false)
          onClose()
          window.location.reload()
        }}
        userId={user?.id}
        paymentType="MERCH"
      />
    </>
  );
};

export default MerchBuyModal;
