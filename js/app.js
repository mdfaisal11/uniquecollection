// =====================================================================
// UniqueCollection - Main Application Logic
// WhatsApp: +977 9708425276 | Email: mdfaisal2202@gmail.com
// Full Customer Auth, Admin Portal, Order Tracking, Reviews & Drag-and-Drop
// =====================================================================

// LocalStorage Keys
var STORAGE_KEY_PRODUCTS = "uniquecollection_products_v3";
var STORAGE_KEY_CART = "uniquecollection_cart_v3";
var STORAGE_KEY_WISHLIST = "uniquecollection_wishlist_v3";
var STORAGE_KEY_USERS = "uniquecollection_users_v3";
var STORAGE_KEY_ORDERS = "uniquecollection_orders_v3";
var STORAGE_KEY_REVIEWS = "uniquecollection_reviews_v3";
var STORAGE_KEY_CURRENT_USER = "uniquecollection_current_user_v3";
var STORAGE_KEY_ADMIN_SESSION = "uniquecollection_admin_session_v3";

// State
var products = [];
var cart = [];
var wishlist = [];
var users = [];
var orders = [];
var reviews = {};
var currentUser = null;
var isAdminAuthenticated = false;

var selectedCategory = "all";
var searchQuery = "";
var sortOption = "featured";
var currentMaxPriceFilter = 10000;
var appliedDiscountCode = "";
var discountPercent = 0;
var currentQuickViewProductId = null;
var reviewSelectedRating = 5;

// Initialize Store
document.addEventListener("DOMContentLoaded", () => {
  loadStoreData();
  renderCategories();
  renderProducts();
  renderCart();
  renderWishlist();
  updateAuthUI();
  setupEventListeners();
  setupGlobalDragAndDrop();
  renderFAQ();
  renderTestimonials();
  updateCategoryCounts();
  showToast("Welcome to UniqueCollection! 🌟 Explore luxury fashion & timepieces.", "info");
});

// Load Data from LocalStorage or Defaults
function loadStoreData() {
  try {
    const rawProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (rawProducts) {
      const parsed = JSON.parse(rawProducts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed;
      } else {
        products = [...(window.DEFAULT_PRODUCTS || DEFAULT_PRODUCTS)];
        saveProductsToStorage();
      }
    } else {
      products = [...(window.DEFAULT_PRODUCTS || DEFAULT_PRODUCTS)];
      saveProductsToStorage();
    }

    // Cart
    const savedCart = localStorage.getItem(STORAGE_KEY_CART);
    cart = savedCart ? JSON.parse(savedCart) : [];

    // Wishlist
    const savedWishlist = localStorage.getItem(STORAGE_KEY_WISHLIST);
    wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    // Users
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    users = savedUsers ? JSON.parse(savedUsers) : [...(window.DEFAULT_USERS || DEFAULT_USERS)];
    if (!savedUsers) saveUsersToStorage();

    // Orders
    const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    orders = savedOrders ? JSON.parse(savedOrders) : [...(window.DEFAULT_ORDERS || DEFAULT_ORDERS)];
    if (!savedOrders) saveOrdersToStorage();

    // Reviews
    const savedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
    reviews = savedReviews ? JSON.parse(savedReviews) : { ...(window.DEFAULT_REVIEWS || DEFAULT_REVIEWS) };
    if (!savedReviews) saveReviewsToStorage();

    // Current User & Admin Session
    const savedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (savedUser) currentUser = JSON.parse(savedUser);

    const savedAdminSession = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    isAdminAuthenticated = savedAdminSession === "true";

  } catch (e) {
    console.error("Error loading localStorage data", e);
    products = [...(window.DEFAULT_PRODUCTS || DEFAULT_PRODUCTS)];
    users = [...(window.DEFAULT_USERS || DEFAULT_USERS)];
    orders = [...(window.DEFAULT_ORDERS || DEFAULT_ORDERS)];
    reviews = { ...(window.DEFAULT_REVIEWS || DEFAULT_REVIEWS) };
  }
}

// Storage Savers
function saveProductsToStorage() {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  updateCategoryCounts();
}

function saveCartToStorage() {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  updateCartBadges();
}

function saveWishlistToStorage() {
  localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  updateWishlistBadges();
}

function saveUsersToStorage() {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function saveOrdersToStorage() {
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

function saveReviewsToStorage() {
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
}

// ---------------------------------------------------------------------
// Customer Authentication & Navigation UI
// ---------------------------------------------------------------------

function updateAuthUI() {
  const userBtn = document.getElementById("navUserBtn");
  const adminBtn = document.getElementById("navAdminBtn");
  const adminBadge = document.getElementById("adminStatusBanner");

  if (userBtn) {
    if (currentUser && currentUser.role === 'client') {
      userBtn.innerHTML = `
        <div class="flex items-center gap-2 text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-all shadow-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="truncate max-w-[110px]">Hi, ${currentUser.name.split(' ')[0]}</span>
        </div>
      `;
      userBtn.onclick = openClientPortal;
    } else {
      userBtn.innerHTML = `
        <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all shadow-sm">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span>Customer Sign In</span>
        </div>
      `;
      userBtn.onclick = () => openAuthModal('login');
    }
  }

  if (adminBtn) {
    if (isAdminAuthenticated) {
      adminBtn.className = "px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md flex items-center gap-1.5";
      adminBtn.innerHTML = `
        <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span>Admin Studio</span>
      `;
      adminBtn.onclick = openAdminDashboard;
    } else {
      adminBtn.className = "px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5 border border-slate-700";
      adminBtn.innerHTML = `
        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <span>Admin Login</span>
      `;
      adminBtn.onclick = () => openAuthModal('admin');
    }
  }

  if (adminBadge) {
    if (isAdminAuthenticated) {
      adminBadge.classList.remove("hidden");
    } else {
      adminBadge.classList.add("hidden");
    }
  }
}

function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  openModal('authModal');
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById("authTabLogin");
  const registerTab = document.getElementById("authTabRegister");
  const adminTab = document.getElementById("authTabAdmin");

  const loginForm = document.getElementById("authFormLogin");
  const registerForm = document.getElementById("authFormRegister");
  const adminForm = document.getElementById("authFormAdmin");

  [loginTab, registerTab, adminTab].forEach(b => {
    if (b) {
      b.classList.remove("border-amber-500", "text-amber-600", "font-bold");
      b.classList.add("border-transparent", "text-slate-500");
    }
  });

  [loginForm, registerForm, adminForm].forEach(f => {
    if (f) f.classList.add("hidden");
  });

  if (tab === 'login') {
    if (loginTab) loginTab.classList.add("border-amber-500", "text-amber-600", "font-bold");
    if (loginForm) loginForm.classList.remove("hidden");
  } else if (tab === 'register') {
    if (registerTab) registerTab.classList.add("border-amber-500", "text-amber-600", "font-bold");
    if (registerForm) registerForm.classList.remove("hidden");
  } else if (tab === 'admin') {
    if (adminTab) adminTab.classList.add("border-amber-500", "text-amber-600", "font-bold");
    if (adminForm) adminForm.classList.remove("hidden");
  }
}

// Client Login Handler
function handleClientLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const user = users.find(u => u.email.toLowerCase() === email && u.password === password && u.role === 'client');

  if (user) {
    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'client'
    };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('authModal');
    showToast(`Welcome back, ${user.name}! You can now order directly. 🌟`, "success");
    e.target.reset();
  } else {
    showToast("Invalid customer email or password. Please check your credentials.", "error");
  }
}

// Client Registration Handler
function handleClientRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  if (users.some(u => u.email.toLowerCase() === email)) {
    showToast("An account with this email already exists. Please sign in.", "error");
    return;
  }

  const newUser = {
    id: "user-" + Date.now(),
    name,
    email,
    phone: phone || "+977",
    role: "client",
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsersToStorage();

  currentUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: "client"
  };
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));

  updateAuthUI();
  closeModal('authModal');
  showToast(`Account created successfully! Welcome to UniqueCollection, ${name}! 🎉`, "success");
  e.target.reset();
}

