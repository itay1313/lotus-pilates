// EmailJS Configuration
// להגדרה: https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_ntjek1e';
const EMAILJS_TEMPLATE_ID = 'template_z4in2ab'; // צריך ליצור Template ולקבל את ה-ID
const EMAILJS_PUBLIC_KEY = 's1yWlJzB9AaOebjpn'; // צריך לקבל מ-Account > General
const RECIPIENT_EMAIL = 'lotuspilates45@gmail.com';

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

// Total: 75 gifts

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

// Send WhatsApp message to user
function sendWhatsAppMessage(registration, gift) {
    // Format phone number (remove dashes, ensure it starts with country code)
    let phoneNumber = registration.phone.replace(/-/g, '').replace(/\s/g, '');

    // If phone doesn't start with country code, add Israel code (972)
    if (!phoneNumber.startsWith('972') && !phoneNumber.startsWith('+972')) {
        // Remove leading 0 if exists
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
        }
        phoneNumber = '972' + phoneNumber;
    }

    // Remove + if exists
    phoneNumber = phoneNumber.replace('+', '');

    // Create WhatsApp message
    const message = `🎉 מזל טוב! 🎉\n\nאת הנרשמת מספר ${registration.registrationNumber}\n${gift}\n\nנשמח לראותך באירוע! 💫`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp Web link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab/window
    // Note: This will open WhatsApp Web/App, user needs to click send
    // For automatic sending, you need WhatsApp Business API (Twilio, etc.)
    window.open(whatsappUrl, '_blank');

    console.log('WhatsApp message prepared for:', phoneNumber);
}

// Send registration email using EmailJS
async function sendRegistrationEmail(registration) {
    console.log('Attempting to send registration email...', registration);

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded. Please add the EmailJS script to your HTML.');
        alert('שגיאה: EmailJS לא נטען. אנא רענני את הדף ונסי שוב.');
        return;
    }

    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.error('EmailJS Service ID not configured');
        alert('שגיאה: Service ID לא מוגדר');
        return;
    }

    if (!EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        console.error('EmailJS Template ID not configured');
        alert('שגיאה: Template ID לא מוגדר');
        return;
    }

    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.error('EmailJS Public Key not configured');
        alert('שגיאה: Public Key לא מוגדר');
        return;
    }

    try {
        console.log('Initializing EmailJS with Public Key:', EMAILJS_PUBLIC_KEY);

        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Prepare email template parameters
        // Note: Make sure your EmailJS Template has these variables:
        // {{registration_number}}, {{first_name}}, {{last_name}}, {{phone}}, {{timestamp}}
        // And set "To Email" in Template settings to: lotuspilates45@gmail.com
        const templateParams = {
            registration_number: registration.registrationNumber,
            first_name: registration.firstName,
            last_name: registration.lastName,
            phone: registration.phone,
            timestamp: new Date().toLocaleString('he-IL')
        };

        console.log('Sending email with params:', {
            serviceId: EMAILJS_SERVICE_ID,
            templateId: EMAILJS_TEMPLATE_ID,
            params: templateParams
        });

        // Send email
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('Registration email sent successfully!', response);
        console.log('Email sent to:', RECIPIENT_EMAIL);
    } catch (error) {
        console.error('Error sending registration email:', error);
        console.error('Error details:', {
            status: error.status,
            text: error.text,
            message: error.message
        });

        // Show user-friendly error message
        if (error.status === 400) {
            alert('שגיאה בשליחת המייל: פרמטרים לא תקינים. אנא בדקי את הגדרות ה-Template ב-EmailJS.');
        } else if (error.status === 401) {
            alert('שגיאה בשליחת המייל: Public Key לא תקין. אנא בדקי את ה-Public Key.');
        } else if (error.status === 404) {
            alert('שגיאה בשליחת המייל: Service או Template לא נמצאו. אנא בדקי את ה-IDs.');
        } else {
            alert('שגיאה בשליחת המייל. אנא בדקי את הקונסול לדetails נוספים.');
        }
    }
}

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', function (e) {
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

    // Get current registration count and increment
    // IMPORTANT: Save count FIRST to ensure sequential numbering even if email fails
    let currentCount = getRegistrationCount();
    currentCount++;

    // Save the new count immediately to localStorage
    // This ensures the count persists even if the page is refreshed
    saveRegistrationCount(currentCount);

    // Save registration data
    const registration = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        registrationNumber: currentCount,
        timestamp: new Date().toISOString()
    };

    // Save registration to localStorage array
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));

    // Send registration email (async, don't wait for response)
    sendRegistrationEmail(registration).catch(error => {
        console.error('Error sending registration email:', error);
        // Continue anyway - don't block the user experience
    });

    // Get gift
    const gift = getGiftForRegistration(currentCount);

    // Send WhatsApp message (opens WhatsApp with pre-filled message)
    // Note: User needs to click send manually
    // For automatic sending, you need WhatsApp Business API
    sendWhatsAppMessage(registration, gift);

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
            <div style="font-size: 1.2em; margin-bottom: 15px; color: #C9A961; font-weight: 800;">
                <strong>את הנרשמת מספר ${registrationNumber}</strong>
            </div>
            <div style="font-size: 1.5em; line-height: 1.6; color: #1a1a1a; font-weight: 700;">
                ${gift}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Video modal functionality
