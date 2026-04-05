(() => {
  const ENABLED_KEY = "byebyeshorts_enabled";
  const HIDDEN_CLASS = "byebyeshorts-hidden";
  const PROCESSED_ATTR = "data-byebyeshorts";

  const SHORTS_SELECTORS = [
    "ytd-rich-shelf-renderer[is-shorts]",
    "ytd-reel-shelf-renderer",
    'ytd-guide-entry-renderer a[title="Shorts"]',
    'ytd-mini-guide-entry-renderer a[title="Shorts"]',
    "ytd-reel-shelf-renderer[is-search]",
    'yt-tab-shape[tab-title="Shorts"]',
    'tp-yt-paper-tab:has(> div:contains("Shorts"))',
    'a[href="/shorts"]',
    'ytd-notification-renderer a[href*="/shorts/"]',
  ];

  const SHORTS_LINK_SELECTORS = [
    "ytd-grid-video-renderer",
    "ytd-video-renderer",
    "ytd-rich-item-renderer",
    "ytd-compact-video-renderer",
  ];

  let enabled = true;
  let observer = null;

  function hideElement(el) {
    if (!el || el.getAttribute(PROCESSED_ATTR)) return;
    el.setAttribute(PROCESSED_ATTR, "true");
    el.classList.add(HIDDEN_CLASS);
  }

  function showElement(el) {
    if (!el) return;
    el.removeAttribute(PROCESSED_ATTR);
    el.classList.remove(HIDDEN_CLASS);
  }

  function isShortsThumbnailLink(el) {
    const link = el.querySelector(
      'a#thumbnail[href*="/shorts/"], a.shortsLockupViewModelHostEndpoint[href*="/shorts/"]'
    );
    return !!link;
  }

  function removeShorts() {
    if (!enabled) return;

    for (const selector of SHORTS_SELECTORS) {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          if (el.closest("ytd-guide-entry-renderer")) {
            hideElement(el.closest("ytd-guide-entry-renderer"));
          } else if (el.closest("ytd-mini-guide-entry-renderer")) {
            hideElement(el.closest("ytd-mini-guide-entry-renderer"));
          } else {
            hideElement(el);
          }
        });
      } catch (_) {}
    }

    for (const selector of SHORTS_LINK_SELECTORS) {
      document.querySelectorAll(selector).forEach((el) => {
        if (isShortsThumbnailLink(el)) {
          hideElement(el);
        }
      });
    }
  }

  function restoreShorts() {
    document.querySelectorAll(`[${PROCESSED_ATTR}]`).forEach(showElement);
  }

  function startObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      if (!enabled) return;

      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
      }

      if (shouldScan) {
        removeShorts();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function init() {
    chrome.storage.local.get(ENABLED_KEY, (result) => {
      enabled = result[ENABLED_KEY] !== false;

      if (enabled) {
        removeShorts();
        startObserver();
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !changes[ENABLED_KEY]) return;

      enabled = changes[ENABLED_KEY].newValue !== false;

      if (enabled) {
        removeShorts();
        startObserver();
      } else {
        stopObserver();
        restoreShorts();
      }
    });
  }

  document.addEventListener("yt-navigate-finish", () => {
    if (enabled) removeShorts();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
