import React, {useState, useEffect, useRef} from "react";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Heart,
  Star,
  RefreshCcw,
  MessageCircle,
  ListOrdered,
  Bell,
  Settings,
  Store,
  Pencil,
  Camera,
  Plus,
  Lock,
  Shield,
  Link,
  Wallet,
  Zap,
  Send,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Trash2,
  Mail,
  Phone,
  ShoppingBag,
  FileText,
  Gift,
  Truck,
  X,
  Menu,
} from "lucide-react";
import {useOrdersStore} from "../stores/getAllOrders";
import {useAddressStore} from "../stores/getAdresses";

// Helper: map backend order to display format
const formatOrderForDisplay = (backendOrder) => {
  const stepMap = {
    processing: 0,
    confirmed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
  };
  const trackStep = stepMap[backendOrder.orderStatus] ?? 0;

  const itemsText = backendOrder.items
    .map((item) => `${item.product?.name || "Product"} (x${item.quantity})`)
    .join(", ");
  const shortItems =
    itemsText.length > 40 ? itemsText.slice(0, 37) + "..." : itemsText;

  const lines = backendOrder.items.map((item) => ({
    name: item.product?.name || "Product",
    qty: item.quantity,
    price: `KES ${(item.price || 0).toLocaleString()}`,
  }));

  return {
    id: backendOrder._id.slice(-8).toUpperCase(),
    backendId: backendOrder._id,
    date: new Date(backendOrder.createdAt).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: shortItems,
    total: `KES ${backendOrder.total.toLocaleString()}`,
    status:
      backendOrder.orderStatus === "out_for_delivery"
        ? "Out for Delivery"
        : backendOrder.orderStatus.charAt(0).toUpperCase() +
          backendOrder.orderStatus.slice(1),
    tracking: backendOrder.trackingNumber || "Pending",
    trackStep,
    lines,
    shippingAddress: backendOrder.shippingAddress,
    paymentMethod: backendOrder.paymentMethod,
    paymentStatus: backendOrder.paymentStatus,
  };
};

