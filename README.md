// 공통 페이지 진입
Tracker.sendEvent("page_view");

// 상품 상세 진입
Tracker.sendEvent("product_view", {
  product: {
    product_code: "P123",
    product_name: "Red T-Shirt",
    product_price: 19000,
    product_dc_price: 15000,
    product_sold_out: false,
    product_image_url: "https://example.com/red.jpg",
    brand: "MyBrand",
    product_first_category: "상의",
    product_second_category: "반팔",
    product_third_category: "면"
  }
});

// 장바구니 담기
Tracker.sendEvent("add_to_cart", {
  cart: {
    items: [...],
    total_qty: 3,
    total_price: 57000
  }
});

// 찜하기
Tracker.sendEvent("add_to_wishlist", {
  product: { ... }
});

// 결제 완료
Tracker.sendEvent("purchase_complete", {
  cart: {
    items: [...],
    total_qty: 3,
    total_price: 57000
  }
});