// 1-Click Quick Fill for Admin Login
function quickAdminLoginFill() {
  const emailInput = document.getElementById("adminEmail");
  const passInput = document.getElementById("adminPassword");
  if (emailInput) emailInput.value = "admin";
  if (passInput) passInput.value = "admin123";
  showToast("Admin credentials filled! Click 'Unlock Admin Studio' below.", "info");
}

// Admin Login Handler
function handleAdminLogin(e) {
  e.preventDefault();
  const emailOrUser = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("adminPassword").value;

  const admin = users.find(u => 
    u.role === 'admin' && 
    (u.email.toLowerCase() === emailOrUser || emailOrUser === 'admin') && 
    u.password === password
  );

  if (admin) {
    isAdminAuthenticated = true;
    localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, "true");
    currentUser = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: 'admin'
    };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    updateAuthUI();
    renderProducts();
    closeModal('authModal');
    showToast("🔒 Admin Authenticated! Opening Management Studio...", "success");
    e.target.reset();
    setTimeout(openAdminDashboard, 300);
  } else {
    showToast("Access Denied: Incorrect Admin Credentials. (Default: admin / admin123)", "error");
  }
}

// User Logout
function handleUserLogout() {
  currentUser = null;
  isAdminAuthenticated = false;
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
  updateAuthUI();
  renderProducts();
  closeModal('clientPortalModal');
  closeModal('adminDashboardModal');
  showToast("You have been signed out.", "info");
}

// ---------------------------------------------------------------------
// Client Portal (My Orders, Profile & Saved Items)
// ---------------------------------------------------------------------

function openClientPortal() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }

  const modal = document.getElementById("clientPortalModal");
  const nameEl = document.getElementById("clientPortalName");
  const emailEl = document.getElementById("clientPortalEmail");
  const phoneEl = document.getElementById("clientPortalPhone");
  const ordersListEl = document.getElementById("clientOrdersList");

  if (nameEl) nameEl.textContent = currentUser.name;
  if (emailEl) emailEl.textContent = currentUser.email;
  if (phoneEl) phoneEl.textContent = currentUser.phone || "+977 9708425276";

  const clientOrders = orders.filter(o => 
    (o.customer && (
      (o.customer.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) || 
      (o.customer.phone && o.customer.phone === currentUser.phone)
    ))
  );

  if (ordersListEl) {
    if (clientOrders.length === 0) {
      ordersListEl.innerHTML = `
        <div class="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 p-6">
          <div class="text-3xl mb-2">📦</div>
          <p class="font-bold text-slate-800 text-sm">No orders placed yet</p>
          <p class="text-xs text-slate-400 mt-1">Explore our clothes, watches, sunglasses and footwear!</p>
          <button onclick="closeModal('clientPortalModal'); setCategory('all');" class="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
            Explore Collection
          </button>
        </div>
      `;
    } else {
      ordersListEl.innerHTML = clientOrders.map(order => `
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span class="text-xs font-extrabold text-amber-600">Order #${order.orderId}</span>
              <span class="text-[11px] text-slate-400 block">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase ${
              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'Confirmed' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-700'
            }">
              ● ${order.status}
            </span>
          </div>

          <div class="space-y-2">
            ${order.items.map(item => `
              <div class="flex items-center gap-3 text-xs">
                <img src="${item.image}" alt="${item.title}" class="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-900 truncate">${item.title}</p>
                  <p class="text-slate-400 text-[11px]">Qty: ${item.quantity} × ${CURRENCY_SYMBOL}${item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span class="text-slate-500">Total: <strong class="text-slate-900 font-extrabold">${CURRENCY_SYMBOL}${order.totalAmount.toLocaleString('en-IN')}</strong> (${order.paymentMethod})</span>
            <button 
              onclick="trackSpecificOrder('${order.orderId}')"
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px]"
            >
              Track Order
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

// ---------------------------------------------------------------------
// Order Tracking System
// ---------------------------------------------------------------------

function openOrderTrackerModal() {
  openModal('orderTrackerModal');
  const searchInput = document.getElementById("orderTrackerSearchInput");
  if (searchInput) searchInput.value = "";
  const resultContainer = document.getElementById("orderTrackerResult");
  if (resultContainer) resultContainer.innerHTML = "";
}

function handleSearchOrderTracking() {
  const query = document.getElementById("orderTrackerSearchInput")?.value.trim().toUpperCase();
  const resultContainer = document.getElementById("orderTrackerResult");
  if (!resultContainer) return;

  if (!query) {
    showToast("Please enter an Order ID or Phone Number", "error");
    return;
  }

  const foundOrder = orders.find(o => 
    o.orderId.toUpperCase() === query || 
    (o.customer && o.customer.phone && o.customer.phone.includes(query))
  );

  if (!foundOrder) {
    resultContainer.innerHTML = `
      <div class="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        <p class="text-2xl mb-1">🔍</p>
        <p class="font-bold text-slate-800">Order not found</p>
        <p class="mt-0.5">Please check your Order ID (e.g. UC-849201) or WhatsApp us at +977 9708425276 for assistance.</p>
      </div>
    `;
    return;
  }

  renderOrderTrackingCard(foundOrder, resultContainer);
}

function trackSpecificOrder(orderId) {
  closeModal('clientPortalModal');
  openModal('orderTrackerModal');
  const found = orders.find(o => o.orderId === orderId);
  const resultContainer = document.getElementById("orderTrackerResult");
  if (found && resultContainer) {
    renderOrderTrackingCard(found, resultContainer);
  }
}

function renderOrderTrackingCard(order, container) {
  const statusLevels = {
    'Pending': 1,
    'Confirmed': 2,
    'Shipped': 3,
    'Delivered': 4
  };
  const currentLevel = statusLevels[order.status] || 1;

  container.innerHTML = `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-xs font-bold text-slate-400">Order Reference</span>
          <h4 class="text-base font-extrabold text-slate-900">${order.orderId}</h4>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-slate-400">Status</span>
          <p class="text-xs font-black uppercase text-amber-600">${order.status}</p>
        </div>
      </div>

      <div class="py-2">
        <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
          <span class="${currentLevel >= 1 ? 'text-emerald-600' : 'text-slate-400'}">1. Placed</span>
          <span class="${currentLevel >= 2 ? 'text-emerald-600' : 'text-slate-400'}">2. Confirmed</span>
          <span class="${currentLevel >= 3 ? 'text-emerald-600' : 'text-slate-400'}">3. Shipped</span>
          <span class="${currentLevel >= 4 ? 'text-emerald-600' : 'text-slate-400'}">4. Delivered</span>
        </div>
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div class="bg-emerald-500 h-full transition-all duration-500" style="width: ${(currentLevel / 4) * 100}%"></div>
        </div>
      </div>

      <div class="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
        <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
        <p><strong>Delivery Address:</strong> ${order.customer.address}, Pincode: ${order.customer.pincode}</p>
        <p><strong>Amount:</strong> ${CURRENCY_SYMBOL}${order.totalAmount.toLocaleString('en-IN')} via ${order.paymentMethod}</p>
        ${order.trackingNotes ? `<p class="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2"><strong>Dispatch Note:</strong> ${order.trackingNotes}</p>` : ''}
      </div>

      <div class="pt-2 flex items-center justify-between">
        <a 
          href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi UniqueCollection, I am checking status for Order #' + order.orderId)}" 
          target="_blank"
          class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <span>Ask on WhatsApp (+977 9708425276)</span>
        </a>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------
// Dedicated Protected Admin Dashboard
// ---------------------------------------------------------------------

function openAdminDashboard() {
  if (!isAdminAuthenticated) {
    openAuthModal('admin');
    return;
  }

  const modal = document.getElementById("adminDashboardModal");
  renderAdminAnalytics();
  renderAdminOrdersTable();
  renderAdminProductsTable();
  renderAdminCustomersList();

  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function switchAdminTab(tabName) {
  const tabs = ['analytics', 'orders', 'products', 'customers', 'settings'];
  tabs.forEach(t => {
    const btn = document.getElementById(`adminTabBtn-${t}`);
    const section = document.getElementById(`adminSection-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add("bg-amber-500", "text-slate-950", "font-bold");
        btn.classList.remove("text-slate-300", "hover:bg-slate-800");
      } else {
        btn.classList.remove("bg-amber-500", "text-slate-950", "font-bold");
        btn.classList.add("text-slate-300", "hover:bg-slate-800");
      }
    }
    if (section) {
      if (t === tabName) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }
  });
}