const videoBtn = document.getElementById('videoBtn');
const videoModal = document.getElementById('videoModal');
const videoClose = document.querySelector('.video-close');
const youtubeVideo = document.getElementById('youtubeVideo');

// YouTube Shorts URL to embed URL conversion
function convertYouTubeShortsToEmbed(url) {
    // Extract video ID from shorts URL
    // https://www.youtube.com/shorts/2qqGcZQmNvY -> 2qqGcZQmNvY
    const videoId = url.split('/shorts/')[1]?.split('?')[0];
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return '';
}

// Open video modal
if (videoBtn) {
    videoBtn.addEventListener('click', function () {
        const videoUrl = 'https://www.youtube.com/shorts/2qqGcZQmNvY';
        const embedUrl = convertYouTubeShortsToEmbed(videoUrl);
        if (embedUrl && youtubeVideo) {
            youtubeVideo.src = embedUrl;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close video modal
if (videoClose) {
    videoClose.addEventListener('click', function () {
        videoModal.style.display = 'none';
        if (youtubeVideo) {
            youtubeVideo.src = ''; // Stop video playback
        }
        document.body.style.overflow = 'auto';
    });
}

// Close video modal when clicking outside
if (videoModal) {
    window.addEventListener('click', function (e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            if (youtubeVideo) {
                youtubeVideo.src = ''; // Stop video playback
            }
            document.body.style.overflow = 'auto';
        }
    });
}

// Close gift modal
const giftModalClose = document.querySelector('#giftModal .close-modal');
if (giftModalClose) {
    giftModalClose.addEventListener('click', function () {
        document.getElementById('giftModal').style.display = 'none';
    });
}

// Close gift modal when clicking outside
window.addEventListener('click', function (e) {
    const giftModal = document.getElementById('giftModal');
    if (e.target === giftModal) {
        giftModal.style.display = 'none';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.sticky-header');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Set hover images for activity cards
document.querySelectorAll('.activity-card[data-hover-image]').forEach(card => {
    const imageUrl = card.getAttribute('data-hover-image');
    const hoverImage = card.querySelector('.activity-hover-image');
    if (hoverImage && imageUrl) {
        hoverImage.style.setProperty('--hover-image', `url(${imageUrl})`);
    }
});

// Scroll indicator click
document.querySelector('.scroll-indicator').addEventListener('click', function () {
    document.querySelector('.intro').scrollIntoView({ behavior: 'smooth' });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
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
    const sparkleCount = 40;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.opacity = Math.random() * 0.3 + 0.2;
        sparkle.style.filter = 'brightness(0.8)';
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
window.addEventListener('load', function () {
    createSparkles();
});

// Add parallax effect to hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

