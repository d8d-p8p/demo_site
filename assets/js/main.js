/**
 * 長期熟成酒研究会 - メインJavaScript
 * ハンバーガーメニュー、スライダー、スムーススクロール、言語切り替え機能
 */

// ============================================
// 初期化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initAll();
});

// グローバル関数として公開（includes.jsから呼び出せるように）
window.initHeaderFooterScripts = function() {
    initHamburgerMenu();
    initHeaderScroll();
    initLanguageSwitcher();
    // Footer挿入後にスクロールトップボタンのイベントを再度紐付け
    initScrollTop();
};

function initAll() {
    // Viewport unit safety: set --app-height and bind listeners
    initViewportSizing();
    initHamburgerMenu();

    // Only initialize sliders if Swiper is available and elements exist
    if (typeof Swiper !== 'undefined') {
        initHeroSlider();
        initSakeSlider();
        initBlogSlider();
        initShopsSlider();
        initShopGallery();
    } else {
        console.log('ℹ️ Swiper not loaded - slider initialization skipped');
    }

    initSmoothScroll();
    initScrollTop();
    initHeaderScroll();
    initLanguageSwitcher();
    initContactForm();
    initAOS();
    initFilterModal();
    initShopsFilter();
    initShopMapLazy();
}

// ============================================
// Viewport sizing fixes (mobile 100vh/100vw issues)
// ============================================
function initViewportSizing() {
    const setAppHeight = () => {
        // Use innerHeight to avoid URL bar issues
        const h = window.innerHeight;
        document.documentElement.style.setProperty('--app-height', h + 'px');
    };

    // Debounced refresher for layout + libraries
    let rafId = null;
    const refreshLayout = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            setAppHeight();
            // Update all Swiper instances if available
            try {
                if (typeof Swiper !== 'undefined') {
                    document.querySelectorAll('.swiper').forEach(el => {
                        if (el && el.swiper && typeof el.swiper.update === 'function') {
                            el.swiper.update();
                        }
                    });
                }
            } catch (e) { /* no-op */ }

            // Refresh AOS animations if loaded
            try {
                if (typeof AOS !== 'undefined' && AOS.refresh) {
                    // refreshHard is heavier; prefer refresh
                    AOS.refresh();
                }
            } catch (e) { /* no-op */ }
        });
    };

    // Initial set
    setAppHeight();

    // Listen to orientation changes and resizes
    window.addEventListener('orientationchange', () => {
        // Some browsers need a tiny delay after orientation change
        setTimeout(refreshLayout, 60);
    });
    window.addEventListener('resize', refreshLayout);
}

// ============================================
// ハンバーガーメニュー
// ============================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link, .sub-menu a');

    if (!hamburger || !navMenu) return;

    // 現在のハッシュに応じてアクティブリンクを更新
    function updateActiveNavLinkByHash(hash) {
        const links = document.querySelectorAll('.nav-link, .sub-menu a');
        links.forEach(l => l.classList.remove('is-active'));
        if (!hash) return;
        const selector = `.nav-link[href$="${hash}"], .sub-menu a[href$="${hash}"]`;
        const target = document.querySelector(selector);
        if (target) target.classList.add('is-active');
    }

    // メニューの開閉
    let scrollY = 0;
    let restoreOnClose = true;
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        if (navOverlay) {
            navOverlay.classList.toggle('active');
        }
        // Robust background scroll lock
        if (isActive) {
            scrollY = window.scrollY || window.pageYOffset;
            document.documentElement.classList.add('menu-open');
            document.body.classList.add('menu-open');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        } else {
            document.documentElement.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
            const top = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            if (restoreOnClose) {
                const y = top ? -parseInt(top, 10) : 0;
                // Force instant scroll restore regardless of global CSS `scroll-behavior: smooth`
                const htmlEl = document.documentElement;
                const prevBehavior = htmlEl.style.scrollBehavior;
                htmlEl.style.scrollBehavior = 'auto';
                try {
                    window.scrollTo({ top: y, behavior: 'auto' });
                } catch (err) {
                    // Fallback for older browsers
                    window.scrollTo(0, y);
                }
                // Restore previous inline setting on next tick
                setTimeout(() => {
                    htmlEl.style.scrollBehavior = prevBehavior || '';
                }, 0);
            }
            // reset flag for next open/close cycle
            restoreOnClose = true;
        }
    }

    // ハンバーガーボタンクリック
    hamburger.addEventListener('click', toggleMenu);

    // オーバーレイクリックで閉じる
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // ナビゲーションリンククリックで閉じる（メニュー内のアンカーは閉じてからスクロール）
    function scrollToHash(hash) {
        if (!hash) return;
        const id = hash.replace(/^#/, '');
        const target = document.getElementById(id);
        if (target) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else if (hash === '#' || hash === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle clicks if the overlay menu is currently open
            if (!navMenu.classList.contains('active')) return;

            const href = link.getAttribute('href') || '';
            const hashIndex = href.indexOf('#');
            const isHash = hashIndex !== -1;

            if (isHash) {
                // Prevent other handlers (smooth scroll) from running now
                e.preventDefault();
                e.stopImmediatePropagation();
                const hash = href.substring(hashIndex);
                // Don't restore previous scroll when closing for anchor navigation
                restoreOnClose = false;
                // Close menu first
                toggleMenu();
                // After overlay hides, perform smooth scroll to target
                setTimeout(() => {
                    scrollToHash(hash);
                    updateActiveNavLinkByHash(hash);
                }, 450);
            } else {
                // Non-anchor links: close menu and allow navigation (no restoration)
                restoreOnClose = false;
                toggleMenu();
                // Let default navigation proceed (do not preventDefault)
            }
        });
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // 初期表示とハッシュ変更時にアクティブ状態を更新
    updateActiveNavLinkByHash(window.location.hash);
    window.addEventListener('hashchange', () => updateActiveNavLinkByHash(window.location.hash));
}

