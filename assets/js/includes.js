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



    // Function to try loading script from multiple possible paths
    async function tryLoadScriptFromPaths(possiblePaths) {
        for (const path of possiblePaths) {
            try {
                console.log('Trying to load includes.data.js from:', path);
                await loadScript(path);
                console.log('Successfully loaded includes.data.js from:', path);
                return true;
            } catch (e) {
                console.warn('Failed to load from:', path, e);
            }
        }
        return false;
    }

    // Function to get all possible asset paths
    function getPossibleAssetPaths() {
        const currentPath = window.location.pathname;
        const isGitHubPages = window.location.hostname.includes('github.io');

        // Generate multiple possible paths
        const paths = [];

        // For GitHub Pages root
        if (isGitHubPages) {
            const pathSegments = currentPath.split('/').filter(s => s);
            if (pathSegments.length > 0) {
                const repoName = pathSegments[0];
                paths.push(`/${repoName}/assets/js/includes.data.js`);
            }
        }

        // Standard relative paths
        paths.push('assets/js/includes.data.js');        // Root level
        paths.push('./assets/js/includes.data.js');      // Explicit current directory
        paths.push('../assets/js/includes.data.js');     // One level up
        paths.push('../../assets/js/includes.data.js');  // Two levels up

        // Absolute paths for GitHub Pages
        if (isGitHubPages && currentPath.includes('/')) {
            const segments = currentPath.split('/').filter(s => s);
            if (segments.length > 1) {
                paths.push(`/${segments[0]}/assets/js/includes.data.js`);
            }
        }

        return paths;
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

        console.log('🔄 Loading includes for language:', lang);
        console.log('Current path:', path);

        try {
            // Always try to load includes.data.js first (most reliable for GitHub Pages)
            if (!window.__INCLUDES) {
                const possiblePaths = getPossibleAssetPaths();
                console.log('Possible asset paths:', possiblePaths);

                const loaded = await tryLoadScriptFromPaths(possiblePaths);

                if (!loaded) {
                    console.error('❌ Failed to load includes.data.js from any path');
                    console.error('Tried paths:', possiblePaths);
                    return;
                }
            }

            // Verify that __INCLUDES is now available
            if (!window.__INCLUDES) {
                console.error('❌ __INCLUDES still not available after script load');
                return;
            }

            console.log('✅ __INCLUDES loaded successfully');
            console.log('Available include keys:', Object.keys(window.__INCLUDES));

            const headerHTML = window.__INCLUDES[`header-${lang}`] || '';
            const footerHTML = window.__INCLUDES[`footer-${lang}`] || '';

            console.log('Header HTML length:', headerHTML.length);
            console.log('Footer HTML length:', footerHTML.length);

            const headerPlaceholder = document.getElementById('header-placeholder');
            const footerPlaceholder = document.getElementById('footer-placeholder');

            if (headerPlaceholder && headerHTML) {
                headerPlaceholder.innerHTML = headerHTML;
                console.log('✅ Header inserted successfully');
            } else {
                console.error('❌ Header not inserted. Placeholder:', !!headerPlaceholder, 'HTML:', !!headerHTML);
            }

            if (footerPlaceholder && footerHTML) {
                footerPlaceholder.innerHTML = footerHTML;
                console.log('✅ Footer inserted successfully');
            } else {
                console.error('❌ Footer not inserted. Placeholder:', !!footerPlaceholder, 'HTML:', !!footerHTML);
            }

            // Fix paths after insertion
            const isInSubdirectory = path.includes('/en/') ||
                           path.includes('/fr/') ||
                           path.includes('/news/') ||
                           path.includes('/blog/') ||
                           path.includes('/shops/') ||
                           path.includes('/project/');

            if (isInSubdirectory) {
                fixPathsForSubdirectory();
                console.log('🔧 Applied subdirectory path fixes');
            }

            fixPathsForRootPages();
            console.log('🔧 Applied root page path fixes');

            // Re-initialize scripts that depend on header/footer elements
            if (window.initHeaderFooterScripts) {
                window.initHeaderFooterScripts();
            }

        } catch (error) {
            console.error('❌ Error loading includes:', error);
        }
    }

    // Debug function to check if files are loading
    function debugLoadStatus() {
        const isGitHubPages = window.location.hostname.includes('github.io');

        console.log('🔍 Final Debug Status:');
        console.log('Full URL:', window.location.href);
        console.log('Is GitHub Pages:', isGitHubPages);
        console.log('__INCLUDES loaded:', !!window.__INCLUDES);
        console.log('Available includes:', window.__INCLUDES ? Object.keys(window.__INCLUDES) : 'none');
        console.log('Header placeholder exists:', !!document.getElementById('header-placeholder'));
        console.log('Footer placeholder exists:', !!document.getElementById('footer-placeholder'));

        // Check if header/footer content was actually loaded
        const headerContent = document.getElementById('header-placeholder')?.innerHTML;
        const footerContent = document.getElementById('footer-placeholder')?.innerHTML;
        console.log('Header content loaded:', headerContent ? headerContent.length + ' chars' : 'none');
        console.log('Footer content loaded:', footerContent ? footerContent.length + ' chars' : 'none');

        // Final status
        const success = !!(window.__INCLUDES && headerContent && footerContent);
        console.log(success ? '✅ Includes loaded successfully!' : '❌ Includes failed to load');
    }

    // Load includes when DOM is ready with proper timing
    function initializeIncludes() {
        console.log('🚀 Initializing includes...');
        console.log('Document ready state:', document.readyState);

        // Add a small delay to ensure DOM is fully ready
        setTimeout(async () => {
            await loadIncludes();
            // Wait a bit more before debugging to see final state
            setTimeout(debugLoadStatus, 100);
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIncludes);
    } else {
        initializeIncludes();
    }
})();
