const container = document.getElementById("binaryMatrix");
const rows = 13;
const cols = 26;
const chars = ['0', '1'];
let matrixFormed = false;

function randomPosition() {
  const fromTop = Math.random() < 0.5;
  const x = Math.random() * container.clientWidth;
  const y = fromTop
    ? -200 - Math.random() * 500
    : container.clientHeight + 200 + Math.random() * 500;
  return { x, y };
}


function gridPosition(row, col) {
  const cellWidth = container.clientWidth / cols;
  const cellHeight = container.clientHeight / rows;
  return {
    x: col * cellWidth,
    y: row * cellHeight
  };
}

function createMatrix() {
  container.innerHTML = '';
  let count = 0;
  const total = rows * cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const charSpan = document.createElement('span');
      const char = chars[Math.floor(Math.random() * chars.length)];

      const isLogoSpace = (row < 5 || row > 7) && (col >= 8 && col <= 17);
      const finalChar = isLogoSpace ? '\u00A0' : char;

      const startPos = randomPosition();
      const endPos = gridPosition(row, col);

      charSpan.textContent = char;
      charSpan.style.left = `${startPos.x}px`;
      charSpan.style.top = `${startPos.y}px`;

      container.appendChild(charSpan);

      setTimeout(() => {
        charSpan.style.opacity = 1;
        charSpan.style.left = `${endPos.x}px`;
        charSpan.style.top = `${endPos.y}px`;
        charSpan.textContent = finalChar;

        count++;
        if (count === total && !matrixFormed) {
          matrixFormed = true;
          setTimeout(startMatrixLoop, 1000);
        }
      }, Math.random() * 1000);
    }
  }
}

function startMatrixLoop() {
  const spans = container.querySelectorAll("span");
  setInterval(() => {
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isLogoSpace = (row < 5 || row > 7) && (col >= 8 && col <= 17);
        if (!isLogoSpace) {
          spans[index].textContent = chars[Math.floor(Math.random() * chars.length)];
        }
        index++;
      }
    }
  }, 100);
}

window.addEventListener("load", () => {
  createMatrix();

  setTimeout(() => {
    document.getElementById("mainContent").style.display = "block";
    const binary = document.getElementById("binaryMatrix");
    binary.style.transition = "opacity 1s ease";
    binary.style.opacity = 0;
    setTimeout(() => {
      binary.style.display = "none";
      const loop = document.getElementById("hadesLogo");
      loop.style.opacity = "0";
      loop.style.transform = "translateY(-100px)";
      loop.style.display = "block";
      setTimeout(() => {
        loop.style.transition = "opacity 1s ease, transform 1s ease";
        loop.style.opacity = "1";
        loop.style.transform = "translateY(0)";
      }, 50);
    }, 1000);
  }, 4000);
});