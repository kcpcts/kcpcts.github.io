// Move all the starfield JavaScript code to this file
// Replace the fixed dimensions with dynamic ones:

$(document).ready(function() {
    // Delay the entire starfield initialization
    setTimeout(function() {
        var mobile = false;
        if (isMobile.phone || isMobile.tablet) {
            mobile = true;
        }

        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.oncontextmenu = function(e) {
            e.preventDefault();
        };

        if (!mobile) {
            canvas.addEventListener('mousemove', mouseMoveHandler);
            canvas.addEventListener('mousedown', mouseDownHandler);
            canvas.addEventListener('mouseup', mouseUpHandler);
            canvas.addEventListener('mouseenter', mouseEnterHandler);
            canvas.addEventListener('mouseleave', mouseLeaveHandler);
            $(canvas).css('cursor', 'pointer');
        } else {
            canvas.addEventListener('touchstart', touchStartHandler, false);
            canvas.addEventListener('touchend', touchEndHandler, false);
            canvas.addEventListener('touchmove', touchMoveHandler, false);
            canvas.addEventListener('touchcancel', touchCancelHandler, false);
        }

        document.getElementById('starfield-effect').appendChild(canvas);
        setTimeout(() => document.getElementById('starfield-effect').classList.add('visible'), 100);

        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var pix = imageData.data;

        var MATHPI180 = Math.PI / 180;
        var MATHPI2 = Math.PI * 2;

        var center = { x: canvasWidth / 2, y: canvasHeight / 2 };

        var mouseActive = false;
        var mouseDown = false;
        var mousePos = { x: center.x, y: center.y };

        var rotationSpeed = -1.00;
        var rotationSpeedFactor = { x: 0, y: 0 };
        rotationSpeedFactor.x = rotationSpeed / center.x;
        rotationSpeedFactor.y = rotationSpeed / center.y;

        var fov = 300;
        var fovMin = 210;
        var fovMax = fov;

        var starHolderCount = 3000;
        var starHolder = [];
        var starBgHolder = [];
        var starSpeed = 10;
        var starSpeedMin = starSpeed;
        var starSpeedMax = 200;
        var starDistance = 8000;
        var starRotation = 0;

        var backgroundColor = { r: 17, g: 17, b: 17, a: 255 };

        function clearImageData() {
            for (var i = 0, l = pix.length; i < l; i += 4) {
                pix[i] = backgroundColor.r;
                pix[i + 1] = backgroundColor.g;
                pix[i + 2] = backgroundColor.b;
                pix[i + 3] = backgroundColor.a;
            }
        }

        function setPixel(x, y, r, g, b, a) {
            var i = (x + y * canvasWidth) * 4;
            pix[i] = r;
            pix[i + 1] = g;
            pix[i + 2] = b;
            pix[i + 3] = a;
        }

        function setPixelAdditive(x, y, r, g, b, a) {
            var i = (x + y * canvasWidth) * 4;
            pix[i] = pix[i] + r;
            pix[i + 1] = pix[i + 1] + g;
            pix[i + 2] = pix[i + 2] + b;
            pix[i + 3] = a;
        }

        function drawLine(x1, y1, x2, y2, r, g, b, a) {
            var dx = Math.abs(x2 - x1);
            var dy = Math.abs(y2 - y1);

            var sx = (x1 < x2) ? 1 : -1;
            var sy = (y1 < y2) ? 1 : -1;

            var err = dx - dy;

            var lx = x1;
            var ly = y1;

            while (true) {
                if (lx > 0 && lx < canvasWidth && ly > 0 && ly < canvasHeight) {
                    setPixel(lx, ly, r, g, b, a);
                }

                if ((lx === x2) && (ly === y2))
                    break;

                var e2 = 2 * err;

                if (e2 > -dx) {
                    err -= dy;
                    lx += sx;
                }

                if (e2 < dy) {
                    err += dx;
                    ly += sy;
                }
            }
        }

        function addParticle(x, y, z, ox, oy, oz) {
            var particle = {};
            particle.x = x;
            particle.y = y;
            particle.z = z;
            particle.ox = ox;
            particle.oy = oy;
            particle.x2d = 0;
            particle.y2d = 0;
            return particle;
        }

        function addParticles() {
            var i;
            var x, y, z;
            var colorValue;
            var particle;

            // Background stars
            for (i = 0; i < starHolderCount / 3; i++) {
                x = Math.random() * 24000 - 12000;
                y = Math.random() * 4500 - 2250;
                z = Math.round(Math.random() * starDistance);

                // Dimmer background stars
                colorValue = Math.floor(Math.random() * 25) + 5;

                particle = addParticle(x, y, z, x, y, z);
                particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 155 };  // More transparent

                starBgHolder.push(particle);
            }

            // Foreground stars
            for (i = 0; i < starHolderCount; i++) {
                x = Math.random() * 10000 - 5000;
                y = Math.random() * 10000 - 5000;
                z = Math.round(Math.random() * starDistance);

                // Dimmer foreground stars
                colorValue = Math.floor(Math.random() * 75) + 50;

                particle = addParticle(x, y, z, x, y, z);
                particle.color = { r: colorValue, g: colorValue, b: colorValue, a: 200 };
                particle.oColor = { r: colorValue, g: colorValue, b: colorValue, a: 200 };
                particle.w = 2;  // Slightly larger stars
                particle.distance = starDistance - z;
                particle.distanceTotal = Math.round(starDistance + fov - particle.w);

                starHolder.push(particle);
            }
        }

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        function animloop() {
            requestAnimFrame(animloop);
            render();
        }

        function render() {
            clearImageData();

            // Calculate brightness factor based on speed
            var brightnessMultiplier = 1 + ((starSpeed - starSpeedMin) / (starSpeedMax - starSpeedMin)) * 2;

            if (mouseActive) {
                starSpeed += 0.5;
                if (starSpeed > starSpeedMax)
                    starSpeed = starSpeedMax;
            } else {
                starSpeed -= 1;
                if (starSpeed < starSpeedMin)
                    starSpeed = starSpeedMin;
            }

            if (!mouseActive) {
                fov += 0.5;
                if (fov > fovMax)
                    fov = fovMax;
            } else {
                fov -= 1;
                if (fov < fovMin)
                    fov = fovMin;
            }

            var warpSpeedValue = mobile ? 
                starSpeed * (starSpeed / starSpeedMax) : 
                starSpeed * (starSpeed / (starSpeedMax / 2));

            // Render background stars
            for (var i = 0; i < starBgHolder.length; i++) {
                var star = starBgHolder[i];
                var scale = fov / (fov + star.z);
                
                // Adjust brightness based on speed
                var speedBrightness = Math.floor(star.color.r * brightnessMultiplier);
                speedBrightness = Math.min(255, speedBrightness); // Cap at 255

                star.x2d = (star.x * scale) + center.x;
                star.y2d = (star.y * scale) + center.y;

                if (star.x2d > 0 && star.x2d < canvasWidth && 
                    star.y2d > 0 && star.y2d < canvasHeight) {
                    setPixel(star.x2d | 0, star.y2d | 0, 
                        speedBrightness, 
                        speedBrightness, 
                        speedBrightness, 
                        255);
                }
            }

            // Render primary stars
            for (var i = 0; i < starHolder.length; i++) {
                var star = starHolder[i];

                star.z -= starSpeed;
                star.distance += starSpeed;

                if (star.z < -fov + star.w) {
                    star.z = starDistance;
                    star.distance = 0;
                }

                var distancePercent = star.distance / star.distanceTotal;
                
                // Adjust brightness based on both distance and speed
                var speedAdjustedBrightness = brightnessMultiplier * distancePercent;
                star.color.r = Math.min(255, Math.floor(star.oColor.r * speedAdjustedBrightness));
                star.color.g = Math.min(255, Math.floor(star.oColor.g * speedAdjustedBrightness));
                star.color.b = Math.min(255, Math.floor(star.oColor.b * speedAdjustedBrightness));

                var scale = fov / (fov + star.z);

                star.x2d = (star.x * scale) + center.x;
                star.y2d = (star.y * scale) + center.y;

                if (star.x2d > 0 && star.x2d < canvasWidth && 
                    star.y2d > 0 && star.y2d < canvasHeight) {
                    setPixelAdditive(star.x2d | 0, star.y2d | 0, 
                        star.color.r, star.color.g, star.color.b, 255);
                }

                if (starSpeed != starSpeedMin) {
                    var nz = star.z + warpSpeedValue;
                    scale = fov / (fov + nz);

                    var x2d = (star.x * scale) + center.x;
                    var y2d = (star.y * scale) + center.y;

                    if (x2d > 0 && x2d < canvasWidth && 
                        y2d > 0 && y2d < canvasHeight) {
                        drawLine(star.x2d | 0, star.y2d | 0, x2d | 0, y2d | 0, 
                            star.color.r, star.color.g, star.color.b, 255);
                    }
                }

                if (mouseDown) {
                    var radians = MATHPI180 * starRotation;
                    var cos = Math.cos(radians);
                    var sin = Math.sin(radians);

                    star.x = (cos * (star.ox - center.x)) + 
                            (sin * (star.oy - center.y)) + center.x;
                    star.y = (cos * (star.oy - center.y)) - 
                            (sin * (star.ox - center.x)) + center.y;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            applyBlur();  // Add blur after rendering

            if (mouseActive) {
                center.x += (mousePos.x - center.x) * 0.015;
            } else {
                center.x += ((canvas.width / 2) - center.x) * 0.015;
            }

            if (mouseDown) {
                starRotation -= 0.1;
            }
        }

        function mouseMoveHandler(event) {
            mousePos = getMousePos(canvas, event);
        }

        function mouseEnterHandler(event) {
            mouseActive = true;
        }

        function mouseLeaveHandler(event) {
            mouseActive = false;
            mouseDown = false;
        }

        function mouseDownHandler(event) {
            mouseDown = true;
            speed = 0;
        }

        function mouseUpHandler(event) {
            mouseDown = false;
            speed = 0.25;
        }

        function getMousePos(canvas, event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function touchStartHandler(event) {
            event.preventDefault();
            mouseDown = true;
            mouseActive = true;
        }

        function touchEndHandler(event) {
            event.preventDefault();
            mouseDown = false;
            mouseActive = false;
        }

        function touchMoveHandler(event) {
            event.preventDefault();
            mousePos = getTouchPos(canvas, event);
        }

        function touchCancelHandler(event) {
            mouseDown = false;
            mouseActive = false;
        }

        function getTouchPos(canvas, event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };
        }

        addParticles();
        animloop();

        window.addEventListener('resize', function() {
            canvas.setAttribute('width', window.innerWidth);
            canvas.setAttribute('height', window.innerHeight);
            center.x = window.innerWidth / 2;
            center.y = window.innerHeight / 2;
            imageData = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
            pix = imageData.data;
        });

        // Add a blur effect to the canvas
        function applyBlur() {
            ctx.filter = 'blur(1px)';  // Subtle blur
            var tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvasWidth;
            tempCanvas.height = canvasHeight;
            var tempCtx = tempCanvas.getContext('2d');
            tempCtx.putImageData(imageData, 0, 0);
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.filter = 'none';
        }
    }, 3000); // 3 second delay
}); 

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * maxDepth;
        
        // Add initial opacity
        this.opacity = 1;
        
        // Calculate fade start point (percentage of canvas height)
        this.fadeStart = 0.2; // Stars start fading at 40% of screen height
        this.fadeEnd = 0.4;   // Stars completely fade out at 70% of screen height
    }

    draw() {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        
        // Calculate opacity based on y position
        const relativeY = y / canvas.height;
        if (relativeY > this.fadeStart) {
            this.opacity = Math.max(0, 1 - (relativeY - this.fadeStart) / (this.fadeEnd - this.fadeStart));
        } else {
            this.opacity = 1;
        }
        
        const size = (maxDepth - z) / maxDepth * 2;
        const brightness = (maxDepth - z) / maxDepth;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * this.opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // ... existing update code ...
    }
} 