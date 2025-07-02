;(function(){
  // 1) 컨테이너 조회
  const container = document.getElementById('recommendation-widget');
  if (!container) return;

  // 2) 설정값 추출
  const apiUrl      = container.dataset.apiUrl;
  const trackingKey = container.dataset.trackingKey;
  const anonId      = container.dataset.anonId;
  const lang        = container.dataset.lang || 'und';
  const topK        = container.dataset.topK || '10';

  // 3) CSS 삽입 (최초 한 번만)
  if (!document.getElementById('recommendation-widget-style')) {
    const style = document.createElement('style');
    style.id = 'recommendation-widget-style';
    style.textContent = `
      #recommendation-widget ul { list-style: none; padding: 0; }
      #recommendation-widget li { display: flex; align-items: center; margin-bottom: 1rem; }
      #recommendation-widget img { width: 80px; height: 80px; object-fit: cover; margin-right: 1rem; }
      #recommendation-widget .info { display: flex; flex-direction: column; }
      #recommendation-widget .name { font-weight: bold; margin-bottom: .5rem; }
      #recommendation-widget .price { color: #e60000; margin-right: .5rem; }
      #recommendation-widget .old-price { text-decoration: line-through; color: #999; }
      #recommendation-widget .meta { font-size: .9rem; color: #555; }
    `;
    document.head.appendChild(style);
  }

  // 4) API 호출
  fetch(`${apiUrl}?tracking_key=${trackingKey}&anon_id=${anonId}&lang=${lang}&top_k=${topK}`)
    .then(r => r.json())
    .then(data => {
      const items = data.recommended_items || [];
      if (!items.length) {
        container.innerHTML = '<p>추천할 상품이 없습니다.</p>';
        return;
      }

      // 5) 마크업 생성
      container.innerHTML = '<ul>' + items.map(item => {
        const soldOutTag = item.product_sold_out
          ? ' <span style="color:red;">(품절)</span>' : '';
        return `
          <li>
            <a href="/products/${item.product_code}">
              <img src="${item.product_image_url}" alt="${item.product_name}">
            </a>
            <div class="info">
              <a class="name" href="/products/${item.product_code}">
                ${item.product_name}${soldOutTag}
              </a>
              <div>
                <span class="price">₩${item.product_dc_price.toLocaleString()}</span>
                <span class="old-price">₩${item.product_price.toLocaleString()}</span>
              </div>
              <div class="meta">
                브랜드: ${item.product_brand}<br>
                카테고리: ${[
                  item.product_category_1_name,
                  item.product_category_2_name,
                  item.product_category_3_name
                ].filter(Boolean).join(' > ')}
              </div>
            </div>
          </li>
        `;
      }).join('') + '</ul>';
    })
    .catch(err => {
      console.error('추천 위젯 에러:', err);
      container.innerHTML = '<p>추천을 불러오는 중 오류가 발생했습니다.</p>';
    });
})();
