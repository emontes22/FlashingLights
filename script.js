class LightsController {
    constructor() {
        this.originalColors = [];
        this.isButtonCooldown = false;
        this.areLightsOn = true;
        this.circles = document.querySelectorAll('.circle');
        this.slider = document.getElementById('speedSlider');
        this.sliderValueElement = document.querySelector('.slider-value');

        this.sliderDefaultValue = 1;

        this.initializeLights();
        this.slider.addEventListener('input', this.onSliderInputChange.bind(this));
        this.createSnowflake();

        setInterval(this.createSnowflake.bind(this), 100);
    }

    initializeLights() {
        this.circles.forEach((circle, index) => {
            this.originalColors[index] = circle.style.backgroundColor;
            if (circle.dataset.lightGroup === 'even') {
                this.activateCircleGlow(circle, index);
            }
        });
    }

    turnOffLights() {
        if (this.isButtonCooldown) return;
        this.areLightsOn = false;
        this.resetSlider();
        this.circles.forEach((circle, index) => {
            this.storeOriginalColor(circle, index);
            this.resetCircleStyles(circle);
            circle.style.animation = 'none';
        });
        this.setButtonCooldown();
    }

    turnOnLights() {
        if (this.isButtonCooldown) return;
        this.areLightsOn = true;
        this.resetSlider();
        this.circles.forEach((circle, index) => {
            this.activateCircleGlow(circle, index);
        });
        this.setButtonCooldown();
    }

    onSliderInputChange() {
        const value = this.slider.value;
        this.updateSliderValue(value);
        const animationDuration = `${1 / value}s`;
        this.circles.forEach((circle, index) => {
            this.adjustAnimationDuration(circle, index, animationDuration);
        });
    }

    adjustAnimationDuration(circle, index, duration) {
        circle.style.animation = this.areLightsOn
            ? `glow${index + 1} ${duration} infinite`
            : 'none';
    }

    resetCircleStyles(circle) {
        circle.style.animation = 'none';
        circle.style.animationPlayState = 'paused';
        circle.style.backgroundColor = 'gray';
        circle.style.boxShadow = 'none';
    }

    resetSlider() {
        this.slider.value = 1;
        this.updateSliderValue(1);
    }

    storeOriginalColor(circle, index) {
        this.originalColors[index] = circle.style.backgroundColor;
    }

    updateSliderValue(value) {
        this.sliderValueElement.dataset.value = value;
        this.sliderValueElement.innerText = value;
    }

    activateCircleGlow(circle, index) {
        if (this.areLightsOn) {
            this.restoreCircleColor(circle, index);
            const sliderValue = parseFloat(this.slider.value);
            const animationDuration = `${1 / sliderValue}s`;
            circle.style.animation = `glow${index + 1} ${animationDuration} infinite`;
            circle.style.animationPlayState = 'running';
        }
    }

    restoreCircleColor(circle, index) {
        circle.style.backgroundColor = this.originalColors[index];
        circle.style.boxShadow = `0%, 100% 0 0 20px 10px ${this.originalColors[index]}`;
        circle.style.boxShadow = 'none';
    }

    setButtonCooldown() {
        this.isButtonCooldown = true;
        setTimeout(() => {
            this.isButtonCooldown = false;
        }, 1000);
    }

    startBlinkingPattern() {
        let evenGroupOn = true;

        const toggleBlinking = () => {
            this.circles.forEach((circle, index) => {
                const lightGroup = circle.dataset.lightGroup;

                if ((evenGroupOn && lightGroup === 'even') || (!evenGroupOn && lightGroup === 'odd')) {
                    this.activateCircleGlow(circle, index);
                } else {
                    this.resetGlowEffect(circle);
                }
            });

            evenGroupOn = !evenGroupOn;
        };

        toggleBlinking();
        setInterval(toggleBlinking, 480);
    }

    resetGlowEffect(circle) {
        circle.style.animation = 'none';
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        const size = Math.random() * 15 + 5;
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';

        const pattern = Math.random() < 0.5 ? 'right' : 'down';

        let x, y, duration;

        if (pattern === 'right') {
            x = Math.random() * window.innerWidth;
            y = -Math.random() * window.innerHeight;
            duration = Math.random() * 5 + 5;
        } else {
            x = Math.random() * window.innerWidth;
            y = -Math.random() * window.innerHeight;
            duration = Math.random() * 8 + 8;
        }

        snowflake.dataset.pattern = pattern;

        snowflake.style.left = x + 'px';
        snowflake.style.top = y + 'px';
        snowflake.style.animation = `fall ${duration}s linear infinite`;

        document.querySelector('.snowflakes-container').appendChild(snowflake);
    }
}

const lightsController = new LightsController();
lightsController.startBlinkingPattern();