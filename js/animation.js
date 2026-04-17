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

  function setArchiveState(isOpen) {
    if (!pageStack || !archivePanel || !archiveTrigger) return;

    pageStack.classList.toggle("is-open", isOpen);
    archivePanel.setAttribute("aria-hidden", String(!isOpen));
    archiveTrigger.setAttribute("aria-expanded", String(isOpen));
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
      featureHeadline.textContent = issue.dataset.headline || "";
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

  const initialIssue =
    document.querySelector(".archive-issue.is-current") || archiveIssues[0];
  updateFeature(initialIssue);
});