// ============================================
// ヒーロースライダー (Swiper.js)
// ============================================
function initHeroSlider() {
    if (typeof Swiper === 'undefined') {
        console.log('ℹ️ Swiper not available for hero slider');
        return;
    }

    const heroSliderElement = document.querySelector('.hero-slider');
    if (!heroSliderElement) {
        console.log('ℹ️ Hero slider element not found');
        return;
    }

    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        speed: 1500,
        effect: 'fade',
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        fadeEffect: {
            crossFade: true
        },
    });
}

// ============================================
// 熟成古酒スライダー (About Aged Sake Section)
// ============================================
function initSakeSlider() {
    if (typeof Swiper === 'undefined') {
        console.log('ℹ️ Swiper not available for sake slider');
        return;
    }

    const sakeSlider = document.querySelector('.sake-slider');
    if (!sakeSlider) return;

    // 総スライド数を取得
    const totalSlides = sakeSlider.querySelectorAll('.swiper-slide').length;

    // perPage設定（各ブレークポイントでの表示数）
    const perPageConfig = {
        mobile: 1,    // SP
        tablet: 2,    // Tablet
        desktop: 4    // PC
    };

    // 現在の画面幅を取得してperPageを決定
    function getCurrentPerPage() {
        const width = window.innerWidth;
        if (width >= 1024) return perPageConfig.desktop;
        if (width >= 768) return perPageConfig.tablet;
        return perPageConfig.mobile;
    }

    // スライダーが必要かどうかを判定
    function shouldEnableSlider() {
        return totalSlides > getCurrentPerPage();
    }

    // スライダーの有効/無効を切り替え
    function toggleSlider() {
        const sakeContainer = document.querySelector('.sake-slider-container');
        if (!sakeContainer) return;

        if (shouldEnableSlider()) {
            // スライダーを有効化
            sakeContainer.classList.add('slider-enabled');
            sakeContainer.classList.remove('slider-disabled');
        } else {
            // スライダーを無効化（全て表示）
            sakeContainer.classList.add('slider-disabled');
            sakeContainer.classList.remove('slider-enabled');
        }
    }

    // 初期化
    const swiperInstance = new Swiper('.sake-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        speed: 600,
        navigation: {
            nextEl: '.sake-button-next',
            prevEl: '.sake-button-prev',
        },
        pagination: {
            el: '.sake-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            }
        },
        on: {
            init: function() {
                toggleSlider();
            },
            resize: function() {
                toggleSlider();
            }
        }
    });

    // リサイズイベントでも判定
    window.addEventListener('resize', toggleSlider);
}

