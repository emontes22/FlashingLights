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
    }

    initializeLights() {
        this.circles.forEach((circle, index) => {
            this.originalColors[index] = circle.style.backgroundColor;
            const lightGroup = circle.getAttribute('data-light-group');
            if (lightGroup === 'even') {
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
            if (this.areLightsOn) {
                this.adjustAnimationDuration(circle, index, animationDuration);
            } else {
                circle.style.animation = 'none';
            }
        });
    }

    adjustAnimationDuration(circle, index, duration) {
        if (this.areLightsOn) {
            circle.style.animation = `glow${index + 1} ${duration} infinite`;
        } else {
            circle.style.animation = 'none';
        }
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
        this.sliderValueElement.setAttribute('data-value', value);
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
                const lightGroup = circle.getAttribute('data-light-group');

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
}

const lightsController = new LightsController();
lightsController.startBlinkingPattern();