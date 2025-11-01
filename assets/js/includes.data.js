// Pre-bundled include HTML for offline (file://) usage
// This file is auto-loaded by includes.js when running under file protocol.
(function(){
  'use strict';
  if (!window.__INCLUDES) window.__INCLUDES = {};
  window.__INCLUDES['header-ja'] = `<!-- Header -->
<header class="header" id="header">
    <div class="container">
        <div class="header-container">
            <div class="logo">
                <a href="/" id="logo-link">
                    <img src="/assets/images/logo.png" alt="長期熟成酒研究会 - Reserve Sake Association" class="logo-image"
                        id="logo-image">
                    <span class="logo-text">長期熟成酒研究会</span>
                </a>
            </div>

            <!-- Language Switcher -->
            <div class="language-switcher">
                <button class="language-toggle" id="languageToggle" aria-label="言語選択">
                    <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                        </path>
                    </svg>
                    <span class="language-text">LANGUAGE</span>
                    <svg class="language-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="language-dropdown" id="languageDropdown">
                    <button class="language-option active" data-lang="ja">日本語</button>
                    <button class="language-option" data-lang="en">English</button>
                    <button class="language-option" data-lang="fr">Français</button>
                </div>
            </div>

            <!-- Hamburger Menu Button -->
            <button class="hamburger" id="hamburger" aria-label="メニュー">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu" id="navMenu">
            <div class="nav-overlay" id="navOverlay"></div>
            <div class="nav-content">
                <ul class="nav-list">
                    <li><a href="#about-sake" class="nav-link">熟成古酒とは</a>
                        <ul class="sub-menu">
                            <li><a href="#sake-definition">熟成古酒の定義</a></li>
                            <li><a href="#sake-types">熟成古酒のタイプ</a></li>
                            <li><a href="#sake-history">熟成古酒の歴史</a></li>
                        </ul>
                    </li>
                    <li><a href="#about-society" class="nav-link">研究会について</a>
                        <ul class="sub-menu">
                            <li><a href="#society-history">あゆみ</a></li>
                            <li><a href="#society-members">会員</a></li>
                        </ul>
                    </li>
                    <li><a href="../news/index.html" class="nav-link">お知らせ</a></li>
                    <li><a href="../shops/index.html" class="nav-link">飲食店・販売店</a></li>
                    <li><a href="../blog/index.html" class="nav-link">古酒を愉しむ</a></li>
                    <li><a href="#100year-project" class="nav-link">百年貯蔵プロジェクト</a></li>
                    <li><a href="#contact" class="nav-link">お問い合わせ</a></li>
                    <li><a href="../privacy.html" class="nav-link">プライバシーポリシー</a></li>
                </ul>

                <!-- SNS Links in Menu -->
                <div class="nav-sns">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    </div>
</header>`;

  window.__INCLUDES['footer-ja'] = `<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-main">
                <div class="footer-logo">
                    <h3>長期熟成酒研究会</h3>
                    <p>Reserve Sake Association</p>
                </div>
                <p class="footer-description">
                    時を重ねた日本酒の魅力を探求し、<br>
                    新しい酒文化を創造します。
                </p>
            </div>

            <nav class="footer-nav">
                <div class="footer-nav-column">
                    <h4>熟成古酒について</h4>
                    <ul>
                        <li><a href="#sake-definition">熟成古酒の定義</a></li>
                        <li><a href="#sake-types">熟成古酒のタイプ</a></li>
                        <li><a href="#sake-history">熟成古酒の歴史</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>研究会</h4>
                    <ul>
                        <li><a href="#society-history">あゆみ</a></li>
                        <li><a href="#society-members">会員について</a></li>
                        <li><a href="#news">お知らせ</a></li>
                        <li><a href="#100year-project">百年貯蔵プロジェクト</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>その他</h4>
                    <ul>
                        <li><a href="#shops">飲食店・販売店</a></li>
                        <li><a href="#blog">古酒を愉しむ</a></li>
                        <li><a href="#contact">お問い合わせ</a></li>
                        <li><a href="privacy.html">プライバシーポリシー</a></li>
                    </ul>
                </div>
            </nav>
        </div>

        <div class="footer-bottom">
            <p class="copyright">&copy; 2025 Reserve Sake Association. All Rights Reserved.</p>
        </div>
    </div>
</footer>

<!-- Scroll to Top Button -->
<button class="scroll-top" id="scrollTop" aria-label="ページトップへ">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
</button>`;

  window.__INCLUDES['header-en'] = `<!-- Header -->
<header class="header" id="header">
    <div class="container">
        <div class="header-container">
            <div class="logo">
                <a href="/en/" id="logo-link">
                    <img src="/assets/images/logo.png" alt="Reserve Sake Association - 長期熟成酒研究会" class="logo-image"
                        id="logo-image">
                    <span class="logo-text">長期熟成酒研究会</span>
                </a>
            </div>

            <!-- Language Switcher -->
            <div class="language-switcher">
                <button class="language-toggle" id="languageToggle" aria-label="Language Selection">
                    <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                        </path>
                    </svg>
                    <span class="language-text">LANGUAGE</span>
                    <svg class="language-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="language-dropdown" id="languageDropdown">
                    <button class="language-option" data-lang="ja">日本語</button>
                    <button class="language-option active" data-lang="en">English</button>
                    <button class="language-option" data-lang="fr">Français</button>
                </div>
            </div>

            <!-- Hamburger Menu Button -->
            <button class="hamburger" id="hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu" id="navMenu">
            <div class="nav-overlay" id="navOverlay"></div>
            <div class="nav-content">
                <ul class="nav-list">
                    <li><a href="#about-sake" class="nav-link">About Aged Sake</a>
                        <ul class="sub-menu">
                            <li><a href="#sake-definition">Definition</a></li>
                            <li><a href="#sake-types">Types</a></li>
                            <li><a href="#sake-history">History</a></li>
                        </ul>
                    </li>
                    <li><a href="#about-society" class="nav-link">About Us</a>
                        <ul class="sub-menu">
                            <li><a href="#society-history">Our Journey</a></li>
                            <li><a href="#society-members">Members</a></li>
                        </ul>
                    </li>
                    <li><a href="../news/index.html" class="nav-link">News</a></li>
                    <li><a href="../shops/index.html" class="nav-link">Where to Find</a></li>
                    <li><a href="../blog/index.html" class="nav-link">Articles</a></li>
                    <li><a href="#100year-project" class="nav-link">100-Year Project</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                    <li><a href="../privacy.html" class="nav-link">Privacy Policy</a></li>
                </ul>

                <!-- SNS Links in Menu -->
                <div class="nav-sns">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    </div>
</header>`;

  window.__INCLUDES['footer-en'] = `<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-main">
                <div class="footer-logo">
                    <h3>Reserve Sake Association</h3>
                    <p>長期熟成酒研究会</p>
                </div>
                <p class="footer-description">
                    Exploring the charm of aged sake<br>
                    and creating a new sake culture.
                </p>
            </div>

            <nav class="footer-nav">
                <div class="footer-nav-column">
                    <h4>About Aged Sake</h4>
                    <ul>
                        <li><a href="#sake-definition">Definition</a></li>
                        <li><a href="#sake-types">Types</a></li>
                        <li><a href="#sake-history">History</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>Society</h4>
                    <ul>
                        <li><a href="#society-history">Our Journey</a></li>
                        <li><a href="#society-members">Members</a></li>
                        <li><a href="#news">News</a></li>
                        <li><a href="#100year-project">100-Year Project</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>More</h4>
                    <ul>
                        <li><a href="#shops">Where to Find</a></li>
                        <li><a href="#blog">Articles</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
            </nav>
        </div>

        <div class="footer-bottom">
            <p class="copyright">&copy; 2025 Reserve Sake Association. All Rights Reserved.</p>
        </div>
    </div>
</footer>

<!-- Scroll to Top Button -->
<button class="scroll-top" id="scrollTop" aria-label="Back to Top">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
</button>`;

  window.__INCLUDES['header-fr'] = `<!-- Header -->
<header class="header" id="header">
    <div class="container">
        <div class="header-container">
            <div class="logo">
                <a href="/fr/" id="logo-link">
                    <img src="/assets/images/logo.png" alt="L’Association du Saké maturé - 長期熟成酒研究会" class="logo-image"
                        id="logo-image">
                    <span class="logo-text">長期熟成酒研究会</span>
                </a>
            </div>

            <!-- Language Switcher -->
            <div class="language-switcher">
                <button class="language-toggle" id="languageToggle" aria-label="Sélection de Langue">
                    <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                        </path>
                    </svg>
                    <span class="language-text">LANGUAGE</span>
                    <svg class="language-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="language-dropdown" id="languageDropdown">
                    <button class="language-option" data-lang="ja">日本語</button>
                    <button class="language-option" data-lang="en">English</button>
                    <button class="language-option active" data-lang="fr">Français</button>
                </div>
            </div>

            <!-- Hamburger Menu Button -->
            <button class="hamburger" id="hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu" id="navMenu">
            <div class="nav-overlay" id="navOverlay"></div>
            <div class="nav-content">
                <ul class="nav-list">
                    <li><a href="#about-sake" class="nav-link">À propos du Saké maturé</a>
                        <ul class="sub-menu">
                            <li><a href="#sake-definition">Définition</a></li>
                            <li><a href="#sake-types">Types</a></li>
                            <li><a href="#sake-history">Histoire</a></li>
                        </ul>
                    </li>
                    <li><a href="#about-society" class="nav-link">À propos de nous</a>
                        <ul class="sub-menu">
                            <li><a href="#society-history">Notre Parcours</a></li>
                            <li><a href="#society-members">Membres</a></li>
                        </ul>
                    </li>
                    <li><a href="../news/index.html" class="nav-link">Actualités</a></li>
                    <li><a href="../shops/index.html" class="nav-link">Où Trouver</a></li>
                    <li><a href="../blog/index.html" class="nav-link">Articles</a></li>
                    <li><a href="#100year-project" class="nav-link">Projet 100 Ans</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                    <li><a href="../privacy.html" class="nav-link">Politique de Confidentialité</a></li>
                </ul>

                <!-- SNS Links in Menu -->
                <div class="nav-sns">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    </div>
</header>`;

  window.__INCLUDES['footer-fr'] = `<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-main">
                <div class="footer-logo">
                    <h3>L’Association du Saké maturé</h3>
                    <p>長期熟成酒研究会</p>
                </div>
                <p class="footer-description">
                    Explorer le charme du saké maturé<br>
                    et créer une nouvelle culture du saké.
                </p>
            </div>

            <nav class="footer-nav">
                <div class="footer-nav-column">
                    <h4>À propos du Saké maturé</h4>
                    <ul>
                        <li><a href="#sake-definition">Définition</a></li>
                        <li><a href="#sake-types">Types</a></li>
                        <li><a href="#sake-history">Histoire</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>Société</h4>
                    <ul>
                        <li><a href="#society-history">Notre Parcours</a></li>
                        <li><a href="#society-members">Membres</a></li>
                        <li><a href="#news">Actualités</a></li>
                        <li><a href="#100year-project">Projet 100 Ans</a></li>
                    </ul>
                </div>

                <div class="footer-nav-column">
                    <h4>Plus</h4>
                    <ul>
                        <li><a href="#shops">Où Trouver</a></li>
                        <li><a href="#blog">Articles</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="privacy.html">Politique de Confidentialité</a></li>
                    </ul>
                </div>
            </nav>
        </div>

        <div class="footer-bottom">
            <p class="copyright">&copy; 2025 L’Association du Saké maturé. Tous Droits Réservés.</p>
        </div>
    </div>
</footer>

<!-- Scroll to Top Button -->
<button class="scroll-top" id="scrollTop" aria-label="Retour en Haut">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
</button>`;
})();
