window.onload = () => {
    const typingElement = document.getElementById("typing");
    const roles = ["Salesforce Consultant", "AI Enthusiast", "Cloud Consultant"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // ⏱ Adjust these values to control speed and delays
    const typingSpeed = 150; // typing speed per character
    const deletingSpeed = 100; // deleting speed per character
    const waitAfterTyping = 2500; // pause after full word is typed
    const waitAfterDeleting = 1000; // pause after word is deleted

    function typeRole() {
        const currentRole = roles[roleIndex];
        let delay = isDeleting ? deletingSpeed : typingSpeed;

        // Typing logic
        if (isDeleting) {
            charIndex--;
            typingElement.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex++;
            typingElement.textContent = currentRole.substring(0, charIndex);
        }

        // When done typing
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            delay = waitAfterTyping;
        }

        // When done deleting
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = waitAfterDeleting;
        }

        setTimeout(typeRole, delay);
    }

    typeRole(); 
}// Start the an