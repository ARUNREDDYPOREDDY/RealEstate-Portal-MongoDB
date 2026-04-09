/* =============================================
   NEW BEGINNINGS — REAL ESTATE PORTAL
   Frontend JavaScript — Connected to Express + MySQL Backend
   API Base: http://localhost:5000/api
============================================= */

const API_BASE = "https://new-beginnings-portal.onrender.com/api";

// ── Local state ──────────────────────────────────────────────
let currentUser   = null;
let authToken     = null;
let filteredProps = [];
let selectedBeds  = "";
let currentPage   = 1;
const PAGE_SIZE   = 8;

// Compare & misc state
const state = {
  compareList:     [null, null, null],
  currentProperty: null,
  currentRating:   0,
  pickerSlot:      0,
  allProperties:   [],   // cached for compare picker
  favoriteIds:     new Set(),
};

// ═══════════════════════════════════════════
// API HELPER
// ═══════════════════════════════════════════
async function api(method, endpoint, body = null, isFormData = false) {
  const headers = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (!isFormData && body) headers["Content-Type"] = "application/json";

  const config = {
    method,
    headers,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  };

  try {
    const res  = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    throw err;
  }
}

const GET    = (url)        => api("GET",    url);
const POST   = (url, body)  => api("POST",   url, body);
const PUT    = (url, body)  => api("PUT",    url, body);
const PATCH  = (url, body)  => api("PATCH",  url, body);
const DELETE = (url)        => api("DELETE", url);

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  // Restore session from localStorage
  const savedToken = localStorage.getItem("nb_token");
  const savedUser  = localStorage.getItem("nb_user");
  if (savedToken && savedUser) {
    authToken   = savedToken;
    currentUser = JSON.parse(savedUser);
    onLogin();
  }

  initParticles();
  initMapPins();
  calcEMI();
  addNavScrollEffect();
  initChat();

  // Load data from backend
  await Promise.all([
    loadFeatured(),
    loadRecommended(),
    loadReviews(),
    loadListings(),
  ]);

  if (currentUser) await loadFavoriteIds();
});

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const page = document.getElementById(`page-${name}`);
  if (page) {
    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));

  if (name === "listings")  loadListings();
  if (name === "favorites") renderFavorites();
  if (name === "admin") {
    if (!currentUser || currentUser.role !== "admin") {
      showToast("Access denied. Admin only.", "error");
      showPage("home");
      return;
    }
    loadAdminDashboard();
  }
  if (name === "profile")    loadProfile();
  if (name === "enquiries")  loadEnquiries();
  if (name === "add-property" && !currentUser) {
    showToast("Please login to list a property.", "error");
    showModal("loginModal");
    return;
  }
  if (name === "calculator") calcEMI();
  if (name === "compare")    initCompareSlots();

  closeDropdown();
  closeMenu();
}

function addNavScrollEffect() {
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
  });
}

function toggleMenu()  { document.getElementById("navLinks").classList.toggle("open"); }
function closeMenu()   { document.getElementById("navLinks").classList.remove("open"); }
function toggleDropdown() { document.getElementById("userDropdown").classList.toggle("open"); }
function closeDropdown()  { document.getElementById("userDropdown")?.classList.remove("open"); }

// ═══════════════════════════════════════════
// PARTICLES & MAP PINS
// ═══════════════════════════════════════════
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p    = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 6 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+8}s;animation-delay:${Math.random()*10}s;`;
    container.appendChild(p);
  }
}

function initMapPins() {
  const container = document.getElementById("mapPins");
  if (!container) return;
  const positions = [
    {left:"20%",top:"30%"},{left:"45%",top:"50%"},{left:"65%",top:"35%"},
    {left:"30%",top:"65%"},{left:"75%",top:"60%"},{left:"55%",top:"25%"},
  ];
  positions.forEach((pos, i) => {
    const pin = document.createElement("div");
    pin.classList.add("map-pin");
    pin.style.cssText = `left:${pos.left};top:${pos.top};animation-delay:${i*0.4}s`;
    pin.innerHTML = `<span>📍</span>`;
    pin.onclick = () => {
      const prop = state.allProperties[i];
      if (prop) showDetail(prop.id);
    };
    container.appendChild(pin);
  });
}

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════
async function doLogin() {
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!email || !password) { showToast("Please fill in all fields.", "error"); return; }

  try {
    showToast("Signing in...");
    const data = await POST("/auth/login", { email, password });
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem("nb_token", authToken);
    localStorage.setItem("nb_user",  JSON.stringify(currentUser));
    onLogin();
    await loadFavoriteIds();
    closeModal("loginModal");
    showToast(`Welcome back, ${currentUser.first_name}! 👋`, "success");
    // Refresh current page data
    loadFeatured();
    loadRecommended();
  } catch (err) {
    showToast(err.message, "error");
  }
}

function quickLogin(email, pass) {
  document.getElementById("loginEmail").value    = email;
  document.getElementById("loginPassword").value = pass;
  doLogin();
}

async function doRegister() {
  const first_name = document.getElementById("regFirst").value.trim();
  const last_name  = document.getElementById("regLast").value.trim();
  const email      = document.getElementById("regEmail").value.trim();
  const phone      = document.getElementById("regPhone").value.trim();
  const password   = document.getElementById("regPass").value;
  const confirm    = document.getElementById("regPassConfirm").value;
  const agreed     = document.getElementById("agreeTerms").checked;

  if (!first_name || !last_name || !email || !password) { showToast("Please fill all required fields.", "error"); return; }
  if (password !== confirm) { showToast("Passwords do not match.", "error"); return; }
  if (password.length < 8)  { showToast("Password must be at least 8 characters.", "error"); return; }
  if (!agreed)               { showToast("Please agree to Terms & Conditions.", "error"); return; }

  try {
    showToast("Creating account...");
    const data = await POST("/auth/register", { first_name, last_name, email, phone, password });
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem("nb_token", authToken);
    localStorage.setItem("nb_user",  JSON.stringify(currentUser));
    onLogin();
    closeModal("registerModal");
    showToast(`Welcome to New Beginnings, ${first_name}! 🏠`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function onLogin() {
  document.getElementById("authButtons").style.display = "none";
  document.getElementById("userMenu").style.display    = "flex";
  document.getElementById("userInitial").textContent   = currentUser.first_name[0].toUpperCase();
  document.getElementById("dropdownName").textContent  = `${currentUser.first_name} ${currentUser.last_name}`;
  document.getElementById("dropdownRole").textContent  = currentUser.role === "admin" ? "⭐ Administrator" : "Member";
  if (currentUser.role === "admin") {
    document.getElementById("adminNavItem").style.display = "list-item";
  }
}

function logout() {
  authToken   = null;
  currentUser = null;
  state.favoriteIds.clear();
  localStorage.removeItem("nb_token");
  localStorage.removeItem("nb_user");
  document.getElementById("authButtons").style.display = "flex";
  document.getElementById("userMenu").style.display    = "none";
  document.getElementById("adminNavItem").style.display = "none";
  showPage("home");
  showToast("Logged out successfully.");
}

async function doForgotPass() {
  const email = document.getElementById("forgotEmail").value.trim();
  if (!email) { showToast("Please enter your email.", "error"); return; }
  showToast("If that email exists, a reset link has been sent.", "success");
  closeModal("forgotModal");
}

function togglePassword(id) {
  const el = document.getElementById(id);
  el.type = el.type === "password" ? "text" : "password";
}

function checkPassStrength() {
  const val = document.getElementById("regPass").value;
  const el  = document.getElementById("passStrength");
  if (!el) return;
  if (val.length < 6)  { el.innerHTML = `<span style="color:#ef4444">Weak</span>`; return; }
  if (val.length < 10) { el.innerHTML = `<span style="color:#f59e0b">Medium</span>`; return; }
  el.innerHTML = `<span style="color:#22c55e">Strong ✓</span>`;
}

// ═══════════════════════════════════════════
// LOAD PROPERTIES FROM BACKEND
// ═══════════════════════════════════════════
async function loadFeatured() {
  try {
    const data = await GET("/properties/featured");
    state.allProperties = [...data.properties];
    document.getElementById("featuredGrid").innerHTML =
      data.properties.map(buildCard).join("") || "<p>No featured properties found.</p>";
  } catch (err) {
    console.error("Failed to load featured:", err.message);
  }
}

async function loadRecommended() {
  try {
    const data = await GET("/properties/recommended");
    document.getElementById("recommendedGrid").innerHTML =
      data.properties.map(buildCard).join("") || "<p>No recommendations yet.</p>";
  } catch (err) {
    console.error("Failed to load recommended:", err.message);
  }
}

async function loadReviews() {
  try {
    const data = await GET("/reviews/testimonials");
    document.getElementById("reviewsGrid").innerHTML = data.reviews.map((r) => `
      <div class="review-card">
        <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p class="review-text">"${r.review_text}"</p>
        <div class="review-author">
          <div class="review-avatar">${r.name[0]}</div>
          <div><div class="review-name">${r.name}</div><div class="review-role">${r.role_label}</div></div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Failed to load reviews:", err.message);
  }
}

