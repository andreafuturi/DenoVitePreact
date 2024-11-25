import { inlineImport } from "../../lib/framework-utils.jsx";

export default function LightCounter() {
  return (
    <article class="light-counter">
      Lightweight <span class="count">0</span>
      <button aria-label="Increment lightweight counter">Count! 🚀</button>
      {inlineImport({ src: counterLogic, selfExecute: true })}
    </article>
  );
}

function counterLogic() {
  // 🎯 Vanilla JS counter logic
  const counter = document.querySelector(".light-counter");
  const display = counter.querySelector(".count");
  const btn = counter.querySelector("button");

  let count = 0;
  btn.addEventListener("click", () => {
    count++;
    display.textContent = count;
  });
}
