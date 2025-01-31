const form = document.getElementById("form");
const formWrapper = document.getElementById("form-wrapper");
const resultCard = document.getElementById("result-card");
const result = document.getElementById("result");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format phone number as user types
function formatPhoneNumber(value) {
    if (!value) return value;
    // Remove all non-digits and the +1 prefix if it exists
    const phoneNumber = value.replace(/^\+1\s*|\D/g, '');
    const phoneNumberLength = phoneNumber.length;

    // Don't format if no numbers entered yet
    if (phoneNumberLength === 0) return '';

    // Build number gradually
    if (phoneNumberLength <= 3) {
        return `+1 (${phoneNumber}`;
    }
    if (phoneNumberLength <= 6) {
        return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    if (phoneNumberLength <= 10) {
        return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
    // Limit to 10 digits
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

// Handle phone input
phoneInput.addEventListener('input', (e) => {
    const cursorPosition = e.target.selectionStart;
    const oldValue = e.target.value;
    const newValue = formatPhoneNumber(oldValue);
    
    if (newValue !== oldValue) {
        e.target.value = newValue;
        
        // Try to maintain cursor position
        if (cursorPosition < oldValue.length) {
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        }
    }
});

// Prevent user from entering non-numeric characters
phoneInput.addEventListener('keydown', (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
    }
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

// Form submission with validation
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate required fields
    if (!emailInput.value.trim() || !document.getElementById('name').value.trim()) {
        result.innerHTML = "Name and email are required";
        result.className = "form-result error";
        resultCard.classList.add("show");
        setTimeout(() => {
            resultCard.classList.remove("show");
        }, 3000);
        return;
    }

    // Validate email
    if (!isValidEmail(emailInput.value)) {
        result.innerHTML = "Please enter a valid email address";
        result.className = "form-result error";
        resultCard.classList.add("show");
        setTimeout(() => {
            resultCard.classList.remove("show");
        }, 3000);
        return;
    }

    // Shrink form
    formWrapper.classList.add("shrink");
    
    // Show loading message
    result.innerHTML = "Please wait...";
    result.className = "form-result";
    resultCard.classList.add("show");

    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    const json = JSON.stringify(object);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: json
    })
        .then(async (response) => {
            const json = await response.json();
            if (response.status === 200) {
                result.innerHTML = json.message;
                result.classList.add("success");
            } else {
                result.innerHTML = json.message;
                result.classList.add("error");
                // Show form again on error
                formWrapper.classList.remove("shrink");
            }
        })
        .catch((error) => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
            result.classList.add("error");
            // Show form again on error
            formWrapper.classList.remove("shrink");
        })
        .then(function () {
            form.reset();
            // Hide result after delay
            setTimeout(() => {
                resultCard.classList.remove("show");
            }, 3000);
        });
}); 