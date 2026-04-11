document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".block");
  const videos = document.querySelectorAll(".auto-video");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  blocks.forEach((block, index) => {
    block.style.transitionDelay = `${index * 0.08}s`;
    revealObserver.observe(block);
  });

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // 自動再生が制限された場合でもエラーで止まらないようにする
            });
          }
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    videoObserver.observe(video);
  });
});
