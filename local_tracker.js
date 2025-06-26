// tracker.js - Entry 이벤트 트래커 SDK
(function () {
  let TRACKING_KEY = null;

  function init(key) {
    TRACKING_KEY = key;
    storeAttributionParams();
    bindAutoEventButtons();
  }

  function getAnonId() {
    const key = "anon_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto?.randomUUID?.() || generateUUIDFallback();
      try {
        localStorage.setItem(key, id);
      } catch (e) {
        console.warn("❗ anon_id 저장 실패", e);
      }
    }
    return id;
  }

  function generateUUIDFallback() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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

  function sendEvent(trackingType, data = {}) {
    if (!TRACKING_KEY) {
      console.warn("⚠️ Tracker.init(tracking_key) 먼저 호출해야 합니다.");
      return;
    }

    const body = {
      tracking_key: TRACKING_KEY,
      anon_id: getAnonId(),
      tracking_type: trackingType,
      common: {
        referrer: document.referrer,
        page_url: location.href,
        page_path: location.pathname,
        timestamp: new Date().toISOString()
      },
      device_info: getDeviceInfo(),
      attribution: getAttribution(),
      ...data
    };

    fetch("http://tracker.xyzentry.com/v1/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).catch(console.error);
  }

  // 복수 상품 지원 함수들
  function normalizeProducts(input) {
    if (!input) return [];
    return Array.isArray(input) ? input : [input];
  }

  function trackProductView(products) {
    const list = normalizeProducts(products);
    sendEvent("product_view", { products: list });
  }

  function trackAddToCart(products, qty = 1) {
    const list = normalizeProducts(products);
    const totalQty = qty * list.length;
    const totalPrice = list.reduce((sum, p) => sum + ((p.product_dc_price || p.product_price) || 0) * qty, 0);
    sendEvent("add_to_cart", { products: list, total_qty: totalQty, total_price: totalPrice });
  }

  function trackAddToWishlist(products) {
    const list = normalizeProducts(products);
    sendEvent("add_to_wishlist", { products: list });
  }

  function trackPurchaseComplete(products, totalQty, totalPrice) {
    const list = normalizeProducts(products);
    sendEvent("purchase_complete", { products: list, total_qty: totalQty, total_price: totalPrice });
  }

  function trackSearch(keyword) {
    if (keyword) {
      sendEvent("search", { search_keyword: keyword });
    }
  }

  function bindAutoEventButtons() {
    window.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-tracker='add-to-cart']").forEach(btn => {
        btn.addEventListener("click", () => {
          const raw = btn.getAttribute('data-products');
          const products = raw ? JSON.parse(raw) : null;
          const qty = parseInt(btn.getAttribute('data-qty')) || 1;
          trackAddToCart(products, qty);
        });
      });
      document.querySelectorAll("[data-tracker='add-to-wishlist']").forEach(btn => {
        btn.addEventListener("click", () => {
          const raw = btn.getAttribute('data-products');
          const products = raw ? JSON.parse(raw) : null;
          trackAddToWishlist(products);
        });
      });
    });
  }

  window.Tracker = {
    init,
    sendEvent,
    trackProductView,
    trackAddToCart,
    trackAddToWishlist,
    trackPurchaseComplete,
    trackSearch
  };
})();
