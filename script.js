// EmailJS Configuration
// להגדרה: https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_ntjek1e';
const EMAILJS_TEMPLATE_ID = 'template_z4in2ab'; // צריך ליצור Template ולקבל את ה-ID
const EMAILJS_PUBLIC_KEY = 's1yWlJzB9AaOebjpn'; // צריך לקבל מ-Account > General
const RECIPIENT_EMAIL = 'liad.levin1@gmail.com';

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
    // Return 0 if no count exists (starting fresh)
    // Parse as integer to ensure we get a number
    return count ? parseInt(count, 10) : 0;
}

// Save registration count to localStorage
function saveRegistrationCount(count) {
    localStorage.setItem('registrationCount', count.toString());
}

// Reset all registration data (for testing)
function resetRegistrations() {
    // Remove all registration data
    localStorage.removeItem('registrationCount');
    localStorage.removeItem('registrations');

    // Verify the reset worked
    const count = getRegistrationCount();
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

    console.log('✅ כל נתוני ההרשמה אופסו בהצלחה!');
    console.log('מספר ההרשמה הנוכחי:', count);
    console.log('מספר הרשמות שנותרו:', registrations.length);
    console.log('מספר ההרשמה הבא יהיה: 1');

    // Show alert to user
    alert('✅ כל נתוני ההרשמה אופסו בהצלחה!\nמספר ההרשמה הבא יהיה: 1');

    // Reload page to reflect changes
    location.reload();

    return true;
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
        console.warn('Email will not be sent, but registration will continue.');
        return;
    }

    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.error('EmailJS Service ID not configured');
        console.warn('Email will not be sent, but registration will continue.');
        return;
    }

    if (!EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        console.error('EmailJS Template ID not configured');
        console.warn('Email will not be sent, but registration will continue.');
        return;
    }

    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.error('EmailJS Public Key not configured');
        console.warn('Email will not be sent, but registration will continue.');
        return;
    }

    try {
        console.log('Initializing EmailJS with Public Key:', EMAILJS_PUBLIC_KEY);

        // Initialize EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Prepare email template parameters
        // Note: Make sure your EmailJS Template has these variables:
        // {{registration_number}}, {{first_name}}, {{last_name}}, {{phone}}, {{timestamp}}
        // And set "To Email" in Template settings to: liad.levin1@gmail.com
        const templateParams = {
            registration_number: registration.registrationNumber,
            first_name: registration.firstName,
            last_name: registration.lastName,
            phone: registration.phone,
            timestamp: new Date().toLocaleString('he-IL')
        };

        console.log('📝 Template parameters prepared:', templateParams);

        console.log('Sending email with params:', {
            serviceId: EMAILJS_SERVICE_ID,
            templateId: EMAILJS_TEMPLATE_ID,
            params: templateParams
        });

        // Send email
        console.log('📧 Sending email via EmailJS...');
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('✅ Registration email sent successfully!', response);
        console.log('📬 Email sent to:', RECIPIENT_EMAIL);
        console.log('📋 Email details:', {
            registrationNumber: registration.registrationNumber,
            name: `${registration.firstName} ${registration.lastName}`,
            phone: registration.phone
        });
    } catch (error) {
        console.error('Error sending registration email:', error);
        console.error('Error details:', {
            status: error.status,
            text: error.text,
            message: error.message
        });

        // Don't show alert to user - email failure shouldn't block the user experience
        // The registration is already saved in localStorage
        // Log detailed error for debugging
        if (error.status === 400) {
            console.error('EmailJS Error 400: Invalid parameters. Check Template variables in EmailJS.');
        } else if (error.status === 401) {
            console.error('EmailJS Error 401: Invalid Public Key. Check Public Key in EmailJS account settings.');
        } else if (error.status === 404) {
            console.error('EmailJS Error 404: Service or Template not found. Check Service ID and Template ID.');
        } else {
            console.error('EmailJS Error: Unknown error. Check EmailJS configuration.');
        }

        // Note: Registration continues successfully even if email fails
        console.warn('Registration saved successfully. Email notification failed but user can still see their gift.');
    }
}