function renderAdminAnalytics() {
  const totalRevEl = document.getElementById("adminTotalRevenue");
  const totalOrdersEl = document.getElementById("adminTotalOrders");
  const totalProductsEl = document.getElementById("adminTotalProducts");
  const totalCustomersEl = document.getElementById("adminTotalCustomers");

  const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const clientUsers = users.filter(u => u.role === 'client');

  if (totalRevEl) totalRevEl.textContent = `${CURRENCY_SYMBOL}${totalRev.toLocaleString('en-IN')}`;
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  if (totalProductsEl) totalProductsEl.textContent = products.length;
  if (totalCustomersEl) totalCustomersEl.textContent = clientUsers.length;
}

function renderAdminOrdersTable() {
  const container = document.getElementById("adminOrdersTableBody");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400 text-xs">No customer orders placed yet.</td></tr>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <tr class="border-b border-slate-700/60 hover:bg-slate-800/40 text-xs">
      <td class="py-3 px-3 font-mono font-bold text-amber-400">#${order.orderId}</td>
      <td class="py-3 px-3">
        <strong class="text-white block">${order.customer.name}</strong>
        <span class="text-slate-400 text-[11px] block">${order.customer.phone}</span>
        <span class="text-slate-400 text-[11px] block">${order.customer.email || 'N/A'}</span>
      </td>
      <td class="py-3 px-3 text-slate-300 max-w-[180px] truncate" title="${order.customer.address}">
        ${order.customer.address} (PIN: ${order.customer.pincode})
      </td>
      <td class="py-3 px-3 text-slate-300">
        ${order.items.map(i => `${i.title.slice(0, 20)}... (×${i.quantity})`).join(", ")}
      </td>
      <td class="py-3 px-3 font-bold text-white">
        ${CURRENCY_SYMBOL}${order.totalAmount.toLocaleString('en-IN')}
        <span class="text-[10px] text-slate-400 block">${order.paymentMethod}</span>
      </td>
      <td class="py-3 px-3">
        <select 
          onchange="updateOrderStatus('${order.orderId}', this.value)"
          class="bg-slate-900 border border-slate-700 text-white text-[11px] rounded-lg px-2 py-1 outline-none font-semibold focus:border-amber-400"
        >
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td class="py-3 px-3 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <a 
            href="https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + order.customer.name + '! This is UniqueCollection regarding your order #' + order.orderId + ' of ' + CURRENCY_SYMBOL + order.totalAmount + '.')}" 
            target="_blank"
            class="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
            title="Chat with customer on WhatsApp"
          >
            WhatsApp
          </a>
          <button 
            onclick="deleteOrder('${order.orderId}')"
            class="px-2 py-1 bg-rose-600/60 hover:bg-rose-600 text-white rounded text-[11px]"
            title="Delete this order record"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    saveOrdersToStorage();
    showToast(`Order #${orderId} status changed to "${newStatus}"!`, "success");
    renderAdminAnalytics();
  }
}

function deleteOrder(orderId) {
  if (confirm(`Delete order #${orderId} permanently?`)) {
    orders = orders.filter(o => o.orderId !== orderId);
    saveOrdersToStorage();
    renderAdminOrdersTable();
    renderAdminAnalytics();
    showToast(`Order #${orderId} deleted.`, "info");
  }
}

