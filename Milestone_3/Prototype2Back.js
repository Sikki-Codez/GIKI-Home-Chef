const app = {
    userProfile: {
        hostel: "Hostel 12, Room 10",
        notes: "Leave at reception."
    },

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
        if(chefId === 'fatima') {
            this.switchView('view-chef-profile');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        }
    },

    checkout: function(itemName, price) {
        document.getElementById('checkout-item-name').innerText = itemName;
        document.getElementById('checkout-price').innerText = `Total: Rs. ${price}`;
        document.getElementById('checkout-address').innerText = this.userProfile.hostel;
        
        document.getElementById('checkout-modal').classList.remove('hidden');
    },

    // NEW: Triggers the toast notification animation
    showToast: function(message) {
        const toast = document.getElementById('app-toast');
        toast.innerText = message;
        toast.classList.add('show');
        
        // Hides it after 3 seconds
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    confirmOrder: function() {
        const itemName = document.getElementById('checkout-item-name').innerText;
        
        // REPLACED: alert() is now showToast()
        this.showToast("Payment successful! Your order is confirmed.");
        this.closeModal();

        if(itemName.includes('5-Day')) {
            this.populateCalendar();
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

    populateCalendar: function() {
        const weeklyMenu = ["Karahi", "Daal Chawal", "Aloo Gosht", "Biryani", "Koftay"];
        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
        
        days.forEach((day, index) => {
            const content = document.querySelector(`#cal-${day} .day-content`);
            content.classList.remove('empty');
            content.classList.add('filled');
            content.innerHTML = `<strong>Fatima's Kitchen</strong><br><span style="font-size:0.9rem; color:#555;">${weeklyMenu[index]}</span>`;
            content.onclick = null; 
        });
    }
};

window.onload = () => app.init();