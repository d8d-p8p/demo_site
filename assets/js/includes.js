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

    // Function to get the base path for GitHub Pages and relative path for assets
    function getBasePath() {
        const isGitHubPages = window.location.hostname.includes('github.io');
        if (isGitHubPages) {
            const pathSegments = window.location.pathname.split('/').filter(s => s);
            if (pathSegments.length > 0) {
                // GitHub Pages path typically starts with /repository-name/
                return `/${pathSegments[0]}/`;
            }
        }
        return '/';
    }

    // Function to calculate relative path to assets from current page
    function getRelativeAssetsPath() {
        const path = window.location.pathname;
        const isGitHubPages = window.location.hostname.includes('github.io');

        // Count depth from root (excluding repository name on GitHub Pages)
        let pathSegments = path.split('/').filter(s => s);

        if (isGitHubPages && pathSegments.length > 0) {
            // Remove repository name from path calculation
            pathSegments = pathSegments.slice(1);
        }

        // If we're at root level (index.html), use current directory
        if (pathSegments.length === 0 || pathSegments[pathSegments.length - 1].endsWith('.html')) {
            pathSegments.pop(); // Remove filename if present
        }

        // Calculate relative path depth
        const depth = pathSegments.length;
        const relativePath = depth > 0 ? '../'.repeat(depth) : '';

        return relativePath;
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
        const basePath = getBasePath();
        let includesPath = `${basePath}includes/`;

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
            includesPath = '../includes/';
        }

        try {
            const isFileProtocol = window.location.protocol === 'file:';
            const isGitHubPages = window.location.hostname.includes('github.io') ||
                                 window.location.hostname.includes('githubusercontent.com') ||
                                 window.location.hostname.endsWith('.github.io');

            // Always use includes.data.js for GitHub Pages or file protocol
            // Only use fetch for local development servers
            const useDataFile = isFileProtocol || isGitHubPages || !window.location.hostname.includes('localhost');

            if (useDataFile) {
                // Load pre-bundled include strings from includes.data.js
                const relativePath = getRelativeAssetsPath();
                const assetsBase = `${relativePath}assets/js/`;

                console.log('Relative path:', relativePath);
                console.log('Loading includes.data.js from:', `${assetsBase}includes.data.js`);

                if (!window.__INCLUDES) {
                    try {
                        await loadScript(`${assetsBase}includes.data.js`);
                    } catch (e) {
                        console.error('Failed to load includes.data.js', e);
                        console.error('Attempted path:', `${assetsBase}includes.data.js`);
                        console.error('Current page path:', window.location.pathname);
                        console.error('Calculated relative path:', relativePath);
                        return; // Exit if we can't load the data file
                    }
                }

                const headerHTML = window.__INCLUDES?.[`header-${lang}`] || '';
                const footerHTML = window.__INCLUDES?.[`footer-${lang}`] || '';

                const headerPlaceholder = document.getElementById('header-placeholder');
                const footerPlaceholder = document.getElementById('footer-placeholder');

                if (headerPlaceholder && headerHTML) {
                    headerPlaceholder.innerHTML = headerHTML;
                } else {
                    console.warn(`Header not loaded. Placeholder: ${!!headerPlaceholder}, HTML: ${!!headerHTML}`);
                }

                if (footerPlaceholder && footerHTML) {
                    footerPlaceholder.innerHTML = footerHTML;
                } else {
                    console.warn(`Footer not loaded. Placeholder: ${!!footerPlaceholder}, HTML: ${!!footerHTML}`);
                }

            } else {
                // Normal fetch path for local development server
                try {
                    // Load header
                    const headerResponse = await fetch(`${includesPath}header-${lang}.html`);
                    if (headerResponse.ok) {
                        const headerHTML = await headerResponse.text();
                        const headerPlaceholder = document.getElementById('header-placeholder');
                        if (headerPlaceholder) {
                            headerPlaceholder.innerHTML = headerHTML;
                        }
                    } else {
                        console.warn(`Failed to fetch header: ${headerResponse.status}`);
                    }

                    // Load footer
                    const footerResponse = await fetch(`${includesPath}footer-${lang}.html`);
                    if (footerResponse.ok) {
                        const footerHTML = await footerResponse.text();
                        const footerPlaceholder = document.getElementById('footer-placeholder');
                        if (footerPlaceholder) {
                            footerPlaceholder.innerHTML = footerHTML;
                        }
                    } else {
                        console.warn(`Failed to fetch footer: ${footerResponse.status}`);
                    }
                } catch (fetchError) {
                    console.error('Fetch failed, falling back to data file:', fetchError);
                    // Fallback to data file if fetch fails
                    const relativePath = getRelativeAssetsPath();
                    const assetsBase = `${relativePath}assets/js/`;

                    if (!window.__INCLUDES) {
                        await loadScript(`${assetsBase}includes.data.js`);
                    }

                    const headerHTML = window.__INCLUDES?.[`header-${lang}`] || '';
                    const footerHTML = window.__INCLUDES?.[`footer-${lang}`] || '';

                    const headerPlaceholder = document.getElementById('header-placeholder');
                    const footerPlaceholder = document.getElementById('footer-placeholder');

                    if (headerPlaceholder && headerHTML) headerPlaceholder.innerHTML = headerHTML;
                    if (footerPlaceholder && footerHTML) footerPlaceholder.innerHTML = footerHTML;
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
        const isGitHubPages = window.location.hostname.includes('github.io');
        const basePath = getBasePath();
        const relativePath = getRelativeAssetsPath();

        console.log('🔍 Debug Info:');
        console.log('Protocol:', window.location.protocol);
        console.log('Hostname:', window.location.hostname);
        console.log('Is GitHub Pages:', isGitHubPages);
        console.log('Base Path:', basePath);
        console.log('Relative Assets Path:', relativePath);
        console.log('Calculated assets path:', `${relativePath}assets/js/includes.data.js`);
        console.log('Full URL:', window.location.href);
        console.log('Path:', window.location.pathname);
        console.log('Path segments:', window.location.pathname.split('/').filter(s => s));
        console.log('__INCLUDES loaded:', !!window.__INCLUDES);
        console.log('Available includes:', window.__INCLUDES ? Object.keys(window.__INCLUDES) : 'none');
        console.log('CSS loaded:', !!document.querySelector('link[href*="style.css"]'));
        console.log('AOS loaded:', typeof AOS !== 'undefined');
        console.log('Header placeholder:', !!document.getElementById('header-placeholder'));
        console.log('Footer placeholder:', !!document.getElementById('footer-placeholder'));
        console.log('Main content exists:', !!document.querySelector('main'));

        // Check if header/footer content was actually loaded
        const headerContent = document.getElementById('header-placeholder')?.innerHTML;
        const footerContent = document.getElementById('footer-placeholder')?.innerHTML;
        console.log('Header content loaded:', headerContent ? headerContent.length + ' chars' : 'none');
        console.log('Footer content loaded:', footerContent ? footerContent.length + ' chars' : 'none');
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
