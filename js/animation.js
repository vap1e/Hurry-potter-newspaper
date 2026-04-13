document.addEventListener("DOMContentLoaded", () => {
  const revealBlocks = document.querySelectorAll(".reveal");
  const videos = document.querySelectorAll(".auto-video");

  revealBlocks.forEach((block, index) => {
    const rect = block.getBoundingClientRect();

    if (rect.top < window.innerHeight - 40) {
      block.classList.add("is-visible");
    } else {
      block.style.transitionDelay = `${index * 0.06}s`;
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 120px 0px",
    }
  );

  revealBlocks.forEach((block) => {
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
      threshold: 0.35,
    }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    videoObserver.observe(video);
  });
});    (entries) => {
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
      threshold: 0.35,
    }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    videoObserver.observe(video);
  });
});
