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

        // Fix footer privacy link path (only one privacy.html at site root)
        const privacyLinks = document.querySelectorAll('.footer-nav a[href$="privacy.html"]');
        privacyLinks.forEach(link => {
            link.href = '../privacy.html';
        });
    }

    // Additional fix for file:// protocol or GitHub Pages on root pages
    function fixPathsForRootPages() {
        const isFileProtocol = window.location.protocol === 'file:';
        const isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('githubusercontent.com');

        if (!isFileProtocol && !isGitHubPages) return;

        const path = window.location.pathname;
        const isRoot = !(/\/(en|fr|dev|restaurants|retailers|news|blog|shops|shop-details|project)\//.test(path));
        if (!isRoot) return;

        // Ensure logo points to index.html
        const logoLink = document.getElementById('logo-link');
        if (logoLink) {
            logoLink.href = 'index.html';
        }

        // Rewrite absolute paths starting with "/" to relative for file protocol or GitHub Pages
        const absNodes = document.querySelectorAll('#header-placeholder a[href^="/"], #header-placeholder img[src^="/"], #footer-placeholder a[href^="/"], #footer-placeholder img[src^="/"]');
        absNodes.forEach(el => {
            if (el.hasAttribute('href')) {
                el.setAttribute('href', el.getAttribute('href').replace(/^\//, ''));
            }
            if (el.hasAttribute('src')) {
                el.setAttribute('src', el.getAttribute('src').replace(/^\//, ''));
            }
        });

        // Normalize leading ../ on root
        const relUpNodes = document.querySelectorAll('#header-placeholder a[href^="../"], #footer-placeholder a[href^="../"], #header-placeholder img[src^="../"], #footer-placeholder img[src^="../"]');
        relUpNodes.forEach(el => {
            if (el.hasAttribute('href')) {
                el.setAttribute('href', el.getAttribute('href').replace(/^\.\.\//, ''));
            }
            if (el.hasAttribute('src')) {
                el.setAttribute('src', el.getAttribute('src').replace(/^\.\.\//, ''));
            }
        });
    }

    // Helper: dynamically load a script file and wait until it's loaded
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = () => resolve();
            s.onerror = (e) => reject(e);
            document.head.appendChild(s);
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
            const isFileProtocol = window.location.protocol === 'file:';
            const isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('githubusercontent.com');

            if (isFileProtocol || isGitHubPages) {
                // Offline/local file fallback or GitHub Pages: load pre-bundled include strings
                // Decide relative path to the data bundle
                const assetsBase = isInSubdirectory ? '../assets/js/' : 'assets/js/';
                if (!window.__INCLUDES) {
                    try {
                        await loadScript(`${assetsBase}includes.data.js`);
                    } catch (e) {
                        console.error('Failed to load includes.data.js for fallback', e);
                    }
                }

                const headerHTML = window.__INCLUDES?.[`header-${lang}`] || '';
                const footerHTML = window.__INCLUDES?.[`footer-${lang}`] || '';

                const headerPlaceholder = document.getElementById('header-placeholder');
                const footerPlaceholder = document.getElementById('footer-placeholder');

                if (headerPlaceholder && headerHTML) headerPlaceholder.innerHTML = headerHTML;
                if (footerPlaceholder && footerHTML) footerPlaceholder.innerHTML = footerHTML;

            } else {
                // Normal fetch path for http/https (local server)
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
            }

            // Fix paths for subdirectories
            if (isInSubdirectory) {
                fixPathsForSubdirectory();
            }
            // Additional fix when opening locally at root or on GitHub Pages
            fixPathsForRootPages();

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
