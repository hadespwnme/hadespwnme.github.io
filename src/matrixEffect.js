document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.hadesLogo');
  if (!container) return;

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
});
