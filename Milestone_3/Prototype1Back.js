const app = {
    // Shared State Context
    userProfile: {
        hostel: "Hostel 12, Room 10",
        notes: "Leave at reception."
    },

    // 1. Navigation Logic
    switchView: function(viewId, navElement) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        
        // Show target view
        const target = document.getElementById(viewId);
        target.classList.remove('hidden');
        target.classList.add('active');

        // Update nav highlighting
        if(navElement) {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            navElement.classList.add('active');
        }

        // Feature: Simulate "Sold Out" exception when entering Specials tab
        if(viewId === 'view-specials') {
            this.triggerSoldOutSimulation();
        }
    },

    // 2. Scenario Task 1: Update Profile
    saveProfile: function() {
        this.userProfile.hostel = document.getElementById('hostel-input').value;
        this.userProfile.notes = document.getElementById('notes-input').value;
        
        const msg = document.getElementById('profile-msg');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 2000);
    },

    // 3. Scenario Task 2: Navigate to Chef & Checkout
    openChefProfile: function(chefId) {
        if(chefId === 'fatima') {
            this.switchView('view-chef-profile');
            // Nav bar loses active state when deep linking
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        }
    },

    checkout: function(itemName, price) {
        // Populate modal data
        document.getElementById('checkout-item-name').innerText = itemName;
        document.getElementById('checkout-price').innerText = `Total: Rs. ${price}`;
        document.getElementById('checkout-address').innerText = this.userProfile.hostel;
        
        // Show modal
        document.getElementById('checkout-modal').classList.remove('hidden');
    },

    confirmOrder: function() {
        alert("Payment successful! Your order is confirmed.");
        this.closeModal();
        this.switchView('view-home', document.querySelector('.nav-item')); // reset to home
    },

    closeModal: function() {
        document.getElementById('checkout-modal').classList.add('hidden');
    },

    // 4. Scenario Task 3: Error Prevention Simulation
    triggerSoldOutSimulation: function() {
        // If they don't click "Order Now" within 5 seconds, the Halwa sells out.
        setTimeout(() => {
            const btn = document.getElementById('btn-halwa');
            if(btn && !btn.classList.contains('btn-disabled')) {
                btn.innerText = "Sold Out";
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-disabled');
                btn.onclick = null; // Remove click event
                
                const limitText = document.querySelector('#special-halwa .limit-text');
                limitText.innerText = "Item is no longer available.";
            }
        }, 5000); 
    }
};