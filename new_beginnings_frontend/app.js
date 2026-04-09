/* =============================================
   NEW BEGINNINGS — REAL ESTATE PORTAL
   Frontend JavaScript Logic
============================================= */

// ==============================
// DATA STORE
// ==============================
const DB = {
  users: [
    { id: 1, email: 'user@demo.com', password: 'demo123', firstName: 'Arjun', lastName: 'Sharma', phone: '+91 98765 43210', city: 'Hyderabad', role: 'user' },
    { id: 2, email: 'admin@demo.com', password: 'admin123', firstName: 'Admin', lastName: 'User', phone: '+91 98765 00000', city: 'Hyderabad', role: 'admin' }
  ],
  properties: [
    { id: 1, title: 'Luxury 3BHK in Banjara Hills', type: 'Apartment', price: 8500000, area: 1800, beds: 3, baths: 3, city: 'Hyderabad', locality: 'Banjara Hills', address: 'Road No. 12, Banjara Hills, Hyderabad', description: 'A stunning luxury apartment with panoramic city views. Premium fittings, modular kitchen, and world-class amenities make this a dream home.', amenities: ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift'], owner: 'Rajesh Reddy', ownerPhone: '+91 98765 12345', rating: 4.8, reviews: 24, badge: 'featured', emoji: '🏢', lat: 17.4156, lng: 78.4347 },
    { id: 2, title: 'Modern Villa in Jubilee Hills', type: 'Villa', price: 25000000, area: 4200, beds: 5, baths: 6, city: 'Hyderabad', locality: 'Jubilee Hills', address: 'Plot 23, Road 36, Jubilee Hills', description: 'An architectural masterpiece spanning 4200 sq.ft. Sprawling lawns, private swimming pool, and luxury interiors define this property.', amenities: ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift', 'Garden', 'Club House'], owner: 'Priya Nair', ownerPhone: '+91 98765 23456', rating: 4.9, reviews: 12, badge: 'featured', emoji: '🏡', lat: 17.4229, lng: 78.4062 },
    { id: 3, title: 'Affordable 2BHK in Kukatpally', type: 'Apartment', price: 4200000, area: 1100, beds: 2, baths: 2, city: 'Hyderabad', locality: 'Kukatpally', address: 'KPHB Phase 6, Kukatpally', description: 'Well-maintained apartment in a prime residential area. Close to HITEC City, ideal for IT professionals.', amenities: ['Parking', 'Security', 'Power Backup', 'Lift'], owner: 'Mohammed Farhan', ownerPhone: '+91 98765 34567', rating: 4.2, reviews: 31, badge: 'new', emoji: '🏠', lat: 17.4947, lng: 78.3996 },
    { id: 4, title: 'Commercial Space in Madhapur', type: 'Commercial', price: 15000000, area: 3500, beds: 0, baths: 4, city: 'Hyderabad', locality: 'Madhapur', address: 'Cyber Towers, Madhapur, Hyderabad', description: 'Premium Grade-A commercial office space in the heart of HITEC City. Excellent connectivity and modern infrastructure.', amenities: ['Parking', 'Security', 'Power Backup', 'Lift', 'Club House'], owner: 'Suresh Kumar', ownerPhone: '+91 98765 45678', rating: 4.5, reviews: 8, badge: 'hot', emoji: '🏗️', lat: 17.4486, lng: 78.3908 },
    { id: 5, title: 'Independent House in Kompally', type: 'Independent House', price: 6800000, area: 2200, beds: 4, baths: 3, city: 'Hyderabad', locality: 'Kompally', address: 'Suchitra Junction, Kompally', description: 'Spacious independent house with a beautiful garden. Perfect for families looking for space and privacy.', amenities: ['Parking', 'Garden', 'Security'], owner: 'Lakshmi Devi', ownerPhone: '+91 98765 56789', rating: 4.3, reviews: 15, badge: 'new', emoji: '🏘️', lat: 17.5463, lng: 78.4884 },
    { id: 6, title: 'Plot in Shamshabad', type: 'Land / Plot', price: 3500000, area: 2000, beds: 0, baths: 0, city: 'Hyderabad', locality: 'Shamshabad', address: 'Near RGIA, Shamshabad', description: 'DTCP approved layout plot with clear titles. Excellent investment opportunity near international airport.', amenities: [], owner: 'Ravi Teja', ownerPhone: '+91 98765 67890', rating: 4.0, reviews: 6, badge: 'featured', emoji: '🌿', lat: 17.2403, lng: 78.4294 },
    { id: 7, title: '1BHK Studio in Gachibowli', type: 'Apartment', price: 2800000, area: 650, beds: 1, baths: 1, city: 'Hyderabad', locality: 'Gachibowli', address: 'DLF Cyber City, Gachibowli', description: 'Compact studio apartment ideal for working professionals. Fully furnished with modern amenities.', amenities: ['Parking', 'Gym', 'Security', 'Power Backup', 'Lift', 'Swimming Pool'], owner: 'Ananya Singh', ownerPhone: '+91 98765 78901', rating: 4.6, reviews: 42, badge: 'hot', emoji: '🏢', lat: 17.4400, lng: 78.3489 },
    { id: 8, title: 'Luxury Penthouse in Hitech City', type: 'Apartment', price: 35000000, area: 5500, beds: 5, baths: 6, city: 'Hyderabad', locality: 'HITEC City', address: 'Salarpuria Sattva, HITEC City', description: 'Sky-high penthouse with 360° city views. Private terrace, jacuzzi, home theatre and sky lounge.', amenities: ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift', 'Garden', 'Club House'], owner: 'Vikram Malhotra', ownerPhone: '+91 98765 89012', rating: 5.0, reviews: 4, badge: 'featured', emoji: '🌆', lat: 17.4475, lng: 78.3762 },
    { id: 9, title: 'Villa in Gandipet', type: 'Villa', price: 18000000, area: 3800, beds: 4, baths: 5, city: 'Hyderabad', locality: 'Gandipet', address: 'Osman Sagar Road, Gandipet', description: 'Lakeside villa with serene Osman Sagar views. Private boat dock, organic farm, and infinity pool.', amenities: ['Parking', 'Swimming Pool', 'Garden', 'Security'], owner: 'Harsha Varma', ownerPhone: '+91 98765 90123', rating: 4.7, reviews: 9, badge: 'featured', emoji: '🏡', lat: 17.3942, lng: 78.2952 },
    { id: 10, title: '3BHK in Miyapur', type: 'Apartment', price: 5200000, area: 1450, beds: 3, baths: 2, city: 'Hyderabad', locality: 'Miyapur', address: 'Metro Station Road, Miyapur', description: 'Well-located apartment near Miyapur Metro Station. Modern amenities and excellent connectivity.', amenities: ['Parking', 'Security', 'Power Backup', 'Lift'], owner: 'Srinivas Rao', ownerPhone: '+91 98765 01234', rating: 4.1, reviews: 18, badge: 'new', emoji: '🏠', lat: 17.4953, lng: 78.3488 },
    { id: 11, title: 'Commercial Plot in Uppal', type: 'Land / Plot', price: 7500000, area: 3000, beds: 0, baths: 0, city: 'Hyderabad', locality: 'Uppal', address: 'Uppal X Roads, Hyderabad', description: 'Prime commercial plot on main road with high visibility. Suitable for showroom, hospital or retail outlet.', amenities: [], owner: 'Praveen Kumar', ownerPhone: '+91 98765 11111', rating: 4.3, reviews: 5, badge: 'hot', emoji: '🌿', lat: 17.4057, lng: 78.5590 },
    { id: 12, title: 'Heritage Bungalow in Secunderabad', type: 'Independent House', price: 12000000, area: 3200, beds: 5, baths: 4, city: 'Hyderabad', locality: 'Secunderabad', address: 'Trimulgherry, Secunderabad', description: 'Rare 80-year-old heritage bungalow with colonial architecture. Restored with modern amenities while preserving original charm.', amenities: ['Parking', 'Garden', 'Security'], owner: 'Col. Anand Krishnan', ownerPhone: '+91 98765 22222', rating: 4.8, reviews: 7, badge: 'featured', emoji: '🏛️', lat: 17.4399, lng: 78.4983 }
  ],
  favorites: [],
  enquiries: [],
  reviews: [
    { id: 1, name: 'Siddharth Reddy', role: 'Home Buyer', rating: 5, text: 'New Beginnings made our house-hunting journey so seamless! The filters, the map view, and the EMI calculator helped us make a confident decision. Found our dream home in Banjara Hills.' },
    { id: 2, name: 'Meena Krishnan', role: 'Property Seller', rating: 5, text: 'As a seller, the platform gave my property incredible visibility. Within 2 weeks of listing, I had 12 enquiries. The admin panel is very professional and intuitive.' },
    { id: 3, name: 'Rahul Agarwal', role: 'Real Estate Investor', rating: 4, text: 'The comparison feature is a game-changer. I compared 3 properties side by side and made my investment decision confidently. Highly recommend for anyone serious about real estate.' }
  ],
  compareList: [null, null, null],
  currentRating: 0,
  currentProperty: null,
  pickerSlot: 0
};

// Current logged-in user
let currentUser = null;
// Filtered properties
let filteredProps = [...DB.properties];
let selectedBeds = '';
let currentPage = 1;
const PAGE_SIZE = 8;

// ==============================
// INIT
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMapPins();
  renderFeatured();
  renderRecommended();
  renderReviews();
  renderListings();
  calcEMI();
  renderAdminTab('properties');
  renderEnquiries();
  addNavScrollEffect();
  initChat();

  // Restore session
  const saved = sessionStorage.getItem('nbUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    onLogin();
  }
});

// ==============================
// NAVIGATION
// ==============================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update active nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Special page logic
  if (name === 'listings') renderListings();
  if (name === 'favorites') renderFavorites();
  if (name === 'admin' && (!currentUser || currentUser.role !== 'admin')) { showToast('Access denied. Admin only.', 'error'); showPage('home'); return; }
  if (name === 'admin') renderAdminTab('properties');
  if (name === 'profile') loadProfile();
  if (name === 'enquiries') renderEnquiries();
  if (name === 'add-property' && !currentUser) { showToast('Please login to list a property.', 'error'); showModal('loginModal'); return; }
  if (name === 'calculator') calcEMI();
  if (name === 'compare') { initCompareSlots(); }
  if (name === 'buying') { renderBuyingGrid(); updateMiniEMI(); initChecklist(); }
  if (name === 'sell' && !currentUser) { showToast('Please login to sell a property.', 'error'); showModal('loginModal'); return; }
  if (name === 'sell' && currentUser) prefillSellForm();

  closeDropdown();
  closeMenu();
}

