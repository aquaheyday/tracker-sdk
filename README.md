# 📦 Tracker.js 설치 및 사용 가이드

이 문서는 광고주가 tracker.js를 이용하여 웹사이트에서 사용자 이벤트를 추적하는 방법을 안내합니다. 이벤트는 자동으로 Kafka로 전송되어 분석 및 리포트에 활용됩니다.

## 📌 설치 방법

1. tracker.js 삽입
```
<!-- CDN으로 tracker.js 로드 -->
<script src="https://cdn.xyzentry.com/tracker.js"></script>

<!-- 광고주의 고유 tracking_key 설정 -->
<script>
  Tracker.init("YOUR_TRACKING_KEY");
</script>
```

YOUR_TRACKING_KEY는 본사에서 발급한 고유 키입니다.

## 🚀 이벤트 전송 방법

✅ 공통 페이지 진입 이벤트
```
Tracker.trackPageView();
```

✅ 상품 상세 페이지 진입
```
Tracker.productView({
  product_code: "P123",
  product_name: "Red T-Shirt",
  product_price: 19000,
  product_dc_price: 15000,
  product_sold_out: false,
  product_image_url: "https://example.com/red.jpg",
  product_brand: "MyBrand",
  product_category_1_code: "100",
  product_category_1_name: "상의",
  product_category_2_code: "110",
  product_category_2_name: "반팔",
  product_category_3_code: "111",
  product_category_3_name: "면",
  product_url: "https://example.com/view/P123
});
```

✅ 장바구니 담기
```
Tracker.addToCart({
  items: [
    {
      product_code: "P123",
      product_name: "Red T-Shirt",
      product_price: 19000,
      product_dc_price: 15000,
      product_sold_out: false,
      product_image_url: "https://example.com/red.jpg",
      product_qty: 2,
      product_brand: "MyBrand",
      product_category_1_code: "100",
      product_category_1_name: "상의",
      product_category_2_code: "110",
      product_category_2_name: "반팔",
      product_category_3_code: "111",
      product_category_3_name: "면",
      product_url: "https://example.com/view/P123
    }
  ],
  total_qty: 2,
  total_price: 30000
});
```

✅ 찜하기 (Wish)
```
Tracker.addToWishlist({
    product_code: "P123",
    product_name: "Red T-Shirt",
    product_price: 19000,
    product_dc_price: 15000,
    product_sold_out: false,
    product_image_url: "https://example.com/red.jpg",
    product_qty: 2,
    product_brand: "MyBrand",
    product_category_1_code: "100",
    product_category_1_name: "상의",
    product_category_2_code: "110",
    product_category_2_name: "반팔",
    product_category_3_code: "111",
    product_category_3_name: "면",
    product_url: "https://example.com/view/P123
});
```

✅ 결제 완료
```
Tracker.purchaseComplete({
  items: [ ...same as addToCart items... ],
  total_qty: 3,
  total_price: 57000
});
```

## 🧠 기술적 설명 (내부적으로 자동 포함됨)

익명 사용자 식별자(anon_id)는 자동 생성되어 브라우저에 저장됩니다.

기기 정보 (브라우저, OS, 언어, 해상도 등) 자동 수집

페이지 정보 (page_url, referrer, timestamp) 자동 수집

전송은 fetch()를 통해 비동기로 이뤄지며, 실패 시 재시도는 하지 않습니다.

## ❓문의 및 지원

SDK 사용 문의: aquaheyday@gmail.com

tracking_key 재발급 요청: 담당 매니저에게 연락

