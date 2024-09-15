document.addEventListener("DOMContentLoaded", function () {
    /*
    const sphere = document.querySelector(".sphere");

    // Get the shockwave element
    const shockwave = document.querySelector(".shockwave");
    const fadein = document.querySelector(".fadein");

    // Get the lower-middle part of the screen
    const lowerMiddleX = window.innerWidth / 2;
    const lowerMiddleY = window.innerHeight * 0.75;

    // Trigger animation on page load
    sphere.style.animationPlayState = "running";

    // Listen for the end of the sphere animation
    sphere.addEventListener("animationend", function () {
        sphere.style.animationPlayState = "paused";
        sphere.remove();
        // Set shockwave position to lower-middle
        shockwave.style.left = lowerMiddleX + "px";
        shockwave.style.top = lowerMiddleY + "px";

        // Trigger shockwave animation
        shockwave.style.animationPlayState = "running";
        setTimeout(() => {
            fadein.style.animationPlayState = "running";
        }, 4500);
        
    });
    shockwave.addEventListener("animationend", function () {
        // Reset shockwave animation state
        const scene = document.getElementById("scene");
        scene.style.display = "none";
        const fadein = document.getElementById(fadein);
        fadein.style.display = "block";
        fadein.style.animationPlayState = "running";
        
    });
    fadein.addEventListener("animationend", function () {
        // Reset shockwave animation state
        const scene = document.getElementById("scene");
        scene.style.display = "none";
        
    });

*/

    const rainContainer = document.getElementById("rain");
    const follower = document.getElementById("follower");
    const container = document.querySelector(".container");
    const ring = document.querySelector(".ring");
    let prevX, prevY;
    let gust = "fall";
    let opened = false;

    // Preload the opened umbrella image
    const openedUmbrellaImage = new Image();
    openedUmbrellaImage.src = "openedumbrella.png";

    let isMouseDown = false;
    let pickedUp = false;
// TESTING




function createBlurredImage(x, y, velocity) {
    const blurAmount = 15; 
    //Math.min(velocity / 10, 5); // Adjust the blur intensity
    const opacity = Math.min(0.5, velocity / 100); // Adjust the maximum opacity
    const blurredImage = document.createElement("img");
    blurredImage.src = "umbrella.png";
    blurredImage.style.width = "100px";
    blurredImage.style.height = "100px";
    blurredImage.style.position = "absolute";
    blurredImage.style.left = x - follower.offsetWidth / 2 + "px";
    blurredImage.style.top = y - follower.offsetHeight / 2 + "px";
    blurredImage.style.filter = `blur(${blurAmount}px)`;
    blurredImage.style.opacity = opacity;
    
    container.appendChild(blurredImage);

    // Remove the blurred image after a short delay
    setTimeout(() => {
        container.removeChild(blurredImage);
    }, 100); // Adjust the delay as needed
}

// END TEST
    document.addEventListener("mousemove", function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        if (!isMouseDown) {
            // If the mouse is not down, update the position of the closed umbrella
            follower.style.left = mouseX - follower.offsetWidth / 2 + "px";
            follower.style.top = mouseY - follower.offsetHeight / 2 + "px";
            const velocityX = prevX ? mouseX - prevX : 0;
            const velocityY = prevY ? mouseY - prevY : 0;
            const velocity = Math.sqrt(velocityX ** 2 + velocityY ** 2)
            createBlurredImage(mouseX, mouseY, velocity);

            prevX = mouseX;
            prevY = mouseY;

            // Apply motion blur using CSS filter
            
        } else {
            // If the mouse is down, update the position of the opened umbrella
            follower.style.left = mouseX - follower.offsetWidth / 2 + "px";
            follower.style.top = mouseY - follower.offsetHeight / 2 + "px";
        }
        
    });

// Important functions

    container.addEventListener("mousedown", function () {
        isMouseDown = true;
        if (isMouseDown) {
            follower.style.transition = "transform 0.2s ease";
            follower.style.transform = "rotate(-45deg)";
            // Use requestAnimationFrame to ensure the next rendering cycle
            requestAnimationFrame(() => {
                setTimeout(() => {
                    follower.style.transition = "transform 0s ease";
                    
                    
                }, 200);
                
                // Use another requestAnimationFrame to ensure the next rendering cycle
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        follower.src = openedUmbrellaImage.src;
                        opened = true;
                        follower.style.transform = "rotate(0deg)";
                        
                    }, 200);
                    // Reset rotation
                    requestAnimationFrame(() => {
                        follower.style.transition = "transform 0.2s ease";
                    });
                });
            });
            
        }
        createRingEffect(event.clientX, event.clientY);
    });

    container.addEventListener("mouseup", function () {
        isMouseDown = false;
        // Rotate the opened umbrella smoothly before changing
        if (!isMouseDown) { // Corrected condition
            follower.src = "umbrella.png";
            opened = false;
            follower.style.transform = "rotate(0deg)"; // Reset rotation
        }
    });






    function createRaindrop() {
        const raindrop = document.createElement("div");
        raindrop.classList.add("raindrop");
        raindrop.style.left = Math.random() * window.innerWidth + "px";
        const variable = Math.random() * 2 + 1;
        raindrop.style.opacity = Math.random()+0.1;
        
        raindrop.style.animationDuration = variable + "s";
        raindrop.style.animationName = gust;
        
        //raindrop.style.animationDuration = variable + "s";
        raindrop.style.height = 1/variable * 50 + "px";
        rainContainer.appendChild(raindrop);

        raindrop.addEventListener("animationiteration", function () {
            //raindrop.style.top = "-100px";
            raindrop.remove;

           
            
        });
    }
    

    requestAnimationFrame(checkCollision);















    
    let isWKeyPressed = false;
    let isSKeyPressed = false;

    


    function createRingEffect(mouseX, mouseY) {
        const ring = document.createElement("div");
        ring.classList.add("ring");
        const ringLeft = mouseX - ring.offsetWidth / 2;
        const ringTop = mouseY - ring.offsetHeight / 2;

        ring.style.left = ringLeft + "px";
        ring.style.top = ringTop + "px";
        ring.addEventListener("animationiteration", function () {
            ring.classList.add("ring.active");
            container.removeChild(ring);
        });
    
        // Append the ring element to the container
        container.appendChild(ring);
    
        // Remove the ring element after the animation completes
        ring.addEventListener("animationend", function () {
            container.removeChild(ring);
        });
    }
    function windGust() {

        let rightLeft = Math.round(Math.random()*2);
        if(rightLeft == 0) {
            gust = "gustFallRight";
        }
        if (rightLeft == 2) {
            gust = "gustFallLeft";
        }
        if (rightLeft == 1) {
            gust = "fall"
        }
    }
    // Create initial raindrops
    //WORKING
    function createGlow(x,y) {
        const blurAmount = 15; 
        
        const glowEffect = document.createElement("img");
        glowEffect.src = "umbrellaGlow.png";
        glowEffect.style.animationName = "fade";
        glowEffect.style.animationDuration = 1 + "s";
        glowEffect.style.width = "100px";
        glowEffect.style.height = "100px";
        glowEffect.style.position = "absolute";
        glowEffect.style.left = y + "px";
        glowEffect.style.top = x + "px";
        glowEffect.style.filter = `blur(${blurAmount}px)`;
        glowEffect.style.opacity = 1;

        
        container.appendChild(glowEffect);

        // Remove the blurred image after a short delay
        setTimeout(() => {
            container.removeChild(glowEffect);
        }, 950); // Adjust the delay as needed
    }

    function checkCollision(raindrop) {

        const raindropRect = raindrop.getBoundingClientRect();
        const umbrellaRect = follower.getBoundingClientRect();

        const cATop = umbrellaRect.top + 100;
        const cABottom = umbrellaRect.top + 5;
        // Check for collision with the top of the umbrella
        const isCollision = (
            (raindropRect.bottom < cATop && raindropRect.bottom > cABottom) && 
            (raindropRect.left < umbrellaRect.right && raindropRect.right > umbrellaRect.left));
        //follower.style.border = isCollision ? "2px solid blue" : "none";
        

        if (isCollision) {
            createGlow(umbrellaRect.top, umbrellaRect.left);
            // Log the coordinates of the collision
            /* console.log("Collision Coordinates: ", {
                raindropTop: raindropRect.top,
                
                raindropLeft: raindropRect.left,

            });
            */
        }
        return isCollision;
    }
    
    function iterateAndDeleteRaindrops() {
        const raindrops = document.querySelectorAll(".raindrop");
        if (opened) {
            raindrops.forEach((raindrop) => {
                const raindropRect = raindrop.getBoundingClientRect();

                const isVisible =
                    raindropRect.bottom >= 0 &&
                    raindropRect.top <= window.innerHeight &&
                    raindropRect.right >= 0 &&
                    raindropRect.left <= window.innerWidth;
                if (isVisible && checkCollision(raindrop)) {
                    // Raindrop is above the umbrella, remove it
                    raindrop.remove();
                    
                }
            });
        }
    
        // Use requestAnimationFrame for continuous iteration
        requestAnimationFrame(iterateAndDeleteRaindrops);
    }




    function hailStorm() {
        const hail = document.createElement("img");
        hail.src = "hail.png";
        hail.style.userSelect = "none";
        const size = Math.round(Math.random() * 50) + 20;
        const speedFactor = Math.sqrt(size); // Use square root for smoother relationship
        const animationDuration = 0.1+speedFactor/2 + "s";
        hail.style.left = Math.random() * window.innerWidth + "px";
        hail.style.top = -500 - (Math.random()*100) + "px";
        createWarningSnowflake(hail.style.top, hail.style.left, animationDuration);
        hail.style.animationName = "hailFall";
        hail.style.animationDuration = animationDuration;
        hail.style.animationTimingFunction = "linear"; // Set linear timing function
        hail.style.width = size + "px";
        hail.style.height = size + "px";
        hail.style.position = "absolute";
        hail.style.opacity = 1;
        hail.addEventListener("animationend", function () {
            // Remove the snowflake when the animation ends
            container.removeChild(hail);
        });
        container.appendChild(hail);

    }

    function createWarningSnowflake(height,x, duration) {
        const snowflake = document.createElement("img");
        snowflake.src = "snowflake.png";
        snowflake.classList.add("snowflake");
        snowflake.style.left = x;
        snowflake.style.top = height+1000 + "px";
        snowflake.style.animationName = "snowflakeFall";
        snowflake.style.animationTimingFunction = "ease-out"; // Set linear timing function
        snowflake.style.animationDuration = 2 + "s";
        //snowflake.style.boxShadow = "0 0 20px 20px rgba(255,255,255,1)";
        snowflake.style.width = "20px";
        snowflake.style.height = "20px";
        snowflake.style.position = "absolute";
        snowflake.style.opacity = 1;
        snowflake.addEventListener("animationend", function () {
            // Remove the snowflake when the animation ends
            container.removeChild(snowflake);
        });
        container.appendChild(snowflake);


    }






    // Generate continuous rain
    requestAnimationFrame(iterateAndDeleteRaindrops);
    setInterval(createRaindrop, 500);
    setInterval(windGust, 100);
    setInterval(hailStorm, 5000);
    //setInterval(makeSnowBlur, 5);
});
