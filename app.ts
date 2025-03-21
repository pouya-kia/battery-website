/****************************************************
 * app.ts
 * Strictly typed TypeScript for brand/price filtering
 * and sorting. We do not skip any lines here.
 ****************************************************/

/**
 * 1. تعریف اینترفیس Product
 *    تضمین می‌کند که هر محصول دارای فیلدهای لازم با تایپ‌های مشخص است.
 */
interface Product {
  id: number;
  title: string;
  price: number;     // قیمت به ریال
  capacity: number;  // ظرفیت به AH
  brand: string;
  imageUrl: string;
}

/**
 * 2. داده‌های نمونه محصولات.
 *    در برنامه‌های واقعی ممکن است از API داده‌ها را دریافت کنید.
 */
const productsData: Product[] = [
  {
    id: 1,
    title: "باتری مدل 1",
    price: 1000000,
    capacity: 60,
    brand: "برند A",
    imageUrl: "images/product1.jpg",
  },
  {
    id: 2,
    title: "باتری مدل 2",
    price: 2000000,
    capacity: 30,
    brand: "برند B",
    imageUrl: "images/product2.jpg",
  },
  {
    id: 3,
    title: "باتری مدل 3",
    price: 2500000,
    capacity: 45,
    brand: "برند B",
    imageUrl: "images/product3.jpg",
  },
  {
    id: 4,
    title: "باتری مدل 4",
    price: 3000000,
    capacity: 50,
    brand: "برند A",
    imageUrl: "images/product4.jpg",
  },
  // محصولات بیشتر در صورت نیاز
];

/**
 * 3. گرفتن المان‌های DOM مورد نیاز:
 *    - brandFilterSelect: منوی انتخاب برند
 *    - priceRangeInput: اسلایدر قیمت
 *    - priceValueSpan: عنصری برای نمایش مقدار اسلایدر
 *    - productGrid: محلی که کارت‌های محصولات رندر می‌شوند
 *    - sortLinks: هر لینک مرتب‌سازی داخل لیست مرتب‌سازی
 */
const brandFilterSelect = document.querySelector<HTMLSelectElement>("#brand-filter");
const priceRangeInput = document.querySelector<HTMLInputElement>("#price-range");
const priceValueSpan = document.querySelector<HTMLSpanElement>("#price-value");
const productGrid = document.querySelector<HTMLDivElement>(".product-grid");
const sortLinks = document.querySelectorAll<HTMLAnchorElement>(".sort-options li a");

/**
 * 4. متغیر برای نگهداری گزینه مرتب‌سازی انتخاب شده.
 *    این مقدار می‌تواند "asc"، "desc"، "new"، "bestseller"، "discount" و ... باشد.
 *    در ابتدا هیچ مرتب‌سازی اعمال نمی‌شود.
 */
let chosenSortOption: string = "";

/**
 * 5. تابع renderProducts
 *    لیستی از محصولات (آرایه‌ای از Product) را گرفته و درون container مربوطه رندر می‌کند.
 */
function renderProducts(productList: Product[]): void {
  if (!productGrid) return;
  // پاک کردن محتوای قبلی
  productGrid.innerHTML = "";
  // ایجاد کارت برای هر محصول
  productList.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>قیمت: ${product.price.toLocaleString("fa-IR")} ریال</p>
      <p>ظرفیت: ${product.capacity} AH</p>
      <p>برند: ${product.brand}</p>
    `;
    productGrid.appendChild(card);
  });
}

/**
 * 6. تابع applyFiltersAndSort
 *    اعمال فیلترهای برند و قیمت و همچنین مرتب‌سازی انتخاب شده را بر روی آرایه محصولات انجام می‌دهد
 *    و سپس محصولات فیلتر شده را رندر می‌کند.
 */
function applyFiltersAndSort(): void {
  let filteredProducts = [...productsData];

  // 6a. فیلتر بر اساس برند
  if (brandFilterSelect && brandFilterSelect.value !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.brand === brandFilterSelect.value);
  }

  // 6b. فیلتر بر اساس محدوده قیمت
  if (priceRangeInput) {
    const maxPrice = parseInt(priceRangeInput.value, 10) || 10000000;
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
  }

  // 6c. مرتب‌سازی بر اساس گزینه انتخاب شده
  if (chosenSortOption === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (chosenSortOption === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (chosenSortOption === "new") {
    filteredProducts.sort((a, b) => b.id - a.id);
  } else if (chosenSortOption === "bestseller") {
    // "پر فروش ترین": نیاز به فیلد یا منطق فروش واقعی دارد.
    // در حال حاضر هیچ عملی انجام نمی‌دهیم.
  } else if (chosenSortOption === "discount") {
    // "تخفیف دار": به عنوان مثال، محصولات با قیمت کمتر از 2,000,000 ریال.
    filteredProducts = filteredProducts.filter((p) => p.price < 2000000);
  }

  // 6d. رندر محصولات به‌روز شده
  renderProducts(filteredProducts);
}

/**
 * 7. تنظیم Event Listener ها
 */

// وقتی که منوی برند تغییر می‌کند
brandFilterSelect?.addEventListener("change", () => {
  applyFiltersAndSort();
});

// وقتی که اسلایدر قیمت تغییر می‌کند، هم مقدار نمایش داده می‌شود و هم فیلتر اعمال می‌شود
priceRangeInput?.addEventListener("input", () => {
  if (priceValueSpan && priceRangeInput) {
    priceValueSpan.textContent = parseInt(priceRangeInput.value, 10).toLocaleString("fa-IR");
  }
  applyFiltersAndSort();
});

// وقتی که یکی از گزینه‌های مرتب‌سازی کلیک می‌شود
sortLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    chosenSortOption = link.getAttribute("data-sort") || "";
    applyFiltersAndSort();
  });
});

/**
 * 8. رندر اولیه محصولات در هنگام بارگذاری صفحه
 */
renderProducts(productsData);
