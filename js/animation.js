document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".block");
  const videos = document.querySelectorAll(".auto-video");

  blocks.forEach((block, index) => {
    const rect = block.getBoundingClientRect();

    // 最初から画面内にある要素は即表示
    if (rect.top < window.innerHeight - 40) {
      block.classList.add("is-visible");
    } else {
      block.style.transitionDelay = `${index * 0.06}s`;
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  blocks.forEach((block) => {
    if (!block.classList.contains("is-visible")) {
      revealObserver.observe(block);
    }
  });

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.45,
    }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    videoObserver.observe(video);
  });
});
