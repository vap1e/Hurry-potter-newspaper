document.addEventListener("DOMContentLoaded", () => {

  /* 導入 */
  const intro = document.getElementById("intro");

  setTimeout(() => {
    intro.classList.add("hidden");
  }, 2000);

  /* スクロール表示 */
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  });

  reveals.forEach(el => observer.observe(el));

  /* 動画再生 */
  const videos = document.querySelectorAll(".auto-video");

  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  });

  videos.forEach(v => videoObserver.observe(v));

  /* 見出し変化 */
  const headline = document.querySelector(".hero__headline");

  const texts = [
    "見出し！！！",
    "動く写真",
    "魔法新聞",
    "内容が変わる",
    "それ本当に同じ？"
  ];

  let i = 0;

  setInterval(() => {
    headline.classList.add("is-changing");

    setTimeout(() => {
      i = (i + 1) % texts.length;
      headline.textContent = texts[i];
      headline.classList.remove("is-changing");
    }, 500);

  }, 6000);

});