function addNavScrollEffect() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ==============================
// PARTICLES
// ==============================
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*15+8}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(p);
  }
}

// ==============================
// MAP PINS
// ==============================
function initMapPins() {
  const container = document.getElementById('mapPins');
  const positions = [
    {left:'20%',top:'30%',emoji:'📍'},{left:'45%',top:'50%',emoji:'📍'},
    {left:'65%',top:'35%',emoji:'📍'},{left:'30%',top:'65%',emoji:'📍'},
    {left:'75%',top:'60%',emoji:'📍'},{left:'55%',top:'25%',emoji:'📍'},
  ];
  positions.forEach((pos, i) => {
    const pin = document.createElement('div');
    pin.classList.add('map-pin');
    pin.style.cssText = `left:${pos.left};top:${pos.top};animation-delay:${i*0.4}s`;
    pin.innerHTML = `<span title="${DB.properties[i]?.locality||'Property'}">${pos.emoji}</span>`;
    pin.onclick = () => { if(DB.properties[i]) showDetail(DB.properties[i].id); };
    container.appendChild(pin);
  });
}

// ==============================
// AUTH
// ==============================
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Please fill in all fields.', 'error'); return; }
  const user = DB.users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('Invalid email or password.', 'error'); return; }
  currentUser = user;
  sessionStorage.setItem('nbUser', JSON.stringify(user));
  onLogin();
  closeModal('loginModal');
  showToast(`Welcome back, ${user.firstName}! 👋`, 'success');
}

function quickLogin(email, pass, role) {
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = pass;
  doLogin();
}

function doRegister() {
  const first = document.getElementById('regFirst').value.trim();
  const last = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const pass = document.getElementById('regPass').value;
  const confirm = document.getElementById('regPassConfirm').value;
  const agreed = document.getElementById('agreeTerms').checked;

  if (!first || !last || !email || !pass) { showToast('Please fill all required fields.', 'error'); return; }
  if (pass !== confirm) { showToast('Passwords do not match.', 'error'); return; }
  if (pass.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
  if (!agreed) { showToast('Please agree to Terms & Conditions.', 'error'); return; }
  if (DB.users.find(u => u.email === email)) { showToast('Email already registered.', 'error'); return; }

  const newUser = { id: DB.users.length+1, email, password: pass, firstName: first, lastName: last, phone, city: '', role: 'user' };
  DB.users.push(newUser);
  currentUser = newUser;
  sessionStorage.setItem('nbUser', JSON.stringify(newUser));
  onLogin();
  closeModal('registerModal');
  showToast(`Welcome to New Beginnings, ${first}! 🏠`, 'success');
}

function onLogin() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('userMenu').style.display = 'flex';
  document.getElementById('userInitial').textContent = currentUser.firstName[0];
  document.getElementById('dropdownName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById('dropdownRole').textContent = currentUser.role === 'admin' ? '⭐ Administrator' : 'Member';
  if (currentUser.role === 'admin') document.getElementById('adminNavItem').style.display = 'block';
  else document.getElementById('adminNavItem').style.display = 'none';
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('nbUser');
  document.getElementById('authButtons').style.display = 'flex';
  document.getElementById('userMenu').style.display = 'none';
  document.getElementById('adminNavItem').style.display = 'none';
  showPage('home');
  showToast('Logged out successfully. See you soon!');
  closeDropdown();
}

function doForgotPass() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) { showToast('Please enter your email.', 'error'); return; }
  showToast('Password reset link sent to your email! ✉️', 'success');
  closeModal('forgotModal');
}

function togglePassword(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function checkPassStrength() {
  const val = document.getElementById('regPass').value;
  const bar = document.getElementById('passStrength');
  if (val.length === 0) { bar.className = 'pass-strength'; return; }
  if (val.length < 6) bar.className = 'pass-strength strength-weak';
  else if (val.length < 10) bar.className = 'pass-strength strength-medium';
  else bar.className = 'pass-strength strength-strong';
}

function toggleDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}
function closeDropdown() {
  document.getElementById('userDropdown').classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) closeDropdown();
});