const Profile = () => {
  // ---------- STORES ----------
  const {
    orders: backendOrders,
    isLoading: ordersLoading,
    fetchAllOrders,
  } = useOrdersStore();

  const {
    addresses: backendAddresses,
    isLoading: addressesLoading,
    fetchAddresses,
  } = useAddressStore();

  // ---------- HARDCODED DEFAULT STATE (profile, contacts, payments, etc.) ----------
  const DEFAULT_STATE = {
    user: {
      firstName: "Amina",
      lastName: "Njoroge",
      email: "amina@example.com",
      gender: "Female",
      dob: "1992-04-14",
    },
    contacts: [
      {
        id: 1,
        type: "email",
        value: "amina@example.com",
        billing: true,
        shipping: false,
      },
      {
        id: 2,
        type: "phone",
        value: "+254 712 345 678",
        billing: false,
        shipping: true,
      },
    ],
    payments: [
      {id: 1, type: "Visa", last4: "4242", expiry: "09/27", isDefault: true},
      {
        id: 2,
        type: "Mastercard",
        last4: "5301",
        expiry: "03/26",
        isDefault: false,
      },
      {id: 3, type: "M-Pesa", last4: "678", expiry: "—", isDefault: false},
    ],
    prefs: {
      marketingEmail: true,
      marketingSMS: false,
      orderEmail: true,
      orderSMS: true,
      shippingMethod: "standard",
    },
    wishlist: [
      {id: 1, name: "Moringa Radiance Serum", price: "KES 2,400", emoji: "🌿"},
      {id: 2, name: "Cold Press Baobab Oil", price: "KES 3,200", emoji: "🫒"},
      {id: 3, name: "African Black Soap 120g", price: "KES 950", emoji: "🧼"},
      {id: 4, name: "Botanical Facial Mist", price: "KES 1,400", emoji: "💧"},
    ],
    reviews: [
      {
        product: "Moringa Radiance Serum",
        rating: 5,
        date: "Apr 20, 2024",
        text: "Absolutely transformed my skin — lighter, more even, glowing. I tell everyone about this.",
      },
      {
        product: "African Black Soap",
        rating: 4,
        date: "Jan 11, 2024",
        text: "Very gentle cleanse, love the natural scent. Would give 5 stars if it lathered a touch more.",
      },
    ],
    tickets: [
      {
        id: "TKT-0041",
        subject: "Delayed shipment — ORD-2024-001",
        date: "Apr 14, 2024",
        status: "Open",
        last: "Apr 15, 2024",
      },
      {
        id: "TKT-0038",
        subject: "Invoice request — ORD-2023-009",
        date: "Nov 8, 2023",
        status: "Resolved",
        last: "Nov 9, 2023",
      },
    ],
  };

  const TRACK_STEPS = [
    "Ordered",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const STATUS_CLASS = {
    Processing: "badge-processing",
    Shipped: "badge-shipped",
    Delivered: "badge-delivered",
    Cancelled: "badge-cancelled",
    "Out for Delivery": "badge-shipped",
  };
  const CARD_ICONS = {Visa: "💳", Mastercard: "💳", "M-Pesa": "📱", Amex: "💳"};

  // ---------- STATE ----------
  const [state, setState] = useState(DEFAULT_STATE);
  const [activePage, setActivePage] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState({
    edit: false,
    password: false,
    twoFA: false,
    order: false,
    addAddress: false,
    addContact: false,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [b2bChecked, setB2bChecked] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  // Format orders for display
  const displayOrders = React.useMemo(() => {
    if (!backendOrders?.length) return [];
    return backendOrders.map(formatOrderForDisplay);
  }, [backendOrders]);

  // ---------- FETCH REAL DATA ----------
  useEffect(() => {
    fetchAllOrders();
    fetchAddresses();
  }, []);

  // ---------- HELPERS ----------
  const showToast = (msg, icon = "CheckCircle") => {
    const id = Date.now();
    setToasts((prev) => [...prev, {id, msg, icon}]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3200,
    );
  };

  const openModal = (name) => setModals((prev) => ({...prev, [name]: true}));
  const closeModal = (name) => setModals((prev) => ({...prev, [name]: false}));

  const navigate = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 900) setSidebarOpen(false);
  };

  // ---------- THEME ----------
  useEffect(() => {
    const savedDark = localStorage.getItem("mlk_dark") === "true";
    setDarkMode(savedDark);
    document.documentElement.setAttribute(
      "data-theme",
      savedDark ? "dark" : "light",
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("mlk_dark", darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  // ---------- PERSIST LOCAL STATE (excluding orders/addresses) ----------
  useEffect(() => {
    const savedState = localStorage.getItem("mlk_profile");
    if (savedState) setState(JSON.parse(savedState));
  }, []);
  useEffect(() => {
    localStorage.setItem("mlk_profile", JSON.stringify(state));
  }, [state]);

  // ---------- PROFILE ACTIONS (local) ----------
  const saveProfile = () => {
    const firstName = document.getElementById("editFirstName")?.value;
    const lastName = document.getElementById("editLastName")?.value;
    const email = document.getElementById("editEmail")?.value;
    if (!firstName || !lastName) {
      showToast("Name cannot be empty", "AlertCircle");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Enter a valid email", "AlertCircle");
      return;
    }
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        firstName,
        lastName,
        email,
        gender: document.getElementById("editGender")?.value,
        dob: document.getElementById("editDob")?.value,
      },
    }));
    closeModal("edit");
    showToast("Profile updated successfully", "CheckCircle");
  };

  const changePassword = () => {
    const cur = document.getElementById("curPwd")?.value;
    const nw = document.getElementById("newPwd")?.value;
    const cn = document.getElementById("confPwd")?.value;
    if (!cur || !nw || !cn) {
      showToast("Please fill all fields", "AlertCircle");
      return;
    }
    if (nw.length < 8) {
      showToast("Password must be at least 8 characters", "AlertCircle");
      return;
    }
    if (nw !== cn) {
      showToast("Passwords do not match", "AlertCircle");
      return;
    }
    closeModal("password");
    showToast("Password changed successfully", "Shield");
  };

  const enable2FA = () => {
    closeModal("twoFA");
    showToast("Two-factor authentication enabled", "Shield");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    showToast("Profile photo updated", "Camera");
  };

  // ---------- CONTACTS (local) ----------
  const saveContact = () => {
    const type = document.getElementById("contactType")?.value;
    const value = document.getElementById("contactValue")?.value.trim();
    if (!value) {
      showToast("Please enter a value", "AlertCircle");
      return;
    }
    setState((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {id: Date.now(), type, value, billing: false, shipping: false},
      ],
    }));
    closeModal("addContact");
    showToast("Contact method added", "CheckCircle");
  };

  const deleteContact = (id) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
    showToast("Contact removed", "Trash2");
  };

  // ---------- ADDRESSES (read‑only – no write operations) ----------
  // No addAddress, setDefaultAddress, deleteAddress functions

  // ---------- PAYMENTS (local) ----------
  const setDefaultPayment = (id) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => ({...p, isDefault: p.id === id})),
    }));
    showToast("Default payment method updated", "CreditCard");
  };

  const deletePayment = (id) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
    showToast("Payment method removed", "Trash2");
  };

  const redeemGiftCard = () => {
    const code = document.getElementById("giftCodeInput")?.value.trim();
    if (!code) {
      showToast("Please enter a gift card code", "AlertCircle");
      return;
    }
    document.getElementById("giftCodeInput").value = "";
    showToast("Gift card redeemed! KES 500 added to your balance", "Gift");
  };

  // ---------- PREFERENCES (local) ----------
  const togglePref = (key) => {
    setState((prev) => ({
      ...prev,
      prefs: {...prev.prefs, [key]: !prev.prefs[key]},
    }));
    showToast("Preference updated", "Settings");
  };

  const setShippingMethod = (id) => {
    setState((prev) => ({
      ...prev,
      prefs: {...prev.prefs, shippingMethod: id},
    }));
    showToast("Default shipping method updated", "Truck");
  };

  // ---------- WISHLIST (local) ----------
  const removeWishlist = (id) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((p) => p.id !== id),
    }));
    showToast("Removed from wishlist", "Heart");
  };

  const moveToCart = () => showToast("Added to cart", "ShoppingBag");

  // ---------- ORDERS ----------
  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    openModal("order");
  };

  const reorder = () => showToast("Items added to your cart", "ShoppingBag");
  const downloadInvoice = (id) => {
    const blob = new Blob(
      [`MINDFUL LIVING KE\nINVOICE — ${id}\n\nThank you for your order.`],
      {type: "application/pdf"},
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Invoice downloaded", "FileText");
  };

  // ---------- RETURNS / BULK ORDER (local) ----------
  const submitReturn = () =>
    showToast(
      "Return request submitted. We'll respond within 24 hours.",
      "CheckCircle",
    );
  const parseSKUs = () => {
    const raw = document.getElementById("skuInput")?.value.trim();
    if (!raw) {
      showToast("Please enter at least one SKU", "AlertCircle");
      return;
    }
    const skus = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    showToast(
      `${skus.length} SKU${skus.length > 1 ? "s" : ""} added to cart`,
      "ShoppingCart",
    );
  };

  const fullName = `${state.user.firstName} ${state.user.lastName}`;
  const initials =
    (state.user.firstName[0] || "") + (state.user.lastName[0] || "");
  const dobFormatted = state.user.dob
    ? new Date(state.user.dob).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // ---------- JSX ----------
  return (
    <div className="app">
      <style>{`
        /* ========== FULL ORIGINAL CSS ========== */
        :root {
          --blog-forest: #14280F;
          --blog-gold: #4A8C2A;
          --blog-gold-light: #72B84A;
          --blog-gold-pale: #E8F5E0;
          --blog-cream: #F7FBF4;
          --blog-dark: #1A1A1A;
          --blog-muted: #5A7A4A;
          --blog-ink: #2C3A28;
          --bg: #F4F7F2;
          --bg-card: rgba(255,255,255,0.72);
          --bg-glass: rgba(255,255,255,0.55);
          --bg-sidebar: #0F2009;
          --border: rgba(74,140,42,0.14);
          --border-strong: rgba(74,140,42,0.28);
          --accent: #4A8C2A;
          --accent-light: #72B84A;
          --accent-pale: #E8F5E0;
          --accent-gold: #B8860B;
          --accent-gold-lt: #D4A843;
          --text-primary: #1A1A1A;
          --text-secondary: #5A7A4A;
          --text-muted: rgba(42,60,28,0.45);
          --text-inverse: #F0F7EC;
          --shadow-sm: 0 2px 12px rgba(20,40,10,0.07);
          --shadow-md: 0 8px 32px rgba(20,40,10,0.10);
          --shadow-lg: 0 20px 60px rgba(20,40,10,0.14);
          --shadow-xl: 0 32px 80px rgba(20,40,10,0.18);
          --radius-sm: 8px;
          --radius: 14px;
          --radius-lg: 20px;
          --sidebar-w: 260px;
          --transition: 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        [data-theme="dark"] {
          --bg: #0B1A07;
          --bg-card: rgba(20,40,12,0.75);
          --bg-glass: rgba(20,40,12,0.55);
          --bg-sidebar: #060E03;
          --border: rgba(114,184,74,0.12);
          --border-strong: rgba(114,184,74,0.25);
          --text-primary: #E8F5E0;
          --text-secondary: rgba(232,245,224,0.65);
          --text-muted: rgba(232,245,224,0.35);
          --shadow-sm: 0 2px 12px rgba(0,0,0,0.25);
          --shadow-md: 0 8px 32px rgba(0,0,0,0.35);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.45);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: var(--bg); color: var(--text-primary); min-height: 100vh; overflow-x: hidden; transition: background var(--transition), color var(--transition); margin:0; }
        .app { display: flex; min-height: 100vh; }
        .sidebar {
          width: var(--sidebar-w); min-height: 100vh; background: var(--bg-sidebar); position: fixed; top: 0; left: 0; bottom: 0;
          display: flex; flex-direction: column; z-index: 100; transition: transform var(--transition), width var(--transition);
          overflow: hidden; border-right: 1px solid rgba(114,184,74,0.08);
        }
        .sidebar::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 30%, rgba(74,140,42,0.18) 0%, transparent 65%), radial-gradient(ellipse at 80% 80%, rgba(114,184,74,0.08) 0%, transparent 55%); pointer-events: none; }
        .sidebar-logo { padding: 32px 28px 28px; border-bottom: 1px solid rgba(114,184,74,0.1); flex-shrink: 0; }
        .sidebar-logo .wordmark { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 300; color: #F0F7EC; letter-spacing: -0.01em; }
        .sidebar-logo .wordmark span { color: var(--accent-light); }
        .sidebar-logo .sub { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(114,184,74,0.45); margin-top: 4px; }
        .sidebar-avatar { padding: 24px 28px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid rgba(114,184,74,0.08); }
        .avatar-circle { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-light)); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 500; color: white; flex-shrink: 0; position: relative; box-shadow: 0 0 0 2px rgba(114,184,74,0.3); }
        .avatar-online { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; background: #4caf50; border: 2px solid var(--bg-sidebar); }
        .avatar-info .name { font-size: 13px; font-weight: 400; color: #F0F7EC; }
        .avatar-info .tier { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent-gold-lt); margin-top: 2px; display: flex; align-items: center; gap: 5px; }
        .tier-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent-gold-lt); }
        .sidebar-nav { flex: 1; overflow-y: auto; padding: 16px 0; }
        .nav-section-label { padding: 12px 28px 6px; font-size: 8px; font-weight: 500; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(114,184,74,0.35); }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 28px; cursor: pointer; font-size: 12px; font-weight: 300; letter-spacing: 0.05em; color: rgba(240,247,236,0.5); transition: all 0.2s; position: relative; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover { color: rgba(240,247,236,0.85); background: rgba(114,184,74,0.06); }
        .nav-item.active { color: #F0F7EC; background: rgba(114,184,74,0.12); }
        .nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent-light); border-radius: 0 2px 2px 0; }
        .nav-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.7; }
        .nav-item.active .nav-icon { opacity: 1; }
        .nav-badge { margin-left: auto; background: var(--accent); color: white; font-size: 9px; padding: 2px 7px; border-radius: 100px; font-weight: 500; }
        .sidebar-footer { padding: 20px 28px; border-top: 1px solid rgba(114,184,74,0.08); display: flex; align-items: center; gap: 10px; }
        .theme-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .theme-label { font-size: 11px; color: rgba(240,247,236,0.4); font-weight: 300; }
        .toggle-switch { width: 40px; height: 22px; border-radius: 100px; background: rgba(114,184,74,0.2); position: relative; cursor: pointer; transition: background 0.3s; border: none; flex-shrink: 0; }
        .toggle-switch.on { background: var(--accent); }
        .toggle-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: transform 0.3s; }
        .toggle-switch.on::after { transform: translateX(18px); }
        .main { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { position: sticky; top: 0; z-index: 50; padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; background: rgba(244,247,242,0.85); backdrop-filter: blur(20px) saturate(1.5); border-bottom: 1px solid var(--border); transition: background var(--transition); }
        [data-theme="dark"] .topbar { background: rgba(11,26,7,0.85); }
        .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
        .topbar-breadcrumb .current { color: var(--text-primary); font-weight: 400; }
        .topbar-breadcrumb .sep { opacity: 0.4; }
        .topbar-actions { display: flex; align-items: center; gap: 12px; }
        .topbar-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; color: var(--text-secondary); transition: all 0.2s; position: relative; backdrop-filter: blur(10px); }
        .topbar-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
        .notif-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent-gold); border: 1.5px solid var(--bg); }
        .page-content { padding: 40px; display: none; animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .page-content.active { display: block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .page-header { margin-bottom: 36px; }
        .page-header h1 { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 300; color: var(--text-primary); line-height: 1.2; }
        .page-header h1 em { font-style: italic; color: var(--accent); }
        .page-header p { font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 300; }
        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); backdrop-filter: blur(20px) saturate(1.2); overflow: hidden; transition: box-shadow var(--transition), transform var(--transition); }
        .card:hover { box-shadow: var(--shadow-md); }
        .card-header { padding: 24px 28px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-size: 11px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-secondary); }
        .card-body { padding: 24px 28px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .field-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-glass); font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-primary); font-weight: 300; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(74,140,42,0.1); }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; border-radius: 100px; font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; border: none; transition: all 0.25s; position: relative; overflow: hidden; }
        .btn-primary { background: var(--accent); color: white; }
        .btn-primary:hover { background: var(--accent-light); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(74,140,42,0.3); }
        .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--border-strong); }
        .btn-outline:hover { background: var(--accent-pale); border-color: var(--accent); }
        .btn-ghost { background: transparent; color: var(--text-secondary); padding: 8px 14px; }
        .btn-ghost:hover { background: var(--accent-pale); color: var(--accent); }
        .btn-gold { background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-lt)); color: white; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(184,134,11,0.3); }
        .btn-sm { padding: 7px 16px; font-size: 9px; }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 9px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; }
        .badge-processing { background: rgba(255,160,0,0.1); color: #e67e00; }
        .badge-shipped { background: rgba(74,140,42,0.1); color: var(--accent); }
        .badge-delivered { background: rgba(52,168,83,0.1); color: #2e7d32; }
        .badge-cancelled { background: rgba(192,57,43,0.1); color: #c0392b; }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .stat-card { padding: 24px 28px; border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--bg-card); backdrop-filter: blur(20px); position: relative; overflow: hidden; transition: all var(--transition); }
        .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0; transition: opacity 0.3s; }
        .stat-card:hover::before { opacity: 1; }
        .stat-label { font-size: 9px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted); }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 300; color: var(--text-primary); margin: 8px 0 4px; line-height: 1; }
        .stat-sub { font-size: 11px; color: var(--text-muted); font-weight: 300; }
        .stat-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); opacity: 0.06; font-size: 48px; }
        .divider { height: 1px; background: var(--border); margin: 20px 0; }
        .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
        .pref-row:last-child { border-bottom: none; }
        .pref-text .label { font-size: 13px; font-weight: 300; color: var(--text-primary); }
        .pref-text .sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .pref-switch { width: 44px; height: 24px; border-radius: 100px; background: rgba(74,140,42,0.15); position: relative; cursor: pointer; transition: background 0.3s; border: none; flex-shrink: 0; }
        .pref-switch.on { background: var(--accent); }
        .pref-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .pref-switch.on::after { transform: translateX(20px); }
        .product-card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-card); overflow: hidden; transition: all var(--transition); }
        .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .product-img { height: 180px; background: var(--accent-pale); display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .product-body { padding: 16px; }
        .product-name { font-size: 13px; font-weight: 400; color: var(--text-primary); }
        .product-price { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 300; color: var(--accent); margin: 4px 0 12px; }
        .tracking-bar { display: flex; align-items: center; gap: 0; margin: 20px 0; }
        .track-step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .track-node { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; z-index: 1; transition: all 0.3s; }
        .track-node.done { background: var(--accent); color: white; box-shadow: 0 0 0 4px rgba(74,140,42,0.15); }
        .track-node.active { background: var(--accent-gold); color: white; box-shadow: 0 0 0 4px rgba(184,134,11,0.2); }
        .track-node.pending { background: var(--border); color: var(--text-muted); }
        .track-line { flex: 1; height: 2px; background: var(--border); margin-top: -34px; }
        .track-line.done { background: var(--accent); }
        .track-label { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); text-align: center; }
        .track-label.done { color: var(--accent); }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead tr { border-bottom: 2px solid var(--border); }
        th { text-align: left; padding: 10px 14px; font-size: 9px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted); }
        td { padding: 14px; color: var(--text-primary); font-weight: 300; }
        tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
        tbody tr:hover { background: rgba(74,140,42,0.03); }
        .address-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; background: var(--bg-card); position: relative; transition: all var(--transition); }
        .address-card.default { border-color: var(--accent); }
        .address-card.default::before { content: 'Default'; position: absolute; top: -1px; right: 18px; background: var(--accent); color: white; font-size: 8px; letter-spacing: 0.25em; text-transform: uppercase; padding: 3px 10px; border-radius: 0 0 6px 6px; }
        .address-name { font-size: 13px; font-weight: 400; color: var(--text-primary); margin-bottom: 6px; }
        .address-line { font-size: 12px; color: var(--text-muted); line-height: 1.7; font-weight: 300; }
        .payment-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; background: var(--bg-card); display: flex; align-items: center; gap: 16px; transition: all var(--transition); cursor: pointer; }
        .payment-card:hover { border-color: var(--accent); }
        .payment-card.default { border-color: var(--accent); background: rgba(74,140,42,0.04); }
        .card-chip { width: 48px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; font-weight: 700; background: linear-gradient(135deg, #1a1a2e, #16213e); color: var(--accent-gold-lt); }
        .card-mask { font-family: 'Playfair Display', serif; font-size: 14px; color: var(--text-primary); letter-spacing: 0.15em; }
        .card-expiry { font-size: 11px; color: var(--text-muted); }
        .stars { display: flex; gap: 2px; }
        .star { color: var(--accent-gold-lt); font-size: 14px; }
        .star.empty { color: var(--border); }
        .points-bar { height: 8px; border-radius: 100px; background: var(--border); overflow: hidden; margin: 10px 0 6px; }
        .points-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--accent), var(--accent-light)); transition: width 1s cubic-bezier(0.16,1,0.3,1); }
        .toast-container { position: fixed; bottom: 28px; right: 28px; display: flex; flex-direction: column; gap: 10px; z-index: 9998; }
        .toast { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: var(--radius); background: var(--blog-forest); color: #F0F7EC; font-size: 13px; font-weight: 300; border: 1px solid rgba(114,184,74,0.2); box-shadow: var(--shadow-lg); animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both; max-width: 320px; }
        .toast.removing { animation: toastOut 0.3s ease both; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(16px) scale(0.95); } to { opacity: 1; transform: none; } }
        @keyframes toastOut { to { opacity: 0; transform: translateY(8px) scale(0.95); } }
        .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(14,28,10,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .modal-overlay.open { opacity: 1; pointer-events: all; }
        .modal { background: var(--bg-card); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); width: 100%; max-width: 600px; max-height: 85vh; overflow-y: auto; position: relative; transform: translateY(20px) scale(0.97); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }
        .modal-overlay.open .modal { transform: none; }
        .modal-header { padding: 28px 32px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .modal-header h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 300; }
        .modal-close { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
        .modal-close:hover { background: rgba(192,57,43,0.08); color: #c0392b; border-color: rgba(192,57,43,0.2); }
        .modal-body { padding: 28px 32px; }
        .skeleton { background: linear-gradient(90deg, var(--border) 25%, rgba(74,140,42,0.08) 50%, var(--border) 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite; border-radius: var(--radius-sm); }
        @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .mobile-menu-btn { display: none; position: fixed; top: 14px; left: 14px; z-index: 200; width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--blog-forest); border: none; cursor: pointer; align-items: center; justify-content: center; color: #F0F7EC; }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); z-index: 150; }
          .sidebar.open { transform: none; }
          .mobile-menu-btn { display: flex; }
          .main { margin-left: 0; }
          .topbar { padding: 0 16px 0 60px; }
          .page-content { padding: 24px 16px; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) { .stat-grid { grid-template-columns: 1fr !important; } .card-header { flex-direction: column; align-items: flex-start; gap: 10px; } }
        .security-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
      `}</style>

      {/* SIDEBAR */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="wordmark">
            Mindful <span>&</span> Living
          </div>
          <div className="sub">My Account</div>
        </div>
        <div className="sidebar-avatar">
          <div className="avatar-circle">
            {initials}
            <div className="avatar-online" />
          </div>
          <div className="avatar-info">
            <div className="name">{fullName}</div>
            <div className="tier">
              <div className="tier-dot" /> Botanical Gold
            </div>
          </div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Account</div>
          <button
            className={`nav-item ${activePage === "profile" ? "active" : ""}`}
            onClick={() => navigate("profile")}
          >
            <User size={16} className="nav-icon" /> Profile
          </button>
          <button
            className={`nav-item ${activePage === "orders" ? "active" : ""}`}
            onClick={() => navigate("orders")}
          >
            <Package size={16} className="nav-icon" /> Orders
            <span className="nav-badge">{displayOrders.length}</span>
          </button>
          <button
            className={`nav-item ${activePage === "payments" ? "active" : ""}`}
            onClick={() => navigate("payments")}
          >
            <CreditCard size={16} className="nav-icon" /> Payments
          </button>
          <button
            className={`nav-item ${activePage === "addresses" ? "active" : ""}`}
            onClick={() => navigate("addresses")}
          >
            <MapPin size={16} className="nav-icon" /> Addresses
          </button>
          <div className="nav-section-label">Activity</div>
          <button
            className={`nav-item ${activePage === "wishlist" ? "active" : ""}`}
            onClick={() => navigate("wishlist")}
          >
            <Heart size={16} className="nav-icon" /> Wishlist
          </button>
          <button
            className={`nav-item ${activePage === "reviews" ? "active" : ""}`}
            onClick={() => navigate("reviews")}
          >
            <Star size={16} className="nav-icon" /> Reviews
          </button>
          <button
            className={`nav-item ${activePage === "returns" ? "active" : ""}`}
            onClick={() => navigate("returns")}
          >
            <RefreshCcw size={16} className="nav-icon" /> Returns
          </button>
          <button
            className={`nav-item ${activePage === "support" ? "active" : ""}`}
            onClick={() => navigate("support")}
          >
            <MessageCircle size={16} className="nav-icon" /> Support
            <span className="nav-badge">1</span>
          </button>
          <div className="nav-section-label">Tools</div>
          <button
            className={`nav-item ${activePage === "bulkorder" ? "active" : ""}`}
            onClick={() => navigate("bulkorder")}
          >
            <ListOrdered size={16} className="nav-icon" /> Order by SKU
          </button>
        </div>
        <div className="sidebar-footer">
          <div className="theme-toggle">
            <span className="theme-label">
              {darkMode ? "Dark mode" : "Light mode"}
            </span>
            <button
              className={`toggle-switch ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
            />
          </div>
        </div>
      </nav>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </button>
      {sidebarOpen && (
        <div
          className="modal-overlay open"
          style={{zIndex: 140, background: "rgba(14,28,10,0.5)"}}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-breadcrumb">
            <span>My Account</span>
            <span className="sep">/</span>
            <span className="current">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </span>
          </div>
          <div className="topbar-actions">
            <button
              className="topbar-btn"
              onClick={() => showToast("Notifications coming soon", "Bell")}
            >
              <Bell size={16} />
              <div className="notif-dot" />
            </button>
            <button className="topbar-btn">
              <Settings size={16} />
            </button>
            <a
              href="/"
              className="btn btn-outline btn-sm"
              style={{textDecoration: "none"}}
            >
              <Store size={13} /> Shop
            </a>
          </div>
        </div>

        {/* ========== PROFILE PAGE (hardcoded) ========== */}
        {activePage === "profile" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                My <em>Profile</em>
              </h1>
              <p>Manage your personal information and security settings</p>
            </div>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{displayOrders.length}</div>
                <div className="stat-sub">Since June 2023</div>
                <div className="stat-icon">
                  <Package size={48} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Loyalty Points</div>
                <div
                  className="stat-value"
                  style={{color: "var(--accent-gold)"}}
                >
                  840
                </div>
                <div className="stat-sub">Expires Dec 2025</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Store Credit</div>
                <div className="stat-value">KES 350</div>
                <div className="stat-sub">Available now</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Wishlist Items</div>
                <div className="stat-value">{state.wishlist.length}</div>
                <div className="stat-sub">2 back in stock</div>
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Personal Information</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openModal("edit")}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </div>
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      marginBottom: 22,
                    }}
                  >
                    <div style={{position: "relative"}}>
                      <div
                        className="profile-avatar"
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          background: avatarPreview
                            ? `url(${avatarPreview})`
                            : "linear-gradient(135deg, var(--accent), var(--accent-light))",
                          backgroundSize: avatarPreview ? "cover" : "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          fontWeight: 500,
                          color: "white",
                          boxShadow: "0 0 0 3px var(--accent-pale)",
                        }}
                      >
                        {!avatarPreview && initials}
                      </div>
                      <label
                        htmlFor="avatarUpload"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--accent-gold)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          border: "2px solid white",
                        }}
                      >
                        <Camera size={11} color="white" />
                      </label>
                      <input
                        id="avatarUpload"
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div>
                      <div style={{fontSize: 16, fontWeight: 400}}>
                        {fullName}
                      </div>
                      <div style={{fontSize: 11, color: "var(--text-muted)"}}>
                        {state.user.email}
                      </div>
                      <div style={{marginTop: 6}}>
                        <span
                          className="badge badge-delivered"
                          style={{fontSize: 8}}
                        >
                          ✦ Botanical Gold Member
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div className="field-label">Gender</div>
                      <div>{state.user.gender}</div>
                    </div>
                    <div>
                      <div className="field-label">Date of Birth</div>
                      <div>{dobFormatted}</div>
                    </div>
                    <div>
                      <div className="field-label">Member Since</div>
                      <div>June 2023</div>
                    </div>
                    <div>
                      <div className="field-label">Account Type</div>
                      <div>{b2bChecked ? "Business" : "Personal"}</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={b2bChecked}
                      onChange={(e) => setB2bChecked(e.target.checked)}
                      style={{accentColor: "var(--accent)"}}
                    />{" "}
                    Business account (B2B)
                  </label>
                  {b2bChecked && (
                    <div style={{marginTop: 16}}>
                      <div className="field-group">
                        <label className="field-label">Company Name</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. Njoroge Organics Ltd"
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">KRA PIN / Tax ID</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. P051234567A"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Contact Methods</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openModal("addContact")}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="card-body" style={{padding: 0}}>
                  {state.contacts.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 28px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--accent-pale)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent)",
                        }}
                      >
                        {c.type === "email" ? (
                          <Mail size={14} />
                        ) : (
                          <Phone size={14} />
                        )}
                      </div>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 13}}>{c.value}</div>
                        <div style={{fontSize: 10, color: "var(--text-muted)"}}>
                          {c.billing && (
                            <span style={{color: "var(--accent)"}}>
                              Billing{" "}
                            </span>
                          )}
                          {c.shipping && (
                            <span style={{color: "var(--accent-gold)"}}>
                              Shipping{" "}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => deleteContact(c.id)}
                      >
                        <Trash2 size={12} color="#c0392b" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Security Settings</span>
              </div>
              <div className="card-body">
                <div className="security-grid">
                  <div
                    style={{
                      padding: 18,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      textAlign: "center",
                    }}
                  >
                    <Lock
                      size={24}
                      style={{color: "var(--accent)", marginBottom: 10}}
                    />
                    <div style={{fontSize: 13, marginBottom: 4}}>Password</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 14,
                      }}
                    >
                      Last changed 90 days ago
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openModal("password")}
                    >
                      Change Password
                    </button>
                  </div>
                  <div
                    style={{
                      padding: 18,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      textAlign: "center",
                    }}
                  >
                    <Shield
                      size={24}
                      style={{color: "var(--accent-gold)", marginBottom: 10}}
                    />
                    <div style={{fontSize: 13, marginBottom: 4}}>
                      Two-Factor Auth
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 14,
                      }}
                    >
                      Not enabled
                    </div>
                    <button
                      className="btn btn-gold btn-sm"
                      onClick={() => openModal("twoFA")}
                    >
                      Enable 2FA
                    </button>
                  </div>
                  <div
                    style={{
                      padding: 18,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      size={24}
                      style={{color: "var(--text-secondary)", marginBottom: 10}}
                    />
                    <div style={{fontSize: 13, marginBottom: 4}}>
                      Social Logins
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 14,
                      }}
                    >
                      Google · Apple
                    </div>
                    <button className="btn btn-outline btn-sm">Manage</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ORDERS PAGE (real orders) ========== */}
        {activePage === "orders" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Order <em>History</em>
              </h1>
              <p>
                Track, reorder, and download invoices for all your purchases
              </p>
            </div>
            {ordersLoading ? (
              <div>
                <div
                  className="skeleton"
                  style={{height: 60, marginBottom: 8}}
                />
                <div
                  className="skeleton"
                  style={{height: 60, marginBottom: 8}}
                />
                <div
                  className="skeleton"
                  style={{height: 60, marginBottom: 8}}
                />
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">All Orders</span>
                  <select
                    className="field-input"
                    style={{width: "auto", padding: "7px 12px"}}
                  >
                    <option>All statuses</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOrders.length ? (
                        displayOrders.map((o) => (
                          <tr key={o.id}>
                            <td>
                              <strong>{o.id}</strong>
                            </td>
                            <td>{o.date}</td>
                            <td
                              style={{
                                maxWidth: 180,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {o.items}
                            </td>
                            <td>
                              <strong>{o.total}</strong>
                            </td>
                            <td>
                              <span
                                className={`badge ${STATUS_CLASS[o.status] || "badge-shipped"}`}
                              >
                                <span className="badge-dot" />
                                {o.status}
                              </span>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => openOrderDetail(o)}
                                >
                                  View
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => reorder()}
                                >
                                  Reorder
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => downloadInvoice(o.id)}
                                >
                                  Invoice
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{textAlign: "center", padding: 40}}
                          >
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== PAYMENTS PAGE (hardcoded) ========== */}
        {activePage === "payments" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Payments & <em>Credits</em>
              </h1>
              <p>
                Manage your payment methods, store credits and loyalty points
              </p>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Saved Payment Methods</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      showToast("Card vault opening soon", "CreditCard")
                    }
                  >
                    <Plus size={12} /> Add Card
                  </button>
                </div>
                <div
                  className="card-body"
                  style={{display: "flex", flexDirection: "column", gap: 10}}
                >
                  {state.payments.map((p) => (
                    <div
                      key={p.id}
                      className={`payment-card ${p.isDefault ? "default" : ""}`}
                      onClick={() => setDefaultPayment(p.id)}
                    >
                      <div className="card-chip">
                        {CARD_ICONS[p.type] || "💳"}
                      </div>
                      <div style={{flex: 1}}>
                        <div className="card-mask">
                          {p.type} •••• {p.last4}
                        </div>
                        <div className="card-expiry">Expires {p.expiry}</div>
                      </div>
                      {p.isDefault && (
                        <span
                          className="badge badge-delivered"
                          style={{fontSize: 8}}
                        >
                          Default
                        </span>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePayment(p.id);
                        }}
                      >
                        <Trash2 size={12} color="#c0392b" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      Store Credits & Gift Cards
                    </span>
                  </div>
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 18,
                      }}
                    >
                      <div>
                        <div className="stat-label">Available Balance</div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 30,
                            fontWeight: 300,
                            color: "var(--accent)",
                            marginTop: 6,
                          }}
                        >
                          KES 350
                        </div>
                      </div>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "var(--radius)",
                          background: "rgba(74,140,42,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Wallet size={24} style={{color: "var(--accent)"}} />
                      </div>
                    </div>
                    <div style={{display: "flex", gap: 10}}>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="Enter gift card code"
                        id="giftCodeInput"
                        style={{flex: 1}}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={redeemGiftCard}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Loyalty Points</span>
                  </div>
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div className="stat-label">Current Points</div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 30,
                            fontWeight: 300,
                            color: "var(--accent-gold)",
                            marginTop: 4,
                          }}
                        >
                          840 pts
                        </div>
                      </div>
                      <Zap
                        size={28}
                        style={{color: "var(--accent-gold)", opacity: 0.7}}
                      />
                    </div>
                    <div className="points-bar">
                      <div className="points-fill" style={{width: "84%"}} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      <span>840 / 1000 to Emerald tier</span>
                      <span>Expires Dec 2025</span>
                    </div>
                    <div className="divider" />
                    <div style={{fontSize: 12, color: "var(--text-muted)"}}>
                      Redeem 100 points ={" "}
                      <strong style={{color: "var(--accent)"}}>
                        KES 50 discount
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ADDRESSES PAGE (read‑only, from orders) ========== */}
        {activePage === "addresses" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Address <em>Book</em>
              </h1>
              <p>Your shipping addresses from past orders (read‑only)</p>
            </div>
            {addressesLoading ? (
              <div
                className="skeleton"
                style={{height: 120, marginBottom: 20}}
              />
            ) : backendAddresses.length === 0 ? (
              <div className="card">
                <div
                  className="card-body"
                  style={{textAlign: "center", padding: 40}}
                >
                  No addresses found. Addresses will appear here after you place
                  an order.
                </div>
              </div>
            ) : (
              <div className="grid-2" style={{marginBottom: 20}}>
                {backendAddresses.map((addr, idx) => (
                  <div
                    key={addr.id || idx}
                    className="address-card"
                    style={{cursor: "default"}}
                  >
                    <div className="address-name">{addr.name}</div>
                    <div className="address-line">
                      {addr.line1}
                      <br />
                      {addr.line2 && (
                        <>
                          {addr.line2}
                          <br />
                        </>
                      )}
                      {addr.city}, {addr.county}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      {addr.phone}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        marginTop: 8,
                      }}
                    >
                      {addr.type || "shipping"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Communication preferences and shipping methods (unchanged) */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Communication Preferences</span>
              </div>
              <div className="card-body">
                {[
                  "marketingEmail",
                  "marketingSMS",
                  "orderEmail",
                  "orderSMS",
                ].map((key) => (
                  <div key={key} className="pref-row">
                    <div className="pref-text">
                      <div className="label">
                        {key === "marketingEmail"
                          ? "Marketing Emails"
                          : key === "marketingSMS"
                            ? "Marketing SMS"
                            : key === "orderEmail"
                              ? "Order Updates (Email)"
                              : "Order Updates (SMS)"}
                      </div>
                      <div className="sub">
                        {key.includes("Email")
                          ? "Shipping, delivery confirmations"
                          : key.includes("SMS")
                            ? "Real-time order tracking via SMS"
                            : "Promotions, launches and exclusive offers"}
                      </div>
                    </div>
                    <button
                      className={`pref-switch ${state.prefs[key] ? "on" : ""}`}
                      onClick={() => togglePref(key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{marginTop: 20}}>
              <div className="card-header">
                <span className="card-title">Default Shipping Method</span>
              </div>
              <div className="card-body">
                <div
                  style={{display: "flex", flexDirection: "column", gap: 10}}
                >
                  {[
                    {
                      id: "standard",
                      label: "Standard Delivery",
                      sub: "3–5 business days · Free over KES 3,000",
                    },
                    {
                      id: "express",
                      label: "Express Delivery",
                      sub: "1–2 business days · KES 350",
                    },
                    {
                      id: "overnight",
                      label: "Overnight Delivery",
                      sub: "Next day by 10 AM · KES 800",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 14,
                        border: `1px solid ${state.prefs.shippingMethod === m.id ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        background:
                          state.prefs.shippingMethod === m.id
                            ? "rgba(74,140,42,0.04)"
                            : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="shipMethod"
                        value={m.id}
                        checked={state.prefs.shippingMethod === m.id}
                        onChange={() => setShippingMethod(m.id)}
                        style={{accentColor: "var(--accent)"}}
                      />
                      <div>
                        <div style={{fontSize: 13}}>{m.label}</div>
                        <div style={{fontSize: 11, color: "var(--text-muted)"}}>
                          {m.sub}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== WISHLIST PAGE (hardcoded) ========== */}
        {activePage === "wishlist" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                My <em>Wishlist</em>
              </h1>
              <p>Saved products you love</p>
            </div>
            <div className="grid-3">
              {state.wishlist.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-img">
                    <span style={{fontSize: 52}}>{p.emoji}</span>
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">{p.price}</div>
                    <div style={{display: "flex", gap: 6}}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{flex: 1, justifyContent: "center"}}
                        onClick={() => moveToCart()}
                      >
                        <ShoppingBag size={12} /> Add to Cart
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeWishlist(p.id)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== REVIEWS PAGE (hardcoded) ========== */}
        {activePage === "reviews" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                My <em>Reviews</em>
              </h1>
              <p>Your product reviews and ratings</p>
            </div>
            <div className="card">
              <div className="card-body" style={{padding: 0}}>
                {state.reviews.map((r) => (
                  <div
                    key={r.product}
                    style={{
                      padding: "22px 28px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "var(--accent)",
                          }}
                        >
                          {r.product}
                        </div>
                        <div className="stars" style={{marginTop: 6}}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span
                              key={i}
                              className={`star ${i <= r.rating ? "" : "empty"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span style={{fontSize: 11, color: "var(--text-muted)"}}>
                        {r.date}
                      </span>
                    </div>
                    <p
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== RETURNS PAGE (hardcoded) ========== */}
        {activePage === "returns" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Returns & <em>Cancellations</em>
              </h1>
              <p>Request a return or cancellation for an order</p>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">New Return Request</span>
                </div>
                <div className="card-body">
                  <div className="field-group">
                    <label className="field-label">Select Order</label>
                    <select className="field-input">
                      <option>ORD-2024-001 — Moringa Serum Bundle</option>
                      <option>ORD-2024-002 — Cold Press Face Oil</option>
                      <option>ORD-2023-009 — Baobab Cream</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Reason for Return</label>
                    <select className="field-input">
                      <option>Wrong item received</option>
                      <option>Damaged / defective product</option>
                      <option>Changed my mind</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Additional Details</label>
                    <textarea
                      className="field-input"
                      rows="4"
                      placeholder="Describe the issue in detail..."
                    ></textarea>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Preferred Resolution</label>
                    <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="resolution"
                          value="refund"
                          defaultChecked
                          style={{accentColor: "var(--accent)"}}
                        />{" "}
                        Full Refund
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="resolution"
                          value="exchange"
                          style={{accentColor: "var(--accent)"}}
                        />{" "}
                        Exchange
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="resolution"
                          value="credit"
                          style={{accentColor: "var(--accent)"}}
                        />{" "}
                        Store Credit
                      </label>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={submitReturn}>
                    <Send size={14} /> Submit Request
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Return Policy</span>
                </div>
                <div
                  className="card-body"
                  style={{
                    fontSize: 13,
                    lineHeight: 1.9,
                    color: "var(--text-secondary)",
                  }}
                >
                  <p style={{marginBottom: 12}}>
                    We accept returns within <strong>30 days</strong> of
                    delivery for unopened products in original packaging.
                  </p>
                  <p style={{marginBottom: 12}}>
                    Opened products may be eligible for exchange or store credit
                    if reported within <strong>7 days</strong> of delivery.
                  </p>
                  <p style={{marginBottom: 12}}>
                    Refunds are processed within{" "}
                    <strong>5-7 business days</strong> to your original payment
                    method.
                  </p>
                  <div className="divider" />
                  <p style={{fontSize: 11}}>
                    For urgent issues, contact us at{" "}
                    <span style={{color: "var(--accent)"}}>
                      returns@mindfullivingke.com
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== SUPPORT PAGE (hardcoded) ========== */}
        {activePage === "support" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Support <em>Tickets</em>
              </h1>
              <p>Track your open and resolved support cases</p>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">My Tickets</span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    showToast("Support portal opening soon", "MessageCircle")
                  }
                >
                  <Plus size={12} /> New Ticket
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Last Reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.tickets.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <strong>{t.id}</strong>
                        </td>
                        <td>{t.subject}</td>
                        <td>{t.date}</td>
                        <td>
                          <span
                            className={`badge badge-${t.status.toLowerCase()}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td>{t.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========== BULK ORDER PAGE (hardcoded) ========== */}
        {activePage === "bulkorder" && (
          <div className="page-content active">
            <div className="page-header">
              <h1>
                Order by <em>SKU</em>
              </h1>
              <p>
                Paste SKUs for fast bulk ordering — ideal for business customers
              </p>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">SKU Input</span>
                </div>
                <div className="card-body">
                  <div className="field-group">
                    <label className="field-label">
                      Enter SKUs (one per line)
                    </label>
                    <textarea
                      className="field-input"
                      rows="10"
                      id="skuInput"
                      placeholder="MLK-MORINGA-30ML&#10;MLK-BAOBAB-CREAM-50G&#10;MLK-FACEOIL-15ML"
                    ></textarea>
                  </div>
                  <div style={{display: "flex", gap: 10}}>
                    <button className="btn btn-primary" onClick={parseSKUs}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        (document.getElementById("skuInput").value = "")
                      }
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">SKU Reference</span>
                </div>
                <div className="card-body">
                  <table style={{fontSize: 12}}>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Product</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>MLK-MORINGA-30ML</td>
                        <td>Moringa Serum 30ml</td>
                        <td>KES 2,400</td>
                      </tr>
                      <tr>
                        <td>MLK-BAOBAB-CREAM-50G</td>
                        <td>Baobab Cream 50g</td>
                        <td>KES 1,800</td>
                      </tr>
                      <tr>
                        <td>MLK-FACEOIL-15ML</td>
                        <td>Cold Press Face Oil</td>
                        <td>KES 3,200</td>
                      </tr>
                      <tr>
                        <td>MLK-BUNDLE-01</td>
                        <td>Starter Bundle</td>
                        <td>KES 5,800</td>
                      </tr>
                      <tr>
                        <td>MLK-MIST-100ML</td>
                        <td>Botanical Mist 100ml</td>
                        <td>KES 1,400</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.icon === "CheckCircle" && (
              <CheckCircle size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "AlertCircle" && (
              <AlertCircle size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "Camera" && (
              <Camera size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "Trash2" && (
              <Trash2 size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "Bell" && (
              <Bell size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "Gift" && (
              <Gift size={20} style={{color: "var(--accent-light)"}} />
            )}
            {t.icon === "ShoppingBag" && (
              <ShoppingBag size={20} style={{color: "var(--accent-light)"}} />
            )}
            {![
              "CheckCircle",
              "AlertCircle",
              "Camera",
              "Trash2",
              "Bell",
              "Gift",
              "ShoppingBag",
            ].includes(t.icon) && (
              <CheckCircle size={20} style={{color: "var(--accent-light)"}} />
            )}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* MODALS */}

      {/* Edit Profile Modal */}
      <div
        className={`modal-overlay ${modals.edit ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal("edit");
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Edit Profile</h2>
            <button className="modal-close" onClick={() => closeModal("edit")}>
              <X size={15} />
            </button>
          </div>
          <div className="modal-body">
            <div className="grid-2">
              <div className="field-group">
                <label className="field-label">First Name</label>
                <input
                  type="text"
                  className="field-input"
                  id="editFirstName"
                  defaultValue={state.user.firstName}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Last Name</label>
                <input
                  type="text"
                  className="field-input"
                  id="editLastName"
                  defaultValue={state.user.lastName}
                />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                id="editEmail"
                defaultValue={state.user.email}
              />
            </div>
            <div className="grid-2">
              <div className="field-group">
                <label className="field-label">Gender</label>
                <select
                  className="field-input"
                  id="editGender"
                  defaultValue={state.user.gender}
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Date of Birth</label>
                <input
                  type="date"
                  className="field-input"
                  id="editDob"
                  defaultValue={state.user.dob}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => closeModal("edit")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <div
        className={`modal-overlay ${modals.password ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal("password");
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Change Password</h2>
            <button
              className="modal-close"
              onClick={() => closeModal("password")}
            >
              <X size={15} />
            </button>
          </div>
          <div className="modal-body">
            <div className="field-group">
              <label className="field-label">Current Password</label>
              <input
                type="password"
                className="field-input"
                id="curPwd"
                placeholder="••••••••"
              />
            </div>
            <div className="field-group">
              <label className="field-label">New Password</label>
              <input
                type="password"
                className="field-input"
                id="newPwd"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Confirm New Password</label>
              <input
                type="password"
                className="field-input"
                id="confPwd"
                placeholder="Repeat new password"
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => closeModal("password")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={changePassword}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      <div
        className={`modal-overlay ${modals.twoFA ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal("twoFA");
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Enable Two-Factor Auth</h2>
            <button className="modal-close" onClick={() => closeModal("twoFA")}>
              <X size={15} />
            </button>
          </div>
          <div className="modal-body" style={{textAlign: "center"}}>
            <div
              style={{
                width: 160,
                height: 160,
                margin: "0 auto 20px",
                border: "2px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 10 10"
                style={{imageRendering: "pixelated"}}
              >
                <rect width="10" height="10" fill="white" />
                <rect x="0" y="0" width="4" height="4" fill="#14280F" />
                <rect x="1" y="1" width="2" height="2" fill="white" />
                <rect x="1.5" y="1.5" width="1" height="1" fill="#14280F" />
                <rect x="6" y="0" width="4" height="4" fill="#14280F" />
                <rect x="7" y="1" width="2" height="2" fill="white" />
                <rect x="7.5" y="1.5" width="1" height="1" fill="#14280F" />
                <rect x="0" y="6" width="4" height="4" fill="#14280F" />
                <rect x="1" y="7" width="2" height="2" fill="white" />
                <rect x="1.5" y="7.5" width="1" height="1" fill="#14280F" />
                <rect x="4" y="4" width="1" height="1" fill="#14280F" />
                <rect x="6" y="5" width="1" height="1" fill="#14280F" />
                <rect x="8" y="6" width="1" height="1" fill="#14280F" />
                <rect x="5" y="7" width="1" height="1" fill="#14280F" />
                <rect x="7" y="8" width="2" height="1" fill="#14280F" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 18,
              }}
            >
              Scan this QR code with your authenticator app, then enter the
              6-digit code below.
            </p>
            <div className="field-group">
              <label className="field-label">Verification Code</label>
              <input
                type="text"
                className="field-input"
                placeholder="000000"
                maxLength="6"
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  letterSpacing: "0.4em",
                }}
              />
            </div>
            <button
              className="btn btn-gold"
              style={{width: "100%", justifyContent: "center"}}
              onClick={enable2FA}
            >
              <Shield size={14} /> Activate 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <div
        className={`modal-overlay ${modals.order ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal("order");
        }}
      >
        <div className="modal" style={{maxWidth: 680}}>
          <div className="modal-header">
            <h2>{selectedOrder?.id || "Order Details"}</h2>
            <button className="modal-close" onClick={() => closeModal("order")}>
              <X size={15} />
            </button>
          </div>
          <div className="modal-body">
            {selectedOrder && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Payment Method
                    </div>
                    <div style={{fontSize: 13, fontWeight: 500}}>
                      {selectedOrder.paymentMethod || "N/A"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 8,
                      }}
                    >
                      Payment Status
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color:
                          selectedOrder.paymentStatus === "paid"
                            ? "var(--accent)"
                            : "var(--accent-gold)",
                      }}
                    >
                      {selectedOrder.paymentStatus === "paid"
                        ? "✓ Paid"
                        : "Pending"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      Tracking Number
                    </div>
                    <div style={{fontSize: 13}}>{selectedOrder.tracking}</div>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: 16,
                      background: "var(--accent-pale)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: 8,
                      }}
                    >
                      Shipping Address
                    </div>
                    <div style={{fontSize: 13, lineHeight: 1.5}}>
                      {selectedOrder.shippingAddress.name}
                      <br />
                      {selectedOrder.shippingAddress.line1}
                      <br />
                      {selectedOrder.shippingAddress.line2 && (
                        <>
                          {selectedOrder.shippingAddress.line2}
                          <br />
                        </>
                      )}
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.county}
                      <br />
                      {selectedOrder.shippingAddress.phone}
                    </div>
                  </div>
                )}

                <div style={{marginBottom: 24}}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                    }}
                  >
                    Delivery Status
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                    }}
                  >
                    {TRACK_STEPS.map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="track-step">
                          <div
                            className={`track-node ${
                              i < selectedOrder.trackStep
                                ? "done"
                                : i === selectedOrder.trackStep
                                  ? "active"
                                  : "pending"
                            }`}
                          >
                            {i < selectedOrder.trackStep ? "✓" : i + 1}
                          </div>
                          <div
                            className={`track-label ${
                              i < selectedOrder.trackStep ? "done" : ""
                            }`}
                          >
                            {s}
                          </div>
                        </div>
                        {i < TRACK_STEPS.length - 1 && (
                          <div
                            className={`track-line ${
                              i < selectedOrder.trackStep ? "done" : ""
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom: 20}}>
                  {selectedOrder.lines.map((l) => (
                    <div
                      key={l.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid var(--border)",
                        fontSize: 13,
                      }}
                    >
                      <div>
                        {l.name}{" "}
                        <span style={{color: "var(--text-muted)"}}>
                          × {l.qty}
                        </span>
                      </div>
                      <div>{l.price}</div>
                    </div>
                  ))}
                </div>

                <div
                  style={{display: "flex", justifyContent: "flex-end", gap: 8}}
                >
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => reorder()}
                  >
                    <ShoppingBag size={12} /> Reorder
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => downloadInvoice(selectedOrder.id)}
                  >
                    <FileText size={12} /> PDF Invoice
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal – removed (no write) */}
      {/* Add Contact Modal */}
      <div
        className={`modal-overlay ${modals.addContact ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal("addContact");
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Add Contact Method</h2>
            <button
              className="modal-close"
              onClick={() => closeModal("addContact")}
            >
              <X size={15} />
            </button>
          </div>
          <div className="modal-body">
            <div className="field-group">
              <label className="field-label">Type</label>
              <select className="field-input" id="contactType">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Value</label>
              <input
                type="text"
                className="field-input"
                id="contactValue"
                placeholder="Enter email or phone"
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => closeModal("addContact")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveContact}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
