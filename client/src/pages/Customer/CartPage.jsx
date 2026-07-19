import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Trash2, ShoppingBag, Calendar, Clock, CreditCard, ChevronRight, Check, MapPin, Printer, Shield, ArrowRight
} from "lucide-react";
import { rentalService } from "@/services/rentalService";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/common/EmptyState";

const SAVED_CARDS = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/28", holder: "Jury Member" },
  { id: "card-2", brand: "Mastercard", last4: "8888", expiry: "06/27", holder: "Jury Member" }
];

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Checkout Funnel Steps: 1 = Cart Summary, 2 = Address, 3 = Payment, 4 = Thank You Page
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({}); // prodId -> quantity

  // Created Order ID (Step 4)
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Rental period dates
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 8);
    return d.toISOString().split("T")[0];
  });
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("18:00");

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // discount in percent
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Address Step (Step 2) States
  const [deliveryMethod, setDeliveryMethod] = useState("standard"); // standard, pickup
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("rentflow_shipping_address");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: user ? `${user.firstName} ${user.lastName}` : "Jury Member",
      address: "123 Hackathon Lane, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      country: "India",
      email: user?.email || "jury@hackathon.com"
    };
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "Jury Member",
    address: "123 Hackathon Lane, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400050",
    country: "India"
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Payment Step (Step 3) States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCardDetails, setSaveCardDetails] = useState(true);

  // Express Checkout Popup Modal States
  const [showExpressModal, setShowExpressModal] = useState(false);
  const [expressCardDetails, setExpressCardDetails] = useState({
    cardNumber: "4242 4242 4242 4242",
    name: user ? `${user.firstName} ${user.lastName}` : "Jury Member",
    email: user?.email || "jury@hackathon.com",
    address: "123 Hackathon Lane, Bandra West",
    zipCode: "400050",
    city: "Mumbai",
    country: "India"
  });

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem("rentflow_cart") || "[]");
        setCart(items);
        const qMap = {};
        items.forEach(x => { qMap[x.id] = x.cartQuantity || 1; });
        setQuantities(qMap);
      } catch (e) {
        console.error(e);
      }
    };
    loadCart();
  }, []);

  const handleUpdateQty = (id, change) => {
    const current = quantities[id] || 1;
    const next = Math.max(1, current + change);
    setQuantities({ ...quantities, [id]: next });

    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, cartQuantity: next } : item
    );
    setCart(updatedCart);
    localStorage.setItem("rentflow_cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id) => {
    const updated = cart.filter(x => x.id !== id);
    setCart(updated);
    localStorage.setItem("rentflow_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("Item removed from cart");
  };

  const handleSaveForLater = (id) => {
    toast.success("Item saved for later!");
    handleRemoveItem(id);
  };

  // Calculate duration in days
  const calculateDays = () => {
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diff = end - start;
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const daysRented = calculateDays();

  // Price calculations
  const itemSubtotal = cart.reduce((sum, item) => {
    const qty = quantities[item.id] || 1;
    const rate = item.displayRate || item.dailyRate;
    return sum + (rate * qty * daysRented);
  }, 0);

  const discountAmount = Math.round(itemSubtotal * (appliedDiscount / 100));
  const subtotal = itemSubtotal - discountAmount;
  const gstAmount = Math.round(subtotal * 0.18); // GST 18%

  const depositTotal = cart.reduce((sum, item) => {
    const qty = quantities[item.id] || 1;
    const deposit = item.securityDeposit || 0;
    return sum + (deposit * qty);
  }, 0);

  const grandTotal = subtotal + gstAmount + depositTotal;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "RENT10") {
      setAppliedDiscount(10);
      toast.success("Coupon RENT10 applied! 10% Discount added.");
      setShowCouponInput(false);
    } else {
      toast.error("Invalid coupon code. Try RENT10");
    }
  };

  // Checkout order submission
  const executeOrderCheckout = async () => {
    try {
      const payload = {
        pickupDate: new Date(`${pickupDate}T${pickupTime}:00`).toISOString(),
        returnDate: new Date(`${returnDate}T${returnTime}:00`).toISOString(),
        items: cart.map(item => ({
          productId: item.id,
          quantity: quantities[item.id] || 1
        }))
      };

      const res = await rentalService.createRental(payload);
      
      const generatedOrderId = res?.id || `SO${Math.floor(100000 + Math.random() * 900000)}`;
      setPlacedOrderId(generatedOrderId);

      // Clear cart
      localStorage.setItem("rentflow_cart", "[]");
      window.dispatchEvent(new Event("cart-updated"));
      
      // Advance to step 4 (Thank You)
      setStep(4);
      toast.success("Payment authorized & rental order created!");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to create order. Please try again.");
    }
  };

  const handlePrintInvoice = () => {
    if (placedOrderId) {
      const baseURL = "http://localhost:5000/api/v1";
      const token = localStorage.getItem("rentflow_token");
      window.open(`${baseURL}/payments/${placedOrderId}/print?token=${token}`, "_blank");
    } else {
      window.print();
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your Rental Cart is Empty"
          description="Browse the rent store catalog to choose equipment and products."
          actionLabel="Browse Products"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator Header (Steps 1 to 3) */}
        {step < 4 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className={step === 1 ? "text-primary-600 font-bold" : "text-slate-500"}>Add to Cart</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step === 2 ? "text-primary-600 font-bold" : "text-slate-500"}>Address</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={step === 3 ? "text-primary-600 font-bold" : "text-slate-500"}>Payment</span>
          </div>
        )}

        {/* ── STEP 1: Add to Cart & Summary ────────────────────────── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left side cart items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.map(item => {
                    const qty = quantities[item.id] || 1;
                    const rate = item.displayRate || item.dailyRate;
                    const itemTotal = rate * qty * daysRented;

                    return (
                      <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start justify-between gap-4">
                        
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</h3>
                            <p className="text-xs text-primary-600 font-bold mt-1">₹{rate.toLocaleString()} / {item.rateLabel || "day"}</p>
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                              Date and time for which the product is rented: {pickupDate} ({pickupTime}) to {returnDate} ({returnTime}) ({daysRented} days)
                            </p>

                            <div className="flex gap-4 items-center mt-3 text-xs">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                              <span className="text-slate-200 dark:text-slate-850">|</span>
                              <button
                                onClick={() => handleSaveForLater(item.id)}
                                className="text-slate-500 hover:text-slate-600 font-semibold"
                              >
                                Save for Later
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Qty select */}
                        <div className="flex flex-col items-end gap-2 self-stretch justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            ₹{itemTotal.toLocaleString()}
                          </span>

                          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950">
                            <button onClick={() => handleUpdateQty(item.id, -1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold">-</button>
                            <span className="px-3 text-xs font-bold text-slate-800 dark:text-white">{qty}</span>
                            <button onClick={() => handleUpdateQty(item.id, 1)} className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold">+</button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
              >
                Continue Shopping &gt;
              </Link>
            </div>

            {/* Right side billing period & summary */}
            <div className="space-y-5">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Rental Period</h3>
                
                {/* Pickers */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Pickup Date & Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" />
                      <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Return Date & Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white" />
                      <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50 dark:bg-slate-955 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Sub Total</span>
                    <span className="font-semibold text-slate-850 dark:text-white">₹{itemSubtotal.toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-success-600">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-slate-850 dark:text-white">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Security Deposits</span>
                    <span className="font-semibold text-slate-850 dark:text-white">₹{depositTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charges</span>
                    <span className="font-semibold text-slate-800 dark:text-white">—</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coupons */}
              <div>
                {!showCouponInput ? (
                  <button onClick={() => setShowCouponInput(true)} className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-850 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center">
                    Apply Coupon
                  </button>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <input type="text" placeholder="Coupon Code (e.g. RENT10)…" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white" />
                    <button type="submit" className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg">Apply</button>
                  </form>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowExpressModal(true)}
                  className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-55 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Pay with Saved Card
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-bold text-sm shadow-sm transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Address Details ─────────────────────────────── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left side delivery method & address details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Method */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delivery Method</h3>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    deliveryMethod === "standard" ? "border-primary-500 bg-primary-50/20" : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={deliveryMethod === "standard"} onChange={() => setDeliveryMethod("standard")} className="text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Standard Delivery</p>
                        <p className="text-xs text-slate-400 mt-0.5">Leased items shipped to your doorstep</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-success-600">Free</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    deliveryMethod === "pickup" ? "border-primary-500 bg-primary-50/20" : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")} className="text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Pick up from Store</p>
                        <p className="text-xs text-slate-400 mt-0.5">Collect directly from RentFlow local warehouse</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-success-600">Free</span>
                  </label>
                </div>
              </div>

              {/* Delivery Address OR Store Location */}
              {deliveryMethod === "pickup" ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store Pickup Location</h3>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative bg-primary-50/50 dark:bg-primary-900/10">
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                      Vendor Store
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">RentFlow Central Warehouse</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      456 Store Ave, Andheri East, Mumbai, Maharashtra - 400069, India
                    </p>
                    <p className="text-xs text-slate-400 mt-1">support@rentflow.com</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delivery Address</h3>
                    <button
                      onClick={() => {
                        if (isEditingAddress) {
                          localStorage.setItem("rentflow_shipping_address", JSON.stringify(shippingAddress));
                        }
                        setIsEditingAddress(!isEditingAddress);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                    >
                      {isEditingAddress ? "Save Address" : "Edit Address"}
                    </button>
                  </div>

                  {!isEditingAddress ? (
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative bg-slate-50/50 dark:bg-slate-900/50">
                      <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-900/30 text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                        Main Address
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{shippingAddress.name}</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}, {shippingAddress.country}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{shippingAddress.email}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</label>
                        <input type="text" value={shippingAddress.name} onChange={e => setShippingAddress({...shippingAddress, name: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                        <input type="email" value={shippingAddress.email} onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
                        <input type="text" value={shippingAddress.address} onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                        <input type="text" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Zip Code</label>
                        <input type="text" value={shippingAddress.zipCode} onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Billing Address Toggle */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Billing Address</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle to configure a different billing destination</p>
                  </div>
                  
                  {/* Wireframe toggle switch representation */}
                  <button
                    onClick={() => setBillingSameAsShipping(!billingSameAsShipping)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      billingSameAsShipping ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      billingSameAsShipping ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {!billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Billing Name</label>
                      <input type="text" value={billingAddress.name} onChange={e => setBillingAddress({...billingAddress, name: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Billing Street</label>
                      <input type="text" value={billingAddress.address} onChange={e => setBillingAddress({...billingAddress, address: e.target.value})} className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-955" />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right side Summary summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Lease Summary</h3>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <img src={item.image} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Qty: {quantities[item.id] || 1} • {daysRented} days</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Sub Total</span>
                  <span className="font-semibold text-slate-850 dark:text-white">₹{itemSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Security Deposits</span>
                  <span className="font-semibold text-slate-850 dark:text-white">₹{depositTotal.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-bold text-sm shadow-sm transition-all"
              >
                Continued &gt;
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-450 hover:text-slate-600 mt-2 block"
              >
                Back to Cart
              </button>
            </div>

          </div>
        )}

        {/* ── STEP 3: Payment details ─────────────────────────────── */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left side card entry details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Payment Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Method</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Card Details</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="JURY MEMBER"
                        value={cardName}
                        onChange={e => setCardName(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Expiry / CVV</label>
                      <div className="flex gap-1.5">
                        <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-1/2 p-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-955 text-slate-900 dark:text-white" />
                        <input type="password" placeholder="CVV" value={cardCvv} onChange={e => setCardCvv(e.target.value)} className="w-1/2 p-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-955 text-slate-900 dark:text-white" />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer mt-2 text-slate-650 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={saveCardDetails}
                      onChange={() => setSaveCardDetails(!saveCardDetails)}
                      className="rounded border-slate-350 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    Save my payment details
                  </label>
                </div>
              </div>

              {/* Delivery & Billing Summary */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Delivery & Billing</h3>
                  <button onClick={() => setStep(2)} className="text-xs text-primary-600 font-bold hover:underline">Edit</button>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase text-[9px]">
                      {deliveryMethod === "pickup" ? "Pickup From:" : "Shipped To:"}
                    </span>
                    {deliveryMethod === "pickup" ? (
                      <>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">RentFlow Central Warehouse</p>
                        <p className="text-slate-500 leading-relaxed mt-0.5">456 Store Ave, Andheri East - 400069</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{shippingAddress.name}</p>
                        <p className="text-slate-500 leading-relaxed mt-0.5">{shippingAddress.address}, {shippingAddress.city} - {shippingAddress.zipCode}</p>
                      </>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-400 block uppercase text-[9px]">Billing Address:</span>
                    <p className="text-slate-500 mt-0.5">
                      {billingSameAsShipping ? "Same as shipping address" : `${billingAddress.name}, ${billingAddress.address}`}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right side checkout action summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">Payment Summary</h3>
              
              <div className="pt-2 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Sub Total</span>
                  <span className="font-semibold text-slate-850 dark:text-white">₹{itemSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-slate-850 dark:text-white">₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Security Deposits</span>
                  <span className="font-semibold text-slate-850 dark:text-white">₹{depositTotal.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={executeOrderCheckout}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-white dark:bg-white dark:hover:bg-slate-50 dark:text-slate-900 font-bold text-sm shadow-sm transition-all"
              >
                Pay Now
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-450 hover:text-slate-600 mt-2 block"
              >
                Back to Address
              </button>
            </div>

          </div>
        )}

        {/* ── STEP 4: Thank You (Order Confirmation Page) ─────────── */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Confirmation Header Block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-green-950/30 text-success-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Thank you for your order</h1>
                <p className="text-slate-500 text-sm">
                  Order ID: <code className="font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded font-bold text-xs">{placedOrderId}</code>
                </p>
              </div>

              {/* processed green banner */}
              <div className="py-4 px-6 rounded-2xl bg-emerald-600 text-white font-semibold text-sm">
                Your Payment has been processed.
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <Link
                  to="/products"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Delivery & Billing summary details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b pb-2">Delivery & Billing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="font-semibold text-slate-400 block uppercase text-[9px] mb-1">
                    {deliveryMethod === "pickup" ? "Pickup Location" : "Customer Details"}
                  </span>
                  {deliveryMethod === "pickup" ? (
                    <>
                      <p className="font-bold text-slate-800 dark:text-slate-200">RentFlow Central Warehouse</p>
                      <p className="mt-1">456 Store Ave, Andheri East - 400069</p>
                      <p className="mt-1">support@rentflow.com</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{shippingAddress.name}</p>
                      <p className="mt-1">{shippingAddress.address}, {shippingAddress.city} - {shippingAddress.zipCode}</p>
                      <p className="mt-1">{shippingAddress.email}</p>
                    </>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase text-[9px] mb-1">Leasing Details</span>
                  <p className="mt-1">Pickup Date: <strong className="text-slate-800 dark:text-white">{pickupDate} ({pickupTime})</strong></p>
                  <p className="mt-1">Return Date: <strong className="text-slate-800 dark:text-white">{returnDate} ({returnTime})</strong></p>
                  <p className="mt-1">Duration: <strong className="text-slate-800 dark:text-white">{daysRented} days</strong></p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Express Checkout Pop-up Modal ─────────────────── */}
      {showExpressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl space-y-5 animate-slide-up relative">
            <button
              onClick={() => setShowExpressModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Express Checkout</h3>
              <p className="text-xs text-slate-400 mt-1">Complete your rental order in one click</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Card Details</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={expressCardDetails.cardNumber}
                    onChange={e => setExpressCardDetails({...expressCardDetails, cardNumber: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Name</label>
                <input
                  type="text"
                  value={expressCardDetails.name}
                  onChange={e => setExpressCardDetails({...expressCardDetails, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                <input
                  type="email"
                  value={expressCardDetails.email}
                  onChange={e => setExpressCardDetails({...expressCardDetails, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                <input
                  type="text"
                  value={expressCardDetails.address}
                  onChange={e => setExpressCardDetails({...expressCardDetails, address: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Zip Code</label>
                <input
                  type="text"
                  value={expressCardDetails.zipCode}
                  onChange={e => setExpressCardDetails({...expressCardDetails, zipCode: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                <input
                  type="text"
                  value={expressCardDetails.city}
                  onChange={e => setExpressCardDetails({...expressCardDetails, city: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 justify-end">
              <button
                onClick={() => setShowExpressModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowExpressModal(false); executeOrderCheckout(); }}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
