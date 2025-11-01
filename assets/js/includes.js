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

    // Language switcher functionality
    function initLanguageSwitcher() {
        // Add a small delay to ensure DOM is fully ready
        setTimeout(() => {
            const languageToggle = document.getElementById('languageToggle');
            const languageDropdown = document.getElementById('languageDropdown');
            const languageOptions = document.querySelectorAll('.language-option');

            if (!languageToggle || !languageDropdown) {
                console.warn('Language switcher elements not found');
                return;
            }

            // Toggle dropdown
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
                    languageDropdown.classList.remove('active');
                }
            });

            // Handle language selection
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedLang = option.getAttribute('data-lang');

                    // Switch language
                    switchLanguage(selectedLang);

                    // Close dropdown
                    languageDropdown.classList.remove('active');
                });
            });
        }, 100); // Small delay to ensure DOM is ready
    }

    // Switch language function
    function switchLanguage(targetLang) {
        const currentPath = window.location.pathname;
        const isGitHubPages = window.location.hostname.includes('github.io');
        let newPath = '';

        if (isGitHubPages) {
            const pathParts = currentPath.split('/').filter(part => part);
            const repoName = pathParts[0] || '';

            // Determine current language
            let currentLang = 'ja';
            if (currentPath.includes('/en/')) currentLang = 'en';
            else if (currentPath.includes('/fr/')) currentLang = 'fr';

            // Don't switch to the same language
            if (currentLang === targetLang) return;

            // Construct new path
            if (targetLang === 'ja') {
                newPath = `/${repoName}/index.html`;
            } else if (targetLang === 'en') {
                newPath = `/${repoName}/en/index.html`;
            } else if (targetLang === 'fr') {
                newPath = `/${repoName}/fr/index.html`;
            }
        } else {
            // Local development
            if (currentPath.includes('/en/')) {
                if (targetLang === 'ja') newPath = currentPath.replace('/en/', '/');
                else if (targetLang === 'fr') newPath = currentPath.replace('/en/', '/fr/');
            } else if (currentPath.includes('/fr/')) {
                if (targetLang === 'ja') newPath = currentPath.replace('/fr/', '/');
                else if (targetLang === 'en') newPath = currentPath.replace('/fr/', '/en/');
            } else {
                if (targetLang === 'en') newPath = '/en/index.html';
                else if (targetLang === 'fr') newPath = '/fr/index.html';
            }
        }

        if (newPath) {
            window.location.href = newPath + window.location.search + window.location.hash;
        }
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
            // Load pre-bundled include strings from includes.data.js
            const assetsBase = isInSubdirectory ? '../assets/js/' : 'assets/js/';

            if (!window.__INCLUDES) {
                try {
                    await loadScript(`${assetsBase}includes.data.js`);
                } catch (e) {
                    console.error('Failed to load includes.data.js', e);
                    return;
                }
            }

            const headerHTML = window.__INCLUDES?.[`header-${lang}`] || '';
            const footerHTML = window.__INCLUDES?.[`footer-${lang}`] || '';

            const headerPlaceholder = document.getElementById('header-placeholder');
            const footerPlaceholder = document.getElementById('footer-placeholder');

            if (headerPlaceholder && headerHTML) {
                headerPlaceholder.innerHTML = headerHTML;
            }

            if (footerPlaceholder && footerHTML) {
                footerPlaceholder.innerHTML = footerHTML;
            }

            // Fix paths for subdirectories
            if (isInSubdirectory) {
                fixPathsForSubdirectory();
            }
            // Additional fix when opening locally at root or on GitHub Pages
            fixPathsForRootPages();

            // Initialize language switcher functionality
            initLanguageSwitcher();

            // Re-initialize scripts that depend on header/footer elements
            if (window.initHeaderFooterScripts) {
                window.initHeaderFooterScripts();
            }
        } catch (error) {
            console.error('Error loading includes:', error);
        }
    }

    // Load includes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadIncludes);
    } else {
        loadIncludes();
    }
})();
