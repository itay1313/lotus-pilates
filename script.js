// Gift assignments based on registration order
const giftAssignments = [
    // First 10: Pilates intro at 10:00
    ...Array(10).fill('אימון היכרות מתנה בשעה 10:00'),
    // Next 10: Pilates intro at 11:00
    ...Array(10).fill('אימון היכרות מתנה בשעה 11:00'),
    // Next 10: Pilates intro at 12:00
    ...Array(10).fill('אימון היכרות מתנה בשעה 12:00'),
    // Next 15: Massage
    ...Array(15).fill('10 דקות מסאז\' מתנה אצל המסאז\'יסטית מלכה כהן'),
    // Next 10: Zumba
    ...Array(10).fill('שיעור זומבה אנרגטי מתנה ב10:30'),
    // Next 20: Discount
    ...Array(20).fill('10 אחוז הנחה על סט ביגוד ספורטיבי של המעצבת ora-bora')
];

// Initialize registration count from localStorage
function getRegistrationCount() {
    const count = localStorage.getItem('registrationCount');
    return count ? parseInt(count) : 0;
}

// Save registration count to localStorage
function saveRegistrationCount(count) {
    localStorage.setItem('registrationCount', count.toString());
}

// Get gift based on registration number
function getGiftForRegistration(registrationNumber) {
    if (registrationNumber <= giftAssignments.length) {
        return giftAssignments[registrationNumber - 1];
    }
    // If all gifts are taken, show a message
    return 'תודה על ההרשמה! נשמח לראותך באירוע!';
}

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validate form
    if (!firstName || !lastName || !phone) {
        alert('אנא מלאי את כל השדות');
        return;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
        alert('אנא הכניסי מספר טלפון תקין');
        return;
    }
    
    // Get current registration count
    let currentCount = getRegistrationCount();
    currentCount++;
    
    // Save registration
    const registration = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        registrationNumber: currentCount,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    saveRegistrationCount(currentCount);
    
    // Get gift
    const gift = getGiftForRegistration(currentCount);
    
    // Display gift modal
    showGiftModal(gift, currentCount);
    
    // Reset form
    document.getElementById('registrationForm').reset();
    
    // Scroll to modal
    document.getElementById('giftModal').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Show gift modal
function showGiftModal(gift, registrationNumber) {
    const modal = document.getElementById('giftModal');
    const giftResult = document.getElementById('giftResult');
    
    giftResult.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 1.2em; margin-bottom: 15px; color: #FFD700;">
                את הנרשמת מספר ${registrationNumber}
            </div>
            <div style="font-size: 1.5em; line-height: 1.6;">
                ${gift}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('giftModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('giftModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll indicator click
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    document.querySelector('.intro').scrollIntoView({ behavior: 'smooth' });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add sparkle effect to hero section
function createSparkles() {
    const hero = document.querySelector('.hero');
    const sparkleCount = 20;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.opacity = Math.random() * 0.5 + 0.3;
        sparkle.style.animation = `sparkleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.pointerEvents = 'none';
        hero.appendChild(sparkle);
    }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// Initialize sparkles when page loads
window.addEventListener('load', function() {
    createSparkles();
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

