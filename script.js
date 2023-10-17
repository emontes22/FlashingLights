class LightsController {
    constructor() {
        this.originalColors = [];
        this.isButtonCooldown = false;
        this.areLightsOn = false;
        this.circles = document.querySelectorAll('.circle');
        this.slider = document.getElementById('speedSlider');
        this.sliderValueElement = document.querySelector('.slider-value');

        this.slider.addEventListener('input', this.onSliderInputChange.bind(this));
    }

    turnOffLights() {
        if (this.isButtonCooldown) return;
        this.areLightsOn = false;

        this.circles.forEach((circle, index) => {
            this.storeOriginalColor(circle, index);
            this.resetCircleStyles(circle);
        });

        this.setButtonCooldown();
    }

    turnOnLights() {
        if (this.isButtonCooldown) return;
        this.areLightsOn = true;

        if (this.areLightsOn) this.resetSlider();

        this.circles.forEach((circle, index) => {
            this.activateCircleGlow(circle, index);
        });

        this.setButtonCooldown();
    }

    onSliderInputChange() {
        const value = this.slider.value;
        this.updateSliderValue(value);

        if (this.areLightsOn) {
            const animationDuration = `${1 / value}s`;
            this.circles.forEach((circle, index) => {
                this.adjustAnimationDuration(circle, index, animationDuration);
            });
        }
    }

    adjustAnimationDuration(circle, index, duration) {
        if (this.areLightsOn) {
            circle.style.animation = `glow${index + 1} ${duration} infinite`;
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
            const defaultAnimationDuration = `${1 / 1}s`;
            circle.style.animation = `glow${index + 1} ${defaultAnimationDuration} infinite`;
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
}

const lightsController = new LightsController();
