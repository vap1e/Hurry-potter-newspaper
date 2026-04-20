document.addEventListener("DOMContentLoaded", () => {
  const revealBlocks = document.querySelectorAll(".reveal");
  const videos = document.querySelectorAll(".auto-video");
  const pageStack = document.getElementById("pageStack");
  const archivePanel = document.getElementById("archivePanel");
  const archiveTrigger = document.getElementById("archiveTrigger");
  const archiveClose = document.getElementById("archiveClose");
  const pageReturnTab = document.getElementById("pageReturnTab");
  const archiveIssues = document.querySelectorAll(".archive-issue");

  const featureDate = document.getElementById("featureDate");
  const featureEdition = document.getElementById("featureEdition");
  const featureHeadline = document.getElementById("featureHeadline");
  const featureSubhead = document.getElementById("featureSubhead");
  const featureText = document.getElementById("featureText");
  const featureThumb = document.getElementById("featureThumb");

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

  function safePlay(video) {
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function clearVideoRestart(video) {
    if (video._restartTimeout) {
      clearTimeout(video._restartTimeout);
      video._restartTimeout = null;
    }
  }

  function resetVideoWaiting(video) {
    clearVideoRestart(video);
    video._waiting = false;
  }

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video._inView = true;

          if (video.ended) {
            video.currentTime = 0;
          }

          if (!video._waiting) {
            safePlay(video);
          }
        } else {
          video._inView = false;
          video.pause();
          resetVideoWaiting(video);
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "metadata";

    video._inView = false;
    video._waiting = false;
    video._restartTimeout = null;

    video.addEventListener("ended", () => {
      video._waiting = true;
      clearVideoRestart(video);

      video._restartTimeout = setTimeout(() => {
        video._restartTimeout = null;
        video._waiting = false;

        if (!video._inView) return;

        video.currentTime = 0;
        safePlay(video);
      }, 2000);
    });

    video.addEventListener("play", () => {
      if (!video.ended) {
        clearVideoRestart(video);
        video._waiting = false;
      }
    });

    video.addEventListener("seeking", () => {
      clearVideoRestart(video);
    });

    video.addEventListener("loadeddata", () => {
      if (video._inView && !video._waiting) {
        safePlay(video);
      }
    });

    videoObserver.observe(video);
  });

  function syncVisibleVideos() {
    videos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const visible =
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.width > 0 &&
        rect.height > 0;

      if (!visible) {
        video._inView = false;
        video.pause();
        resetVideoWaiting(video);
        return;
      }

      video._inView = true;

      if (video.ended) {
        video.currentTime = 0;
      }

      if (!video._waiting) {
        safePlay(video);
      }
    });
  }

  function setArchiveState(isOpen) {
    if (!pageStack || !archivePanel || !archiveTrigger) return;

    pageStack.classList.toggle("is-open", isOpen);
    archivePanel.setAttribute("aria-hidden", String(!isOpen));
    archiveTrigger.setAttribute("aria-expanded", String(isOpen));

    requestAnimationFrame(() => {
      requestAnimationFrame(syncVisibleVideos);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildHeadlineMarkup(headline) {
    const raw = (headline || "").trim();
    if (!raw) return "";

    const exactMap = {
      "FOREST OF TEN HUES": ["FOREST OF", "TEN HUES"],
      "THE BOY WHO LIES?": ["THE BOY WHO", "LIES?"],
      "CASTLE IN THE MIST": ["CASTLE IN THE", "MIST"],
    };

    if (exactMap[raw]) {
      const [top, main] = exactMap[raw];
      return `
        <span class="headline-top">${escapeHtml(top)}</span>
        <span class="headline-main">${escapeHtml(main)}</span>
      `;
    }

    const words = raw.split(/\s+/);

    if (words.length <= 2) {
      return `<span class="headline-main">${escapeHtml(raw)}</span>`;
    }

    const mid = Math.ceil(words.length / 2);
    const top = words.slice(0, mid).join(" ");
    const main = words.slice(mid).join(" ");

    return `
      <span class="headline-top">${escapeHtml(top)}</span>
      <span class="headline-main">${escapeHtml(main)}</span>
    `;
  }

  function updateFeature(issue) {
    if (!issue) return;

    archiveIssues.forEach((item) => item.classList.remove("is-current"));
    issue.classList.add("is-current");

    if (featureDate) {
      featureDate.textContent = issue.dataset.date || "";
    }

    if (featureEdition) {
      featureEdition.textContent = issue.dataset.edition || "";
    }

    if (featureHeadline) {
      featureHeadline.innerHTML = buildHeadlineMarkup(issue.dataset.headline || "");
    }

    if (featureSubhead) {
      featureSubhead.textContent = issue.dataset.subhead || "";
    }

    if (featureText) {
      featureText.textContent = issue.dataset.text || "";
    }

    if (featureThumb) {
      featureThumb.textContent = issue.dataset.thumb || "VOL.";
    }
  }

  if (archiveTrigger) {
    archiveTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = pageStack.classList.contains("is-open");
      setArchiveState(!isOpen);
    });
  }

  if (archiveClose) {
    archiveClose.addEventListener("click", (event) => {
      event.stopPropagation();
      setArchiveState(false);
    });
  }

  if (pageReturnTab) {
    pageReturnTab.addEventListener("click", (event) => {
      event.stopPropagation();
      setArchiveState(false);
    });
  }

  archiveIssues.forEach((issue) => {
    issue.addEventListener("click", (event) => {
      event.stopPropagation();
      updateFeature(issue);

      requestAnimationFrame(() => {
        requestAnimationFrame(syncVisibleVideos);
      });
    });
  });

  if (archivePanel) {
    archivePanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("click", (event) => {
    if (!pageStack) return;
    if (!pageStack.contains(event.target)) {
      setArchiveState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setArchiveState(false);
    }
  });

  window.addEventListener("pageshow", () => {
    syncVisibleVideos();
  });

  window.addEventListener("focus", () => {
    syncVisibleVideos();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach((video) => {
        video.pause();
        resetVideoWaiting(video);
      });
    } else {
      syncVisibleVideos();
    }
  });

  const initialIssue =
    document.querySelector(".archive-issue.is-current") || archiveIssues[0];
  updateFeature(initialIssue);
  syncVisibleVideos();
});
