(function(){
  const form = document.getElementById('donation-form');
  const donationsList = document.getElementById('donations-list');
  const STORAGE_KEY = 'localFoodDonations';

  // Load donations from localStorage or start empty
  let donations = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Utility function: Save donations to localStorage
  function saveDonations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  }

  // Utility function: Create donation element in DOM
  function createDonationElement(donation, index) {
    const div = document.createElement('div');
    div.className = 'donation-item';
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `Donation from ${donation.donorName}, food: ${donation.foodType}, quantity: ${donation.quantity}`);

    const header = document.createElement('div');
    header.className = 'donation-header';

    const donorSpan = document.createElement('span');
    donorSpan.textContent = donation.donorName;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Mark as Collected';
    removeBtn.setAttribute('aria-label', `Mark donation from ${donation.donorName} as collected`);
    removeBtn.addEventListener('click', () => {
      donations.splice(index, 1);
      saveDonations();
      renderDonations();
    });

    header.appendChild(donorSpan);
    header.appendChild(removeBtn);

    const contactInfo = document.createElement('div');
    contactInfo.className = 'donation-contact';
    contactInfo.textContent = `Contact: ${donation.contactInfo}`;

    const foodInfo = document.createElement('div');
    foodInfo.className = 'donation-info';
    foodInfo.innerHTML = `<strong>Food:</strong> ${donation.foodType}`;

    const quantityInfo = document.createElement('div');
    quantityInfo.className = 'donation-info';
    quantityInfo.innerHTML = `<strong>Quantity:</strong> ${donation.quantity}`;

    const addressInfo = document.createElement('div');
    addressInfo.className = 'donation-info';
    addressInfo.innerHTML = `<strong>Pickup Address:</strong> ${donation.pickupAddress}`;

    const notesInfo = document.createElement('div');
    notesInfo.className = 'donation-info';
    if (donation.notes.trim() !== '') {
      notesInfo.innerHTML = `<strong>Notes:</strong> ${donation.notes}`;
    }

    div.appendChild(header);
    div.appendChild(contactInfo);
    div.appendChild(foodInfo);
    div.appendChild(quantityInfo);
    div.appendChild(addressInfo);
    if (donation.notes.trim() !== '') {
      div.appendChild(notesInfo);
    }

    return div;
  }

  // Render entire donations list
  function renderDonations() {
    donationsList.innerHTML = '';
    if(donations.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = "No active food donations available.";
      emptyMsg.style.fontStyle = 'italic';
      emptyMsg.style.color = '#558b2f';
      donationsList.appendChild(emptyMsg);
      donationsList.setAttribute('aria-label', 'No active food donations');
      return;
    }
    donations.forEach((donation, index) => {
      const donationEl = createDonationElement(donation, index);
      donationsList.appendChild(donationEl);
    });
    donationsList.setAttribute('aria-label', `${donations.length} active food donations listed`);
  }

  // Form submission handler
  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const formData = new FormData(form);
    const newDonation = {
      donorName: formData.get('donorName').trim(),
      contactInfo: formData.get('contactInfo').trim(),
      foodType: formData.get('foodType').trim(),
      quantity: formData.get('quantity').trim(),
      pickupAddress: formData.get('pickupAddress').trim(),
      notes: formData.get('notes').trim()
    };

    // Basic validation to ensure required fields are not empty
    if (!newDonation.donorName || !newDonation.contactInfo || !newDonation.foodType || !newDonation.quantity || !newDonation.pickupAddress) {
      alert('Please fill in all required fields.');
      return;
    }

    donations.push(newDonation);
    saveDonations();
    renderDonations();

    // Reset form after successful submission
    form.reset();

    // Focus back to donorName input
    form.elements['donorName'].focus();
  });

  // Initial render
  renderDonations();

})();
