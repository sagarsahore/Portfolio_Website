/**
 * Portfolio Filter - Apple-style Segmented Control
 * 
 * This script provides a smooth filtering experience for portfolio projects
 * using an Apple-style segmented control interface.
 * 
 * Features:
 * - Smooth transitions when switching categories
 * - Only one category active at a time
 * - Works with any number of categories defined via data-category attributes
 * - Fully responsive
 * 
 * Usage:
 * 1. Add data-category attribute to each project card
 * 2. Add filter buttons with data-category matching project categories
 * 3. Include this script in your HTML
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-pill');
        const projectCards = document.querySelectorAll('.project-card');

        // Early return if elements don't exist
        if (!filterButtons.length || !projectCards.length) {
            return;
        }

        /**
         * Filter projects based on selected category
         * @param {string} category - The category to filter by ('all' shows everything)
         */
        function filterProjects(category) {
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    // Show the card
                    card.classList.remove('hide');
                    // Trigger reflow for smooth animation
                    void card.offsetWidth;
                } else {
                    // Hide the card
                    card.classList.add('hide');
                }
            });
        }

        /**
         * Update active state of filter buttons
         * @param {HTMLElement} activeButton - The button that should be active
         */
        function updateActiveButton(activeButton) {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-pressed', 'true');
        }

        /**
         * Handle filter button click
         * @param {Event} e - The click event
         */
        function handleFilterClick(e) {
            const button = e.currentTarget;
            const category = button.getAttribute('data-category');
            
            // Update UI
            updateActiveButton(button);
            
            // Filter projects with a slight delay for better UX
            setTimeout(() => {
                filterProjects(category);
            }, 50);
        }

        // Attach click handlers to all filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
            
            // Add ARIA attributes for accessibility
            button.setAttribute('role', 'button');
            button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
        });

        // Set initial state - show all projects
        filterProjects('all');

        // Add keyboard navigation support
        const filterBar = document.querySelector('.portfolio-filter-bar');
        if (filterBar) {
            filterBar.addEventListener('keydown', (e) => {
                const buttons = Array.from(filterButtons);
                const currentIndex = buttons.findIndex(btn => btn === document.activeElement);
                
                if (currentIndex === -1) return;
                
                let newIndex = currentIndex;
                
                // Arrow key navigation
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    buttons[currentIndex].click();
                    return;
                }
                
                buttons[newIndex].focus();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioFilter);
    } else {
        initPortfolioFilter();
    }

    // Re-initialize if page changes (for SPAs or dynamic content)
    window.addEventListener('load', () => {
        // Small delay to ensure all elements are rendered
        setTimeout(initPortfolioFilter, 100);
    });

})();
