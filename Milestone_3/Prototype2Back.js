const app = {
    userProfile: {
        hostel: "Hostel 12, Room 10",
        notes: "Leave at reception."
    },
    currentChef: null, 

    init: function() {
        this.checkTimeForSpecials();
    },

    switchView: function(viewId, navElement) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        
        const target = document.getElementById(viewId);
        target.classList.remove('hidden');
        target.classList.add('active');

        if(navElement) {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            navElement.classList.add('active');
        }

        if(viewId === 'view-specials') {
            this.checkTimeForSpecials();
        }
    },

    saveProfile: function() {
        this.userProfile.hostel = document.getElementById('hostel-input').value;
        this.userProfile.notes = document.getElementById('notes-input').value;
        
        const msg = document.getElementById('profile-msg');
        msg.classList.remove('hidden');
        
        setTimeout(() => msg.classList.add('hidden'), 4000);
    },

    openChefProfile: function(chefId) {
        this.switchView('view-chef-profile');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const title = document.getElementById('chef-name-title');
        const planName = document.getElementById('plan-name');
        const planPrice = document.getElementById('plan-price');
        const menuList = document.getElementById('full-menu-list');
        const btnSub = document.getElementById('btn-subscribe');

        menuList.innerHTML = ''; 

        if(chefId === 'fatima') {
            this.currentChef = "Fatima's Kitchen";
            title.innerText = "Fatima's Kitchen";
            planName.innerText = "5-Day Dinner Subscription";
            planPrice.innerText = "Rs. 1500";
            
            const fatimaMenu = ["Mon: Karahi", "Tue: Daal Chawal", "Wed: Aloo Gosht", "Thu: Biryani", "Fri: Koftay"];
            fatimaMenu.forEach(item => {
                menuList.innerHTML += `<li>• ${item}</li>`;
            });

            btnSub.onclick = () => this.checkout('5-Day Plan (Fatima)', 1500);
            
        } else if (chefId === 'ali') {
            this.currentChef = "Chef Ali";
            title.innerText = "Chef Ali";
            planName.innerText = "5-Day Lunch Subscription";
            planPrice.innerText = "Rs. 1300";
            
            const aliMenu = ["Mon: Pulao", "Tue: Qorma", "Wed: Haleem", "Thu: Nihari", "Fri: Sabzi"];
            aliMenu.forEach(item => {
                menuList.innerHTML += `<li>• ${item}</li>`;
            });

            btnSub.onclick = () => this.checkout('5-Day Plan (Ali)', 1300);
        }
    },

    checkout: function(itemName, price) {
        document.getElementById('checkout-item-name').innerText = itemName;
        document.getElementById('checkout-price').innerText = `Total: Rs. ${price}`;
        document.getElementById('checkout-address').innerText = this.userProfile.hostel;
        
        document.getElementById('checkout-modal').classList.remove('hidden');
    },

    showToast: function(message) {
        const toast = document.getElementById('app-toast');
        toast.innerText = message;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    confirmOrder: function() {
        const itemName = document.getElementById('checkout-item-name').innerText;
        
        this.showToast("Payment successful! Your order is confirmed.");
        this.closeModal();

        if(itemName.includes('5-Day')) {
            this.populateCalendar(itemName);
            this.switchView('view-calendar', document.getElementById('nav-week'));
        } else {
            this.switchView('view-home', document.getElementById('nav-home')); 
        }
    },

    closeModal: function() {
        document.getElementById('checkout-modal').classList.add('hidden');
    },

    checkTimeForSpecials: function() {
        const now = new Date();
        const pktTimeString = now.toLocaleString("en-US", {timeZone: "Asia/Karachi"});
        const pktTime = new Date(pktTimeString);
        const hours = pktTime.getHours(); 

        const btn = document.getElementById('btn-halwa');
        const limitText = document.querySelector('#special-halwa .limit-text');

        if(hours >= 17) {
            if(btn && !btn.classList.contains('btn-disabled')) {
                btn.innerText = "Sold Out";
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-disabled');
                btn.onclick = null; 
                limitText.innerText = "Item is no longer available (Past 5:00 PM).";
            }
        } else {
            if(btn) {
                btn.innerText = "Order Now";
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-disabled');
                btn.onclick = () => this.checkout('Gajar ka Halwa', 250);
                limitText.innerText = "Only 2 portions left! Ends at 5:00 PM";
            }
        }
    },

    populateCalendar: function(planName) {
        let weeklyMenu = [];
        let chefName = this.currentChef;

        if (planName.includes('Fatima')) {
            weeklyMenu = ["Karahi", "Daal Chawal", "Aloo Gosht", "Biryani", "Koftay"];
        } else if (planName.includes('Ali')) {
            weeklyMenu = ["Pulao", "Qorma", "Haleem", "Nihari", "Sabzi"];
        }
        
        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
        
        days.forEach((day, index) => {
            const content = document.querySelector(`#cal-${day} .day-content`);
            content.classList.remove('empty');
            content.classList.add('filled');
            content.innerHTML = `<strong>${chefName}</strong><br><span style="font-size:0.9rem; color:#555;">${weeklyMenu[index]}</span>`;
            content.onclick = null; 
        });
    }
};

window.onload = () => app.init();