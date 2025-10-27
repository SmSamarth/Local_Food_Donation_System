// Filename: script.js
let donations = [];
let donationIdCounter = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    setupEventListeners();
    displayDonations();
});

function setupEventListeners() {
    document.getElementById('donationForm').addEventListener('submit', handleDonationSubmit);
}

function loadSampleData() {
    const sampleDonations = [
        {
            id: 'DON001',
            donorName: 'Community Kitchen',
            foodType: 'Cooked Meals',
            quantity: 50,
            location: 'Downtown Community Center',
            contact: '555-0123',
            notes: 'Fresh hot meals ready for pickup',
            timestamp: new Date(),
            status: 'Available'
        },
        {
            id: 'DON002',
            donorName: 'Green Grocers',
            foodType: 'Vegetables',
            quantity: 25,
            location: 'Market Street, Block 5',
            contact: '555-0456',
            notes: 'Fresh organic vegetables',
            timestamp: new Date(),
            status: 'Available'
        }
    ];
    donations = sampleDonations;
    donationIdCounter = 3;
}

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Refresh donations display when browse tab is shown
    if (tabName === 'browse') {
        displayDonations();
    }
}

function handleDonationSubmit(event) {
    event.preventDefault();
    
    const formData = {
        id: `DON${String(donationIdCounter).padStart(3, '0')}`,
        donorName: document.getElementById('donorName').value,
        foodType: document.getElementById('foodType').value,
        quantity: parseInt(document.getElementById('quantity').value),
        location: document.getElementById('location').value,
        contact: document.getElementById('contact').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date(),
        status: 'Available'
    };
    
    donations.push(formData);
    donationIdCounter++;
    
    showNotification('Donation submitted successfully!', 'success');
    document.getElementById('donationForm').reset();
    
    // Switch to browse tab to show the new donation
    showTab('browse');
    const browseBtn = document.querySelector('.tab-btn:nth-child(2)');
    browseBtn.classList.add('active');
}

function displayDonations() {
    const grid = document.getElementById('donationsGrid');
    grid.innerHTML = '';
    
    if (donations.length === 0) {
        grid.innerHTML = '<p>No donations available at the moment.</p>';
        return;
    }
    
    donations.forEach(donation => {
        const card = createDonationCard(donation);
        grid.appendChild(card);
    });
}

function createDonationCard(donation) {
    const card = document.createElement('div');
    card.className = 'donation-card';
    
    const timeString = donation.timestamp.toLocaleDateString() + ' ' + 
                      donation.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    card.innerHTML = `
        <h3>${donation.foodType}</h3>
        <p><strong>Donor:</strong> ${donation.donorName}</p>
        <p><strong>Quantity:</strong> ${donation.quantity} servings/items</p>
        <p><strong>Location:</strong> ${donation.location}</p>
        <p><strong>Contact:</strong> ${donation.contact}</p>
        <p><strong>Posted:</strong> ${timeString}</p>
        ${donation.notes ? `<p><strong>Notes:</strong> ${donation.notes}</p>` : ''}
        <span class="status ${donation.status.toLowerCase()}">${donation.status}</span>
        ${donation.status === 'Available' ? 
            `<br><button class="claim-btn" onclick="claimDonation('${donation.id}')">Claim This Donation</button>` : 
            ''}
    `;
    
    return card;
}

function claimDonation(donationId) {
    const donation = donations.find(d => d.id === donationId);
    if (donation && donation.status === 'Available') {
        donation.status = 'Claimed';
        displayDonations();
        showNotification('Donation claimed successfully! Contact the donor for pickup details.', 'success');
    } else {
        showNotification('This donation is no longer available.', 'error');
    }
}

function searchDonations() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a location to search.</p>';
        return;
    }
    
    const filteredDonations = donations.filter(donation => 
        donation.location.toLowerCase().includes(searchTerm) && 
        donation.status === 'Available'
    );
    
    resultsContainer.innerHTML = '';
    
    if (filteredDonations.length === 0) {
        resultsContainer.innerHTML = `<p>No available donations found in "${searchTerm}".</p>`;
        return;
    }
    
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'donations-grid';
    
    filteredDonations.forEach(donation => {
        const card = createDonationCard(donation);
        resultsGrid.appendChild(card);
    });
    
    resultsContainer.appendChild(resultsGrid);
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Allow search on Enter key press
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchDonations();
        }
    });
});

// Auto-refresh donations every 30 seconds (simulate real-time updates)
setInterval(function() {
    if (document.getElementById('browse').classList.contains('active')) {
        displayDonations();
    }
}, 30000);