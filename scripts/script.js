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

class MusicPlayer {
    constructor() {
        this.albumCoverImg = document.getElementById('album-cover-img');
        this.songTitle = document.getElementById('song-title');
        this.artist = document.getElementById('artist');
        this.album = document.getElementById('album');
        this.skipButton = document.getElementById('skip-button');
        this.playPauseButton = document.getElementById('play-pause-button');
        this.volumeControl = document.getElementById('volume-control');
        this.audioElement = document.getElementById('audio-element');
        this.progressBar = document.getElementById('progress');
        this.timer = document.getElementById('timer');
        this.dragging = false;

        this.musicData = [
            {
                albumCover: 'assets/images/cover1.jpg',
                title: 'Merry Christmas',
                artist: 'Ed Sheeran ft. Elton John',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song1.mp3',
            },
            {
                albumCover: 'assets/images/cover2.jpg',
                title: 'Feliz Navidad',
                artist: 'Jose Feliciano',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song2.mp3',
            },
            {
                albumCover: 'assets/images/cover3.jpg',
                title: 'Underneath the Tree',
                artist: 'Kelly Clarkson',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song3.mp3',
            },
            {
                albumCover: 'assets/images/cover4.jpg',
                title: 'Somewhere in My Memory',
                artist: 'Leslie Bricusse',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song4.mp3',
            },
            {
                albumCover: 'assets/images/cover5.jpg',
                title: 'We Three Gentlemen',
                artist: 'Lidsey Stirling',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song5.mp3',
            },
            {
                albumCover: 'assets/images/cover6.jpg',
                title: 'All I Want For Chsristmas is You',
                artist: 'Mariah Carey',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song6.mp3',
            },
            {
                albumCover: 'assets/images/cover7.jpg',
                title: 'Its Beginning To Look a Lot Like Christmas',
                artist: 'Michael Buble',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song7.mp3',
            },
            {
                albumCover: 'assets/images/cover8.jpg',
                title: 'Rockin Around the Christmas Tree',
                artist: 'Brenda Lee',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song8.mp3',
            },
            {
                albumCover: 'assets/images/cover9.jpg',
                title: 'Last Christmas',
                artist: 'Wham',
                album: 'Christmas Songs',
                audioFile: 'assets/audio/song9.mp3',
            }
        ];

        this.currentSongIndex = 0;
        this.currentSong = this.musicData[this.currentSongIndex];
        this.updateUI();
        this.initMusicPlayer();
    }

    initMusicPlayer() {
        this.albumCoverImg.src = this.currentSong.albumCover;
        this.songTitle.textContent = this.currentSong.title;
        this.artist.textContent = this.currentSong.artist;
        this.album.textContent = this.currentSong.album;
        this.volumeControl.value = 50;

        this.playPauseButton.addEventListener('click', this.togglePlayPause.bind(this));
        this.skipButton.addEventListener('click', this.skipToNext.bind(this));
        this.volumeControl.addEventListener('input', this.adjustVolume.bind(this));

        this.progressBar.addEventListener('click', this.seek.bind(this));

        this.progressBar.addEventListener('mousedown', (e) => {
            this.dragging = true;
            this.seek(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.dragging) {
                this.seek(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.dragging = false;
        });

        this.audioElement.addEventListener('timeupdate', this.updateProgressBar.bind(this));

        this.audioElement.addEventListener('ended', () => {
            this.playPauseButton.textContent = 'Play';
            this.progressBar.style.width = '0%';
            this.timer.textContent = '0:00 / 0:00';
        });

        this.skipButton.addEventListener('click', () => {
            this.skipToNext();
        });
    }

    togglePlayPause() {
        if (this.audioElement.paused) {
            this.audioElement.play();
            this.playPauseButton.textContent = 'Pause';
        } else {
            this.audioElement.pause();
            this.playPauseButton.textContent = 'Play';
        }
    }

    skipToNext() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.musicData.length;
        this.currentSong = this.musicData[this.currentSongIndex];
        this.updateUI();
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.src = this.currentSong.audioFile;
        this.audioElement.oncanplay = () => {
            this.audioElement.play();
            this.audioElement.oncanplay = null;
        };
    }

    updateUI() {
        this.albumCoverImg.src = this.currentSong.albumCover;
        this.songTitle.textContent = this.currentSong.title;
        this.artist.textContent = this.currentSong.artist;
        this.album.textContent = this.currentSong.album;
    }

    adjustVolume() {
        this.audioElement.volume = this.volumeControl.value / 100;
    }

    seek(e) {
        const audio = this.audioElement;
        const percent = e.offsetX / document.querySelector('.progress-bar').offsetWidth;
        const seekTime = percent * audio.duration;
        audio.currentTime = seekTime;
    }

    updateProgressBar() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;
        const progress = (currentTime / duration) * 100;

        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);

        const timeString = `${currentMinutes}:${(currentSeconds < 10 ? '0' : '')}${currentSeconds} / ${durationMinutes}:${(durationSeconds < 10 ? '0' : '')}${durationSeconds}`;

        this.timer.textContent = timeString;

        this.progressBar.style.width = `${progress}%`;
    }
}

const musicPlayer = new MusicPlayer();