// ============================================
// ブログスライダー (Articles Section)
// ============================================
function initBlogSlider() {
    if (typeof Swiper === 'undefined') {
        console.log('ℹ️ Swiper not available for blog slider');
        return;
    }

    const blogSlider = document.querySelector('.blog-slider');
    if (!blogSlider) return;

    // 総スライド数を取得
    const totalSlides = blogSlider.querySelectorAll('.swiper-slide').length;

    // perPage設定（各ブレークポイントでの表示数）
    const perPageConfig = {
        mobile: 1,    // SP
        tablet: 2,    // Tablet
        desktop: 4    // PC
    };

    // 現在の画面幅を取得してperPageを決定
    function getCurrentPerPage() {
        const width = window.innerWidth;
        if (width >= 1024) return perPageConfig.desktop;
        if (width >= 768) return perPageConfig.tablet;
        return perPageConfig.mobile;
    }

    // スライダーが必要かどうかを判定
    function shouldEnableSlider() {
        return totalSlides > getCurrentPerPage();
    }

    // スライダーの有効/無効を切り替え
    function toggleSlider() {
        const blogContainer = document.querySelector('.blog-slider-container');
        if (!blogContainer) return;

        if (shouldEnableSlider()) {
            // スライダーを有効化
            blogContainer.classList.add('slider-enabled');
            blogContainer.classList.remove('slider-disabled');
        } else {
            // スライダーを無効化（全て表示）
            blogContainer.classList.add('slider-disabled');
            blogContainer.classList.remove('slider-enabled');
        }
    }

    // 初期化
    const swiperInstance = new Swiper('.blog-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        speed: 600,
        navigation: {
            nextEl: '.blog-button-next',
            prevEl: '.blog-button-prev',
        },
        pagination: {
            el: '.blog-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            }
        },
        on: {
            init: function() {
                toggleSlider();
            },
            resize: function() {
                toggleSlider();
            }
        }
    });

    // リサイズイベントでも判定
    window.addEventListener('resize', toggleSlider);
}

// ============================================
// 店舗スライダー (Swiper.js)
// ============================================
function initShopsSlider() {
    if (typeof Swiper === 'undefined') {
        console.log('ℹ️ Swiper not available for shops slider');
        return;
    }

    const shopsSliderElement = document.querySelector('.shops-slider');
    if (!shopsSliderElement) {
        console.log('ℹ️ Shops slider element not found');
        return;
    }

    const shopsSlider = new Swiper('.shops-slider', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        initialSlide: 0,
        loop: false,
        speed: 800,
        navigation: {
            nextEl: '.shops-button-next',
            prevEl: '.shops-button-prev',
        },
        pagination: {
            el: '.shops-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
                centeredSlides: true,
            },
            640: {
                slidesPerView: 1.5,
                spaceBetween: 25,
                centeredSlides: true,
            },
            1024: {
                slidesPerView: 2.5,
                spaceBetween: 30,
                centeredSlides: true,
            },
            1280: {
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: true,
            }
        },
        on: {
            init: function() {
                updateSlideScale(this);
            },
            slideChange: function() {
                updateSlideScale(this);
            },
            resize: function() {
                updateSlideScale(this);
            }
        }
    });

    // スライドのスケール調整
    function updateSlideScale(swiper) {
        swiper.slides.forEach((slide, index) => {
            if (index === swiper.activeIndex) {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = '1';
                slide.style.zIndex = '10';
            } else {
                slide.style.transform = 'scale(0.85)';
                slide.style.opacity = '0.6';
                slide.style.zIndex = '1';
            }
        });
    }
}

// ============================================
// スムーススクロール
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // 空のハッシュや無効なリンクをスキップ
            if (href === '#' || href === '#!') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// スクロールトップボタン
// ============================================
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (!scrollTopBtn) return;

    // スクロール位置に応じて表示/非表示
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // クリックでトップへ
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// ヘッダースクロール効果
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('header');

    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// 言語切り替え機能
// ============================================
function initLanguageSwitcher() {
    const toggle = document.getElementById('languageToggle');
    const dropdown = document.getElementById('languageDropdown');
    const langOptions = document.querySelectorAll('.language-option');
    const currentLang = getCurrentLanguage();

    if (!toggle || !dropdown) return;

    // 現在の言語オプションをアクティブに
    langOptions.forEach(option => {
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        }
    });

    // トグルボタンのクリックイベント
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggle.classList.toggle('active');
        dropdown.classList.toggle('active');
    });

    // 言語オプションのクリックイベント
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetLang = this.dataset.lang;
            switchLanguage(targetLang);
        });
    });

    // ドロップダウン外をクリックしたら閉じる
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            toggle.classList.remove('active');
            dropdown.classList.remove('active');
        }
    });

    // Escキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            toggle.classList.remove('active');
            dropdown.classList.remove('active');
        }
    });
}

