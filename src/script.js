const shuffleChars = "#&+(@/_-";
const words = ["Hades", "Pentester", "CTF Player"];
let wordIndex = 0;

function shuffleText(element, targetWord, callback) {
  let iterations = 0;
  const maxIterations = 10;
  const letters = targetWord.split("");

  const interval = setInterval(() => {
    const displayed = letters.map((char, i) => {
      if (i < iterations) return char;
      return shuffleChars[Math.floor(Math.random() * shuffleChars.length)];
    }).join("");

    element.textContent = displayed;

    iterations++;
    if (iterations > letters.length) {
      clearInterval(interval);
      element.textContent = targetWord;
      if (callback) callback();
    }
  }, 80);
}

function cycleWords() {
  const target = document.getElementById("animated-text");
  if (!target) return;
  shuffleText(target, words[wordIndex], () => {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(cycleWords, 2000);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(cycleWords, 4100);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre > code").forEach(codeBlock => {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerText = "Copy";

    const pre = codeBlock.parentNode;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";

    pre.parentNode.replaceChild(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(button);

    button.addEventListener("click", () => {
      const text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => button.innerText = "Copy", 1500);
      });
    });
  });
});