// Form submission handler
const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const phoneInput = document.getElementById('phone');

        if (!firstNameInput || !lastNameInput || !phoneInput) {
            console.error('Form inputs not found');
            alert('שגיאה בטופס. אנא רענני את הדף ונסי שוב.');
            return;
        }

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const phone = phoneInput.value.trim();

        // Validate form
        if (!firstName || !lastName || !phone) {
            alert('אנא מלאי את כל השדות');
            return;
        }

        // Validate phone number (basic validation)
        // Remove dashes, spaces, and other non-digit characters for validation
        const cleanedPhone = phone.replace(/[-\s]/g, '');
        const phoneRegex = /^[0-9]{9,10}$/;
        if (!phoneRegex.test(cleanedPhone)) {
            alert('אנא הכניסי מספר טלפון תקין');
            return;
        }

        // Check if phone number already exists
        const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        const phoneExists = existingRegistrations.some(reg => {
            // Normalize phone numbers for comparison (remove dashes and spaces)
            const existingPhone = reg.phone.replace(/[-\s]/g, '');
            return existingPhone === cleanedPhone;
        });

        if (phoneExists) {
            alert('מספר הטלפון הזה כבר נרשם! אנא השתמשי במספר טלפון אחר.');
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

        // Display gift modal with WhatsApp button
        showGiftModal(gift, currentCount, registration);

        // Reset form
        registrationForm.reset();

        // Scroll to modal
        const giftModal = document.getElementById('giftModal');
        if (giftModal) {
            giftModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
} else {
    console.error('Registration form not found');
}

// Show gift modal
function showGiftModal(gift, registrationNumber, registration) {
    const modal = document.getElementById('giftModal');
    const giftResult = document.getElementById('giftResult');

    // Remove any existing WhatsApp button before clearing content
    const existingWhatsAppBtn = document.getElementById('whatsappBtn');
    if (existingWhatsAppBtn) {
        existingWhatsAppBtn.remove();
    }

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

    // Add WhatsApp button to modal if registration data is available
    if (registration) {
        addWhatsAppButtonToModal(registration, gift, registrationNumber);
    }
}

// Add WhatsApp button to the gift modal
function addWhatsAppButtonToModal(registration, gift, registrationNumber) {
    const giftResult = document.getElementById('giftResult');

    if (!giftResult) {
        console.warn('Gift result element not found');
        return;
    }

    // Remove any existing WhatsApp button to prevent duplicates
    const existingBtn = document.getElementById('whatsappBtn');
    if (existingBtn) {
        existingBtn.remove();
    }

    // Create WhatsApp button
    const whatsappBtn = document.createElement('button');
    whatsappBtn.id = 'whatsappBtn';
    whatsappBtn.className = 'whatsapp-modal-btn';
    whatsappBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="whatsapp-icon">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        שלחי לי בוואטסאפ
    `;

    // Add click event with current registration data
    whatsappBtn.addEventListener('click', function () {
        sendWhatsAppMessage(registration, gift);
    });

    // Insert button after the screenshot message
    const screenshotMsg = document.querySelector('.gift-result-screenshot');
    if (screenshotMsg) {
        screenshotMsg.parentNode.insertBefore(whatsappBtn, screenshotMsg.nextSibling);
    } else {
        giftResult.appendChild(whatsappBtn);
    }
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

if (header) {
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

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
const scrollIndicator = document.querySelector('.scroll-indicator');
const introSection = document.querySelector('.intro');

if (scrollIndicator && introSection) {
    scrollIndicator.addEventListener('click', function () {
        introSection.scrollIntoView({ behavior: 'smooth' });
    });
}

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

    if (!hero) {
        console.warn('Hero section not found, skipping sparkle effect');
        return;
    }

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

    // Make reset function available in console for testing
    // Run: resetRegistrations() in browser console to reset all registrations
    window.resetRegistrations = resetRegistrations;

    // Log current registration count on page load
    const currentCount = getRegistrationCount();
    if (currentCount > 0) {
        console.log(`📊 מספר ההרשמה הנוכחי: ${currentCount}`);
        console.log('💡 להאיפוס: הרצי resetRegistrations() בקונסול');
    } else {
        console.log('✨ אין הרשמות - מוכן להתחלה חדשה');
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
