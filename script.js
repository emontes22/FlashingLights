let originalColors = [];
let isButtonCooldown = false;

function turnOffLights() {

    if (isButtonCooldown) return;

    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        // Store the original color before turning off the lights
        originalColors[index] = circle.style.backgroundColor;

        // Clear animation properties
        circle.style.animation = 'none';
        circle.style.animationPlayState = 'paused';

        circle.style.backgroundColor = 'gray';
        circle.style.boxShadow = 'none';
    });

    // Set a cooldown of 1 second
    isButtonCooldown = true;
    setTimeout(() => {
        isButtonCooldown = false;
    }, 1000);
}

function turnOnLights() {

    if (isButtonCooldown) return;

    const circles = document.querySelectorAll('.circle');

    circles.forEach((circle, index) => {
        circle.style.animationPlayState = 'running';

        // Restore the original color
        circle.style.backgroundColor = originalColors[index];
        circle.style.boxShadow = `0%, 100% 0 0 20px 10px ${originalColors[index]}`;
        circle.style.boxShadow = `none`;

        // Modify the delay to smoothly start the glow effect
        circle.style.animation = `glow${index + 1} 1s infinite`;
    });

    // Set a cooldown of 1 second
    isButtonCooldown = true;
    setTimeout(() => {
        isButtonCooldown = false;
    }, 1000);
}