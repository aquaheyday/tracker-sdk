;(function(){
  // --- 1) 컨테이너 찾기 ---
  const widget = document.getElementById('recommendation-widget');
  if (!widget) return;

  // --- 2) 동적 스타일 삽입 ---
  const style = document.createElement('style');
  style.textContent = `
    #recommendation-widget {
      position: fixed;
      top: 100px;
      right: 20px;
      width: 300px;
      max-height: 70vh;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      font-family: sans-serif;
      z-index: 1000;
    }
    #recommendation-widget .header {
      padding: 12px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      font-size: 1.1rem;
      font-weight: bold;
      text-align: center;
    }
    #recommendation-widget .list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    #recommendation-widget ul { list-style: none; margin: 0; padding: 0; }
    #recommendation-widget li {
      display: flex;
      margin-bottom: 12px;
    }
    #recommendation-widget img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 8px;
    }
    #recommendation-widget .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    #recommendation-widget .name {
      font-size: 0.95rem;
      font-weight: 500;
      margin-bottom: 4px;
      color: #333;
      text-decoration: none;
    }
    #recommendation-widget .price-block {
      display: flex;
      align-items: baseline;
    }
    #recommendation-widget .current-price {
      font-size: 1rem;
      font-weight: bold;
      color: #e60000;
      margin-right: 6px;
    }
    #recommendation-widget .original-price {
      font-size: 0.85rem;
      color: #999;
      text-decoration: line-through;
    }
    #recommendation-widget .empty,
    #recommendation-widget .error {
      text-align: center;
      color: #666;
      padding: 16px;
    }
    #recommendation-widget .error { color: red; }
  `;
  document.head.appendChild(style);

  // --- 3) 기본 구조 삽입 ---
  widget.innerHTML = `
    <div class="header">추천 상품</div>
    <div class="list">
      <p class="empty">로딩 중…</p>
    </div>
  `;

  // --- 4) 데이터 가져오기 & 렌더링 ---
  const apiUrl      = widget.dataset.apiUrl;
  const trackingKey = widget.dataset.trackingKey;
  const anonId      = widget.dataset.anonId;
  const lang        = widget.dataset.lang || 'und';
  const topK        = widget.dataset.topK || '10';
  const listEl      = widget.querySelector('.list');

  fetch(`${apiUrl}?tracking_key=${trackingKey}&anon_id=${anonId}&lang=${lang}&top_k=${topK}`)
    .then(r => r.json())
    .then(data => {
      const items = data.recommended_items || [];
      if (!items.length) {
        listEl.innerHTML = '<p class="empty">추천할 상품이 없습니다.</p>';
        return;
      }

      listEl.innerHTML = '<ul>' + items.map(item => `
        <li>
          <a href="/products/${item.product_code}">
            <img src="${item.common_protocol}://${item.common_site_domain}${item.product_image_url}" alt="${item.product_name}">
          </a>
          <div class="info">
            <a class="name" href="/products/${item.product_code}">
              ${item.product_name}
            </a>
            <div class="price-block">
              <span class="current-price">₩${item.product_dc_price.toLocaleString()}</span>
              <span class="original-price">₩${item.product_price.toLocaleString()}</span>
            </div>
          </div>
        </li>
      `).join('') + '</ul>';
    })
    .catch(err => {
      console.error('추천 위젯 에러:', err);
      listEl.innerHTML = '<p class="error">오류가 발생했습니다.</p>';
    });
})();