/**
 * 現在の言語を取得
 */
function getCurrentLanguage() {
    const path = window.location.pathname;

    if (path.includes('/en/')) {
        return 'en';
    } else if (path.includes('/fr/')) {
        return 'fr';
    }
    return 'ja';
}

/**
 * 言語切り替え
 */
function switchLanguage(lang) {
    const currentLang = getCurrentLanguage();

    if (currentLang === lang) return;

    const isFile = window.location.protocol === 'file:';
    if (isFile) {
        // Local file mode: avoid absolute paths like "/en/" which resolve to file:///en/
        const p = window.location.pathname;
        const inLangDir = /\/(en|fr)\//.test(p);
        const inSubdir = /\/(blog|news|shops|project|dev|restaurants|retailers)\//.test(p) || inLangDir;
        const up = inSubdir ? '../' : '';

        // Preserve hash if current page has one
        const hash = window.location.hash || '';

        if (lang === 'ja') {
            // Japanese lives at project root
            window.location.href = `${up}${hash}`;
        } else {
            // en/fr live under their own folder
            window.location.href = `${up}${lang}/${hash}`;
        }
        return;
    }

    // HTTP/HTTPS mode: handle GitHub Pages and regular hosting
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const hadTrailingSlash = pathname.endsWith('/');
    const segments = pathname.split('/').filter(Boolean);
    const supportedLangs = ['en', 'fr'];

    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    let repoName = '';
    let pathAfterRepo = segments.slice();

    if (isGitHubPages && segments.length > 0) {
        // First segment is usually the repository name
        repoName = segments[0];
        pathAfterRepo = segments.slice(1);
    }

    let newPathname = '';

    // Check if current path has language segment (after repo name if on GitHub Pages)
    const currentLangSegment = pathAfterRepo.length > 0 && supportedLangs.includes(pathAfterRepo[0]) ? pathAfterRepo[0] : null;

    if (currentLangSegment) {
        // Currently in a language directory
        if (lang === 'ja') {
            // Switch to Japanese (remove language segment)
            const remainingPath = pathAfterRepo.slice(1);
            if (isGitHubPages) {
                newPathname = `/${repoName}` + (remainingPath.length > 0 ? `/${remainingPath.join('/')}` : '') + '/';
            } else {
                newPathname = '/' + (remainingPath.length > 0 ? remainingPath.join('/') : '') + (remainingPath.length > 0 ? '/' : '');
                if (newPathname === '//') newPathname = '/';
            }
        } else {
            // Switch to different language
            pathAfterRepo[0] = lang;
            if (isGitHubPages) {
                newPathname = `/${repoName}/${pathAfterRepo.join('/')}/`;
            } else {
                newPathname = `/${pathAfterRepo.join('/')}/`;
            }
        }
    } else {
        // Currently in Japanese (no language segment)
        if (lang === 'ja') {
            // Stay in Japanese
            newPathname = pathname;
        } else {
            // Switch to other language
            if (isGitHubPages) {
                const remainingPath = pathAfterRepo.length > 0 ? `/${pathAfterRepo.join('/')}` : '';
                newPathname = `/${repoName}/${lang}${remainingPath}/`;
            } else {
                newPathname = `/${lang}${pathname === '/' ? '/' : pathname}`;
                if (!newPathname.endsWith('/')) newPathname += '/';
            }
        }
    }

    // Clean up double slashes
    newPathname = newPathname.replace(/\/+/g, '/');

    // Ensure we never end up with '/en/index.html' style paths in HTTP mode
    newPathname = newPathname.replace(/\/index\.html\/?$/, '/');
    // Also clean any '/lang/index.html' occurring mid-build (defensive)
    newPathname = newPathname.replace(/\/(en|fr)\/index\.html(\/)?/g, '/$1/');
    // Ensure trailing slash for directories
    if (!newPathname.endsWith('/') && !newPathname.match(/\.[a-zA-Z0-9]+$/)) {
        newPathname += '/';
    }

    console.log('Language switch debug:');
    console.log('Is GitHub Pages:', isGitHubPages);
    console.log('Repository name:', repoName);
    console.log('Current path:', pathname);
    console.log('Path after repo:', pathAfterRepo);
    console.log('Current lang segment:', currentLangSegment);
    console.log('Target lang:', lang);
    console.log('New pathname:', newPathname);

    const newUrl = newPathname + url.search + url.hash;
    window.location.href = newUrl;
}

