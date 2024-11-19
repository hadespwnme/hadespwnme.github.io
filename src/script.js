particlesJS('particles-js', {
    particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: {
            type: "polygon",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 6 }
        },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 4,
            direction: "none",
            random: true,
            out_mode: "out"
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onclick: { enable: true, mode: "push" }
        },
        modes: {
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

const container = document.querySelector('.hadesLogo');
const chars = ['0', '1'];
const numCols = 26;
const numRows = 13;
const delay = 100;

function generateMatrixAnimation() {
    let animation = '';

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let char;
            if ((row < 5 || row > 7) && (col >= 8 && col <= 17)) {
                char = '&nbsp;';
            } else {
                char = chars[Math.floor(Math.random() * chars.length)];
            }
            animation += char;
        }
        animation += '<br>';
    }
    container.innerHTML = animation;
}
setInterval(generateMatrixAnimation, delay);

const words = ['Hades', 'Pentester'];
const changeNameElement = document.getElementById('changeName');
let wordIndex = 0;
const scrambleDelay = 2000;
const scrambleSpeed = 50;

function scrambleText(newText, callback) {
    const currentText = changeNameElement.innerText;
    const maxLength = Math.max(currentText.length, newText.length);
    let scrambleIndex = 0;

    const interval = setInterval(() => {
        const scrambleArray = [];
        for (let i = 0; i < maxLength; i++) {
            if (i < scrambleIndex && i < newText.length) {
                scrambleArray.push(newText[i]);
            } else {
                scrambleArray.push(chars[Math.floor(Math.random() * chars.length)]);
            }
        }
        changeNameElement.innerText = scrambleArray.slice(0, newText.length).join('');
        scrambleIndex++;
        if (scrambleIndex > maxLength) {
            clearInterval(interval);
            callback();
        }
    }, scrambleSpeed);
}

function changeText() {
    wordIndex = (wordIndex + 1) % words.length;
    scrambleText(words[wordIndex], () => {
        setTimeout(changeText, scrambleDelay);
    });
}

setTimeout(changeText, scrambleDelay);

document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const toggleIcon = document.getElementById('toggleIcon');

    const openSVG = `<path d="M0 13.01v-2l7.09-2.98.58 1.94-5.1 2.05 5.16 2.05-.63 1.9Zm16.37 1.03 5.18-2-5.16-2.09.65-1.88L24 10.95v2.12L17 16zm-2.85-9.98H16l-5.47 15.88H8.05Z"/>`;
    const closeSVG = `<path d="M5.52 2.955A3.521 3.521 0 001.996 6.48v2.558A2.12 2.12 0 010 11.157l.03.562-.03.561a2.12 2.12 0 011.996 2.121v2.948a3.69 3.69 0 003.68 3.696v-1.123a2.56 2.56 0 01-2.557-2.558v-2.963a3.239 3.239 0 00-1.42-2.682 3.26 3.26 0 001.42-2.682V6.48A2.412 2.412 0 015.52 4.078h.437V2.955zm12.538 0v1.123h.437a2.39 2.39 0 012.386 2.401v2.558a3.26 3.26 0 001.42 2.682 3.239 3.239 0 00-1.42 2.682v2.963a2.56 2.56 0 01-2.557 2.558v1.123a3.69 3.69 0 003.68-3.696V14.4A2.12 2.12 0 0124 12.281l-.03-.562.03-.561a2.12 2.12 0 01-1.996-2.12V6.478a3.518 3.518 0 00-3.509-3.524zM6.253 7.478l3.478 3.259a3.393 3.393 0 004.553 0l3.478-3.26h-1.669l-2.65 2.464a2.133 2.133 0 01-2.886 0L7.922 7.478zm5.606 4.884a3.36 3.36 0 00-2.128.886l-3.493 3.274h1.668l2.667-2.495a2.133 2.133 0 012.885 0l2.65 2.495h1.67l-3.494-3.274a3.36 3.36 0 00-2.425-.886z"/>`;

    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('hidden');
        if (navbarMenu.classList.contains('hidden')) {
            toggleIcon.innerHTML = openSVG;
        } else {
            toggleIcon.innerHTML = closeSVG;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".opacity-0");

  const observerOptions = {
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("opacity-100");
      } else {
        entry.target.classList.remove("opacity-100");
        entry.target.classList.add("opacity-0");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((section) => {
    observer.observe(section); 
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarToggle = document.getElementById("navbarToggle");
  const navbarMenu = document.getElementById("navbarMenu");

  setTimeout(() => {
    navbarToggle.classList.remove("translate-x-[-100%]");
    navbarToggle.classList.add("translate-x-0"); 
  }, 100);
});