function renderAdminProductsTable() {
  const container = document.getElementById("adminProductsTableBody");
  if (!container) return;

  container.innerHTML = products.map(product => `
    <tr class="border-b border-slate-700/60 hover:bg-slate-800/40 text-xs">
      <td class="py-2.5 px-3">
        <img src="${product.image}" alt="${product.title}" class="w-10 h-10 rounded-lg object-cover bg-slate-800" />
      </td>
      <td class="py-2.5 px-3">
        <strong class="text-white block">${product.title}</strong>
        <span class="text-amber-500 uppercase text-[10px] font-bold">${product.category}</span>
      </td>
      <td class="py-2.5 px-3 font-bold text-white">${CURRENCY_SYMBOL}${product.price.toLocaleString('en-IN')}</td>
      <td class="py-2.5 px-3 text-slate-300">${(product.features || []).length} Specs</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${product.inStock ? 'bg-emerald-900/60 text-emerald-400' : 'bg-rose-900/60 text-rose-400'}">
          ${product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td class="py-2.5 px-3 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button 
            onclick="openEditProductModal('${product.id}')"
            class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px]"
          >
            Edit
          </button>
          <button 
            onclick="deleteProduct('${product.id}')"
            class="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[11px]"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminCustomersList() {
  const container = document.getElementById("adminCustomersTableBody");
  if (!container) return;

  const clientUsers = users.filter(u => u.role === 'client');

  if (clientUsers.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">No clients registered yet.</td></tr>`;
    return;
  }

  container.innerHTML = clientUsers.map(client => {
    const clientOrderCount = orders.filter(o => 
      o.customer && (o.customer.email === client.email || o.customer.phone === client.phone)
    ).length;

    return `
      <tr class="border-b border-slate-700/60 hover:bg-slate-800/40 text-xs">
        <td class="py-3 px-3 font-bold text-white">${client.name}</td>
        <td class="py-3 px-3 text-slate-300">${client.email}</td>
        <td class="py-3 px-3 text-slate-300">${client.phone}</td>
        <td class="py-3 px-3 text-slate-400">${new Date(client.createdAt).toLocaleDateString()}</td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
            ${clientOrderCount} Orders
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

// ---------------------------------------------------------------------
// Customer Review System
// ---------------------------------------------------------------------

function renderProductReviews(productId) {
  const container = document.getElementById("productReviewsListContainer");
  const averageRatingEl = document.getElementById("productReviewsAvgRating");
  const countEl = document.getElementById("productReviewsTotalCount");
  if (!container) return;

  const productReviews = reviews[productId] || [];
  const count = productReviews.length;

  if (countEl) countEl.textContent = `(${count} Reviews)`;

  if (count === 0) {
    if (averageRatingEl) averageRatingEl.textContent = "5.0 ★";
    container.innerHTML = `<p class="text-xs text-slate-400 italic py-2">No reviews yet for this product. Be the first to share your experience!</p>`;
    return;
  }

  const avg = (productReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1);
  if (averageRatingEl) averageRatingEl.textContent = `${avg} ★`;

  container.innerHTML = productReviews.map(r => `
    <div class="border-b border-slate-100 py-3 last:border-none">
      <div class="flex items-center justify-between text-xs mb-1">
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-slate-900">${r.userName}</span>
          ${r.verified ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">✓ Verified Buyer</span>' : ''}
        </div>
        <span class="text-slate-400 text-[10px]">${r.date}</span>
      </div>
      <div class="flex items-center text-amber-400 text-xs mb-1">
        ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
      </div>
      <p class="text-slate-600 text-xs leading-relaxed">${r.comment}</p>
    </div>
  `).join("");
}

function handleAddReviewSubmit(e) {
  e.preventDefault();
  if (!currentQuickViewProductId) return;

  const nameInput = document.getElementById("reviewAuthorName");
  const commentInput = document.getElementById("reviewComment");

  const name = nameInput.value.trim() || (currentUser ? currentUser.name : "Verified Customer");
  const comment = commentInput.value.trim();

  if (!comment) {
    showToast("Please write a few words about your experience", "error");
    return;
  }

  if (!reviews[currentQuickViewProductId]) {
    reviews[currentQuickViewProductId] = [];
  }

  const newReview = {
    id: "rev-" + Date.now(),
    userName: name,
    rating: reviewSelectedRating,
    date: new Date().toISOString().split("T")[0],
    verified: true,
    comment
  };

  reviews[currentQuickViewProductId].unshift(newReview);
  saveReviewsToStorage();

  const product = products.find(p => p.id === currentQuickViewProductId);
  if (product) {
    const allRev = reviews[currentQuickViewProductId];
    product.reviewsCount = allRev.length;
    product.rating = parseFloat((allRev.reduce((s, r) => s + r.rating, 0) / allRev.length).toFixed(1));
    saveProductsToStorage();
    renderProducts();
  }

  renderProductReviews(currentQuickViewProductId);
  showToast("Thank you! Your product review has been submitted. 🌟", "success");
  e.target.reset();
}

function setReviewRating(starNumber) {
  reviewSelectedRating = starNumber;
  const stars = document.querySelectorAll(".review-star-btn");
  stars.forEach((star, idx) => {
    if (idx < starNumber) {
      star.classList.add("text-amber-400");
      star.classList.remove("text-slate-300");
    } else {
      star.classList.remove("text-amber-400");
      star.classList.add("text-slate-300");
    }
  });
}

// ---------------------------------------------------------------------
// Category Navigation & Filtering
// ---------------------------------------------------------------------

function renderCategories() {
  const container = document.getElementById("categoryPillsContainer");
  if (!container) return;

  const categories = [
    { id: "all", name: "All Items", icon: "✨" },
    { id: "clothes", name: "Clothes", icon: "👔" },
    { id: "watches", name: "Luxury Watches", icon: "⌚" },
    { id: "sunglasses", name: "Sunglasses", icon: "🕶️" },
    { id: "footwear", name: "Footwear", icon: "👞" },
    { id: "perfumes", name: "Oud & Perfumes", icon: "✨" },
    { id: "accessories", name: "Accessories", icon: "💼" }
  ];

  container.innerHTML = categories.map(cat => {
    const isActive = selectedCategory === cat.id;
    const count = cat.id === "all" ? products.length : products.filter(p => p.category === cat.id).length;
    return `
      <button 
        onclick="setCategory('${cat.id}')"
        class="category-pill whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
          isActive 
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105' 
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
        }"
      >
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
        <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 text-slate-500'}">${count}</span>
      </button>
    `;
  }).join("");
}

function updateCategoryCounts() {
  renderCategories();
}

function setCategory(catId) {
  selectedCategory = catId;
  renderCategories();
  renderProducts();

  const section = document.getElementById("productsSection");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getFilteredProducts() {
  return products.filter(p => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      const matchCat = p.category && p.category.toLowerCase().includes(q);
      const matchFeatures = p.features && p.features.some(f => f.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchFeatures) return false;
    }
    if (p.price > currentMaxPriceFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortOption === "priceLow") return a.price - b.price;
    if (sortOption === "priceHigh") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    if (sortOption === "discount") {
      const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
      return discB - discA;
    }
    return 0;
  });
}

// ---------------------------------------------------------------------
// Render Products Grid & On-Card Drag and Drop
// ---------------------------------------------------------------------

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyProductsState");
  const countDisplay = document.getElementById("productCountDisplay");
  if (!grid) return;

  const filtered = getFilteredProducts();

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} of ${products.length} Products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const discountPercent = product.originalPrice && product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;
    const previewFeatures = (product.features || []).slice(0, 2);

    return `
      <div 
        id="card-${product.id}"
        class="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        data-id="${product.id}"
      >
        <!-- On-Card Drag Overlay -->
        <div class="card-drag-overlay" id="drag-overlay-${product.id}">
          <div class="p-4 text-center">
            <svg class="w-12 h-12 mx-auto mb-2 text-amber-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="font-bold text-white text-base">Drop Image Here!</p>
            <p class="text-xs text-amber-200">Replaces ${product.title.slice(0, 22)}... image</p>
          </div>
        </div>

        <!-- Image Container -->
        <div class="relative product-img-container aspect-square bg-slate-100 flex items-center justify-center">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          ${product.badge ? `
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg tracking-wide uppercase shadow-sm ${
                product.badge.toLowerCase().includes('exclusive') || product.badge.toLowerCase().includes('luxury')
                  ? 'bg-slate-900 text-amber-300 border border-amber-500/30'
                  : product.badge.toLowerCase().includes('hot') || product.badge.toLowerCase().includes('sale')
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500 text-slate-950 font-extrabold'
              }">
                ${product.badge}
              </span>
            </div>
          ` : ''}

          ${discountPercent > 0 ? `
            <div class="absolute bottom-3 left-3 bg-emerald-600/95 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
              ${discountPercent}% OFF
            </div>
          ` : ''}

          <!-- Wishlist & Quick View -->
          <div class="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <button 
              onclick="toggleWishlist('${product.id}')"
              title="Add to Wishlist"
              class="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow hover:bg-white flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors"
            >
              <svg class="w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
            <button 
              onclick="openQuickView('${product.id}')"
              title="Quick View Details & Reviews"
              class="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow hover:bg-white flex items-center justify-center text-slate-700 hover:text-amber-500 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>

          <!-- Admin Quick Edit Toolbar on Card (If logged in as admin) -->
          ${isAdminAuthenticated ? `
            <div class="absolute inset-x-0 bottom-0 bg-slate-900/90 backdrop-blur-sm p-2 flex items-center justify-between text-xs text-white border-t border-slate-700">
              <span class="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Drop Photo
              </span>
              <div class="flex items-center gap-1">
                <button 
                  onclick="openEditProductModal('${product.id}')"
                  class="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-semibold text-[11px]"
                >
                  Edit
                </button>
                <button 
                  onclick="deleteProduct('${product.id}')"
                  class="px-1.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[11px]"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Info Body -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span class="uppercase tracking-wider font-semibold text-amber-600">${product.category}</span>
              <div class="flex items-center gap-1 text-amber-500 font-bold">
                <span>★</span>
                <span>${product.rating || '4.9'}</span>
                <span class="text-slate-400 text-[10px]">(${product.reviewsCount || 100})</span>
              </div>
            </div>

            <h3 
              onclick="openQuickView('${product.id}')"
              class="font-semibold text-slate-900 text-base leading-snug hover:text-amber-600 transition-colors cursor-pointer line-clamp-1 mb-2" 
              title="${product.title}"
            >
              ${product.title}
            </h3>

            ${previewFeatures.length > 0 ? `
              <div class="flex flex-wrap gap-1.5 mb-3">
                ${previewFeatures.map(f => `
                  <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg class="w-3 h-3 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="truncate max-w-[120px]">${f}</span>
                  </span>
                `).join("")}
              </div>
            ` : ''}
          </div>

          <div>
            <div class="flex items-baseline gap-2 mb-3">
              <span class="text-xl font-extrabold text-slate-900">${CURRENCY_SYMBOL}${product.price.toLocaleString('en-IN')}</span>
              ${product.originalPrice && product.originalPrice > product.price ? `
                <span class="text-xs text-slate-400 line-through">${CURRENCY_SYMBOL}${product.originalPrice.toLocaleString('en-IN')}</span>
              ` : ''}
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button 
                onclick="addToCart('${product.id}')"
                class="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>Add to Cart</span>
              </button>

              <button 
                onclick="orderViaWhatsApp('${product.id}')"
                class="w-full py-2.5 px-3 rounded-xl whatsapp-green-btn font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                title="Direct Order on WhatsApp to +977 9708425276"
              >
                <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachCardDragDropListeners();
}

function attachCardDragDropListeners() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const productId = card.getAttribute("data-id");

    card.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.add("drag-over");
    });

    card.addEventListener("dragleave", e => {
      e.preventDefault();
      e.stopPropagation();
      if (!card.contains(e.relatedTarget)) {
        card.classList.remove("drag-over");
      }
    });

    card.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.remove("drag-over");

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          showToast("Please drop an image file (JPG, PNG, WEBP)", "error");
          return;
        }

        const reader = new FileReader();
        reader.onload = loadEvent => {
          updateProductImage(productId, loadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

function setupGlobalDragAndDrop() {
  window.addEventListener("dragover", e => e.preventDefault());
  window.addEventListener("drop", e => e.preventDefault());
}

function updateProductImage(productId, base64OrUrl) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.image = base64OrUrl;
    saveProductsToStorage();
    renderProducts();
    showToast(`📸 Photo updated for "${product.title}"! Changes saved.`, "success");
  }
}

// ---------------------------------------------------------------------
// Quick View Modal & Customer Reviews
// ---------------------------------------------------------------------

function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentQuickViewProductId = productId;

  const modal = document.getElementById("quickViewModal");
  const content = document.getElementById("quickViewContent");
  if (!modal || !content) return;

  const discountPercent = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div class="relative rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center group min-h-[320px]">
        <img 
          id="quickViewMainImage" 
          src="${product.image}" 
          alt="${product.title}" 
          class="w-full h-full object-cover max-h-[440px] rounded-2xl"
        />
        ${product.badge ? `
          <span class="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-lg uppercase shadow">
            ${product.badge}
          </span>
        ` : ''}

        ${isAdminAuthenticated ? `
          <div class="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur text-white text-xs p-3 rounded-xl text-center border border-slate-700">
            <p class="font-semibold text-amber-400">💡 Drag & drop any photo here to update</p>
          </div>
        ` : ''}
      </div>

      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span class="uppercase tracking-wider font-bold text-amber-600">${product.category}</span>
            <div class="flex items-center gap-1 text-amber-500 font-bold">
              <span>★</span>
              <span id="quickViewAvgRating">${product.rating || '4.9'}</span>
              <span class="text-slate-400" id="quickViewReviewCount">(${product.reviewsCount || 100} reviews)</span>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 mb-2">${product.title}</h2>
          
          <div class="flex items-baseline gap-3 mb-4">
            <span class="text-3xl font-extrabold text-slate-900">${CURRENCY_SYMBOL}${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `
              <span class="text-base text-slate-400 line-through">${CURRENCY_SYMBOL}${product.originalPrice.toLocaleString('en-IN')}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">${discountPercent}% OFF</span>
            ` : ''}
          </div>

          <p class="text-slate-600 text-sm mb-4 leading-relaxed">${product.description || 'Premium design with luxury craftsmanship by UniqueCollection.'}</p>

          <div class="mb-5">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Key Features & Specifications
            </h4>
            <div class="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              ${(product.features && product.features.length > 0) ? product.features.map(feat => `
                <div class="flex items-start gap-2 text-xs text-slate-700">
                  <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>${feat}</span>
                </div>
              `).join("") : `
                <p class="text-xs text-slate-400 italic">No specific features listed.</p>
              `}
            </div>
          </div>

          ${(product.options && product.options.length > 0) ? `
            <div class="mb-5">
              <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Select Option / Size</label>
              <div class="flex flex-wrap gap-2" id="quickViewOptionContainer">
                ${product.options.map((opt, idx) => `
                  <button 
                    type="button" 
                    onclick="selectQuickViewOption(this)"
                    class="quickview-option-btn text-xs font-medium px-3.5 py-1.5 rounded-lg border ${idx === 0 ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200 text-slate-700 hover:border-slate-300'}"
                  >
                    ${opt}
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="space-y-2.5">
          <button 
            onclick="addToCart('${product.id}'); closeModal('quickViewModal');"
            class="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span>Add to Bag - ${CURRENCY_SYMBOL}${product.price.toLocaleString('en-IN')}</span>
          </button>

          <button 
            onclick="orderViaWhatsApp('${product.id}')"
            class="w-full py-3 px-4 rounded-xl whatsapp-green-btn font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>Instant WhatsApp Order (+977 9708425276)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Reviews -->
    <div class="border-t border-slate-200 p-6 bg-slate-50/70">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Customer Ratings & Reviews</h3>
          <p class="text-xs text-slate-500">Verified buyer experiences for this product</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xl font-black text-amber-500" id="productReviewsAvgRating">${product.rating || '4.9'} ★</span>
          <span class="text-xs text-slate-500" id="productReviewsTotalCount">(${product.reviewsCount || 100} Reviews)</span>
        </div>
      </div>

      <!-- Add Review Form -->
      <form onsubmit="handleAddReviewSubmit(event)" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <h4 class="text-xs font-bold uppercase text-slate-800">Write a Review</h4>
        
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">Your Rating:</span>
          <div class="flex items-center text-lg cursor-pointer">
            <span class="review-star-btn text-amber-400" onclick="setReviewRating(1)">★</span>
            <span class="review-star-btn text-amber-400" onclick="setReviewRating(2)">★</span>
            <span class="review-star-btn text-amber-400" onclick="setReviewRating(3)">★</span>
            <span class="review-star-btn text-amber-400" onclick="setReviewRating(4)">★</span>
            <span class="review-star-btn text-amber-400" onclick="setReviewRating(5)">★</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input 
            type="text" 
            id="reviewAuthorName" 
            placeholder="Your Name (e.g. Sunil Shrestha)" 
            value="${currentUser ? currentUser.name : ''}"
            class="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-amber-500"
          />
        </div>

        <textarea 
          id="reviewComment" 
          rows="2" 
          required 
          placeholder="Share your feedback on the fabric, quality, or fit..."
          class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-amber-500 resize-none"
        ></textarea>

        <button 
          type="submit" 
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
        >
          Submit Customer Review
        </button>
      </form>

      <div id="productReviewsListContainer" class="space-y-2">
        <!-- Rendered by renderProductReviews -->
      </div>
    </div>
  `;

  renderProductReviews(productId);

  const imgContainer = content.querySelector(".relative.rounded-2xl");
  if (imgContainer) {
    imgContainer.addEventListener("dragover", e => {
      e.preventDefault();
      imgContainer.classList.add("ring-4", "ring-amber-500");
    });
    imgContainer.addEventListener("dragleave", e => {
      e.preventDefault();
      imgContainer.classList.remove("ring-4", "ring-amber-500");
    });
    imgContainer.addEventListener("drop", e => {
      e.preventDefault();
      imgContainer.classList.remove("ring-4", "ring-amber-500");
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && files[0].type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = le => {
          updateProductImage(productId, le.target.result);
          const qImg = document.getElementById("quickViewMainImage");
          if (qImg) qImg.src = le.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    });
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function selectQuickViewOption(btn) {
  const container = document.getElementById("quickViewOptionContainer");
  if (!container) return;
  const buttons = container.querySelectorAll(".quickview-option-btn");
  buttons.forEach(b => {
    b.classList.remove("border-amber-500", "bg-amber-50", "text-amber-900", "font-bold");
    b.classList.add("border-slate-200", "text-slate-700");
  });
  btn.classList.add("border-amber-500", "bg-amber-50", "text-amber-900", "font-bold");
}

// ---------------------------------------------------------------------
// Admin Product Editor Modal (Add / Edit / Features / Drag & Drop)
// ---------------------------------------------------------------------

var editingProductId = null;
var currentFeatureList = [];

function openAddProductModal() {
  if (!isAdminAuthenticated) {
    openAuthModal('admin');
    return;
  }

  editingProductId = null;
  currentFeatureList = [
    "Premium Craftsmanship",
    "100% Genuine Guaranteed"
  ];

  const modal = document.getElementById("adminProductModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const form = document.getElementById("adminProductForm");
  const previewImg = document.getElementById("adminImagePreview");
  const deleteBtn = document.getElementById("adminDeleteProductBtn");

  if (modalTitle) modalTitle.textContent = "Add New Product to UniqueCollection";
  if (deleteBtn) deleteBtn.classList.add("hidden");
  if (form) form.reset();

  document.getElementById("prodIdInput").value = "prod-" + Date.now();
  document.getElementById("prodTitleInput").value = "";
  document.getElementById("prodCategoryInput").value = selectedCategory !== "all" ? selectedCategory : "clothes";
  document.getElementById("prodPriceInput").value = "";
  document.getElementById("prodOrigPriceInput").value = "";
  document.getElementById("prodBadgeInput").value = "New Arrival";
  document.getElementById("prodDescInput").value = "";
  document.getElementById("prodOptionsInput").value = "Standard";
  document.getElementById("prodImageInput").value = "";

  if (previewImg) {
    previewImg.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  }

  renderFeatureEditorList();

  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function openEditProductModal(productId) {
  if (!isAdminAuthenticated) {
    openAuthModal('admin');
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  currentFeatureList = product.features ? [...product.features] : [];

  const modal = document.getElementById("adminProductModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const previewImg = document.getElementById("adminImagePreview");
  const deleteBtn = document.getElementById("adminDeleteProductBtn");

  if (modalTitle) modalTitle.textContent = `Edit Product: ${product.title}`;
  if (deleteBtn) deleteBtn.classList.remove("hidden");

  document.getElementById("prodIdInput").value = product.id;
  document.getElementById("prodTitleInput").value = product.title || "";
  document.getElementById("prodCategoryInput").value = product.category || "clothes";
  document.getElementById("prodPriceInput").value = product.price || 0;
  document.getElementById("prodOrigPriceInput").value = product.originalPrice || "";
  document.getElementById("prodBadgeInput").value = product.badge || "";
  document.getElementById("prodDescInput").value = product.description || "";
  document.getElementById("prodOptionsInput").value = (product.options || []).join(", ");
  document.getElementById("prodImageInput").value = product.image || "";

  if (previewImg) previewImg.src = product.image;

  renderFeatureEditorList();

  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function renderFeatureEditorList() {
  const container = document.getElementById("featuresEditorContainer");
  if (!container) return;

  if (currentFeatureList.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 italic">No features added yet. Click "+ Add Feature" below.</p>`;
    return;
  }

  container.innerHTML = currentFeatureList.map((feat, index) => `
    <div class="flex items-center gap-2">
      <span class="text-xs font-bold text-amber-500 w-4">${index + 1}.</span>
      <input 
        type="text" 
        value="${feat.replace(/"/g, '&quot;')}" 
        onchange="updateFeatureItem(${index}, this.value)"
        class="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
        placeholder="e.g. UV400 Protection or 100% European Linen"
      />
      <button 
        type="button" 
        onclick="removeFeatureItem(${index})"
        class="w-7 h-7 text-rose-500 hover:bg-rose-50 rounded flex items-center justify-center text-xs font-bold"
      >✕</button>
    </div>
  `).join("");
}

function addFeatureItem() {
  const newFeatInput = document.getElementById("newFeatureTextInput");
  if (!newFeatInput) return;
  const val = newFeatInput.value.trim();
  if (val) {
    currentFeatureList.push(val);
    newFeatInput.value = "";
  } else {
    currentFeatureList.push("New Specification / Feature");
  }
  renderFeatureEditorList();
}

function updateFeatureItem(index, value) {
  if (index >= 0 && index < currentFeatureList.length) {
    currentFeatureList[index] = value;
  }
}

function removeFeatureItem(index) {
  currentFeatureList.splice(index, 1);
  renderFeatureEditorList();
}

function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById("prodIdInput").value || ("prod-" + Date.now());
  const title = document.getElementById("prodTitleInput").value.trim();
  const category = document.getElementById("prodCategoryInput").value;
  const price = parseFloat(document.getElementById("prodPriceInput").value) || 0;
  const origPriceVal = document.getElementById("prodOrigPriceInput").value;
  const originalPrice = origPriceVal ? parseFloat(origPriceVal) : null;
  const badge = document.getElementById("prodBadgeInput").value.trim();
  const description = document.getElementById("prodDescInput").value.trim();
  const optionsStr = document.getElementById("prodOptionsInput").value.trim();
  const image = document.getElementById("prodImageInput").value.trim() || document.getElementById("adminImagePreview").src;

  if (!title) {
    showToast("Please enter a product title", "error");
    return;
  }
  if (price <= 0) {
    showToast("Please enter a valid price", "error");
    return;
  }

  const options = optionsStr ? optionsStr.split(",").map(o => o.trim()).filter(Boolean) : ["Standard"];
  const features = currentFeatureList.filter(f => f && f.trim() !== "");

  const existingIndex = products.findIndex(p => p.id === id);

  if (existingIndex >= 0) {
    products[existingIndex] = {
      ...products[existingIndex],
      title,
      category,
      price,
      originalPrice,
      badge,
      description,
      options,
      features,
      image
    };
    showToast(`✅ "${title}" updated successfully!`, "success");
  } else {
    const newProduct = {
      id,
      title,
      category,
      price,
      originalPrice,
      badge: badge || "New",
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      description: description || "Exclusive luxury item from UniqueCollection.",
      features,
      options,
      image
    };
    products.unshift(newProduct);
    showToast(`🎉 New Product "${title}" added!`, "success");
  }

  saveProductsToStorage();
  renderProducts();
  if (isAdminAuthenticated) renderAdminProductsTable();
  closeModal("adminProductModal");
}

function deleteCurrentProduct() {
  if (!editingProductId) return;
  const prod = products.find(p => p.id === editingProductId);
  const confirmName = prod ? prod.title : "this product";

  if (confirm(`Delete "${confirmName}" from UniqueCollection?`)) {
    products = products.filter(p => p.id !== editingProductId);
    saveProductsToStorage();
    renderProducts();
    if (isAdminAuthenticated) renderAdminProductsTable();
    closeModal("adminProductModal");
    showToast(`Product deleted from catalog.`, "info");
  }
}

function deleteProduct(id) {
  const prod = products.find(p => p.id === id);
  const confirmName = prod ? prod.title : "this product";

  if (confirm(`Delete "${confirmName}"?`)) {
    products = products.filter(p => p.id !== id);
    saveProductsToStorage();
    renderProducts();
    if (isAdminAuthenticated) renderAdminProductsTable();
    showToast(`Product removed from catalog.`, "info");
  }
}

function setupAdminImageDropzone() {
  const dropzone = document.getElementById("adminImageDropzone");
  const fileInput = document.getElementById("adminFileInput");
  const preview = document.getElementById("adminImagePreview");
  const urlInput = document.getElementById("prodImageInput");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = le => {
        preview.src = le.target.result;
        urlInput.value = le.target.result;
        showToast("Image loaded from file!", "success");
      };
      reader.readAsDataURL(file);
    }
  });

  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.classList.add("drag-active");
  });

  dropzone.addEventListener("dragleave", e => {
    e.preventDefault();
    dropzone.classList.remove("drag-active");
  });

  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.classList.remove("drag-active");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = le => {
        preview.src = le.target.result;
        urlInput.value = le.target.result;
        showToast("Image dropped successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  });

  if (urlInput) {
    urlInput.addEventListener("input", e => {
      if (e.target.value.startsWith("http") || e.target.value.startsWith("data:")) {
        preview.src = e.target.value;
      }
    });
  }
}

// ---------------------------------------------------------------------
// WhatsApp Ordering & Order Database
// ---------------------------------------------------------------------

function orderViaWhatsApp(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const orderId = "UC-" + Math.floor(100000 + Math.random() * 900000);
  const clientName = currentUser ? currentUser.name : "Valued Customer";
  const clientPhone = currentUser ? currentUser.phone : "WhatsApp Contact";

  const newOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: clientName,
      phone: clientPhone,
      email: currentUser ? currentUser.email : "whatsapp-order@uniquecollection.com",
      address: "Sharing delivery address in WhatsApp chat",
      pincode: "Nepal"
    },
    items: [
      {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image
      }
    ],
    totalAmount: product.price,
    paymentMethod: "WhatsApp Direct Order",
    status: "Pending",
    trackingNotes: "Direct WhatsApp order placed. Awaiting address confirmation."
  };

  orders.unshift(newOrder);
  saveOrdersToStorage();

  const message = 
`Hello UniqueCollection! 🛍️
I would like to order this item:

• Order Ref: #${orderId}
• Product: ${product.title}
• Price: ${CURRENCY_SYMBOL}${product.price.toLocaleString('en-IN')}
• Category: ${product.category.toUpperCase()}
• Customer: ${clientName}

Please confirm availability and share payment options (COD / UPI). Thank you!`;

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  showToast(`Order #${orderId} generated! Opening WhatsApp with +977 9708425276...`, "success");
}

function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    showToast("Your cart is empty! Add products first.", "error");
    return;
  }

  const orderId = "UC-" + Math.floor(100000 + Math.random() * 900000);
  const subtotal = getCartSubtotal();
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const clientName = currentUser ? currentUser.name : (document.getElementById("checkoutName")?.value.trim() || "Customer");
  const clientPhone = currentUser ? currentUser.phone : (document.getElementById("checkoutPhone")?.value.trim() || "WhatsApp Chat");
  const clientEmail = currentUser ? currentUser.email : "guest@uniquecollection.com";
  const clientAddress = document.getElementById("checkoutAddress")?.value.trim() || "Sharing in WhatsApp Chat";
  const clientPincode = document.getElementById("checkoutPincode")?.value.trim() || "Nepal";

  const newOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      address: clientAddress,
      pincode: clientPincode
    },
    items: [...cart],
    totalAmount: total,
    paymentMethod: "WhatsApp Order / COD",
    status: "Pending",
    trackingNotes: "Full bag order via WhatsApp. Awaiting dispatch."
  };

  orders.unshift(newOrder);
  saveOrdersToStorage();

  let itemsListText = "";
  cart.forEach((item, index) => {
    itemsListText += `${index + 1}. ${item.title} (Qty: ${item.quantity}) - ${CURRENCY_SYMBOL}${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
  });

  const message = 
`Hello UniqueCollection! 🛍️
I want to confirm an order from your website:

📦 ORDER REF: #${orderId}
${itemsListText}
💰 Subtotal: ${CURRENCY_SYMBOL}${subtotal.toLocaleString('en-IN')}
🏷️ Discount: -${CURRENCY_SYMBOL}${discount.toLocaleString('en-IN')} ${discountPercent > 0 ? `(${appliedDiscountCode})` : ''}
🚚 Shipping: ${shipping === 0 ? 'FREE' : `${CURRENCY_SYMBOL}${shipping}`}
💵 GRAND TOTAL: ${CURRENCY_SYMBOL}${total.toLocaleString('en-IN')}

👤 CUSTOMER DETAILS:
• Name: ${clientName}
• Phone: ${clientPhone}
• Delivery Address: ${clientAddress}

Please confirm my order and dispatch timeline!`;

  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  cart = [];
  saveCartToStorage();
  renderCart();
  closeModal("checkoutModal");
  closeDrawer("cartDrawer");
  showToast(`Order #${orderId} registered! Opening WhatsApp (+977 9708425276)...`, "success");
}

function handleStandardCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("checkoutName")?.value.trim() || "";
  const phone = document.getElementById("checkoutPhone")?.value.trim() || "";
  const address = document.getElementById("checkoutAddress")?.value.trim() || "";
  const pincode = document.getElementById("checkoutPincode")?.value.trim() || "";
  const payment = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Cash on Delivery";

  const orderId = "UC-" + Math.floor(100000 + Math.random() * 900000);
  const subtotal = getCartSubtotal();
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const newOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name,
      phone,
      email: currentUser ? currentUser.email : "guest@uniquecollection.com",
      address,
      pincode
    },
    items: [...cart],
    totalAmount: total,
    paymentMethod: payment,
    status: "Pending",
    trackingNotes: "Order confirmed via website checkout. Queued for packaging."
  };

  orders.unshift(newOrder);
  saveOrdersToStorage();

  alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${orderId}\nName: ${name}\nPhone: ${phone}\nTotal: ${CURRENCY_SYMBOL}${total.toLocaleString('en-IN')}\nPayment: ${payment}\n\nOur team will contact you via WhatsApp (+977 9708425276) to confirm delivery.`);

  cart = [];
  saveCartToStorage();
  renderCart();
  closeModal("checkoutModal");
  showToast(`Order #${orderId} confirmed! You can track it anytime using your Order ID.`, "success");
}

// ---------------------------------------------------------------------
// Shopping Cart & Wishlist Logic
// ---------------------------------------------------------------------

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      quantity: 1
    });
  }

  saveCartToStorage();
  renderCart();
  showToast(`Added "${product.title}" to your cart! 🛍️`, "success");
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCartToStorage();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCartToStorage();
  renderCart();
  showToast("Item removed from cart.", "info");
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartBadges() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) badge.classList.remove("hidden");
    else badge.classList.add("hidden");
  });
}

