(function() {
const DATA = {
    chefs: [
        { id:'fatima', name:"Fatima's Kitchen", rating:"⭐ 4.9 (47)", location:"Topi Campus", cuisine:"Desi • Rs 200–350/meal", closesAt:"6PM", bio:"Home-style traditional meals cooked with love.", emoji:"🍲",
          subscriptions:[{id:'sub-f-5',name:"5-Day Dinner Plan",price:1500,menu:["Mon: Karahi","Tue: Daal Chawal","Wed: Biryani","Thu: Sabzi","Fri: Pulao"]},{id:'sub-f-3',name:"3-Day Dinner Plan",price:1000,menu:["Mon: Karahi","Wed: Biryani","Fri: Pulao"]}],
          aLaCarte:[{id:'alc-f-1',name:"Extra Roti (3x)",price:50},{id:'alc-f-2',name:"Mint Raita",price:80}]},
        { id:'ali', name:"Chef Ali", rating:"⭐ 4.5 (12)", location:"Swabi Gate", cuisine:"Fast Food • Rs 300–500/meal", closesAt:"8PM", bio:"Craving burgers or rolls? I got you.", emoji:"🍔",
          subscriptions:[{id:'sub-a-5',name:"5-Day Snack Plan",price:2000,menu:["Mon: Zinger","Tue: Fries","Wed: Wrap","Thu: Wings","Fri: Burger"]}],
          aLaCarte:[{id:'alc-a-1',name:"Loaded Fries",price:300},{id:'alc-a-2',name:"Mayo Garlic Dip",price:50}]},
        { id:'ammi', name:"Ammi Jan's Dhabba", rating:"⭐ 4.8 (89)", location:"Tuck Shop Area", cuisine:"Comfort Food • Rs 150–250/meal", closesAt:"5PM", bio:"Just like home.", emoji:"🍛",
          subscriptions:[{id:'sub-am-5',name:"5-Day Lunch Plan",price:1200,menu:["Mon: Chana","Tue: Lobia","Wed: Aloo Gosht","Thu: Kari Pakora","Fri: Haleem"]}],
          aLaCarte:[{id:'alc-am-1',name:"Meetha Paratha",price:100}]}
    ],
    specials: [
        {id:'sp-1',name:"Gajar ka Halwa",chefName:"Fatima's Kitchen",portions:2,cutoff:"5:00 PM",price:250,emoji:"🥕"},
        {id:'sp-2',name:"Chicken Shami Kebab",chefName:"Chef Ali",portions:5,cutoff:"4:30 PM",price:150,emoji:"🍗"}
    ],
    cart: [],
    myWeek: [
        {day:"Mon",date:12,meal:null,chefName:null},{day:"Tue",date:13,meal:null,chefName:null},
        {day:"Wed",date:14,meal:null,chefName:null},{day:"Thu",date:15,meal:null,chefName:null},
        {day:"Fri",date:16,meal:null,chefName:null}
    ],
    profile: {name:"",hostel:"",notes:"",activeSubscriptions:[],orderHistory:[]},
    chefDash: {
        orders:[
            {id:'ord-201',student:"Ali M.",hostel:"H10",meal:"Karahi",status:"Pending"},
            {id:'ord-202',student:"Sara K.",hostel:"Girls Hostel",meal:"Daal Chawal",status:"Confirmed"},
            {id:'ord-203',student:"Zain A.",hostel:"H8",meal:"Biryani",status:"Delivered"}
        ],
        weeklyMenu:["Karahi","Daal Chawal","Biryani","Sabzi","Pulao"]
    }
};

function esc(s) { return String(s).replace(/'/g, "\\'"); }

const app = {
    currentChef: null, currentRole: null, selectedSlot: '1:00–1:30',

    init() {
        // Hide all views, show login
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-login').classList.add('active');
        document.querySelector('.bottom-nav').style.display = 'none';
        document.getElementById('cart-badge').classList.add('hidden');
        this.renderHome();
        this.renderSpecials();
        this.renderWeek();
        this.renderChefDash();
        this.renderOrders();
    },

    login(role) {
        this.currentRole = role;
        document.querySelector('.bottom-nav').style.display = 'flex';
        if (role === 'chef') {
            document.getElementById('nav-profile').style.display = 'none';
            document.getElementById('nav-orders').style.display = 'none';
            this.switchView('view-chef-dash');
        } else {
            document.getElementById('nav-profile').style.display = '';
            document.getElementById('nav-orders').style.display = '';
            this.switchView('view-home', document.getElementById('nav-home'));
        }
    },

    // Instant view switch — no setTimeout, no lag
    switchView(viewId, navBtn) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        if (navBtn && navBtn.classList.contains('nav-item')) {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            navBtn.classList.add('active');
        }
        // Refresh data-driven views
        if (viewId === 'view-calendar') this.renderWeek();
        if (viewId === 'view-profile') this.renderProfile();
        if (viewId === 'view-chef-dash') this.renderChefDash();
        if (viewId === 'view-specials') this.renderSpecials();
        if (viewId === 'view-orders') this.renderOrders();
        // Scroll to top
        document.querySelector('.app-content').scrollTop = 0;
    },

    renderHome() {
        const el = document.getElementById('home-chef-list');
        el.innerHTML = DATA.chefs.map(c => `
            <div class="chef-card" onclick="app.openChefProfile('${c.id}')" tabindex="0" role="button" aria-label="Open ${c.name}">
                <div class="chef-card-header">
                    <h3>${c.name}</h3>
                    <div class="emoji-placeholder" style="width:40px;height:40px;font-size:20px;margin:0">${c.emoji}</div>
                </div>
                <div><span class="tag">${c.cuisine}</span><span class="tag">Closes at ${c.closesAt}</span></div>
                <p class="chef-meta">${c.rating} • ${c.location}</p>
            </div>`).join('');
    },

    openChefProfile(id) {
        this.currentChef = DATA.chefs.find(c => c.id === id);
        const ch = this.currentChef;
        document.getElementById('chef-profile-header').innerHTML = `
            <h2>${ch.name}</h2><p class="subtitle">${ch.bio}</p>
            <p class="chef-meta" style="margin-top:-10px;margin-bottom:20px">${ch.rating} • ${ch.location}</p>`;
        this.renderChefTabs();
        this.switchChefTab('subscribe');
        this.switchView('view-chef-profile', document.getElementById('nav-home'));
    },

    renderChefTabs() {
        const ch = this.currentChef;
        document.getElementById('tab-subscribe').innerHTML = ch.subscriptions.map(p => `
            <div class="menu-item"><div class="menu-item-info">
                <h4>${p.name}</h4><p>${p.menu.join(', ')}</p><p class="price">Rs. ${p.price}</p>
            </div><button class="btn-primary small" data-id="${p.id}" onclick="app.addToCart(this,'${esc(p.id)}','${esc(p.name)}',${p.price},'subscription','${esc(ch.id)}')">Add</button></div>`).join('');
        document.getElementById('tab-order').innerHTML = ch.aLaCarte.map(it => `
            <div class="menu-item"><div class="menu-item-info">
                <h4>${it.name}</h4><p class="price">Rs. ${it.price}</p>
            </div><button class="btn-primary small" data-id="${it.id}" onclick="app.addToCart(this,'${esc(it.id)}','${esc(it.name)}',${it.price},'alacarte','${esc(ch.id)}')">Add</button></div>`).join('');
    },

    switchChefTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        if (tab === 'subscribe') {
            document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
            document.getElementById('tab-subscribe').classList.add('active');
        } else {
            document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
            document.getElementById('tab-order').classList.add('active');
        }
    },

    renderSpecials() {
        document.getElementById('specials-list').innerHTML = DATA.specials.map(sp => {
            const out = sp.portions <= 0;
            return `<div class="special-card card">
                <div class="emoji-placeholder">${sp.emoji}</div>
                <div class="special-info">
                    <h4>${sp.name}</h4>
                    <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${sp.chefName}</p>
                    <p class="limit-text">${out ? 'Sold Out!' : sp.portions+' portions left'} • Ends ${sp.cutoff}</p>
                    <p class="price" style="margin-top:4px">Rs. ${sp.price}</p>
                </div>
                <button class="btn-primary small" ${out?'disabled':''} onclick="app.addToCart(this,'${esc(sp.id)}','${esc(sp.name)}',${sp.price},'special',null)">${out?'Sold Out':'Order Now'}</button>
            </div>`;
        }).join('');
    },

    renderWeek() {
        document.getElementById('calendar-grid').innerHTML = DATA.myWeek.map(d => {
            const empty = !d.meal;
            return `<div class="cal-day" onclick="app.handleDayClick('${d.day}')" tabindex="0" role="button">
                <div class="cal-date"><span class="day-name">${d.day}</span><span class="day-num">${d.date}</span></div>
                <div class="cal-content ${empty?'empty':''}">${empty ? 'Tap to plan' : `<div class="cal-content-inner"><h4>${d.meal}</h4><p>${d.chefName}</p></div>`}</div>
            </div>`;
        }).join('');
    },

    handleDayClick(dayName) {
        const d = DATA.myWeek.find(x => x.day === dayName);
        if (!d.meal) { this.switchView('view-home', document.getElementById('nav-home')); return; }
        document.getElementById('popover-title').innerText = d.day+', '+d.date+' – '+d.meal;
        document.getElementById('popover-desc').innerText = 'Prepared by: '+d.chefName;
        document.getElementById('meal-popover').classList.remove('hidden');
    },

    closePopover() { document.getElementById('meal-popover').classList.add('hidden'); },

    renderProfile() {
        document.getElementById('profile-name').value = DATA.profile.name;
        document.getElementById('profile-location').value = DATA.profile.hostel;
        document.getElementById('profile-notes').value = DATA.profile.notes;

        const subs = document.getElementById('active-subscriptions');
        subs.innerHTML = DATA.profile.activeSubscriptions.length === 0
            ? '<p style="color:var(--text-muted);font-size:14px">No active subscriptions.</p>'
            : DATA.profile.activeSubscriptions.map((s,i) => `<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:12px">
                <div><h4 style="font-size:14px;margin-bottom:4px">${s.name}</h4><p style="font-size:12px;color:var(--text-muted)">${s.chefName}</p></div>
                <button class="btn-secondary small" onclick="app.cancelSub(${i})">Cancel</button></div>`).join('');

        const hist = document.getElementById('order-history');
        hist.innerHTML = DATA.profile.orderHistory.length === 0
            ? '<p style="color:var(--text-muted);font-size:14px">No past orders.</p>'
            : DATA.profile.orderHistory.map(o => `<div class="card" style="padding:12px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <h4 style="font-size:14px">${o.item}</h4><span style="font-size:14px;font-weight:bold">Rs. ${o.total}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <p style="font-size:12px;color:var(--text-muted)">${o.date} – ${o.status}</p>
                    ${o.status==='Pending'?`<button class="btn-secondary small" style="color:var(--accent);border-color:var(--accent)" onclick="app.cancelOrder('${o.id}')">Cancel</button>`:''}</div>
            </div>`).join('');

        // Accessibility toggle states
        document.getElementById('btn-font-toggle').className = 'btn-secondary small btn-toggle' + (document.body.classList.contains('large-font') ? ' on' : '');
        document.getElementById('btn-contrast-toggle').className = 'btn-secondary small btn-toggle' + (document.body.classList.contains('high-contrast') ? ' on' : '');
    },

    saveProfile() {
        const n = document.getElementById('profile-name').value.trim();
        const h = document.getElementById('profile-location').value.trim();
        if (!n || !h) { this.showToast("Name and Hostel are required!"); return false; }
        DATA.profile.name = n; DATA.profile.hostel = h;
        DATA.profile.notes = document.getElementById('profile-notes').value;
        this.showToast("Profile saved!"); return true;
    },

    cancelSub(i) {
        DATA.profile.activeSubscriptions.splice(i, 1);
        DATA.myWeek.forEach(d => { d.meal = null; d.chefName = null; });
        this.renderProfile(); this.showToast("Subscription cancelled");
    },

    cancelOrder(id) {
        const o = DATA.profile.orderHistory.find(x => x.id === id);
        if (o && o.status !== 'Delivered' && o.status !== 'Cancelled') {
            if (o.cancelDeadline && Date.now() > o.cancelDeadline) {
                this.showToast('Cancel window expired!'); return;
            }
            o.status = 'Cancelled';
            this.renderProfile(); this.renderOrders();
            this.showToast('Order cancelled');
        }
    },

    toggleFontSize() { document.body.classList.toggle('large-font'); this.renderProfile(); this.showToast("Font size toggled"); },
    toggleContrast() { document.body.classList.toggle('high-contrast'); this.renderProfile(); this.showToast("Contrast toggled"); },

    // --- CART ---
    // Button feedback: button element passed as first arg
    addToCart(btnEl, id, name, price, type, chefId) {
        const existing = DATA.cart.find(x => x.id === id);
        if (existing) { existing.qty++; } else { DATA.cart.push({id,name,price:+price,qty:1,type,chefId}); }
        this.updateCartBadge();
        // Visual feedback on button
        if (btnEl) {
            const orig = btnEl.innerText;
            btnEl.innerText = '✓ Added';
            btnEl.classList.add('btn-added');
            setTimeout(() => { btnEl.innerText = orig; btnEl.classList.remove('btn-added'); }, 800);
        }
        this.showToast(name + " added to cart");
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const count = DATA.cart.reduce((s,i) => s+i.qty, 0);
        if (count > 0) { badge.innerText = count; badge.classList.remove('hidden'); }
        else { badge.classList.add('hidden'); }
    },

    openCart() {
        if (DATA.cart.length === 0) { this.showToast("Your cart is empty"); return; }
        if (!DATA.profile.name || !DATA.profile.hostel) {
            this.showToast("Please setup your profile first!");
            this.switchView('view-profile', document.getElementById('nav-profile')); return;
        }
        this.renderCart();
        document.getElementById('cart-modal').classList.remove('hidden');
        document.getElementById('cart-address').innerText = DATA.profile.hostel;
    },

    closeCart() { document.getElementById('cart-modal').classList.add('hidden'); },

    renderCart() {
        let sub = 0;
        document.getElementById('cart-items').innerHTML = DATA.cart.map((it,i) => {
            sub += it.price * it.qty;
            return `<div class="cart-item"><div>
                <div style="font-weight:bold;font-size:14px">${it.name}</div>
                <div style="font-size:12px;color:var(--text-muted)">Rs. ${it.price} each</div></div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="app.updateCartQty(${i},-1)">−</button>
                    <span>${it.qty}</span>
                    <button class="qty-btn" onclick="app.updateCartQty(${i},1)">+</button>
                </div></div>`;
        }).join('');
        document.getElementById('cart-subtotal').innerText = 'Rs. '+sub;
    },

    updateCartQty(i, delta) {
        DATA.cart[i].qty += delta;
        if (DATA.cart[i].qty <= 0) DATA.cart.splice(i, 1);
        this.updateCartBadge();
        if (DATA.cart.length === 0) this.closeCart();
        else this.renderCart();
    },

    confirmOrder() {
        let total = 0;
        const id = 'ord-'+Date.now();
        const items = [];
        const otp = String(Math.floor(1000+Math.random()*9000)); // 4-digit OTP
        const payment = document.querySelector('input[name="payment"]:checked');
        const payMethod = payment ? payment.value : 'cod';
        DATA.cart.forEach(it => {
            total += it.price * it.qty;
            items.push(it.qty+'x '+it.name);
            if (it.type === 'subscription') {
                const chef = DATA.chefs.find(c => c.id === it.chefId);
                DATA.profile.activeSubscriptions.push({name:it.name,chefName:chef.name});
                const plan = chef.subscriptions.find(s => s.id === it.id);
                if (plan) {
                    const dayMap = {Mon:0,Tue:1,Wed:2,Thu:3,Fri:4};
                    plan.menu.forEach(m => {
                        const parts = m.split(': ');
                        const idx = dayMap[parts[0]];
                        if (idx !== undefined) { DATA.myWeek[idx].meal = parts[1]; DATA.myWeek[idx].chefName = chef.name; }
                    });
                }
            } else if (it.type === 'special') {
                const sp = DATA.specials.find(s => s.id === it.id);
                if (sp) sp.portions = Math.max(0, sp.portions - it.qty);
            }
            if (it.type !== 'subscription') {
                const empty = DATA.myWeek.find(d => !d.meal);
                if (empty) { empty.meal = it.name; empty.chefName = "Today's Order"; }
            }
            DATA.chefDash.orders.push({id:id,student:DATA.profile.name,hostel:DATA.profile.hostel.split(',')[0],meal:it.name,status:"Pending"});
        });
        // HCI: User Control & Freedom — cancel window (5 min simulation)
        DATA.profile.orderHistory.unshift({
            id:id, item:items.join(', '), date:"Just now", total:total,
            status:'Preparing', otp:otp, slot:this.selectedSlot, payment:payMethod,
            cancelDeadline: Date.now() + 5*60*1000, // 5 min cancel window
            trackStage: 0 // 0=Preparing, 1=On the Way, 2=At Hostel, 3=Delivered
        });
        DATA.cart = [];
        this.updateCartBadge(); this.closeCart();
        this.renderWeek(); this.renderSpecials(); this.renderProfile(); this.renderOrders();
        this.showToast('Order confirmed! OTP: '+otp);
        // Simulate order progress
        this.simulateOrderProgress(id);
    },

    // HCI: Visibility of System Status — simulated live tracking
    simulateOrderProgress(orderId) {
        const stages = ['Preparing','On the Way','At Hostel','Delivered'];
        let step = 0;
        const interval = setInterval(() => {
            step++;
            const ord = DATA.profile.orderHistory.find(o => o.id === orderId);
            if (!ord || step >= stages.length) { clearInterval(interval); return; }
            if (ord.status === 'Cancelled') { clearInterval(interval); return; }
            ord.status = stages[step];
            ord.trackStage = step;
            this.renderOrders();
            this.renderProfile();
            if (step === 2) this.showToast('Your order is at your hostel! Show OTP: '+ord.otp);
        }, 15000); // Every 15s for demo
    },

    selectSlot(el, slot) {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedSlot = slot;
    },

    // Render My Orders tracking view
    renderOrders() {
        const el = document.getElementById('active-orders-list');
        const orders = DATA.profile.orderHistory;
        if (orders.length === 0) {
            el.innerHTML = '<p style="color:var(--text-muted);font-size:14px">No orders yet. Browse chefs to get started!</p>';
            return;
        }
        el.innerHTML = orders.map(o => {
            const stages = ['Preparing','On the Way','At Hostel','Delivered'];
            const stageIdx = stages.indexOf(o.status);
            const canCancel = o.cancelDeadline && Date.now() < o.cancelDeadline && o.status !== 'Cancelled' && o.status !== 'Delivered';
            const timeLeft = canCancel ? Math.max(0, Math.ceil((o.cancelDeadline - Date.now())/1000)) : 0;
            const minLeft = Math.floor(timeLeft/60);
            const secLeft = timeLeft % 60;
            return `<div class="order-track-card">
                <div class="order-track-header">
                    <h4>${o.item}</h4>
                    <span class="tag ${o.status==='Cancelled'?'status-pending':stageIdx>=3?'status-delivered':'status-confirmed'}" style="margin:0">${o.status}</span>
                </div>
                <p style="font-size:12px;color:var(--text-muted)">Rs. ${o.total} • ${o.slot||''} • ${o.payment||''}</p>
                ${o.status !== 'Cancelled' && stageIdx < 4 && stageIdx >= 0 ? `
                    <div class="order-track-status">
                        ${stages.map((s,i) => `<div class="track-step ${i<stageIdx?'done':i===stageIdx?'current':''}"></div>`).join('')}
                    </div>
                    <div class="track-labels">
                        ${stages.map(s => `<span>${s.split(' ')[0]}</span>`).join('')}
                    </div>` : ''}
                ${o.otp && o.status !== 'Cancelled' && o.status !== 'Delivered' ? `<p style="font-size:12px;margin-top:8px">Delivery PIN: <span class="otp-badge">${o.otp}</span></p>` : ''}
                ${canCancel ? `<p class="cancel-timer">Cancel window: ${minLeft}:${secLeft<10?'0':''}${secLeft} left</p>
                    <button class="btn-secondary small" style="margin-top:6px;color:var(--accent);border-color:var(--accent)" onclick="app.cancelOrder('${o.id}')">Cancel Order</button>` : ''}
            </div>`;
        }).join('');
    },

    // --- CHEF DASHBOARD ---
    renderChefDash() {
        // Revenue: base + confirmed orders
        const confirmed = DATA.chefDash.orders.filter(o => o.status === 'Confirmed' || o.status === 'Delivered').length;
        const rev = 4500 + (confirmed * 300);
        document.getElementById('chef-revenue').innerText = 'Rs. '+rev;
        document.getElementById('chef-orders-list').innerHTML = DATA.chefDash.orders.map((o,i) => {
            const sc = o.status === 'Pending' ? 'status-pending' : o.status === 'Confirmed' ? 'status-confirmed' : 'status-delivered';
            return `<div class="card" style="padding:12px;margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-weight:bold;font-size:14px">${o.student}</span>
                    <span class="tag ${sc} order-status" onclick="app.cycleOrderStatus(${i})" style="margin:0;cursor:pointer">${o.status}</span></div>
                <p style="font-size:12px;color:var(--text-muted)">${o.meal} • ${o.hostel}</p></div>`;
        }).join('');
        document.getElementById('menu-editor-list').innerHTML = DATA.myWeek.map((d,i) => `
            <div class="form-group" style="flex-direction:row;align-items:center;gap:10px">
                <label style="width:30px">${d.day}</label>
                <input type="text" id="menu-day-${i}" value="${DATA.chefDash.weeklyMenu[i]||''}" style="flex:1;padding:6px">
            </div>`).join('');
    },

    cycleOrderStatus(i) {
        const s = ["Pending","Confirmed","Delivered"];
        const o = DATA.chefDash.orders[i];
        o.status = s[(s.indexOf(o.status)+1)%s.length];
        this.renderChefDash();
    },

    postSpecial() {
        const n = document.getElementById('special-name').value.trim();
        const p = document.getElementById('special-price').value;
        const po = document.getElementById('special-portions').value;
        const ct = document.getElementById('special-cutoff').value;
        if (!n||!p||!po||!ct) { this.showToast("Please fill all fields"); return; }
        DATA.specials.push({id:'sp-'+Date.now(),name:n,chefName:"Fatima's Kitchen",portions:+po,cutoff:ct,price:+p,emoji:"✨"});
        document.getElementById('special-name').value='';
        document.getElementById('special-price').value='';
        document.getElementById('special-portions').value='';
        document.getElementById('special-cutoff').value='';
        this.showToast("Special posted! Visible to students now.");
        this.renderSpecials();
    },

    saveWeeklyMenu() {
        DATA.myWeek.forEach((d,i) => { DATA.chefDash.weeklyMenu[i] = document.getElementById('menu-day-'+i).value; });
        const f = DATA.chefs.find(c => c.id === 'fatima');
        if (f && f.subscriptions[0]) f.subscriptions[0].menu = DATA.myWeek.map((d,i) => d.day+': '+DATA.chefDash.weeklyMenu[i]);
        this.showToast("Menu updated!");
    },

    // --- TOAST (queued, no overlap) ---
    _tq: [], _ta: false,
    showToast(msg) { this._tq.push(msg); this._pt(); },
    _pt() {
        if (this._ta || !this._tq.length) return;
        this._ta = true;
        const msg = this._tq.shift();
        const t = document.createElement('div');
        t.className = 'toast'; t.innerText = msg; t.setAttribute('role','alert');
        document.getElementById('toast-container').appendChild(t);
        void t.offsetWidth; t.classList.add('show');
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => { t.remove(); this._ta = false; this._pt(); }, 250); }, 2000);
    }
};

window.app = app;
window.onload = () => app.init();
})();