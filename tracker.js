// tracker.js - 자동 이벤트 수집 SDK + attribution 지원
(function () {
  let TRACKING_KEY = null;
  let currentProduct = null;

  function init(key) {
    TRACKING_KEY = key;
    storeAttributionParams();
    bindAutoEventButtons();
  }

  function setCurrentProduct(product) {
    currentProduct = product;
  }

  function getAnonId() {
    const key = "anon_id";
    let id = localStorage.getItem(key);
    if (!id) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        id = crypto.randomUUID();
      } else {
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      try {
        localStorage.setItem(key, id);
      } catch (e) {
        console.warn("❗ anon_id 저장 실패", e);
      }
    }
    return id;
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      type: /Mobi|Android/i.test(ua) ? "mobile" : "desktop",
      os: /Windows/i.test(ua) ? "Windows" :
          /Mac/i.test(ua) ? "MacOS" :
          /Android/i.test(ua) ? "Android" :
          /iPhone|iPad/i.test(ua) ? "iOS" : "Unknown",
      browser: /Chrome/i.test(ua) ? "Chrome" :
               /Firefox/i.test(ua) ? "Firefox" :
               /Safari/i.test(ua) && !/Chrome/i.test(ua) ? "Safari" :
               /Edge/i.test(ua) ? "Edge" : "Unknown",
      user_agent: ua,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  function storeAttributionParams() {
    const url = new URL(location.href);
    const saved = {
      referrer: document.referrer,
      utm_source: url.searchParams.get("utm_source"),
      utm_campaign: url.searchParams.get("utm_campaign"),
      utm_medium: url.searchParams.get("utm_medium")
    };
    localStorage.setItem("entry_attribution", JSON.stringify(saved));
  }

  function getAttribution() {
    try {
      return JSON.parse(localStorage.getItem("entry_attribution") || "null");
    } catch {
      return null;
    }
  }

  function sendEvent(eventType, payload = {}) {
    if (!TRACKING_KEY) {
      console.warn("⚠️ Tracker.init(tracking_key) 먼저 호출해야 합니다.");
      return;
    }

    const body = {
      tracking_key: TRACKING_KEY,
      anon_id: getAnonId(),
      event_type: eventType,
      common: {
        referrer: document.referrer,
        page_url: location.href,
        page_path: location.pathname,
        timestamp: new Date().toISOString()
      },
      device_info: getDeviceInfo(),
      attribution: getAttribution(),
      ...payload
    };

    fetch("https://xyzentry.com/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).catch(console.error);
  }

  function trackProductView() {
    sendEvent("product_view", { product: currentProduct });
  }

  function trackAddToCart() {
    if (!currentProduct) return;
    sendEvent("add_to_cart", {
      cart: {
        items: [{
          ...currentProduct,
          product_qty: 1
        }],
        total_qty: 1,
        total_price: currentProduct.product_dc_price || currentProduct.product_price
      }
    });
  }

  function trackAddToWishlist() {
    sendEvent("add_to_wishlist", { product: currentProduct });
  }

  function trackPurchaseComplete(cartData) {
    sendEvent("purchase_complete", { cart: cartData });
  }

  function bindAutoEventButtons() {
    window.addEventListener("DOMContentLoaded", () => {
      const cartBtn = document.querySelector(".tracker-add-to-cart");
      if (cartBtn) cartBtn.addEventListener("click", trackAddToCart);

      const wishBtn = document.querySelector(".tracker-add-to-wishlist");
      if (wishBtn) wishBtn.addEventListener("click", trackAddToWishlist);
    });
  }

  window.Tracker = {
    init,
    sendEvent,
    setCurrentProduct,
    trackProductView,
    trackAddToCart,
    trackAddToWishlist,
    trackPurchaseComplete
  };
})();