function renderCart() {
  updateCartBadges();

  const container = document.getElementById("cartItemsContainer");
  const emptyState = document.getElementById("cartEmptyState");
  const footer = document.getElementById("cartFooter");
  const subtotalEl = document.getElementById("cartSubtotalText");
  const totalEl = document.getElementById("cartTotalText");
  const shippingEl = document.getElementById("cartShippingText");
  const discountEl = document.getElementById("cartDiscountText");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    if (footer) footer.classList.add("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");
  if (footer) footer.classList.remove("hidden");

  const subtotal = getCartSubtotal();
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 py-3 border-b border-slate-100">
      <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs sm:text-sm font-semibold text-slate-900 truncate">${item.title}</h4>
        <p class="text-xs text-amber-600 font-bold mt-0.5">${CURRENCY_SYMBOL}${item.price.toLocaleString('en-IN')}</p>
        
        <div class="flex items-center gap-2 mt-2">
          <div class="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
            <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 text-xs font-bold">-</button>
            <span class="w-6 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 text-xs font-bold">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-[11px] text-rose-500 hover:text-rose-700 ml-1">Remove</button>
        </div>
      </div>
      <div class="text-right">
        <span class="text-sm font-extrabold text-slate-900">${CURRENCY_SYMBOL}${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    </div>
  `).join("");

  if (subtotalEl) subtotalEl.textContent = `${CURRENCY_SYMBOL}${subtotal.toLocaleString('en-IN')}`;
  if (discountEl) discountEl.textContent = discount > 0 ? `-${CURRENCY_SYMBOL}${discount.toLocaleString('en-IN')}` : `${CURRENCY_SYMBOL}0`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : `${CURRENCY_SYMBOL}${shipping}`;
  if (totalEl) totalEl.textContent = `${CURRENCY_SYMBOL}${total.toLocaleString('en-IN')}`;
}

function applyCouponCode() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === "UNIQUE10") {
    discountPercent = 10;
    appliedDiscountCode = code;
    showToast("🎉 Promo Code UNIQUE10: 10% OFF!", "success");
  } else if (code === "UNIQUE20") {
    discountPercent = 20;
    appliedDiscountCode = code;
    showToast("🎉 VIP Code UNIQUE20: 20% OFF!", "success");
  } else if (code === "") {
    showToast("Please enter a discount coupon code", "error");
  } else {
    showToast("Invalid promo code. Try UNIQUE10 or UNIQUE20", "error");
  }

  renderCart();
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from Wishlist", "info");
  } else {
    wishlist.push(productId);
    showToast("Added to your Wishlist ❤️", "success");
  }

  saveWishlistToStorage();
  renderProducts();
  renderWishlist();
}

function updateWishlistBadges() {
  const count = wishlist.length;
  const badges = document.querySelectorAll(".wishlist-count-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) badge.classList.remove("hidden");
    else badge.classList.add("hidden");
  });
}

function renderWishlist() {
  updateWishlistBadges();

  const container = document.getElementById("wishlistItemsContainer");
  const emptyState = document.getElementById("wishlistEmptyState");
  if (!container) return;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = wishlistProducts.map(p => `
    <div class="flex items-center gap-4 py-3 border-b border-slate-100">
      <img src="${p.image}" alt="${p.title}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"/>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-slate-900 truncate">${p.title}</h4>
        <p class="text-xs text-amber-600 font-bold mt-0.5">${CURRENCY_SYMBOL}${p.price.toLocaleString('en-IN')}</p>
        <button 
          onclick="addToCart('${p.id}'); toggleWishlist('${p.id}');"
          class="text-xs text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg mt-2 font-medium"
        >
          Move to Cart
        </button>
      </div>
      <button onclick="toggleWishlist('${p.id}')" class="text-slate-400 hover:text-rose-500 p-2" title="Remove">✕</button>
    </div>
  `).join("");
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your cart is empty! Add items first.", "error");
    return;
  }

  const modal = document.getElementById("checkoutModal");
  const summaryEl = document.getElementById("checkoutSummaryList");
  const grandTotalEl = document.getElementById("checkoutGrandTotal");
  const accountTipEl = document.getElementById("checkoutAccountTip");

  if (accountTipEl) {
    if (currentUser) {
      accountTipEl.innerHTML = `
        <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <span>✓ Ordering as logged-in customer: <strong>${currentUser.name}</strong></span>
          <span class="text-[10px] text-emerald-700 font-semibold">Saved to My Orders</span>
        </div>
      `;
    } else {
      accountTipEl.innerHTML = `
        <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>Want order tracking & rewards?</span>
          <button type="button" onclick="closeModal('checkoutModal'); openAuthModal('register');" class="text-xs font-bold text-amber-800 underline hover:text-amber-950">
            Create Account
          </button>
        </div>
      `;
    }
  }

  if (currentUser) {
    const nameInput = document.getElementById("checkoutName");
    const phoneInput = document.getElementById("checkoutPhone");
    if (nameInput && !nameInput.value) nameInput.value = currentUser.name;
    if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone || "";
  }

  if (summaryEl) {
    const subtotal = getCartSubtotal();
    const discount = Math.round(subtotal * (discountPercent / 100));
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    summaryEl.innerHTML = cart.map(item => `
      <div class="flex justify-between text-xs py-1 text-slate-600">
        <span class="truncate max-w-[200px]">${item.title} × ${item.quantity}</span>
        <span class="font-bold text-slate-900">${CURRENCY_SYMBOL}${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join("");

    if (grandTotalEl) grandTotalEl.textContent = `${CURRENCY_SYMBOL}${total.toLocaleString('en-IN')}`;
  }

  closeDrawer("cartDrawer");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

// ---------------------------------------------------------------------
// Help & Query Form
// ---------------------------------------------------------------------

function handleHelpFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("helpName")?.value.trim() || "";
  const email = document.getElementById("helpEmail")?.value.trim() || "";
  const phone = document.getElementById("helpPhone")?.value.trim() || "";
  const queryType = document.getElementById("helpSubject")?.value || "General Query";
  const message = document.getElementById("helpMessage")?.value.trim() || "";

  if (!message) {
    showToast("Please enter your message or query", "error");
    return;
  }

  const subject = `[UniqueCollection Query] - ${queryType} from ${name || 'Customer'}`;
  const body = `Dear UniqueCollection Support (Md Faisal),\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTopic: ${queryType}\n\nMessage:\n${message}\n\nSent via UniqueCollection Web Portal.`;

  window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast(`Opening email to ${STORE_EMAIL}! WhatsApp support is also available at +977 9708425276.`, "success");
  e.target.reset();
}

function sendHelpViaWhatsApp() {
  const name = document.getElementById("helpName")?.value.trim() || "Customer";
  const queryType = document.getElementById("helpSubject")?.value || "Product Inquiry";
  const message = document.getElementById("helpMessage")?.value.trim() || "";

  const text = `Hello UniqueCollection Support (+977 9708425276)!\n\nName: ${name}\nTopic: ${queryType}\n\nMessage:\n${message || 'I have a question regarding UniqueCollection products.'}`;

  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
}

function renderFAQ() {
  const container = document.getElementById("faqAccordionContainer");
  if (!container) return;

  container.innerHTML = FAQ_DATA.map((faq, index) => `
    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button 
        onclick="toggleFAQ(${index})" 
        class="w-full px-6 py-4 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span>${faq.q}</span>
        <svg id="faq-icon-${index}" class="w-5 h-5 text-amber-500 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="faq-answer-${index}" class="hidden px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
        ${faq.a}
      </div>
    </div>
  `).join("");
}

function toggleFAQ(index) {
  const answer = document.getElementById(`faq-answer-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  if (!answer || !icon) return;

  if (answer.classList.contains("hidden")) {
    answer.classList.remove("hidden");
    icon.classList.add("rotate-180");
  } else {
    answer.classList.add("hidden");
    icon.classList.remove("rotate-180");
  }
}

function renderTestimonials() {
  const container = document.getElementById("testimonialsContainer");
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-1 text-amber-400 mb-3 text-sm">
          ${'★'.repeat(t.rating)}
        </div>
        <p class="text-slate-600 text-sm italic mb-4 leading-relaxed">"${t.comment}"</p>
      </div>
      <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div>
          <span class="font-bold text-slate-900 block">${t.name}</span>
          <span class="text-slate-400">${t.city} • Verified Buyer</span>
        </div>
        <span class="text-[10px] text-amber-700 bg-amber-50 font-semibold px-2 py-1 rounded">
          ${t.product.slice(0, 18)}...
        </span>
      </div>
    </div>
  `).join("");
}

// ---------------------------------------------------------------------
// Catalog Backup / Reset
// ---------------------------------------------------------------------

function resetCatalogToDefault() {
  if (confirm("Reset all products back to original UniqueCollection defaults? Any custom items will be overwritten.")) {
    products = [...(window.DEFAULT_PRODUCTS || DEFAULT_PRODUCTS)];
    saveProductsToStorage();
    renderProducts();
    if (isAdminAuthenticated) renderAdminProductsTable();
    showToast("Catalog restored to default!", "info");
  }
}

function exportCatalogJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `uniquecollection_catalog_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Catalog exported as JSON backup! 💾", "success");
}

function openImportCatalogModal() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          products = imported;
          saveProductsToStorage();
          renderProducts();
          if (isAdminAuthenticated) renderAdminProductsTable();
          showToast(`Imported ${imported.length} products successfully!`, "success");
        } else {
          showToast("Invalid JSON file format.", "error");
        }
      } catch (err) {
        showToast("Error parsing JSON file.", "error");
      }
    };
    reader.readAsText(file);
  };
  fileInput.click();
}

// ---------------------------------------------------------------------
// Toasts & Modal Utilities
// ---------------------------------------------------------------------

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-slide p-3.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 max-w-sm pointer-events-auto border ${
    type === "success" 
      ? "bg-slate-900 text-white border-amber-500/40" 
      : type === "error"
      ? "bg-rose-900 text-white border-rose-500/40"
      : "bg-slate-900 text-white border-slate-700"
  }`;

  const icon = type === "success" 
    ? `<span class="text-amber-400 text-base">✓</span>` 
    : type === "error" 
    ? `<span class="text-rose-400 text-base">✕</span>` 
    : `<span class="text-amber-400 text-base">ℹ</span>`;

  toast.innerHTML = `${icon}<span class="flex-1">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

function openDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  drawer.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  drawer.classList.add("hidden");
  document.body.style.overflow = "auto";
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// ---------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------

function setupEventListeners() {
  const searchInput = document.getElementById("globalSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      sortOption = e.target.value;
      renderProducts();
    });
  }

  const priceSlider = document.getElementById("priceFilterSlider");
  const priceDisplay = document.getElementById("priceFilterDisplay");
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", e => {
      currentMaxPriceFilter = parseInt(e.target.value);
      priceDisplay.textContent = `Up to ${CURRENCY_SYMBOL}${currentMaxPriceFilter.toLocaleString('en-IN')}`;
      renderProducts();
    });
  }

  setupAdminImageDropzone();

  const adminForm = document.getElementById("adminProductForm");
  if (adminForm) adminForm.addEventListener("submit", handleSaveProduct);

  const checkoutForm = document.getElementById("standardCheckoutForm");
  if (checkoutForm) checkoutForm.addEventListener("submit", handleStandardCheckoutSubmit);

  const helpForm = document.getElementById("helpQueryForm");
  if (helpForm) helpForm.addEventListener("submit", handleHelpFormSubmit);

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal("quickViewModal");
      closeModal("adminProductModal");
      closeModal("adminDashboardModal");
      closeModal("authModal");
      closeModal("clientPortalModal");
      closeModal("orderTrackerModal");
      closeModal("checkoutModal");
      closeModal("wishlistModal");
      closeDrawer("cartDrawer");
    }
  });
}