// ==============================
// PROPERTY CARDS
// ==============================
function formatPrice(p) {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p/100000).toFixed(1)}L`;
  return `₹${p.toLocaleString()}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '★'.repeat(full);
  if (half) s += '☆';
  return s;
}

function isFav(id) { return DB.favorites.includes(id); }

function buildCard(prop) {
  const fav = isFav(prop.id);
  const inCompare = DB.compareList.includes(prop.id);
  return `
    <div class="property-card" data-id="${prop.id}">
      <div class="card-image-wrap">
        <div class="card-image" onclick="showDetail(${prop.id})">${prop.emoji}</div>
        ${prop.badge ? `<div class="card-badge badge-${prop.badge}">${prop.badge}</div>` : ''}
        <button class="card-fav ${fav?'active':''}" onclick="toggleFav(${prop.id},this)" title="Save property">
          ${fav ? '❤️' : '🤍'}
        </button>
        <div class="card-price-tag">${formatPrice(prop.price)}</div>
        <button class="card-compare ${inCompare?'active':''}" onclick="addToCompare(${prop.id})">⚖ Compare</button>
      </div>
      <div class="card-body" onclick="showDetail(${prop.id})">
        <div class="card-type">${prop.type}</div>
        <div class="card-title">${prop.title}</div>
        <div class="card-location">${prop.locality}, ${prop.city}</div>
        <div class="card-specs">
          ${prop.beds > 0 ? `<div class="spec">🛏 ${prop.beds} BHK</div>` : ''}
          ${prop.baths > 0 ? `<div class="spec">🚿 ${prop.baths} Bath</div>` : ''}
          <div class="spec">📐 ${prop.area.toLocaleString()} sqft</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-rating">
          <span class="stars">${renderStars(prop.rating)}</span>
          <span>${prop.rating} (${prop.reviews})</span>
        </div>
        <div class="card-actions">
          <button class="card-action-btn btn-enquire" onclick="openEnquiry(${prop.id})">Enquire</button>
          <button class="card-action-btn btn-view" onclick="showDetail(${prop.id})">View →</button>
        </div>
      </div>
    </div>
  `;
}

// ==============================
// FEATURED & RECOMMENDED
// ==============================
function renderFeatured() {
  const featured = DB.properties.filter(p => p.badge === 'featured').slice(0, 6);
  document.getElementById('featuredGrid').innerHTML = featured.map(buildCard).join('');
}

function renderRecommended() {
  // Simulate AI recommendation by picking high-rated properties
  const rec = [...DB.properties].sort((a,b) => b.rating - a.rating).slice(0, 4);
  document.getElementById('recommendedGrid').innerHTML = rec.map(buildCard).join('');
}

// ==============================
// REVIEWS
// ==============================
function renderReviews() {
  document.getElementById('reviewsGrid').innerHTML = DB.reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.name[0]}</div>
        <div><div class="review-name">${r.name}</div><div class="review-role">${r.role}</div></div>
      </div>
    </div>
  `).join('');
}

// ==============================
// LISTINGS & FILTERS
// ==============================
function renderListings() {
  applyFilters();
}

function applyFilters() {
  const search = document.getElementById('filterSearch')?.value.toLowerCase() || '';
  const checkedTypes = [...document.querySelectorAll('.checkbox-group input:checked')].map(c => c.value);
  const priceMin = parseFloat(document.getElementById('priceMin')?.value) || 0;
  const priceMax = parseFloat(document.getElementById('priceMax')?.value) || Infinity;
  const areaMin = parseFloat(document.getElementById('areaMin')?.value) || 0;
  const areaMax = parseFloat(document.getElementById('areaMax')?.value) || Infinity;
  const sortBy = document.getElementById('sortBy')?.value || 'newest';

  filteredProps = DB.properties.filter(p => {
    if (search && !p.title.toLowerCase().includes(search) && !p.city.toLowerCase().includes(search) && !p.locality.toLowerCase().includes(search)) return false;
    if (checkedTypes.length && !checkedTypes.includes(p.type)) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (p.area < areaMin || p.area > areaMax) return false;
    if (selectedBeds && p.beds !== parseInt(selectedBeds) && !(selectedBeds === '4' && p.beds >= 4)) return false;
    return true;
  });

  // Sort
  if (sortBy === 'price-asc') filteredProps.sort((a,b) => a.price - b.price);
  else if (sortBy === 'price-desc') filteredProps.sort((a,b) => b.price - a.price);
  else if (sortBy === 'area') filteredProps.sort((a,b) => b.area - a.area);
  else if (sortBy === 'rating') filteredProps.sort((a,b) => b.rating - a.rating);

  currentPage = 1;
  renderPage();
}

function renderPage() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageProps = filteredProps.slice(start, start + PAGE_SIZE);
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  if (pageProps.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><h3>No properties found</h3><p>Try adjusting your filters.</p><button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button></div>`;
  } else {
    grid.innerHTML = pageProps.map(buildCard).join('');
  }

  const rc = document.getElementById('resultsCount');
  if (rc) rc.innerHTML = `Showing <strong>${Math.min(start+1, filteredProps.length)}–${Math.min(start+PAGE_SIZE, filteredProps.length)}</strong> of <strong>${filteredProps.length}</strong> properties`;

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProps.length / PAGE_SIZE);
  const pg = document.getElementById('pagination');
  if (!pg) return;
  if (totalPages <= 1) { pg.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goToPage(${i})">${i}</button>`;
  }
  pg.innerHTML = html;
}

function goToPage(n) {
  currentPage = n;
  renderPage();
  document.querySelector('.listings-results')?.scrollIntoView({ behavior: 'smooth' });
}

function clearFilters() {
  document.getElementById('filterSearch').value = '';
  document.querySelectorAll('.checkbox-group input').forEach(c => c.checked = false);
  document.getElementById('priceMin').value = '';
  document.getElementById('priceMax').value = '';
  document.getElementById('areaMin').value = '';
  document.getElementById('areaMax').value = '';
  document.getElementById('sortBy').value = 'newest';
  selectedBeds = '';
  document.querySelectorAll('.bed-btn').forEach(b => b.classList.remove('active'));
  applyFilters();
}