async function loadFavoriteIds() {
  if (!currentUser) return;
  try {
    const data = await GET("/favorites/ids");
    state.favoriteIds = new Set(data.ids);
  } catch (_) {}
}

// ═══════════════════════════════════════════
// LISTINGS PAGE
// ═══════════════════════════════════════════
async function loadListings() {
  const params = buildFilterParams();
  try {
    document.getElementById("resultsCount").textContent = "Loading...";
    const data = await GET(`/properties?${params}`);
    filteredProps = data.properties;

    // Cache for compare picker
    state.allProperties = [...new Map(
      [...state.allProperties, ...data.properties].map((p) => [p.id, p])
    ).values()];

    const grid = document.getElementById("listingsGrid");
    if (!grid) return;

    if (!filteredProps.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">🔍</div>
          <h3>No properties found</h3>
          <p>Try adjusting your filters.</p>
          <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
        </div>`;
    } else {
      grid.innerHTML = filteredProps.map(buildCard).join("");
    }

    document.getElementById("resultsCount").innerHTML =
      `Showing <strong>${data.properties.length}</strong> of <strong>${data.total}</strong> properties`;

    renderPagination(data.total_pages);
  } catch (err) {
    showToast("Failed to load listings: " + err.message, "error");
  }
}

function buildFilterParams() {
  const params = new URLSearchParams();
  const search    = document.getElementById("filterSearch")?.value || "";
  const priceMin  = document.getElementById("priceMin")?.value || "";
  const priceMax  = document.getElementById("priceMax")?.value || "";
  const areaMin   = document.getElementById("areaMin")?.value  || "";
  const areaMax   = document.getElementById("areaMax")?.value  || "";
  const sortBy    = document.getElementById("sortBy")?.value   || "newest";
  const checkedTypes = [...document.querySelectorAll(".checkbox-group input:checked")].map((c) => c.value);

  if (search)   params.set("search",    search);
  if (priceMin) params.set("min_price", priceMin);
  if (priceMax) params.set("max_price", priceMax);
  if (areaMin)  params.set("area_min",  areaMin);
  if (areaMax)  params.set("area_max",  areaMax);
  if (sortBy)   params.set("sort",      sortBy);
  if (selectedBeds) {
    params.set("beds", selectedBeds === "4" ? "4+" : selectedBeds);
  }
  if (checkedTypes.length === 1) params.set("type", checkedTypes[0]);
  params.set("page",     currentPage);
  params.set("per_page", PAGE_SIZE);
  return params.toString();
}

function applyFilters() { currentPage = 1; loadListings(); }

function clearFilters() {
  document.getElementById("filterSearch").value = "";
  document.querySelectorAll(".checkbox-group input").forEach((c) => (c.checked = false));
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";
  document.getElementById("areaMin").value  = "";
  document.getElementById("areaMax").value  = "";
  document.getElementById("sortBy").value   = "newest";
  selectedBeds = "";
  document.querySelectorAll(".bed-btn").forEach((b) => b.classList.remove("active"));
  currentPage  = 1;
  loadListings();
}

function setBeds(btn, val) {
  selectedBeds = selectedBeds === val ? "" : val;
  document.querySelectorAll(".bed-btn").forEach((b) => b.classList.remove("active"));
  if (selectedBeds) btn.classList.add("active");
  applyFilters();
}

function setView(btn, mode) {
  document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const grid = document.getElementById("listingsGrid");
  mode === "list" ? grid.classList.add("list-view") : grid.classList.remove("list-view");
}

function renderPagination(totalPages) {
  const pg = document.getElementById("pagination");
  if (!pg || totalPages <= 1) { if (pg) pg.innerHTML = ""; return; }
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
  }
  pg.innerHTML = html;
}

function goToPage(n) {
  currentPage = n;
  loadListings();
  document.querySelector(".listings-results")?.scrollIntoView({ behavior: "smooth" });
}

// Hero search
function doSearch() {
  const loc    = document.getElementById("searchLocation").value;
  const type   = document.getElementById("searchType").value;
  const budget = document.getElementById("searchBudget").value;

  showPage("listings");
  setTimeout(() => {
    if (loc && document.getElementById("filterSearch"))
      document.getElementById("filterSearch").value = loc;
    if (type) {
      document.querySelectorAll(".checkbox-group input").forEach((c) => {
        c.checked = c.value === type;
      });
    }
    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      document.getElementById("priceMin").value = min || "";
      document.getElementById("priceMax").value = max || "";
    }
    applyFilters();
  }, 100);
}

function setSearchTab(btn) {
  document.querySelectorAll(".stab").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function filterByType(type) {
  showPage("listings");
  setTimeout(() => {
    document.querySelectorAll(".checkbox-group input").forEach((c) => {
      c.checked = c.value === type;
    });
    applyFilters();
  }, 100);
}

// ═══════════════════════════════════════════
// PROPERTY CARD BUILDER
// ═══════════════════════════════════════════
function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${p.toLocaleString()}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return "★".repeat(full) + (half ? "☆" : "");
}

function isFav(id) { return state.favoriteIds.has(id); }

function buildCard(prop) {
  const fav       = isFav(prop.id);
  const inCompare = state.compareList.includes(prop.id);
  const imgHtml   = prop.images?.length
    ? `<img src="${prop.images[0].url}" alt="${prop.title}" style="width:100%;height:100%;object-fit:cover;">`
    : `<div style="font-size:64px;display:flex;align-items:center;justify-content:center;height:100%">${prop.emoji || "🏠"}</div>`;

  return `
    <div class="property-card" data-id="${prop.id}">
      <div class="card-image-wrap">
        <div class="card-image" onclick="showDetail(${prop.id})">${imgHtml}</div>
        ${prop.badge ? `<div class="card-badge badge-${prop.badge}">${prop.badge}</div>` : ""}
        <button class="card-fav ${fav ? "active" : ""}" onclick="toggleFav(${prop.id},this)" title="Save property">
          ${fav ? "❤️" : "🤍"}
        </button>
        <div class="card-price-tag">${formatPrice(prop.price)}</div>
        <button class="card-compare ${inCompare ? "active" : ""}" onclick="addToCompare(${prop.id})">⚖ Compare</button>
      </div>
      <div class="card-body" onclick="showDetail(${prop.id})">
        <div class="card-type">${prop.type}</div>
        <div class="card-title">${prop.title}</div>
        <div class="card-location">${prop.locality || ""}, ${prop.city}</div>
        <div class="card-specs">
          ${prop.beds > 0  ? `<div class="spec">🛏 ${prop.beds} BHK</div>` : ""}
          ${prop.baths > 0 ? `<div class="spec">🚿 ${prop.baths} Bath</div>` : ""}
          <div class="spec">📐 ${Number(prop.area).toLocaleString()} sqft</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-rating">
          <span class="stars">${renderStars(prop.rating || 0)}</span>
          <span>${prop.rating || 0} (${prop.review_count || 0})</span>
        </div>
        <div class="card-actions">
          <button class="card-action-btn btn-enquire" onclick="openEnquiry(${prop.id})">Enquire</button>
          <button class="card-action-btn btn-view" onclick="showDetail(${prop.id})">View →</button>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════
// PROPERTY DETAIL
// ═══════════════════════════════════════════
async function showDetail(id) {
  try {
    const data = await GET(`/properties/${id}`);
    const prop = data.property;
    state.currentProperty = prop;

    const fav = isFav(prop.id);
    const amenitiesHtml = prop.amenities?.length
      ? `<div class="detail-section"><h3>Amenities</h3><div class="amenities-list">${prop.amenities.map((a) => `<div class="amenity-tag">✓ ${a}</div>`).join("")}</div></div>`
      : "";

    document.getElementById("detailContent").innerHTML = `
      <div class="detail-hero">
        <div class="gallery-main">
          ${prop.images?.length
            ? `<img src="${prop.images[0].url}" alt="${prop.title}" style="width:100%;height:100%;object-fit:cover;">`
            : `<div style="font-size:100px;display:flex;align-items:center;justify-content:center;height:100%;background:#f5f0e8">${prop.emoji || "🏠"}</div>`
          }
        </div>
        <div class="detail-overlay">
          <div class="detail-overlay-content">
            <div class="detail-badge">${prop.type}</div>
            <h1 style="font-size:clamp(24px,4vw,42px);color:white;font-family:'Cormorant Garamond',serif;margin-bottom:8px">${prop.title}</h1>
            <div style="color:rgba(255,255,255,0.7);margin-bottom:12px">📍 ${prop.address || `${prop.locality}, ${prop.city}`}</div>
            <div class="detail-price">${formatPrice(prop.price)}</div>
          </div>
        </div>
        <div class="detail-actions">
          <button class="detail-action-btn dab-fav" onclick="toggleFav(${prop.id},this)">${fav ? "❤️" : "🤍"} ${fav ? "Saved" : "Save"}</button>
          <button class="detail-action-btn dab-share" onclick="shareProperty()">🔗 Share</button>
          <button class="detail-action-btn dab-compare" onclick="addToCompare(${prop.id})">⚖ Compare</button>
        </div>
      </div>

      <div class="container">
        <div style="padding:16px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <a href="#" onclick="showPage('home')" style="color:var(--text-light);font-size:13px">Home</a>
          <span style="color:var(--text-light)">›</span>
          <a href="#" onclick="showPage('listings')" style="color:var(--text-light);font-size:13px">Properties</a>
          <span style="color:var(--text-light)">›</span>
          <span style="font-size:13px;color:var(--text-dark)">${prop.title}</span>
        </div>

        <div class="detail-layout">
          <div class="detail-main">
            <div class="detail-section">
              <h3>Property Overview</h3>
              <div class="specs-grid">
                <div class="spec-item"><div class="spec-icon">💰</div><div class="spec-value">${formatPrice(prop.price)}</div><div class="spec-label">Price</div></div>
                <div class="spec-item"><div class="spec-icon">📐</div><div class="spec-value">${Number(prop.area).toLocaleString()} sqft</div><div class="spec-label">Total Area</div></div>
                ${prop.beds > 0 ? `<div class="spec-item"><div class="spec-icon">🛏</div><div class="spec-value">${prop.beds} BHK</div><div class="spec-label">Bedrooms</div></div>` : ""}
                ${prop.baths > 0 ? `<div class="spec-item"><div class="spec-icon">🚿</div><div class="spec-value">${prop.baths}</div><div class="spec-label">Bathrooms</div></div>` : ""}
                <div class="spec-item"><div class="spec-icon">🏙</div><div class="spec-value">${prop.locality || prop.city}</div><div class="spec-label">Locality</div></div>
                <div class="spec-item"><div class="spec-icon">⭐</div><div class="spec-value">${prop.rating}/5</div><div class="spec-label">Rating</div></div>
              </div>
            </div>

            <div class="detail-section">
              <h3>About this Property</h3>
              <p style="color:var(--text-mid);line-height:1.8;font-size:16px">${prop.description || "No description available."}</p>
            </div>

            ${amenitiesHtml}

            <div class="detail-section">
              <h3>Location & Neighbourhood</h3>
              <div class="map-embed">
                <div class="map-embed-inner">
                  <span style="font-size:36px">🗺️</span>
                  <span>${prop.address || `${prop.locality}, ${prop.city}`}</span>
                  ${prop.lat ? `<span style="font-size:12px">Lat: ${prop.lat}, Lng: ${prop.lng}</span>` : ""}
                </div>
              </div>
              <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">
                <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🏫</b> School 0.8km</div>
                <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🏥</b> Hospital 1.2km</div>
                <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🛒</b> Mall 0.5km</div>
                <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🚇</b> Metro 0.6km</div>
              </div>
            </div>

            <div class="detail-section">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid var(--border)">
                <h3 style="border:none;margin:0;padding:0">Reviews & Ratings</h3>
                <button class="btn btn-primary btn-sm" onclick="showModal('reviewModal')">Write a Review</button>
              </div>
              <div id="propertyReviews">
                ${prop.reviews_list?.length
                  ? prop.reviews_list.map((r) => `
                      <div class="review-card" style="margin-bottom:16px">
                        <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
                        <p class="review-text">"${r.review_text}"</p>
                        <div class="review-author">
                          <div class="review-avatar">${r.name[0]}</div>
                          <div><div class="review-name">${r.name}</div><div class="review-role">${r.role_label}</div></div>
                        </div>
                      </div>`).join("")
                  : `<div style="color:var(--text-light);text-align:center;padding:20px">Be the first to review this property.</div>`
                }
              </div>
            </div>
          </div>

          <div class="detail-sidebar">
            <div class="sidebar-card">
              <h4>Contact Owner</h4>
              <div class="owner-info">
                <div class="owner-avatar">${(prop.owner_name || "O")[0]}</div>
                <div><div class="owner-name">${prop.owner_name || "Owner"}</div><div class="owner-type">Property Owner</div></div>
              </div>
              <div class="contact-btns">
                <button class="contact-btn cb-call" onclick="showToast('Calling ${prop.owner_phone}...','success')">📞 Call: ${prop.owner_phone || "N/A"}</button>
                <button class="contact-btn cb-whatsapp" onclick="showToast('Opening WhatsApp...','success')">💬 WhatsApp</button>
                <button class="contact-btn cb-enquiry" onclick="openEnquiry(${prop.id})">📩 Send Enquiry</button>
              </div>
            </div>

            <div class="sidebar-card">
              <h4>Quick EMI</h4>
              <div style="background:var(--off-white);border-radius:8px;padding:16px;text-align:center">
                <div style="font-size:13px;color:var(--text-light)">For ${formatPrice(prop.price)} at 8.5%</div>
                <div style="font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--primary);font-weight:600;margin:8px 0">${quickEMI(prop.price)}</div>
                <div style="font-size:12px;color:var(--text-light)">per month (20yr, 20% down)</div>
              </div>
              <button class="btn btn-outline-dark full-width mt-20" onclick="showPage('calculator')">Full EMI Calculator →</button>
            </div>

            <div class="sidebar-card">
              <h4>Schedule Visit</h4>
              <div class="form-group">
                <label>Preferred Date</label>
                <input type="date" id="visitDate" style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:8px">
              </div>
              <div class="form-group">
                <label>Preferred Time</label>
                <select id="visitTime" style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:8px">
                  <option>Morning (9–12 AM)</option>
                  <option>Afternoon (12–3 PM)</option>
                  <option>Evening (4–7 PM)</option>
                </select>
              </div>
              <button class="btn btn-primary full-width" onclick="scheduleVisit(${prop.id})">Schedule Visit</button>
            </div>
          </div>
        </div>
      </div>`;

    showPage("detail");
  } catch (err) {
    showToast("Failed to load property details: " + err.message, "error");
  }
}

async function scheduleVisit(propertyId) {
  const visit_date = document.getElementById("visitDate")?.value;
  const visit_time = document.getElementById("visitTime")?.value;
  if (!visit_date) { showToast("Please select a visit date.", "error"); return; }

  const name  = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Guest";
  const phone = currentUser?.phone || "";
  try {
    await POST("/visits", { property_id: propertyId, name, phone, visit_date, visit_time });
    showToast("Visit scheduled! Owner will confirm shortly. 📅", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function quickEMI(price) {
  const loan = price * 0.8, r = 8.5 / 100 / 12, n = 240;
  const emi  = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return `₹${Math.round(emi).toLocaleString()}`;
}

function shareProperty() { showToast("Link copied to clipboard! 🔗", "success"); }

// ═══════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════
async function toggleFav(id, btn) {
  if (!currentUser) { showToast("Please login to save properties.", "error"); showModal("loginModal"); return; }

  try {
    if (state.favoriteIds.has(id)) {
      await DELETE(`/favorites/${id}`);
      state.favoriteIds.delete(id);
      if (btn) { btn.textContent = "🤍"; btn.classList.remove("active"); }
      showToast("Removed from favorites.");
    } else {
      await POST(`/favorites/${id}`);
      state.favoriteIds.add(id);
      if (btn) { btn.textContent = "❤️"; btn.classList.add("active"); }
      showToast("Added to favorites! ❤️", "success");
    }
    updateFavCount();
  } catch (err) {
    showToast(err.message, "error");
  }
}

function updateFavCount() {
  const el = document.getElementById("pFavCount");
  if (el) el.textContent = state.favoriteIds.size;
}

async function renderFavorites() {
  if (!currentUser) {
    document.getElementById("favoritesGrid").innerHTML = "";
    document.getElementById("noFavorites").style.display = "block";
    return;
  }
  try {
    const data = await GET("/favorites");
    const grid = document.getElementById("favoritesGrid");
    const noFav = document.getElementById("noFavorites");
    if (!data.favorites.length) {
      grid.innerHTML = "";
      noFav.style.display = "block";
    } else {
      noFav.style.display = "none";
      grid.innerHTML = data.favorites.map(buildCard).join("");
    }
  } catch (err) {
    showToast("Failed to load favorites: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════
// ENQUIRY
// ═══════════════════════════════════════════
function openEnquiry(propId) {
  const prop = state.allProperties.find((p) => p.id === propId) || state.currentProperty;
  if (prop) document.getElementById("enquiryPropName").textContent = `For: ${prop.title}`;
  if (currentUser) {
    document.getElementById("enqName").value    = `${currentUser.first_name} ${currentUser.last_name}`;
    document.getElementById("enqEmail").value   = currentUser.email;
    document.getElementById("enqPhone").value   = currentUser.phone || "";
  }
  document.getElementById("enqMessage").value =
    `Hi, I'm interested in "${prop?.title}" listed at ${formatPrice(prop?.price)}. Please share more details.`;
  state.currentProperty = prop || state.currentProperty;
  showModal("enquiryModal");
}

async function submitEnquiry() {
  const name    = document.getElementById("enqName").value.trim();
  const email   = document.getElementById("enqEmail").value.trim();
  const phone   = document.getElementById("enqPhone").value.trim();
  const message = document.getElementById("enqMessage").value.trim();
  if (!name || !email) { showToast("Name and email are required.", "error"); return; }

  try {
    await POST("/enquiries", {
      property_id: state.currentProperty?.id,
      name, email, phone, message,
    });
    closeModal("enquiryModal");
    showToast("Enquiry sent! Owner will contact you soon. 📩", "success");
    const el = document.getElementById("pEnqCount");
    if (el) el.textContent = parseInt(el.textContent || "0") + 1;
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ═══════════════════════════════════════════
// ADD PROPERTY
// ═══════════════════════════════════════════
function previewImages(event) {
  const previews = document.getElementById("imagePreviews");
  previews.innerHTML = "";
  [...event.target.files].forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement("div");
      div.className = "preview-item";
      div.innerHTML = `<img src="${e.target.result}" alt="Preview"><button class="preview-remove" onclick="this.parentElement.remove()">✕</button>`;
      previews.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

async function submitProperty(e) {
  e.preventDefault();
  if (!currentUser) { showToast("Please login to list a property.", "error"); return; }

  const formData = new FormData();
  formData.append("title",       document.getElementById("propTitle").value);
  formData.append("type",        document.getElementById("propType").value);
  formData.append("price",       document.getElementById("propPrice").value);
  formData.append("area",        document.getElementById("propArea").value);
  formData.append("beds",        document.getElementById("propBeds").value);
  formData.append("baths",       document.getElementById("propBaths").value);
  formData.append("city",        document.getElementById("propCity").value);
  formData.append("locality",    document.getElementById("propLocality").value);
  formData.append("address",     document.getElementById("propAddress").value);
  formData.append("description", document.getElementById("propDesc").value);
  formData.append("owner_name",  document.getElementById("ownerName").value);
  formData.append("owner_phone", document.getElementById("ownerPhone").value);

  const emojis = { Apartment:"🏢", Villa:"🏡", "Independent House":"🏠", "Land / Plot":"🌿", Commercial:"🏗️" };
  formData.append("emoji", emojis[document.getElementById("propType").value] || "🏠");

  const amenities = [...document.querySelectorAll("#amenitiesGrid input:checked")].map((c) => c.value);
  amenities.forEach((a) => formData.append("amenities", a));

  const files = document.getElementById("imageInput").files;
  [...files].forEach((f) => formData.append("images", f));

  try {
    showToast("Submitting property...");
    await api("POST", "/properties", formData, true);
    showToast("Property submitted! Pending admin approval. 🎉", "success");
    showPage("listings");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ═══════════════════════════════════════════
// COMPARE
// ═══════════════════════════════════════════
function initCompareSlots() { renderCompareSlots(); }

function renderCompareSlots() {
  const container = document.getElementById("compareSlots");
  if (!container) return;
  container.innerHTML = state.compareList.map((id, i) => {
    const prop = id ? state.allProperties.find((p) => p.id === id) : null;
    if (prop) {
      return `
        <div class="compare-slot filled">
          <div style="font-size:32px">${prop.emoji || "🏠"}</div>
          <div style="font-weight:600;font-size:14px;text-align:center;padding:0 8px">${prop.title}</div>
          <div style="color:var(--accent);font-size:16px">${formatPrice(prop.price)}</div>
          <button onclick="removeFromCompare(${i})" style="font-size:11px;padding:4px 10px;border:1px solid var(--danger);border-radius:6px;background:white;color:var(--danger);cursor:pointer;margin-top:4px">Remove</button>
        </div>`;
    }
    return `<div class="compare-slot" onclick="showPropertyPicker(${i})"><div class="slot-icon">+</div><div>Add Property</div></div>`;
  }).join("");
}

function addToCompare(id) {
  if (state.compareList.includes(id)) { showToast("Already in comparison!"); return; }
  const slot = state.compareList.indexOf(null);
  if (slot === -1) { showToast("Comparison is full. Remove one first.", "error"); return; }
  state.compareList[slot] = id;
  showToast("Added to comparison! ⚖️", "success");
}

function removeFromCompare(i) {
  state.compareList[i] = null;
  renderCompareSlots();
}

function showPropertyPicker(slot) {
  state.pickerSlot = slot;
  renderPickerList(state.allProperties);
  showModal("pickerModal");
}

function renderPickerList(props) {
  document.getElementById("pickerList").innerHTML = props.map((p) => `
    <div class="picker-item" onclick="pickProperty(${p.id})">
      <div class="picker-emoji">${p.emoji || "🏠"}</div>
      <div class="picker-info">
        <div class="picker-name">${p.title}</div>
        <div class="picker-loc">📍 ${p.locality || ""}, ${p.city}</div>
      </div>
      <div class="picker-price">${formatPrice(p.price)}</div>
    </div>`).join("");
}

function filterPicker(val) {
  const filtered = state.allProperties.filter(
    (p) => p.title.toLowerCase().includes(val.toLowerCase()) || p.city.toLowerCase().includes(val.toLowerCase())
  );
  renderPickerList(filtered);
}

function pickProperty(id) {
  state.compareList[state.pickerSlot] = id;
  closeModal("pickerModal");
  renderCompareSlots();
}

function renderComparison() {
  const selected = state.compareList
    .filter((id) => id !== null)
    .map((id) => state.allProperties.find((p) => p.id === id))
    .filter(Boolean);

  if (selected.length < 2) { showToast("Please select at least 2 properties.", "error"); return; }

  const fields = [
    { label: "Price",        key: "price",  format: formatPrice,                         better: "min" },
    { label: "Type",         key: "type",   format: (v) => v,                            better: "none" },
    { label: "Area (sqft)",  key: "area",   format: (v) => Number(v).toLocaleString(),   better: "max" },
    { label: "Bedrooms",     key: "beds",   format: (v) => v > 0 ? v + " BHK" : "N/A",  better: "none" },
    { label: "Bathrooms",    key: "baths",  format: (v) => v > 0 ? v : "N/A",           better: "none" },
    { label: "Location",     key: "locality",format: (v) => v || "-",                   better: "none" },
    { label: "Rating",       key: "rating", format: (v) => `${v}/5 ⭐`,                 better: "max" },
  ];

  const table = document.getElementById("comparisonTable");
  table.style.display = "block";
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          ${selected.map((p) => `<th>${p.emoji || "🏠"} ${p.title}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${fields.map((f) => {
          const vals = selected.map((p) => p[f.key]);
          const bestIdx =
            f.better === "max" ? vals.indexOf(Math.max(...vals)) :
            f.better === "min" ? vals.indexOf(Math.min(...vals)) : -1;
          return `
            <tr>
              <td>${f.label}</td>
              ${selected.map((p, i) => `<td class="${i === bestIdx ? "better-value" : ""}">${f.format(p[f.key])}</td>`).join("")}
            </tr>`;
        }).join("")}
        <tr>
          <td>Amenities</td>
          ${selected.map((p) => `<td>${(p.amenities || []).slice(0, 3).join(", ") || "None"}${(p.amenities || []).length > 3 ? ` +${p.amenities.length - 3} more` : ""}</td>`).join("")}
        </tr>
        <tr>
          <td>Action</td>
          ${selected.map((p) => `<td><button class="btn btn-primary btn-sm" onclick="showDetail(${p.id})">View Details</button></td>`).join("")}
        </tr>
      </tbody>
    </table>`;
  table.scrollIntoView({ behavior: "smooth" });
}

// ═══════════════════════════════════════════
// EMI CALCULATOR
// ═══════════════════════════════════════════
function calcEMI() {
  const price = parseFloat(document.getElementById("calcPrice")?.value)  || 5000000;
  const down  = parseFloat(document.getElementById("calcDown")?.value)   || 1000000;
  const rate  = parseFloat(document.getElementById("calcRate")?.value)   || 8.5;
  const years = parseInt(document.getElementById("calcYears")?.value)    || 20;

  const loan  = price - down;
  const r     = rate / 100 / 12;
  const n     = years * 12;
  const emi   = r > 0 ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loan / n;
  const total = emi * n;
  const interest = total - loan;

  const fmt = (v) => `₹${Math.round(v).toLocaleString()}`;
  const el  = (id) => document.getElementById(id);

  if (el("emiAmount"))   el("emiAmount").textContent   = fmt(emi);
  if (el("loanAmount"))  el("loanAmount").textContent  = fmt(loan);
  if (el("totalInterest")) el("totalInterest").textContent = fmt(interest);
  if (el("totalPayment")) el("totalPayment").textContent = fmt(total);

  // Donut chart
  const svg = el("donutSvg");
  if (svg && loan > 0) {
    const pct  = loan / total;
    const r1   = 70, cx = 100, cy = 100, sw = 30;
    const dash = 2 * Math.PI * r1;
    const d1   = dash * pct;
    svg.innerHTML = `
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#c9a96e" stroke-width="${sw}"
        stroke-dasharray="${d1} ${dash - d1}" stroke-dashoffset="${dash * 0.25}" transform="rotate(-90,${cx},${cy})"/>
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#fc8c8c" stroke-width="${sw}"
        stroke-dasharray="${dash - d1} ${d1}" stroke-dashoffset="${dash * 0.25 - d1}" transform="rotate(-90,${cx},${cy})"/>
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">Principal</text>
      <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="14" fill="white" font-weight="600">${(pct * 100).toFixed(0)}%</text>`;
  }
}

["Price", "Down", "Rate", "Years"].forEach((f) => {
  document.addEventListener("DOMContentLoaded", () => {
    const inp   = document.getElementById(`calc${f}`);
    const range = document.getElementById(`calc${f}Range`);
    if (inp && range) {
      inp.addEventListener("input",   () => { range.value = inp.value;   calcEMI(); });
      range.addEventListener("input", () => { inp.value   = range.value; calcEMI(); });
    }
  });
});

function toggleAmortization() {
  const table = document.getElementById("amortizationTable");
  if (table.style.display !== "none") { table.style.display = "none"; return; }

  const price  = parseFloat(document.getElementById("calcPrice").value)  || 5000000;
  const down   = parseFloat(document.getElementById("calcDown").value)   || 1000000;
  const rate   = parseFloat(document.getElementById("calcRate").value)   || 8.5;
  const years  = parseInt(document.getElementById("calcYears").value)    || 20;
  let balance  = price - down;
  const r      = rate / 100 / 12;
  const n      = years * 12;
  const emi    = r > 0 ? balance * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : balance / n;

  let rows = `<table><thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>`;
  for (let yr = 1; yr <= Math.min(years, 10); yr++) {
    let yp = 0, yi = 0;
    for (let mo = 0; mo < 12 && balance > 0; mo++) {
      const interest = balance * r;
      const principal = Math.min(emi - interest, balance);
      yi += interest; yp += principal; balance -= principal;
    }
    rows += `<tr><td>${yr}</td><td>₹${Math.round(yp).toLocaleString()}</td><td>₹${Math.round(yi).toLocaleString()}</td><td>₹${Math.max(0, Math.round(balance)).toLocaleString()}</td></tr>`;
  }
  if (years > 10) rows += `<tr><td colspan="4" style="text-align:center;opacity:0.6">...${years - 10} more years</td></tr>`;
  rows += "</tbody></table>";
  table.innerHTML = rows;
  table.style.display = "block";
}

// ═══════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════
async function loadAdminDashboard() {
  try {
    const data = await GET("/admin/stats");
    const s = data.stats;
    // Update stat cards
    const cards = document.querySelectorAll(".admin-stat-card");
    if (cards[0]) {
      cards[0].querySelector(".asc-num").textContent   = s.total_properties;
      cards[0].querySelector(".asc-trend").textContent = `↑ +${s.new_props_week} this week`;
    }
    if (cards[1]) {
      cards[1].querySelector(".asc-num").textContent   = s.total_users;
      cards[1].querySelector(".asc-trend").textContent = `↑ +${s.new_users_week} this week`;
    }
    if (cards[2]) {
      cards[2].querySelector(".asc-num").textContent   = s.new_enquiries;
    }
    if (cards[3]) {
      cards[3].querySelector(".asc-num").textContent   = s.pending_approvals;
    }
  } catch (err) {
    console.error("Failed to load admin stats:", err.message);
  }
  renderAdminTab("properties");
}

function switchAdminTab(btn, tab) {
  document.querySelectorAll(".atab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  renderAdminTab(tab);
}

async function renderAdminTab(tab) {
  const content = document.getElementById("adminTabContent");
  if (!content) return;

  if (tab === "properties") {
    try {
      const data = await GET("/properties?per_page=50");
      content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div style="font-size:15px;color:var(--text-mid)">${data.total} total properties</div>
          <button class="btn btn-primary btn-sm" onclick="showPage('add-property')">+ Add Property</button>
        </div>
        <div class="admin-table">
          <table>
            <thead><tr><th>#</th><th>Property</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${data.properties.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><b>${p.emoji || "🏠"} ${p.title}</b><br><span style="font-size:12px;color:var(--text-light)">${p.locality || ""}, ${p.city}</span></td>
                  <td>${p.type}</td>
                  <td style="font-weight:600;color:var(--accent)">${formatPrice(p.price)}</td>
                  <td><span class="status-badge status-${p.status}">${p.status}</span></td>
                  <td>
                    <button class="btn btn-sm" style="background:var(--off-white);border:1px solid var(--border)" onclick="showDetail(${p.id})">View</button>
                    <button class="btn btn-sm btn-danger" onclick="adminDeleteProperty(${p.id})">Delete</button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    } catch (err) { content.innerHTML = `<p>Failed to load properties: ${err.message}</p>`; }

  } else if (tab === "users") {
    try {
      const data = await GET("/admin/users");
      content.innerHTML = `
        <div class="admin-table">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${data.users.map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><b>${u.first_name} ${u.last_name}</b></td>
                  <td>${u.email}</td>
                  <td><span class="status-badge ${u.role === "admin" ? "status-pending" : "status-active"}">${u.role}</span></td>
                  <td><span class="status-badge ${u.is_active ? "status-active" : "status-rejected"}">${u.is_active ? "Active" : "Inactive"}</span></td>
                  <td>
                    <button class="btn btn-sm btn-danger" onclick="adminToggleUser(${u.id})">${u.is_active ? "Block" : "Unblock"}</button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    } catch (err) { content.innerHTML = `<p>Failed to load users: ${err.message}</p>`; }

  } else if (tab === "enquiries") {
    try {
      const data = await GET("/enquiries");
      content.innerHTML = !data.enquiries.length
        ? `<div class="empty-state"><div class="empty-icon">📩</div><h3>No enquiries yet</h3></div>`
        : `
          <div class="admin-table">
            <table>
              <thead><tr><th>#</th><th>From</th><th>Property</th><th>Message</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${data.enquiries.map((e, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><b>${e.name}</b><br><span style="font-size:12px">${e.email}</span></td>
                    <td style="font-size:13px">${e.property_title || "—"}</td>
                    <td style="font-size:13px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.message || "—"}</td>
                    <td style="font-size:13px">${new Date(e.created_at).toLocaleDateString("en-IN")}</td>
                    <td><span class="status-badge status-${e.status}">${e.status}</span></td>
                    <td>
                      <select onchange="adminUpdateEnquiry(${e.id},this.value)" style="font-size:12px;padding:4px;border:1px solid var(--border);border-radius:6px">
                        <option ${e.status === "new"     ? "selected" : ""}>new</option>
                        <option ${e.status === "read"    ? "selected" : ""}>read</option>
                        <option ${e.status === "replied" ? "selected" : ""}>replied</option>
                      </select>
                    </td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>`;
    } catch (err) { content.innerHTML = `<p>Failed to load enquiries: ${err.message}</p>`; }

  } else if (tab === "approvals") {
    try {
      const data = await GET("/admin/pending-properties");
      content.innerHTML = !data.properties.length
        ? `<div class="admin-table"><table><tbody><tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-light)">No pending approvals.</td></tr></tbody></table></div>`
        : `
          <div class="admin-table">
            <table>
              <thead><tr><th>#</th><th>Property</th><th>Submitted By</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                ${data.properties.map((p, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><b>${p.title}</b><br><span style="font-size:12px">${p.city}</span></td>
                    <td style="font-size:13px">${p.first_name || ""} ${p.last_name || ""}<br><span style="font-size:12px">${p.owner_email || ""}</span></td>
                    <td style="font-size:13px">${new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                    <td>
                      <button class="btn btn-sm" style="background:#22c55e;color:white;margin-right:4px" onclick="adminApproveProperty(${p.id})">✓ Approve</button>
                      <button class="btn btn-sm btn-danger" onclick="adminRejectProperty(${p.id})">✗ Reject</button>
                    </td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>`;
    } catch (err) { content.innerHTML = `<p>Failed to load approvals: ${err.message}</p>`; }
  }
}

async function adminDeleteProperty(id) {
  if (!confirm("Delete this property permanently?")) return;
  try {
    await DELETE(`/properties/${id}`);
    showToast("Property deleted.", "success");
    renderAdminTab("properties");
  } catch (err) { showToast(err.message, "error"); }
}

async function adminToggleUser(id) {
  try {
    const data = await PATCH(`/admin/users/${id}/toggle`);
    showToast(data.message, "success");
    renderAdminTab("users");
  } catch (err) { showToast(err.message, "error"); }
}

async function adminUpdateEnquiry(id, status) {
  try {
    await PATCH(`/enquiries/${id}/status`, { status });
    showToast(`Enquiry marked as '${status}'`, "success");
  } catch (err) { showToast(err.message, "error"); }
}

async function adminApproveProperty(id) {
  try {
    await PATCH(`/properties/${id}/status`, { status: "active" });
    showToast("Property approved and is now live!", "success");
    renderAdminTab("approvals");
    loadAdminDashboard();
  } catch (err) { showToast(err.message, "error"); }
}

async function adminRejectProperty(id) {
  try {
    await PATCH(`/properties/${id}/status`, { status: "rejected" });
    showToast("Property rejected.", "success");
    renderAdminTab("approvals");
  } catch (err) { showToast(err.message, "error"); }
}

// ═══════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════
function loadProfile() {
  if (!currentUser) { showPage("home"); showModal("loginModal"); return; }
  document.getElementById("profileAvatar").textContent     = currentUser.first_name[0].toUpperCase();
  document.getElementById("profileName").textContent       = `${currentUser.first_name} ${currentUser.last_name}`;
  document.getElementById("profileRoleDisplay").textContent = currentUser.role === "admin" ? "⭐ Administrator" : "Member";
  document.getElementById("editName").value  = `${currentUser.first_name} ${currentUser.last_name}`;
  document.getElementById("editEmail").value = currentUser.email;
  document.getElementById("editPhone").value = currentUser.phone || "";
  document.getElementById("editCity").value  = currentUser.city  || "";
  updateFavCount();
}

async function saveProfile() {
  const fullName = document.getElementById("editName").value.trim().split(" ");
  const first_name = fullName[0] || currentUser.first_name;
  const last_name  = fullName.slice(1).join(" ") || currentUser.last_name;
  const phone = document.getElementById("editPhone").value.trim();
  const city  = document.getElementById("editCity").value.trim();

  try {
    await PUT("/auth/me", { first_name, last_name, phone, city });
    currentUser = { ...currentUser, first_name, last_name, phone, city };
    localStorage.setItem("nb_user", JSON.stringify(currentUser));
    onLogin();
    showToast("Profile updated successfully! ✓", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function changePasswordProfile() {
  const current_password = document.getElementById("currentPass").value;
  const new_password     = document.getElementById("newPass").value;
  const confirm          = document.getElementById("confirmPass").value;

  if (!current_password || !new_password) { showToast("Fill in both password fields.", "error"); return; }
  if (new_password !== confirm)            { showToast("Passwords do not match.", "error"); return; }

  try {
    await PUT("/auth/change-password", { current_password, new_password });
    showToast("Password changed successfully!", "success");
    document.getElementById("currentPass").value = "";
    document.getElementById("newPass").value      = "";
    document.getElementById("confirmPass").value  = "";
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ═══════════════════════════════════════════
// ENQUIRIES PAGE
// ═══════════════════════════════════════════
async function loadEnquiries() {
  const list = document.getElementById("enquiriesList");
  if (!list) return;

  if (!currentUser) {
    list.innerHTML = `<div class="empty-state" style="padding:80px"><div class="empty-icon">🔒</div><h3>Please log in</h3><button class="btn btn-primary" onclick="showModal('loginModal')">Login</button></div>`;
    return;
  }

  try {
    const data = await GET("/enquiries");
    if (!data.enquiries.length) {
      list.innerHTML = `<div class="empty-state" style="padding:80px"><div class="empty-icon">📩</div><h3>No enquiries yet</h3><p>When you enquire about a property, it'll appear here.</p><button class="btn btn-primary" onclick="showPage('listings')">Browse Properties</button></div>`;
    } else {
      list.innerHTML = data.enquiries.map((e) => `
        <div class="enquiry-card">
          <div>
            <div class="enq-prop">🏠 ${e.property_title || "Property"}</div>
            <div class="enq-msg">${e.message || ""}</div>
            <div class="enq-date">📅 ${new Date(e.created_at).toLocaleDateString("en-IN")}</div>
          </div>
          <div class="enq-status"><span class="status-badge status-${e.status}">${e.status}</span></div>
        </div>`).join("");
    }
    const el = document.getElementById("pEnqCount");
    if (el) el.textContent = data.enquiries.length;
  } catch (err) {
    list.innerHTML = `<p style="color:red">Failed to load enquiries: ${err.message}</p>`;
  }
}

// ═══════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════
function setRating(n) {
  state.currentRating = n;
  document.querySelectorAll(".star").forEach((s, i) => s.classList.toggle("active", i < n));
}

async function submitReview() {
  if (!currentUser)       { showToast("Please login to write a review.", "error"); return; }
  if (!state.currentRating) { showToast("Please select a rating.", "error"); return; }
  const review_text = document.getElementById("reviewText").value.trim();
  if (!review_text)         { showToast("Please write your review.", "error"); return; }

  try {
    await POST(`/reviews/${state.currentProperty?.id}`, {
      rating: state.currentRating, review_text,
      role_label: currentUser.role === "admin" ? "Administrator" : "Member",
    });
    closeModal("reviewModal");
    showToast("Review submitted! Thank you ⭐", "success");
    state.currentRating = 0;
    document.querySelectorAll(".star").forEach((s) => s.classList.remove("active"));
    // Reload detail page to show new review
    if (state.currentProperty) showDetail(state.currentProperty.id);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ═══════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════
function initChat() {
  addChatMsg("bot", "Hi! Welcome to New Beginnings 🏠 I'm here to help you find your perfect property. How can I assist you today?");
}

function toggleChat()  { document.getElementById("chatBox").classList.toggle("open"); }

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg   = input.value.trim();
  if (!msg) return;
  addChatMsg("user", msg);
  input.value = "";
  setTimeout(() => botReply(msg), 800);
}

function addChatMsg(type, text) {
  const container = document.getElementById("chatMessages");
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const div  = document.createElement("div");
  div.className = `chat-msg ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${time}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function botReply(msg) {
  const m = msg.toLowerCase();
  let reply = "I can help you with property searches, EMI calculations, and more. What would you like to know?";
  if (m.includes("price") || m.includes("cost") || m.includes("budget"))
    reply = "Our properties range from ₹20L to ₹35Cr+. Use our EMI Calculator to plan your budget. What's your range?";
  else if (m.includes("hyderabad") || m.includes("location") || m.includes("area"))
    reply = "We have 400+ properties across Hyderabad — Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, and more!";
  else if (m.includes("emi") || m.includes("loan"))
    reply = "Current home loan rates start at 8.5% p.a. Use our EMI Calculator for precise estimates!";
  else if (m.includes("apartment") || m.includes("flat"))
    reply = "We have 4,200+ apartments listed, from cozy 1BHK studios to luxurious 5BHK penthouses.";
  else if (m.includes("villa") || m.includes("bungalow"))
    reply = "We have 1,800+ villas. Many feature private pools, gardens, and premium finishes.";
  else if (m.includes("hello") || m.includes("hi") || m.includes("hey"))
    reply = "Hello! Great to see you here 😊 Are you looking to buy, rent, or list a property?";
  else if (m.includes("contact") || m.includes("call"))
    reply = "Reach us at +91 98765 43210 or hello@newbeginnings.in. Mon–Sat, 9AM–7PM.";
  addChatMsg("bot", reply);
}

// ═══════════════════════════════════════════
// MODALS & TOAST
// ═══════════════════════════════════════════
function showModal(id)  { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

function showToast(msg, type = "") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className   = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}
