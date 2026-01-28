/**
 * Apple-Inspired Experience Section Animations
 * Handles scroll-triggered animations for timeline entries and dots
 */

(function() {
	'use strict';

	// Wait for DOM to be ready
	function initAppleExperienceAnimations() {
		const timelineEntries = document.querySelectorAll('.apple-timeline-entry');
		
		if (timelineEntries.length === 0) {
			return;
		}

		// Intersection Observer for scroll-triggered animations
		const observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0.2 // Trigger when 20% of element is visible
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Add delay based on the data-index attribute for sequential animation
					const dataIndex = entry.target.getAttribute('data-index');
					const delay = dataIndex ? parseInt(dataIndex) * 150 : 0;
					
					setTimeout(() => {
						entry.target.classList.add('animate-in');
					}, delay);
					
					// Stop observing after animation is triggered
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// Observe all timeline entries
		timelineEntries.forEach((entry) => {
			observer.observe(entry);
		});

		// Add smooth hover glow effect for cards
		const experienceCards = document.querySelectorAll('.apple-experience-card');
		
		experienceCards.forEach((card) => {
			card.addEventListener('mousemove', (e) => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				
				// Create subtle spotlight effect following cursor
				card.style.setProperty('--mouse-x', `${x}px`);
				card.style.setProperty('--mouse-y', `${y}px`);
			});
		});

		// Add additional CSS for cursor-following glow
		if (!document.getElementById('apple-experience-glow-styles')) {
			const style = document.createElement('style');
			style.id = 'apple-experience-glow-styles';
			style.textContent = `
				.apple-experience-card {
					--mouse-x: 50%;
					--mouse-y: 50%;
					position: relative;
				}
				
				.apple-experience-card::after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					border-radius: 24px;
					background: radial-gradient(
						600px circle at var(--mouse-x) var(--mouse-y),
						rgba(42, 128, 144, 0.08),
						transparent 40%
					);
					opacity: 0;
					transition: opacity 0.3s ease;
					pointer-events: none;
					z-index: 1;
				}
				
				.apple-experience-card:hover::after {
					opacity: 1;
				}
				
				.apple-experience-card > * {
					position: relative;
					z-index: 2;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAppleExperienceAnimations);
	} else {
		initAppleExperienceAnimations();
	}

	// Re-initialize on page transitions (for single-page apps)
	window.addEventListener('load', initAppleExperienceAnimations);

})();