function setBeds(btn, val) {
  if (selectedBeds === val) {
    selectedBeds = '';
    btn.classList.remove('active');
  } else {
    selectedBeds = val;
    document.querySelectorAll('.bed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  applyFilters();
}

function setView(btn, mode) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('listingsGrid');
  if (mode === 'list') grid.classList.add('list-view');
  else grid.classList.remove('list-view');
}

// HERO SEARCH
function doSearch() {
  const loc = document.getElementById('searchLocation').value;
  const type = document.getElementById('searchType').value;
  const budget = document.getElementById('searchBudget').value;
  const beds = document.getElementById('searchBeds').value;

  showPage('listings');

  // Apply search to filters
  if (loc && document.getElementById('filterSearch')) {
    document.getElementById('filterSearch').value = loc;
  }

  setTimeout(() => {
    if (budget) {
      const [min, max] = budget.split('-').map(Number);
      document.getElementById('priceMin').value = min || '';
      document.getElementById('priceMax').value = max || '';
    }
    applyFilters();
  }, 100);
}

function setSearchTab(btn, mode) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function filterByType(type) {
  showPage('listings');
  setTimeout(() => {
    document.querySelectorAll('.checkbox-group input').forEach(c => {
      c.checked = c.value === type;
    });
    applyFilters();
  }, 100);
}

// ==============================
// PROPERTY DETAIL
// ==============================
function showDetail(id) {
  const prop = DB.properties.find(p => p.id === id);
  if (!prop) return;
  DB.currentProperty = prop;

  const fav = isFav(prop.id);
  const propReviews = DB.enquiries.filter(e => e.propertyId === prop.id && e.type === 'review');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero">
      <div class="gallery-main">${prop.emoji}</div>
      <div class="detail-overlay">
        <div class="detail-overlay-content">
          <div class="detail-badge">${prop.type}</div>
          <h1 style="font-size:clamp(24px,4vw,42px);color:white;font-family:'Cormorant Garamond',serif;margin-bottom:8px">${prop.title}</h1>
          <div style="color:rgba(255,255,255,0.7);margin-bottom:12px">📍 ${prop.address}</div>
          <div class="detail-price">${formatPrice(prop.price)}</div>
        </div>
      </div>
      <div class="detail-actions">
        <button class="detail-action-btn dab-fav" onclick="toggleFav(${prop.id},this)">${fav?'❤️':'🤍'} ${fav?'Saved':'Save'}</button>
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
          <!-- SPECS -->
          <div class="detail-section">
            <h3>Property Overview</h3>
            <div class="specs-grid">
              <div class="spec-item"><div class="spec-icon">💰</div><div class="spec-value">${formatPrice(prop.price)}</div><div class="spec-label">Price</div></div>
              <div class="spec-item"><div class="spec-icon">📐</div><div class="spec-value">${prop.area.toLocaleString()} sqft</div><div class="spec-label">Total Area</div></div>
              ${prop.beds > 0 ? `<div class="spec-item"><div class="spec-icon">🛏</div><div class="spec-value">${prop.beds} BHK</div><div class="spec-label">Bedrooms</div></div>` : ''}
              ${prop.baths > 0 ? `<div class="spec-item"><div class="spec-icon">🚿</div><div class="spec-value">${prop.baths}</div><div class="spec-label">Bathrooms</div></div>` : ''}
              <div class="spec-item"><div class="spec-icon">🏙</div><div class="spec-value">${prop.locality}</div><div class="spec-label">Locality</div></div>
              <div class="spec-item"><div class="spec-icon">⭐</div><div class="spec-value">${prop.rating}/5</div><div class="spec-label">Rating</div></div>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="detail-section">
            <h3>About this Property</h3>
            <p style="color:var(--text-mid);line-height:1.8;font-size:16px">${prop.description}</p>
            <p style="color:var(--text-mid);line-height:1.8;font-size:16px;margin-top:16px">This property offers an exceptional living experience with its prime location and world-class amenities. The ${prop.area} sqft layout is designed to maximize natural light and ventilation, creating a comfortable and welcoming environment for residents.</p>
          </div>

          <!-- AMENITIES -->
          ${prop.amenities.length > 0 ? `
          <div class="detail-section">
            <h3>Amenities</h3>
            <div class="amenities-list">
              ${prop.amenities.map(a => `<div class="amenity-tag">✓ ${a}</div>`).join('')}
            </div>
          </div>` : ''}

          <!-- MAP -->
          <div class="detail-section">
            <h3>Location & Neighbourhood</h3>
            <div class="map-embed">
              <div class="map-embed-inner">
                <span style="font-size:36px">🗺️</span>
                <span>Google Maps: ${prop.address}</span>
                <span style="font-size:12px">Lat: ${prop.lat}, Lng: ${prop.lng}</span>
              </div>
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">
              <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🏫</b> School 0.8km</div>
              <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🏥</b> Hospital 1.2km</div>
              <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🛒</b> Mall 0.5km</div>
              <div style="background:var(--off-white);border-radius:8px;padding:12px 16px;font-size:13px"><b>🚇</b> Metro 0.6km</div>
            </div>
          </div>

          <!-- REVIEWS -->
          <div class="detail-section">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid var(--border)">
              <h3 style="border:none;margin:0;padding:0">Reviews & Ratings</h3>
              <button class="btn btn-primary btn-sm" onclick="showModal('reviewModal')">Write a Review</button>
            </div>
            <div style="background:var(--off-white);border-radius:var(--radius);padding:20px;display:flex;align-items:center;gap:24px;margin-bottom:24px">
              <div style="text-align:center">
                <div style="font-family:'Cormorant Garamond',serif;font-size:56px;color:var(--primary);font-weight:600">${prop.rating}</div>
                <div style="color:#f59e0b;font-size:20px">${renderStars(prop.rating)}</div>
                <div style="font-size:13px;color:var(--text-light)">${prop.reviews} reviews</div>
              </div>
              <div style="flex:1">
                ${[5,4,3,2,1].map(n => `
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                    <span style="font-size:13px;width:20px">${n}★</span>
                    <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden">
                      <div style="height:100%;background:#f59e0b;border-radius:4px;width:${n===5?65:n===4?20:n===3?10:n===2?3:2}%"></div>
                    </div>
                    <span style="font-size:13px;color:var(--text-light);width:30px">${n===5?65:n===4?20:n===3?10:n===2?3:2}%</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="color:var(--text-light);font-size:14px;text-align:center;padding:20px">Be the first to share your experience with this property.</div>
          </div>
        </div>

        <!-- SIDEBAR -->
        <div class="detail-sidebar">
          <div class="sidebar-card">
            <h4>Contact Owner</h4>
            <div class="owner-info">
              <div class="owner-avatar">${prop.owner[0]}</div>
              <div><div class="owner-name">${prop.owner}</div><div class="owner-type">Property Owner</div></div>
            </div>
            <div class="contact-btns">
              <button class="contact-btn cb-call" onclick="showToast('Calling ${prop.ownerPhone}...','success')">📞 Call: ${prop.ownerPhone}</button>
              <button class="contact-btn cb-whatsapp" onclick="showToast('Opening WhatsApp...','success')">💬 WhatsApp</button>
              <button class="contact-btn cb-enquiry" onclick="openEnquiry(${prop.id})">📩 Send Enquiry</button>
            </div>
          </div>

          <div class="sidebar-card">
            <h4>Quick EMI</h4>
            <div style="background:var(--off-white);border-radius:8px;padding:16px;text-align:center">
              <div style="font-size:13px;color:var(--text-light)">For ${formatPrice(prop.price)} at 8.5% interest</div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--primary);font-weight:600;margin:8px 0">${quickEMI(prop.price)}</div>
              <div style="font-size:12px;color:var(--text-light)">per month (20yr, 20% down)</div>
            </div>
            <button class="btn btn-outline-dark full-width mt-20" style="text-align:center;justify-content:center" onclick="showPage('calculator')">Full EMI Calculator →</button>
          </div>

          <div class="sidebar-card">
            <h4>Schedule Visit</h4>
            <div class="form-group">
              <label>Preferred Date</label>
              <input type="date" style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:8px">
            </div>
            <div class="form-group">
              <label>Preferred Time</label>
              <select style="width:100%;padding:10px;border:1.5px solid var(--border);border-radius:8px">
                <option>Morning (9–12 AM)</option>
                <option>Afternoon (12–3 PM)</option>
                <option>Evening (4–7 PM)</option>
              </select>
            </div>
            <button class="btn btn-primary full-width" onclick="showToast('Visit scheduled! Owner will confirm shortly.','success')">Schedule Visit</button>
          </div>
        </div>
      </div>
    </div>
  `;

  showPage('detail');
}

function quickEMI(price) {
  const loan = price * 0.8;
  const r = 8.5 / 100 / 12;
  const n = 20 * 12;
  const emi = loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  return `₹${Math.round(emi).toLocaleString()}`;
}

function shareProperty() {
  showToast('Link copied to clipboard! 🔗', 'success');
}

// ==============================
// FAVORITES
// ==============================
function toggleFav(id, btn) {
  if (!currentUser) { showToast('Please login to save properties.', 'error'); showModal('loginModal'); return; }
  const idx = DB.favorites.indexOf(id);
  if (idx === -1) {
    DB.favorites.push(id);
    btn.textContent = '❤️';
    btn.classList.add('active');
    showToast('Added to favorites! ❤️', 'success');
  } else {
    DB.favorites.splice(idx, 1);
    btn.textContent = '🤍';
    btn.classList.remove('active');
    showToast('Removed from favorites.');
  }
  updateFavCount();
}

function updateFavCount() {
  const el = document.getElementById('pFavCount');
  if (el) el.textContent = DB.favorites.length;
}

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const noFav = document.getElementById('noFavorites');
  if (DB.favorites.length === 0) {
    grid.innerHTML = '';
    noFav.style.display = 'block';
  } else {
    noFav.style.display = 'none';
    const favProps = DB.properties.filter(p => DB.favorites.includes(p.id));
    grid.innerHTML = favProps.map(buildCard).join('');
  }
}

// ==============================
// ENQUIRY
// ==============================
function openEnquiry(propId) {
  const prop = DB.properties.find(p => p.id === propId);
  document.getElementById('enquiryPropName').textContent = `For: ${prop?.title}`;
  if (currentUser) {
    document.getElementById('enqName').value = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('enqEmail').value = currentUser.email;
    document.getElementById('enqPhone').value = currentUser.phone || '';
  }
  document.getElementById('enqMessage').value = `Hi, I'm interested in "${prop?.title}" listed at ${formatPrice(prop?.price)}. Please share more details.`;
  DB.currentProperty = prop;
  showModal('enquiryModal');
}

function submitEnquiry() {
  const name = document.getElementById('enqName').value;
  const email = document.getElementById('enqEmail').value;
  const msg = document.getElementById('enqMessage').value;
  if (!name || !email) { showToast('Please fill required fields.', 'error'); return; }

  DB.enquiries.push({
    id: DB.enquiries.length + 1,
    propertyId: DB.currentProperty?.id,
    propertyTitle: DB.currentProperty?.title,
    name, email,
    phone: document.getElementById('enqPhone').value,
    message: msg,
    date: new Date().toLocaleDateString('en-IN'),
    status: 'Sent',
    type: 'enquiry'
  });

  closeModal('enquiryModal');
  showToast('Enquiry sent successfully! Owner will contact you soon. 📩', 'success');
  if (document.getElementById('pEnqCount')) document.getElementById('pEnqCount').textContent = DB.enquiries.filter(e => e.type==='enquiry').length;
}

// ==============================
// ADD PROPERTY
// ==============================
function previewImages(event) {
  const previews = document.getElementById('imagePreviews');
  previews.innerHTML = '';
  [...event.target.files].forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `<img src="${e.target.result}" alt="Preview"><button class="preview-remove" onclick="this.parentElement.remove()">✕</button>`;
      previews.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function submitProperty(e) {
  e.preventDefault();
  if (!currentUser) { showToast('Please login to list a property.', 'error'); return; }
  const title = document.getElementById('propTitle').value;
  const type = document.getElementById('propType').value;
  const price = parseInt(document.getElementById('propPrice').value);
  const area = parseInt(document.getElementById('propArea').value);
  const beds = parseInt(document.getElementById('propBeds').value) || 0;
  const city = document.getElementById('propCity').value;
  const locality = document.getElementById('propLocality').value;

  const emojis = { 'Apartment':'🏢', 'Villa':'🏡', 'Independent House':'🏠', 'Land / Plot':'🌿', 'Commercial':'🏗️' };
  const amenities = [...document.querySelectorAll('#amenitiesGrid input:checked')].map(c => c.value);

  const newId = Date.now();
  const newProp = {
    id: newId, title, type, price, area, beds,
    baths: parseInt(document.getElementById('propBaths').value) || 1,
    city, locality, description: document.getElementById('propDesc').value,
    amenities, owner: `${currentUser.firstName} ${currentUser.lastName}`,
    ownerPhone: document.getElementById('ownerPhone').value || currentUser.phone,
    rating: 0, reviews: 0, badge: 'new',
    emoji: emojis[type] || '🏠',
    address: document.getElementById('propAddress').value,
    lat: 17.4 + Math.random()*0.2, lng: 78.3 + Math.random()*0.3,
    addedAt: Date.now()
  };

  DB.properties.unshift(newProp);
  DB.lastAddedId = newId;

  // Reset form fields
  e.target.reset();
  const previews = document.getElementById('imagePreviews');
  if (previews) previews.innerHTML = '';

  // Navigate to listings with success banner
  showListingsWithNewPropertyBanner(title);
}

// ==============================
// COMPARE
// ==============================
function initCompareSlots() {
  renderCompareSlots();
}

function renderCompareSlots() {
  const container = document.getElementById('compareSlots');
  container.innerHTML = DB.compareList.map((id, i) => {
    const prop = id ? DB.properties.find(p => p.id === id) : null;
    if (prop) {
      return `
        <div class="compare-slot filled">
          <div style="font-size:32px">${prop.emoji}</div>
          <div style="font-weight:600;font-size:14px;text-align:center;padding:0 8px">${prop.title}</div>
          <div style="color:var(--accent);font-size:16px">${formatPrice(prop.price)}</div>
          <button onclick="removeFromCompare(${i})" style="font-size:11px;padding:4px 10px;border:1px solid var(--danger);border-radius:6px;background:white;color:var(--danger);cursor:pointer;margin-top:4px">Remove</button>
        </div>`;
    }
    return `<div class="compare-slot" onclick="showPropertyPicker(${i})"><div class="slot-icon">+</div><div>Add Property</div></div>`;
  }).join('');
}

function addToCompare(id) {
  if (DB.compareList.includes(id)) { showToast('Already in comparison!'); return; }
  const slot = DB.compareList.indexOf(null);
  if (slot === -1) { showToast('Comparison is full (max 3). Remove one first.', 'error'); return; }
  DB.compareList[slot] = id;
  showToast('Added to comparison! ⚖️', 'success');
}

function removeFromCompare(i) {
  DB.compareList[i] = null;
  renderCompareSlots();
}

function showPropertyPicker(slot) {
  DB.pickerSlot = slot;
  renderPickerList(DB.properties);
  showModal('pickerModal');
}

function renderPickerList(props) {
  document.getElementById('pickerList').innerHTML = props.map(p => `
    <div class="picker-item" onclick="pickProperty(${p.id})">
      <div class="picker-emoji">${p.emoji}</div>
      <div class="picker-info">
        <div class="picker-name">${p.title}</div>
        <div class="picker-loc">📍 ${p.locality}, ${p.city}</div>
      </div>
      <div class="picker-price">${formatPrice(p.price)}</div>
    </div>
  `).join('');
}

function filterPicker(val) {
  const filtered = DB.properties.filter(p => p.title.toLowerCase().includes(val.toLowerCase()) || p.city.toLowerCase().includes(val.toLowerCase()));
  renderPickerList(filtered);
}

function pickProperty(id) {
  DB.compareList[DB.pickerSlot] = id;
  closeModal('pickerModal');
  renderCompareSlots();
}

function renderComparison() {
  const selected = DB.compareList.filter(id => id !== null).map(id => DB.properties.find(p => p.id === id));
  if (selected.length < 2) { showToast('Please select at least 2 properties to compare.', 'error'); return; }

  const fields = [
    { label: 'Price', key: 'price', format: formatPrice, better: 'min' },
    { label: 'Type', key: 'type', format: v => v, better: 'none' },
    { label: 'Area (sqft)', key: 'area', format: v => v.toLocaleString(), better: 'max' },
    { label: 'Bedrooms', key: 'beds', format: v => v > 0 ? v+' BHK' : 'N/A', better: 'none' },
    { label: 'Bathrooms', key: 'baths', format: v => v > 0 ? v : 'N/A', better: 'none' },
    { label: 'Location', key: 'locality', format: v => v, better: 'none' },
    { label: 'Rating', key: 'rating', format: v => `${v}/5 ⭐`, better: 'max' },
  ];

  const table = document.getElementById('comparisonTable');
  table.style.display = 'block';
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          ${selected.map(p => `<th>${p.emoji} ${p.title}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${fields.map(f => {
          const vals = selected.map(p => p[f.key]);
          const bestIdx = f.better === 'max' ? vals.indexOf(Math.max(...vals)) :
                         f.better === 'min' ? vals.indexOf(Math.min(...vals)) : -1;
          return `
            <tr>
              <td>${f.label}</td>
              ${selected.map((p, i) => `<td class="${i === bestIdx ? 'better-value' : ''}">${f.format(p[f.key])}</td>`).join('')}
            </tr>
          `;
        }).join('')}
        <tr>
          <td>Amenities</td>
          ${selected.map(p => `<td>${p.amenities.slice(0,3).join(', ') || 'None'}${p.amenities.length > 3 ? ` +${p.amenities.length-3} more` : ''}</td>`).join('')}
        </tr>
        <tr>
          <td>Action</td>
          ${selected.map(p => `<td><button class="btn btn-primary btn-sm" onclick="showDetail(${p.id})">View Details</button></td>`).join('')}
        </tr>
      </tbody>
    </table>
  `;
  table.scrollIntoView({ behavior: 'smooth' });
}

// ==============================
// EMI CALCULATOR
// ==============================
function calcEMI() {
  const price = parseFloat(document.getElementById('calcPrice')?.value) || 5000000;
  const down = parseFloat(document.getElementById('calcDown')?.value) || 1000000;
  const rate = parseFloat(document.getElementById('calcRate')?.value) || 8.5;
  const years = parseInt(document.getElementById('calcYears')?.value) || 20;

  const loan = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r > 0 ? loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1) : loan/n;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loan;

  const fmt = v => `₹${Math.round(v).toLocaleString()}`;
  const el = id => document.getElementById(id);
  if (el('emiAmount')) el('emiAmount').textContent = fmt(emi);
  if (el('loanAmount')) el('loanAmount').textContent = fmt(loan);
  if (el('totalInterest')) el('totalInterest').textContent = fmt(totalInterest);
  if (el('totalPayment')) el('totalPayment').textContent = fmt(totalPayment);

  // Donut chart
  const svg = el('donutSvg');
  if (svg && loan > 0) {
    const pct = loan / totalPayment;
    const r1 = 70, cx = 100, cy = 100, sw = 30;
    const dash = 2 * Math.PI * r1;
    const d1 = dash * pct;
    const d2 = dash * (1 - pct);
    svg.innerHTML = `
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#c9a96e" stroke-width="${sw}" stroke-dasharray="${d1} ${dash-d1}" stroke-dashoffset="${dash*0.25}" transform="rotate(-90,${cx},${cy})"/>
      <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="#fc8c8c" stroke-width="${sw}" stroke-dasharray="${d2} ${dash-d2}" stroke-dashoffset="${dash*0.25 - d1}" transform="rotate(-90,${cx},${cy})"/>
      <text x="${cx}" y="${cy-8}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">Principal</text>
      <text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="14" fill="white" font-weight="600">${(pct*100).toFixed(0)}%</text>
    `;
  }
}

function syncCalc(field) {
  const rangeEl = document.getElementById(`calc${field}Range`);
  const inputEl = document.getElementById(`calc${field.charAt(0).toUpperCase()+field.slice(1)}`);
  if (!rangeEl || !inputEl) return;
  if (document.activeElement === rangeEl) {
    const inp = document.getElementById(`calc${field}`);
    if (inp) inp.value = rangeEl.value;
  }
  calcEMI();
}
// Fix sync for range sliders
document.addEventListener('DOMContentLoaded', () => {
  ['Price','Down','Rate','Years'].forEach(f => {
    const range = document.getElementById(`calc${f}Range`);
    const input = document.getElementById(`calc${f.toLowerCase()==='price'?'Price':f.toLowerCase()==='down'?'Down':f.toLowerCase()==='rate'?'Rate':'Years'}`);
    if (range && input) {
      range.addEventListener('input', () => {
        input.value = range.value;
        calcEMI();
      });
    }
  });
});

function toggleAmortization() {
  const table = document.getElementById('amortizationTable');
  const isHidden = table.style.display === 'none';
  if (!isHidden) { table.style.display = 'none'; return; }

  const price = parseFloat(document.getElementById('calcPrice').value) || 5000000;
  const down = parseFloat(document.getElementById('calcDown').value) || 1000000;
  const rate = parseFloat(document.getElementById('calcRate').value) || 8.5;
  const years = parseInt(document.getElementById('calcYears').value) || 20;

  let loan = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r > 0 ? loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1) : loan/n;

  let rows = '<table><thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
  let balance = loan;
  for (let yr = 1; yr <= Math.min(years, 10); yr++) {
    let yearPrincipal = 0, yearInterest = 0;
    for (let mo = 0; mo < 12 && balance > 0; mo++) {
      const interest = balance * r;
      const principal = Math.min(emi - interest, balance);
      yearInterest += interest;
      yearPrincipal += principal;
      balance -= principal;
    }
    rows += `<tr><td>${yr}</td><td>₹${Math.round(yearPrincipal).toLocaleString()}</td><td>₹${Math.round(yearInterest).toLocaleString()}</td><td>₹${Math.max(0,Math.round(balance)).toLocaleString()}</td></tr>`;
  }
  if (years > 10) rows += `<tr><td colspan="4" style="text-align:center;opacity:0.6">... ${years-10} more years</td></tr>`;
  rows += '</tbody></table>';
  table.innerHTML = rows;
  table.style.display = 'block';
}

// ==============================
// ADMIN DASHBOARD
// ==============================
function switchAdminTab(btn, tab) {
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderAdminTab(tab);
}

function renderAdminTab(tab) {
  const content = document.getElementById('adminTabContent');
  if (!content) return;

  if (tab === 'properties') {
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div style="font-size:15px;color:var(--text-mid)">${DB.properties.length} total properties</div>
        <button class="btn btn-primary btn-sm" onclick="showPage('add-property')">+ Add Property</button>
      </div>
      <div class="admin-table">
        <table>
          <thead><tr><th>#</th><th>Property</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.properties.slice(0,10).map((p,i) => `
              <tr>
                <td>${i+1}</td>
                <td><b>${p.emoji} ${p.title}</b><br><span style="font-size:12px;color:var(--text-light)">${p.locality}, ${p.city}</span></td>
                <td>${p.type}</td>
                <td style="font-weight:600;color:var(--accent)">${formatPrice(p.price)}</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>
                  <button class="btn btn-sm" style="background:var(--off-white);border:1px solid var(--border)" onclick="showDetail(${p.id})">View</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteProperty(${p.id})">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'users') {
    content.innerHTML = `
      <div class="admin-table">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${DB.users.map((u,i) => `
              <tr>
                <td>${i+1}</td>
                <td><b>${u.firstName} ${u.lastName}</b></td>
                <td>${u.email}</td>
                <td><span class="status-badge ${u.role==='admin'?'status-pending':'status-active'}">${u.role}</span></td>
                <td><span class="status-badge status-active">Active</span></td>
                <td><button class="btn btn-sm btn-danger" onclick="showToast('User blocked.')">Block</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'enquiries') {
    content.innerHTML = DB.enquiries.length === 0 ? `<div class="empty-state"><div class="empty-icon">📩</div><h3>No enquiries yet</h3></div>` : `
      <div class="admin-table">
        <table>
          <thead><tr><th>#</th><th>From</th><th>Property</th><th>Message</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.enquiries.map((e,i) => `
              <tr>
                <td>${i+1}</td>
                <td><b>${e.name}</b><br><span style="font-size:12px">${e.email}</span></td>
                <td style="font-size:13px">${e.propertyTitle}</td>
                <td style="font-size:13px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.message}</td>
                <td style="font-size:13px">${e.date}</td>
                <td><span class="status-badge status-active">${e.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'approvals') {
    content.innerHTML = `
      <div class="admin-table">
        <table>
          <thead><tr><th>#</th><th>Property</th><th>Submitted By</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-light)">No pending approvals at the moment.</td></tr>
          </tbody>
        </table>
      </div>
    `;
  }
}

function deleteProperty(id) {
  if (!confirm('Are you sure you want to delete this property?')) return;
  const idx = DB.properties.findIndex(p => p.id === id);
  if (idx !== -1) DB.properties.splice(idx, 1);
  renderAdminTab('properties');
  showToast('Property deleted.', 'success');
}

// ==============================
// PROFILE
// ==============================
function loadProfile() {
  if (!currentUser) { showPage('home'); showModal('loginModal'); return; }
  document.getElementById('profileAvatar').textContent = currentUser.firstName[0];
  document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById('profileRoleDisplay').textContent = currentUser.role === 'admin' ? '⭐ Administrator' : 'Member';
  document.getElementById('editName').value = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById('editEmail').value = currentUser.email;
  document.getElementById('editPhone').value = currentUser.phone || '';
  document.getElementById('editCity').value = currentUser.city || '';
  document.getElementById('pFavCount').textContent = DB.favorites.length;
  document.getElementById('pEnqCount').textContent = DB.enquiries.filter(e => e.type === 'enquiry').length;
}

function saveProfile() {
  showToast('Profile updated successfully! ✓', 'success');
}

// ==============================
// ENQUIRIES PAGE
// ==============================
function renderEnquiries() {
  const list = document.getElementById('enquiriesList');
  if (!list) return;
  const userEnqs = currentUser ? DB.enquiries.filter(e => e.email === currentUser.email) : [];
  if (userEnqs.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding:80px"><div class="empty-icon">📩</div><h3>No enquiries yet</h3><p>When you enquire about a property, it'll appear here.</p><button class="btn btn-primary" onclick="showPage('listings')">Browse Properties</button></div>`;
  } else {
    list.innerHTML = userEnqs.map(e => `
      <div class="enquiry-card">
        <div>
          <div class="enq-prop">🏠 ${e.propertyTitle}</div>
          <div class="enq-msg">${e.message}</div>
          <div class="enq-date">📅 ${e.date}</div>
        </div>
        <div class="enq-status">
          <span class="status-badge status-active">${e.status}</span>
        </div>
      </div>
    `).join('');
  }
}

// ==============================
// REVIEWS
// ==============================
function setRating(n) {
  DB.currentRating = n;
  document.querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
}

function submitReview() {
  if (!currentUser) { showToast('Please login to write a review.', 'error'); return; }
  if (!DB.currentRating) { showToast('Please select a rating.', 'error'); return; }
  const text = document.getElementById('reviewText').value;
  if (!text) { showToast('Please write your review.', 'error'); return; }
  closeModal('reviewModal');
  showToast('Review submitted! Thank you ⭐', 'success');
  DB.currentRating = 0;
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
}

// ==============================
// CHAT
// ==============================
function initChat() {
  addChatMsg('bot', "Hi! Welcome to New Beginnings 🏠 I'm here to help you find your perfect property. How can I assist you today?");
}

function toggleChat() {
  document.getElementById('chatBox').classList.toggle('open');
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMsg('user', msg);
  input.value = '';
  setTimeout(() => botReply(msg), 800);
}

function addChatMsg(type, text) {
  const container = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${time}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function botReply(msg) {
  const m = msg.toLowerCase();
  let reply = "I can help you with property searches, EMI calculations, and more. What would you like to know?";
  if (m.includes('price') || m.includes('cost') || m.includes('budget')) reply = "Our properties range from ₹20L to ₹35Cr+. You can use our EMI Calculator to plan your budget. What's your budget range?";
  else if (m.includes('hyderabad') || m.includes('location') || m.includes('area')) reply = "We have 400+ properties across Hyderabad — Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, and more. Which area interests you?";
  else if (m.includes('emi') || m.includes('loan') || m.includes('bank')) reply = "For home loans, we recommend HDFC, SBI, and ICICI. Current rates start at 8.5% p.a. Use our EMI Calculator for precise estimates!";
  else if (m.includes('apartment') || m.includes('flat')) reply = "We have 4,200+ apartments listed, from cozy 1BHK studios to luxurious 5BHK penthouses. Want me to filter by your requirements?";
  else if (m.includes('villa') || m.includes('bungalow')) reply = "We have 1,800+ villas and independent houses. Many feature private pools, gardens, and premium finishes. Shall I show you some options?";
  else if (m.includes('hello') || m.includes('hi') || m.includes('hey')) reply = "Hello! Great to see you here 😊 Are you looking to buy, rent, or list a property?";
  else if (m.includes('contact') || m.includes('call') || m.includes('phone')) reply = "You can reach us at +91 98765 43210 or email hello@newbeginnings.in. Our team is available Mon-Sat, 9 AM – 7 PM.";
  addChatMsg('bot', reply);
}

// ==============================
// MODALS
// ==============================
function showModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

// ==============================
// TOAST
// ==============================
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==============================
// RANGE SLIDER SYNC
// ==============================
function syncRange(field) {
  const val = document.getElementById(`calc${field}`).value;
  const range = document.getElementById(`calc${field}Range`);
  if (range) range.value = val;
  calcEMI();
}

// Auto-sync range sliders with inputs
['Price','Down','Rate','Years'].forEach(f => {
  const inp = document.getElementById(`calc${f}`);
  const range = document.getElementById(`calc${f}Range`);
  if (inp && range) {
    inp.addEventListener('input', () => { range.value = inp.value; calcEMI(); });
    range.addEventListener('input', () => { inp.value = range.value; calcEMI(); });
  }
});
// existing code above...

// ================= ADD PROPERTY FEATURE =================

function openForm() {
  document.getElementById("propertyForm").style.display = "block";
}

function closeForm() {
  document.getElementById("propertyForm").style.display = "none";
}

function showAddPropertyButton(user) {
  if (user) {
    document.getElementById("addPropertyBtn").style.display = "inline-block";
  }
}

// NOTE: duplicate submitProperty removed — using the correct one defined above (line ~757)

// ✅ SHOW BUTTON IF ALREADY LOGGED IN
window.addEventListener("load", function () {
  const token = localStorage.getItem("token");

  if (token) {
    const btn = document.getElementById("addPropertyBtn");
    if (btn) btn.style.display = "inline-block";
  }
});

// ==============================
// BUYING PAGE
// ==============================
function renderBuyingGrid() {
  const grid = document.getElementById('buyingGrid');
  if (!grid) return;
  // Show top-rated properties for buyers
  const picks = [...DB.properties].sort((a, b) => b.rating - a.rating).slice(0, 6);
  grid.innerHTML = picks.map(buildCard).join('');
}

function doBuySearch() {
  const loc = document.getElementById('buyLocation').value.trim();
  const type = document.getElementById('buyType').value;
  const budget = document.getElementById('buyBudget').value;
  const beds = document.getElementById('buyBeds').value;

  showPage('listings');

  setTimeout(() => {
    if (loc && document.getElementById('filterSearch')) {
      document.getElementById('filterSearch').value = loc;
    }
    if (type) {
      document.querySelectorAll('.checkbox-group input').forEach(c => {
        c.checked = c.value === type;
      });
    }
    if (budget) {
      const [min, max] = budget.split('-').map(Number);
      document.getElementById('priceMin').value = min || '';
      document.getElementById('priceMax').value = max || '';
    }
    if (beds) {
      const bedNum = beds.replace(' BHK', '').replace('+', '');
      selectedBeds = bedNum;
    }
    applyFilters();
  }, 100);
}

function updateMiniEMI() {
  const price = parseFloat(document.getElementById('miniPrice')?.value) || 5000000;
  const down = parseFloat(document.getElementById('miniDown')?.value) || 1000000;
  const years = parseInt(document.getElementById('miniYears')?.value) || 20;
  const loan = price - down;
  const r = 8.5 / 100 / 12;
  const n = years * 12;
  const emi = r > 0 ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loan / n;
  const el = document.getElementById('miniEMIAmount');
  if (el) el.textContent = `₹${Math.round(emi).toLocaleString()}`;
}

function initChecklist() {
  document.querySelectorAll('#buyerChecklist input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateChecklistProgress);
  });
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const all = document.querySelectorAll('#buyerChecklist input[type="checkbox"]');
  const checked = document.querySelectorAll('#buyerChecklist input[type="checkbox"]:checked');
  const pct = all.length ? (checked.length / all.length) * 100 : 0;
  const bar = document.getElementById('clBar');
  const status = document.getElementById('clStatus');
  if (bar) bar.style.width = pct + '%';
  if (status) status.textContent = `${checked.length} of ${all.length} completed`;
}

// ==============================
// SELL PAGE
// ==============================
function prefillSellForm() {
  if (!currentUser) return;
  const nameEl = document.getElementById('sellOwnerName');
  const phoneEl = document.getElementById('sellOwnerPhone');
  if (nameEl && !nameEl.value) nameEl.value = `${currentUser.firstName} ${currentUser.lastName}`;
  if (phoneEl && !phoneEl.value) phoneEl.value = currentUser.phone || '';
}

function submitSellProperty(e) {
  e.preventDefault();
  if (!currentUser) {
    showToast('Please login to list a property.', 'error');
    showModal('loginModal');
    return;
  }

  const title = document.getElementById('sellTitle').value;
  const type = document.getElementById('sellType').value;
  const price = parseInt(document.getElementById('sellPrice').value);
  const area = parseInt(document.getElementById('sellArea').value);
  const beds = parseInt(document.getElementById('sellBeds').value) || 0;
  const city = document.getElementById('sellCity').value;
  const locality = document.getElementById('sellLocality').value;

  const emojis = { 'Apartment': '🏢', 'Villa': '🏡', 'Independent House': '🏠', 'Land / Plot': '🌿', 'Commercial': '🏗️' };
  const amenities = [...document.querySelectorAll('#sellAmenitiesGrid input:checked')].map(c => c.value);

  const newId = Date.now();
  const newProp = {
    id: newId,
    title, type, price, area, beds,
    baths: parseInt(document.getElementById('sellBaths').value) || 1,
    city, locality,
    description: document.getElementById('sellDesc').value,
    amenities,
    owner: `${currentUser.firstName} ${currentUser.lastName}`,
    ownerPhone: document.getElementById('sellOwnerPhone').value || currentUser.phone || '',
    rating: 0, reviews: 0, badge: 'new',
    emoji: emojis[type] || '🏠',
    address: document.getElementById('sellAddress').value,
    lat: 17.4 + Math.random() * 0.2,
    lng: 78.3 + Math.random() * 0.3,
    addedAt: Date.now()
  };

  DB.properties.unshift(newProp);
  DB.lastAddedId = newId;

  // Reset form
  e.target.reset();

  // Navigate with success banner
  showListingsWithNewPropertyBanner(title);
}

// ==============================
// LISTINGS SUCCESS BANNER + HIGHLIGHT
// ==============================
function showListingsWithNewPropertyBanner(title) {
  // Force sort to newest so the new property appears first
  const sortEl = document.getElementById('sortBy');
  if (sortEl) sortEl.value = 'newest';
  selectedBeds = '';
  document.querySelectorAll('.bed-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.checkbox-group input').forEach(c => c.checked = false);
  if (document.getElementById('filterSearch')) document.getElementById('filterSearch').value = '';
  if (document.getElementById('priceMin')) document.getElementById('priceMin').value = '';
  if (document.getElementById('priceMax')) document.getElementById('priceMax').value = '';

  showPage('listings');

  setTimeout(() => {
    // Show animated success banner at top of listings
    showListingsBanner(title);
    // Highlight the new card
    highlightNewCard(DB.lastAddedId);
  }, 120);
}

function showListingsBanner(title) {
  // Remove any existing banner first
  const existing = document.getElementById('listingSuccessBanner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'listingSuccessBanner';
  banner.innerHTML = `
    <div class="lsb-inner">
      <div class="lsb-icon">🎉</div>
      <div class="lsb-text">
        <div class="lsb-title">Property Listed Successfully!</div>
        <div class="lsb-sub">"${title}" is now live and visible to all buyers</div>
      </div>
      <button class="lsb-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  banner.classList.add('lsb-enter');

  // Insert at the very top of the listings results area
  const resultsEl = document.querySelector('.listings-results');
  if (resultsEl) {
    resultsEl.insertBefore(banner, resultsEl.firstChild);
  } else {
    const app = document.getElementById('page-listings');
    if (app) app.prepend(banner);
  }

  // Auto-remove after 6 seconds
  setTimeout(() => {
    banner.classList.add('lsb-exit');
    setTimeout(() => banner.remove(), 400);
  }, 6000);
}

function highlightNewCard(id) {
  // Look for the card and pulse-highlight it
  const card = document.querySelector(`.property-card[data-id="${id}"]`);
  if (card) {
    card.classList.add('card-newly-added');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => card.classList.remove('card-newly-added'), 4000);
  }
}