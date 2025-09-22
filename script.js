document.addEventListener('DOMContentLoaded', () => {
    // --- Typing Animation Logic ---
    const subtitleElement = document.getElementById('hero-subtitle');
    if (subtitleElement) {
        const textToType = "B.Tech in CSE (Data Science)";
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < textToType.length) { // Typing
                subtitleElement.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor">&nbsp;</span>';
                charIndex++;
                setTimeout(typeWriter, 120);
            } else {
                // Pause at the end
                setTimeout(erase, 2000); // Wait 2 seconds before erasing
            }
        }

        function erase() {
            if (charIndex > 0) { // Erasing
                subtitleElement.innerHTML = textToType.substring(0, charIndex - 1) + '<span class="cursor">&nbsp;</span>';
                charIndex--;
                setTimeout(erase, 80);
            } else {
                // Pause when empty and restart
                setTimeout(typeWriter, 500); // Wait 0.5 seconds before typing again
            }
        }

        // Start the animation (always run, ignore reduced motion)
        setTimeout(typeWriter, 500);
    }

    // --- CGPA Chart Logic ---
    const cgpaChartCanvas = document.getElementById('cgpaChart');
    if (cgpaChartCanvas) {
        const cgpaData = [
            { semester: 1, cgpa: 8.15 },
            { semester: 2, cgpa: 8.06 },
            // Add more semesters here as you complete them
            // { semester: 3, cgpa: 8.5 },
        ];

        // Define all semesters for the chart labels
        const allSemesters = [
            'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4',
            'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'
        ];

        // Map available data to the full semester list, using null for future semesters
        const chartCgpaValues = allSemesters.map((sem, index) => {
            const semNumber = index + 1;
            const dataPoint = cgpaData.find(data => data.semester === semNumber);
            return dataPoint ? dataPoint.cgpa : null;
        });

        // Calculate average CGPA based only on available data
        const availableCgpaValues = cgpaData.map(data => data.cgpa);
        const totalSemestersWithData = availableCgpaValues.length;
        const sumOfCgpa = availableCgpaValues.reduce((sum, value) => sum + value, 0);
        const averageCgpa = (sumOfCgpa / totalSemestersWithData).toFixed(2);

        // Update summary text
        document.getElementById('total-sem').textContent = totalSemestersWithData;
        document.getElementById('avg-cgpa').textContent = averageCgpa;

        // Render Chart
        const ctx = cgpaChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allSemesters,
                datasets: [{
                    label: 'CGPA',
                    data: chartCgpaValues,
                    backgroundColor: 'rgba(0, 173, 181, 0.6)',
                    borderColor: 'rgba(0, 173, 181, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 7.5, // Adjust based on your grades
                        max: 10,
                        ticks: { color: '#EEEEEE' },
                        grid: { color: 'rgba(238, 238, 238, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#EEEEEE' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        filter: function (tooltipItem) {
                            return tooltipItem.raw !== null;
                        }
                    }
                }
            }
        });
    }

    // --- Scroll Animation Logic ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    // --- Hide Navbar on Scroll Logic ---
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    let isNavigatingViaAnchor = false;
    let lastScrollY = window.scrollY;

    const handleNavbarScroll = () => {
        // If we are navigating via an anchor link, don't hide the navbar.
        // The flag will be reset automatically after a short period.
        if (isNavigatingViaAnchor) {
            lastScrollY = window.scrollY;
            return;
        }

        if (lastScrollY < window.scrollY && window.scrollY > 100 && !navMenu.classList.contains('active')) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollY = window.scrollY;
        handleScrollAnimation(); // Also handle fade-in animations on scroll

        // Show/hide back-to-top button
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    // Trigger animation for elements already in view on page load
    handleScrollAnimation();

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                // If it's an anchor link, set a flag to prevent navbar from hiding during scroll
                if (link.getAttribute('href').startsWith('#')) {
                    isNavigatingViaAnchor = true;
                    navbar.classList.remove('navbar-hidden'); // Ensure it's visible
                    setTimeout(() => {
                        isNavigatingViaAnchor = false;
                    }, 1000); // Reset flag after 1 second (enough time for scroll)
                }

                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // --- Back to Top Button Click Logic ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Contact Form Mailto Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the form from submitting the traditional way

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const recipient = 'paramveersinghpanesar28@gmail.com';
            const subject = `New Message from Portfolio - ${name}`;
            const body = `You have received a new message from your portfolio website.\n\n--- Details ---\nName: ${name}\nEmail: ${email}\n\n--- Message ---\n${message}`;

            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        });
    }
});