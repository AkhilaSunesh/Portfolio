/* ============================================
   PORTFOLIO INTERACTIVE JAVASCRIPT
   - Preloader handler
   - Navigation mobile toggle & smooth scroll
   - Number counting animation (Anime.js)
   - Profile Photo upload & drag/drop preview
   - Video URL prompt & embed handler
   - Projects live search & category filtering
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initMobileNav();
  initAnimeAnimations();
  initGSAPAnimations();
  initVideoPlaceholder();
  initProfilePlaceholder();
  initProjectsFilter();
});

/* ============================================
   1. PRELOADER DISMISS
   ============================================ */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  function hidePreloader() {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 450);
  }

  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 350);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hidePreloader, 350);
    });
    setTimeout(hidePreloader, 1000); // Fail-safe
  }
}

/* ============================================
   2. MOBILE NAVIGATION TOGGLE
   ============================================ */
function initMobileNav() {
  const toggleBtn = document.getElementById("navToggle");
  const mainNav = document.getElementById("main-nav");

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
      });
    });
  }
}

/* ============================================
   3. ANIME.JS STAT COUNTERS & GLOW
   ============================================ */
function initAnimeAnimations() {
  if (typeof anime === "undefined") return;

  // Ambient glow pulse
  anime({
    targets: ".placeholder-glow",
    scale: [0.9, 1.15],
    opacity: [0.4, 0.75],
    duration: 3500,
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
  });

  // Animated Number Counting for Hero Stats
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  statNumbers.forEach(stat => {
    const targetVal = parseInt(stat.getAttribute("data-target"), 10);
    if (!isNaN(targetVal)) {
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: targetVal,
        round: 1,
        duration: 1500,
        easing: "easeOutExpo",
        update: () => {
          if (targetVal < 100) {
            stat.textContent = `${obj.val}+`;
          } else {
            stat.textContent = `${obj.val}`;
          }
        },
      });
    }
  });
}

/* ============================================
   4. SAFE GSAP ENTRANCE
   ============================================ */
function initGSAPAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.from(".hero-content", { y: 20, duration: 0.8, ease: "power2.out" });
  gsap.from(".profile-card-frame", { y: 20, duration: 0.8, ease: "power2.out", delay: 0.1 });
}

/* ============================================
   5. VIDEO PLACEHOLDER & NEW TAB HANDLER
   ============================================ */
function initVideoPlaceholder() {
  const videoFrame = document.getElementById("videoPlaceholderFrame");
  const newTabBtn = document.getElementById("videoOpenNewTabBtn");
  if (!videoFrame) return;

  let currentVideoUrl = "https://www.youtube.com";

  videoFrame.addEventListener("click", () => {
    const videoUrl = prompt(
      "🎥 Insert Video Link:\nEnter a YouTube embed URL, Vimeo link, or MP4 file URL:\n\n(e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)"
    );

    if (videoUrl && videoUrl.trim() !== "") {
      const trimmedUrl = videoUrl.trim();
      currentVideoUrl = trimmedUrl;

      if (newTabBtn) {
        newTabBtn.href = currentVideoUrl;
      }

      if (trimmedUrl.includes("youtube.com") || trimmedUrl.includes("youtu.be") || trimmedUrl.includes("vimeo.com")) {
        videoFrame.innerHTML = `
          <iframe 
            src="${trimmedUrl}" 
            title="Video Demonstration" 
            style="width: 100%; height: 100%; border: 0;" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        `;
      } else {
        videoFrame.innerHTML = `
          <video controls autoplay style="width: 100%; height: 100%; object-fit: cover;">
            <source src="${trimmedUrl}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        `;
      }
    }
  });
}

/* ============================================
   6. PROFILE IMAGE PLACEHOLDER & UPLOAD HANDLER
   ============================================ */
function initProfilePlaceholder() {
  const photoBox = document.getElementById("profilePhotoBox");
  const fileInput = document.getElementById("heroImageInput");
  const uploadTrigger = document.getElementById("uploadTriggerBtn");
  const placeholderContent = document.getElementById("placeholderContent");
  const uploadedImageWrap = document.getElementById("uploadedImageWrap");
  const displayedImg = document.getElementById("displayedHeroImg");
  const changeBtn = document.getElementById("changePhotoBtn");

  if (!photoBox || !fileInput) return;

  function loadFile(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => {
        displayedImg.src = e.target.result;
        if (placeholderContent) placeholderContent.style.display = "none";
        if (uploadedImageWrap) uploadedImageWrap.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }

  if (uploadTrigger) {
    uploadTrigger.addEventListener("click", e => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", e => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  });

  photoBox.addEventListener("dragover", e => {
    e.preventDefault();
    photoBox.classList.add("drag-over");
  });

  photoBox.addEventListener("dragleave", () => {
    photoBox.classList.remove("drag-over");
  });

  photoBox.addEventListener("drop", e => {
    e.preventDefault();
    photoBox.classList.remove("drag-over");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  });
}

/* ============================================
   7. PROJECTS PAGE FILTER, LIVE SEARCH & CLICK-TO-EXPAND
   ============================================ */
function initProjectsFilter() {
  const searchInput = document.getElementById("projectSearchInput");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("#allProjectsGrid .expandable-project-card");

  if (!projectCards.length) return;

  // Initialize click-to-expand cards
  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const isExpanded = card.classList.toggle("is-expanded");
      const btnSpan = card.querySelector(".btn-preview-project span");
      if (btnSpan) {
        btnSpan.textContent = isExpanded ? "Hide Details" : "View Details";
      }
    });

    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  let currentCategory = "all";
  let searchQuery = "";

  function applyFilter() {
    projectCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category") || "";
      const cardTitle = (card.getAttribute("data-title") || "").toLowerCase();
      const cardText = card.textContent.toLowerCase();

      const matchesCategory =
        currentCategory === "all" || cardCategory.toLowerCase() === currentCategory.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        cardTitle.includes(searchQuery) ||
        cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category") || "all";
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilter();
    });
  }
}
