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
        console.log('🌐 Initializing language switcher...');

        const languageToggle = document.getElementById('languageToggle');
        const languageDropdown = document.getElementById('languageDropdown');
        const languageOptions = document.querySelectorAll('.language-option');

        if (!languageToggle || !languageDropdown) {
            console.warn('❌ Language switcher elements not found');
            return;
        }

        console.log('🌐 Language switcher elements found');

        // Toggle dropdown
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
            console.log('🌐 Language dropdown toggled');
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
                console.log('🌐 Language selected:', selectedLang);

                // Switch language
                switchLanguage(selectedLang);

                // Close dropdown
                languageDropdown.classList.remove('active');
            });
        });

        console.log('🌐 Language switcher initialized successfully');
    }

    // Switch language function
    function switchLanguage(targetLang) {
        console.log('🌐 Switching to language:', targetLang);

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;

        console.log('🌐 Current path:', currentPath);

        // For GitHub Pages, extract repository name if present
        const isGitHubPages = window.location.hostname.includes('github.io');
        let basePath = '';
        let relativePath = currentPath;

        if (isGitHubPages) {
            const pathParts = currentPath.split('/').filter(part => part);
            if (pathParts.length > 0) {
                basePath = '/' + pathParts[0]; // Repository name
                relativePath = '/' + pathParts.slice(1).join('/');
                if (!relativePath.endsWith('/') && !relativePath.includes('.')) {
                    relativePath += '/';
                }
            }
        }

        console.log('🌐 Base path:', basePath);
        console.log('🌐 Relative path:', relativePath);

        let newPath = '';

        // Determine current language and create new path
        if (relativePath.includes('/en/')) {
            // Currently in English
            if (targetLang === 'ja') {
                newPath = relativePath.replace('/en/', '/');
            } else if (targetLang === 'fr') {
                newPath = relativePath.replace('/en/', '/fr/');
            } else {
                return; // Same language, no change needed
            }
        } else if (relativePath.includes('/fr/')) {
            // Currently in French
            if (targetLang === 'ja') {
                newPath = relativePath.replace('/fr/', '/');
            } else if (targetLang === 'en') {
                newPath = relativePath.replace('/fr/', '/en/');
            } else {
                return; // Same language, no change needed
            }
        } else {
            // Currently in Japanese (root)
            if (targetLang === 'en') {
                // Handle root index.html specially
                if (relativePath.endsWith('/') || relativePath.endsWith('/index.html') || relativePath === '/') {
                    newPath = '/en/index.html';
                } else {
                    newPath = '/en' + relativePath;
                }
            } else if (targetLang === 'fr') {
                // Handle root index.html specially
                if (relativePath.endsWith('/') || relativePath.endsWith('/index.html') || relativePath === '/') {
                    newPath = '/fr/index.html';
                } else {
                    newPath = '/fr' + relativePath;
                }
            } else {
                return; // Same language, no change needed
            }
        }

        // Combine base path for GitHub Pages
        if (isGitHubPages && basePath) {
            newPath = basePath + newPath;
        }

        // Handle GitHub Pages path resolution
        const isGitHubPagesEnv = window.location.hostname.includes('github.io');
        if (isGitHubPagesEnv) {
            // For GitHub Pages, we need to handle the repository name in the path
            const repoName = window.location.pathname.split('/')[1] || '';

            if (newPath.startsWith('/')) {
                if (repoName && !newPath.startsWith(`/${repoName}/`)) {
                    newPath = `/${repoName}${newPath}`;
                }
            } else {
                // If it's a relative path, make it work from current location
                const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                newPath = basePath + newPath;
            }
        }

        if (newPath) {
            const fullNewUrl = newPath + currentSearch + currentHash;
            console.log('🌐 Redirecting to:', fullNewUrl);
            window.location.href = fullNewUrl;
        } else {
            console.warn('🌐 Could not determine new path for language:', targetLang);
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
            // For simplicity and reliability, always use includes.data.js
            // This avoids issues with GitHub Pages, CORS, and file protocols
            console.log('🔧 Loading includes from data file...');

            // Load pre-bundled include strings from includes.data.js
            const assetsBase = isInSubdirectory ? '../assets/js/' : 'assets/js/';
            console.log('🔧 Assets base path:', assetsBase);

            if (!window.__INCLUDES) {
                try {
                    console.log('🔧 Loading script:', `${assetsBase}includes.data.js`);
                    await loadScript(`${assetsBase}includes.data.js`);
                    console.log('🔧 Script loaded successfully');
                } catch (e) {
                    console.error('❌ Failed to load includes.data.js', e);
                    return; // Exit if we can't load the data file
                }
            }

            console.log('🔧 __INCLUDES available:', !!window.__INCLUDES);
            console.log('🔧 Available keys:', window.__INCLUDES ? Object.keys(window.__INCLUDES) : 'none');

            const headerHTML = window.__INCLUDES?.[`header-${lang}`] || '';
            const footerHTML = window.__INCLUDES?.[`footer-${lang}`] || '';

            console.log('🔧 Header HTML length:', headerHTML.length);
            console.log('🔧 Footer HTML length:', footerHTML.length);

            const headerPlaceholder = document.getElementById('header-placeholder');
            const footerPlaceholder = document.getElementById('footer-placeholder');

            if (headerPlaceholder && headerHTML) {
                headerPlaceholder.innerHTML = headerHTML;
                console.log('✅ Header loaded successfully');
            } else {
                console.warn(`❌ Header not loaded. Placeholder: ${!!headerPlaceholder}, HTML: ${!!headerHTML}`);
            }

            if (footerPlaceholder && footerHTML) {
                footerPlaceholder.innerHTML = footerHTML;
                console.log('✅ Footer loaded successfully');
            } else {
                console.warn(`❌ Footer not loaded. Placeholder: ${!!footerPlaceholder}, HTML: ${!!footerHTML}`);
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

    // Debug function to check if files are loading
    function debugLoadStatus() {
        console.log('🔍 Debug Info:');
        console.log('Protocol:', window.location.protocol);
        console.log('Hostname:', window.location.hostname);
        console.log('Full URL:', window.location.href);
        console.log('Path:', window.location.pathname);
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