// ============================================
// お問い合わせフォーム
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームバリデーション
        if (!validateForm(form)) {
            return;
        }

        // ここでフォームデータを送信
        // 実際の実装では、microCMSやメール送信サービスのAPIを使用
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // 送信成功メッセージ
        showMessage('お問い合わせを送信しました。ありがとうございます。', 'success');

        // フォームリセット
        form.reset();
    });
}

/**
 * フォームバリデーション
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#d32f2f';
        } else {
            field.style.borderColor = '';
        }
    });

    // メールアドレスの形式チェック
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = '#d32f2f';
            showMessage('正しいメールアドレスを入力してください。', 'error');
        }
    }

    if (!isValid) {
        showMessage('必須項目を入力してください。', 'error');
    }

    return isValid;
}

/**
 * メッセージ表示
 */
function showMessage(message, type = 'info') {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // メッセージ要素作成
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        font-weight: 500;
        ${type === 'success' ? 'background-color: #e8f5e9; color: #2e7d32;' : ''}
        ${type === 'error' ? 'background-color: #ffebee; color: #c62828;' : ''}
        ${type === 'info' ? 'background-color: #e3f2fd; color: #1565c0;' : ''}
    `;

    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);

    // 5秒後に自動削除
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// AOSアニメーション初期化
// ============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0,
        });
        console.log('✅ AOS initialized');
    } else {
        console.log('ℹ️ AOS not loaded - animation initialization skipped');
    }
}

// ============================================
// 取扱店一覧フィルター（モーダル）
// ============================================
function initFilterModal() {
    const openBtn = document.getElementById('filterOpen');
    const modal = document.getElementById('filterModal');
    const closeBtn = document.getElementById('filterClose');
    if (!openBtn || !modal) return;

    const overlay = modal.querySelector('.filter-modal__overlay');
    const dialog = modal.querySelector('.filter-modal__dialog');
    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    function lockScroll() {
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
    }
    function unlockScroll() {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
    }

    function openModal() {
        lastFocused = document.activeElement;
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        lockScroll();
        // Focus first focusable
        setTimeout(() => {
            const first = dialog.querySelector(focusableSelectors);
            if (first) first.focus();
        }, 0);
    }

    function closeModal(restoreFocus = true) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('is-open');
        unlockScroll();
        if (restoreFocus && lastFocused) {
            lastFocused.focus();
        }
    }

    // Focus trap
    function handleKeydown(e) {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key === 'Tab') {
            const focusables = dialog.querySelectorAll(focusableSelectors);
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-close') === 'true') closeModal();
    });
    document.addEventListener('keydown', handleKeydown);

    // Auto-close after apply/reset to match popup UX
    const applyBtn = document.getElementById('filterApply');
    const resetBtn = document.getElementById('filterReset');
    if (applyBtn) applyBtn.addEventListener('click', () => closeModal());
    if (resetBtn) resetBtn.addEventListener('click', () => closeModal());
}

// ============================================
// 取扱店一覧フィルター
// ============================================
function initShopsFilter() {
    const container = document.querySelector('.content-grid');
    const bar = document.querySelector('.filter-bar');
    if (!container || !bar) return;

    const cards = Array.from(container.querySelectorAll('.shop-card'));
    const searchInput = document.getElementById('filterSearch');
    const typeSelect = document.getElementById('filterType');
    const areaSelect = document.getElementById('filterArea');
    const sortSelect = document.getElementById('filterSort');
    const resetBtn = document.getElementById('filterReset');
    const noResults = document.getElementById('noResults');
    const header = document.querySelector('.filter-header');

    // Inject results count badge in header
    let resultsBadge = null;
    if (header) {
        resultsBadge = document.createElement('span');
        resultsBadge.className = 'results-count';
        header.appendChild(resultsBadge);
    }

    // Inject active filter chips container below header
    let chipsWrap = document.querySelector('.active-filters');
    if (!chipsWrap) {
        chipsWrap = document.createElement('div');
        chipsWrap.className = 'active-filters';
        header?.insertAdjacentElement('afterend', chipsWrap);
    }

    // Filter button (no results count badge per latest request)
    const filterBtn = document.getElementById('filterOpen');

    function getText(el, selector) {
        const n = el.querySelector(selector);
        return n ? (n.textContent || '').trim() : '';
    }

    function applyFilters() {
        const q = (searchInput?.value || '').toLowerCase();
        const type = typeSelect?.value || '';
        const area = areaSelect?.value || '';

        let visibleCount = 0;
        cards.forEach(card => {
            const cardType = card.dataset.type || '';
            const cardArea = card.dataset.area || '';
            const name = getText(card, '.shop-name').toLowerCase();
            const desc = getText(card, '.shop-description').toLowerCase();

            const matchesQuery = !q || name.includes(q) || desc.includes(q);
            const matchesType = !type || cardType === type;
            const matchesArea = !area || cardArea === area;

            const show = matchesQuery && matchesType && matchesArea;
            card.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Update results count and active filter chips
        updateMetaUI(visibleCount);

        applySort();
    }

    function applySort() {
        const mode = sortSelect?.value || 'default';
        const parent = container;
        const visibleCards = cards.filter(c => c.style.display !== 'none');

        // Restore original order when default is selected by using the initial DOM order index
        if (mode === 'default') {
            cards.forEach(c => parent.appendChild(c));
            return;
        }

        const collator = new Intl.Collator('ja');
        const byName = (a, b) => collator.compare(getText(a, '.shop-name'), getText(b, '.shop-name'));
        const byArea = (a, b) => collator.compare(a.dataset.area || '', b.dataset.area || '');

        if (mode === 'name-asc') visibleCards.sort(byName);
        if (mode === 'area-asc') visibleCards.sort(byArea);

        // Append in new order (only visible ones move to the end contiguously)
        visibleCards.forEach(c => parent.appendChild(c));
    }

    // Build custom span-based sort UI (replaces select)
    if (sortSelect && header) {
        // Hide native select and label block
        const sortControls = document.querySelector('.sort-controls');
        if (sortControls) sortControls.style.display = 'none';

        const custom = document.createElement('div');
        custom.className = 'sort-custom';

        const trigger = document.createElement('span');
        trigger.className = 'sort-trigger';
        const iconSvg = '<svg class="sort-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3 5h8v2H3V5zm0 6h12v2H3v-2zm0 6h16v2H3v-2z"/></svg>';
        const currentText = () => (sortSelect.options[sortSelect.selectedIndex]?.text || '').replace(/（.*?）/g, '');
        trigger.innerHTML = iconSvg + '<span class="sort-text">' + currentText() + '</span><span class="caret">▾</span>';

        const menu = document.createElement('div');
        menu.className = 'sort-menu';
        Array.from(sortSelect.options).forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                sortSelect.value = opt.value;
                sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
                trigger.querySelector('.sort-text').textContent = currentText();
                custom.classList.remove('open');
            });
            menu.appendChild(btn);
        });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            custom.classList.toggle('open');
        });
        document.addEventListener('click', () => custom.classList.remove('open'));

        custom.appendChild(trigger);
        custom.appendChild(menu);

        // Place custom sort after filter button within header
        const filterBtn = document.getElementById('filterOpen');
        if (filterBtn) {
            filterBtn.insertAdjacentElement('afterend', custom);
        } else {
            header.appendChild(custom);
        }
    }

    // Event wiring for apply button
    const applyBtn = document.getElementById('filterApply');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (typeSelect) typeSelect.value = '';
            if (areaSelect) areaSelect.value = '';
            if (sortSelect) sortSelect.value = 'default';
            applyFilters();
        });
    }

    // Sort change should react immediately
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            // Ensure filters are applied first, then sort visible subset
            applyFilters();
        });
    }

    // Live filter on change/input for intuitive UX
    const debounce = (fn, wait = 250) => {
        let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    };
    if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
    if (typeSelect) typeSelect.addEventListener('change', applyFilters);
    if (areaSelect) areaSelect.addEventListener('change', applyFilters);

    // Helpers for chips/meta
    const typeLabel = (v) => ({ dining: '飲食店', retail: '販売店' }[v] || v);
    function getActiveFilters() {
        const list = [];
        const q = (searchInput?.value || '').trim();
        const type = typeSelect?.value || '';
        const area = areaSelect?.value || '';
        if (q) list.push({ key: 'q', label: 'キーワード', value: q });
        if (type) list.push({ key: 'type', label: '種別', value: typeLabel(type), raw: type });
        if (area) list.push({ key: 'area', label: 'エリア', value: area });
        return list;
    }

    function renderChips() {
        if (!chipsWrap) return;
        const filters = getActiveFilters();
        chipsWrap.innerHTML = '';
        if (filters.length === 0) {
            chipsWrap.style.display = 'none';
            return;
        }
        chipsWrap.style.display = '';
        const frag = document.createDocumentFragment();
        filters.forEach(f => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'filter-chip';
            btn.setAttribute('data-key', f.key);
            btn.innerHTML = `<span class="chip-text">${f.label}: ${escapeHtml(f.value)}</span><span class="chip-remove" aria-hidden="true">×</span>`;
            btn.addEventListener('click', () => {
                if (f.key === 'q' && searchInput) searchInput.value = '';
                if (f.key === 'type' && typeSelect) typeSelect.value = '';
                if (f.key === 'area' && areaSelect) areaSelect.value = '';
                applyFilters();
            });
            frag.appendChild(btn);
        });
        // Clear all button
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'filters-clear';
        clearBtn.textContent = 'すべてクリア';
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (typeSelect) typeSelect.value = '';
            if (areaSelect) areaSelect.value = '';
            applyFilters();
        });
        chipsWrap.appendChild(frag);
        chipsWrap.appendChild(clearBtn);
    }

    function updateMetaUI(count) {
        // results count text
        if (resultsBadge) {
            resultsBadge.textContent = `${count}件`;
        }
        // no badge next to filter button (kept intentionally empty)
        renderChips();
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    // Initial run
    applyFilters();
}

// ============================================
// 画像遅延読み込み (オプション)
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// ウィンドウリサイズ対応
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // リサイズ時の処理
        const navMenu = document.getElementById('navMenu');
        if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.getElementById('hamburger').classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ============================================
// パフォーマンス最適化：スクロールイベントのスロットリング
// ============================================
function throttle(func, wait) {
    let timeout;
    let lastRan;

    return function executedFunction(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// ============================================
// デバッグ用：開発環境判定
// ============================================
const isDevelopment = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

if (isDevelopment) {
    console.log('🍶 長期熟成酒研究会 ウェブサイト - 開発モード');
    console.log('現在の言語:', getCurrentLanguage());
}

// ============================================
// ショップ詳細ページ：ギャラリー（条件付きSwiper）
// ============================================
function initShopGallery() {
    const galleryEl = document.querySelector('.shop-gallery');
    if (!galleryEl) return;

    // data-gallery="yes" の場合のみSwiper初期化
    if (galleryEl.getAttribute('data-gallery') !== 'yes') {
        return;
    }

    const swiper = new Swiper('.shopGallerySwiper', {
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.shops-button-next',
            prevEl: '.shops-button-prev',
        },
        slidesPerView: 1,
        autoplay: false,
        keyboard: {
            enabled: true,
        },
        a11y: {
            enabled: true,
            prevSlideMessage: '前の画像',
            nextSlideMessage: '次の画像',
            firstSlideMessage: '最初の画像です',
            lastSlideMessage: '最後の画像です',
            paginationBulletMessage: 'スライド {{index}}',
        },
    });
}

// ============================================
// ショップ詳細ページ：地図埋め込み（遅延読み込み）
// ============================================
function initShopMapLazy() {
    const mapEl = document.querySelector('.shop-map');
    if (!mapEl) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lat = mapEl.getAttribute('data-lat');
                const lng = mapEl.getAttribute('data-lng');
                const title = mapEl.getAttribute('data-title');

                if (lat && lng) {
                    const mapDiv = mapEl.querySelector('.map-placeholder');
                    // Google Maps埋め込み
                    const zoom = 15;
                    const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.${lat}0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s${title}!5e0!3m2!1sja!2sjp!4v1234567890`;

                    const iframe = document.createElement('iframe');
                    iframe.width = '100%';
                    iframe.height = '400';
                    iframe.style.borderRadius = 'var(--radius-md)';
                    iframe.style.border = '1px solid var(--color-border)';
                    iframe.setAttribute('loading', 'lazy');
                    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                    iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

                    mapDiv.replaceWith(iframe);
                }

                observer.unobserve(mapEl);
            }
        });
    }, { rootMargin: '100px' });

    observer.observe(mapEl);
}

// ============================================
// エクスポート（必要に応じて）
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentLanguage,
        switchLanguage,
        showMessage
    };
}
