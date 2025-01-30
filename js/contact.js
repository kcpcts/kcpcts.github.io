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

// Allow only numbers in phone field
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9+\-() ]/g, '');
});

// Form submission with validation
form.addEventListener("submit", function (e) {
    e.preventDefault();

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