(function () {
  const siteId = document.currentScript.getAttribute("data-site-id");

  function sendLog(action, itemId) {
    const payload = {
      site_id: siteId,
      user_id: "user_" + Math.floor(Math.random() * 100000),
      action,
      item_id,
      timestamp: new Date().toISOString()
    };

    fetch("https://your-api.com/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  window.MyTracker = { sendLog };
})();
