// Include HTML components utility
(function() {
    'use strict';

    // Function to fix paths in loaded content for subdirectories
    function fixPathsForSubdirectory() {
        const path = window.location.pathname;
        let lang = 'ja';
        let homeUrl = '../index.html';

        if (path.includes('/en/')) {
            lang = 'en';
            homeUrl = '../en/index.html';
        } else if (path.includes('/fr/')) {
            lang = 'fr';
            homeUrl = '../fr/index.html';
        }

        // Fix logo link
        const logoLink = document.getElementById('logo-link');
        if (logoLink) {
            logoLink.href = homeUrl;
        }

        // Fix logo image
        const logoImage = document.getElementById('logo-image');
        if (logoImage) {
            logoImage.src = '../assets/images/logo.png';
        }

        // Fix navigation links that start with #
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.href = homeUrl + href;
        });

        // Fix sub-menu links that start with #
        const subMenuLinks = document.querySelectorAll('.sub-menu a[href^="#"]');
        subMenuLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.href = homeUrl + href;
        });

        // Fix footer navigation links that start with #
        const footerLinks = document.querySelectorAll('.footer-nav a[href^="#"]');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.href = homeUrl + href;
        });
    }

    // Function to load HTML includes
    async function loadIncludes() {
        // Determine current language from URL
        const path = window.location.pathname;
        let lang = 'ja';

        if (path.includes('/en/')) {
            lang = 'en';
        } else if (path.includes('/fr/')) {
            lang = 'fr';
        }

        // Determine base path for includes
        let basePath = '/includes/';

        // Check if we're in a subdirectory
    const isInSubdirectory = path.includes('/en/') ||
                   path.includes('/fr/') ||
                   path.includes('/dev/') ||
                   path.includes('/restaurants/') ||
                   path.includes('/retailers/') ||
                   path.includes('/news/') ||
                   path.includes('/blog/') ||
                   path.includes('/shops/') ||
                   path.includes('/shop-details/') ||
                   path.includes('/project/');

        if (isInSubdirectory) {
            basePath = '../includes/';
        }

        try {
            // Load header
            const headerResponse = await fetch(`${basePath}header-${lang}.html`);
            if (headerResponse.ok) {
                const headerHTML = await headerResponse.text();
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) {
                    headerPlaceholder.innerHTML = headerHTML;
                }
            }

            // Load footer
            const footerResponse = await fetch(`${basePath}footer-${lang}.html`);
            if (footerResponse.ok) {
                const footerHTML = await footerResponse.text();
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) {
                    footerPlaceholder.innerHTML = footerHTML;
                }
            }

            // Fix paths for subdirectories
            if (isInSubdirectory) {
                fixPathsForSubdirectory();
            }

            // Re-initialize scripts that depend on header/footer elements
            if (window.initHeaderFooterScripts) {
                window.initHeaderFooterScripts();
            }
        } catch (error) {
            console.error('Error loading includes:', error);
        }
    }

    // Debug function to check if files are loading
    function debugLoadStatus() {
        console.log('🔍 Debug Info:');
        console.log('Path:', window.location.pathname);
        console.log('CSS loaded:', !!document.querySelector('link[href*="style.css"]'));
        console.log('AOS loaded:', typeof AOS !== 'undefined');
        console.log('Header placeholder:', !!document.getElementById('header-placeholder'));
        console.log('Footer placeholder:', !!document.getElementById('footer-placeholder'));
        console.log('Main content exists:', !!document.querySelector('main'));
    }

    // Load includes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadIncludes();
            debugLoadStatus();
        });
    } else {
        loadIncludes();
        debugLoadStatus();
    }
})();
