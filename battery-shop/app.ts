/********************************************************************
 * app.ts
 * توضیحات مهم:
 *  - یک آرایه از محصولات داریم (productsData).
 *  - با تغییر Select برند یا اسلایدر قیمت، تابع applyFiltersAndRender() صدا می‌شود
 *    و محصولات مطابق فیلتر دوباره نشان داده می‌شوند.
 *  - با کلیک روی لینک‌های مرتب‌سازی نیز همین تابع صدا می‌شود.
 *  - تابع renderProducts() مسئول ساخت کارت محصولات در DOM است.
 *  - برای استفاده در مرورگر باید این فایل را با tsc کامپایل کرده و خروجی را
 *    به صورت app.js در کنار index.html قرار دهید.
 ********************************************************************/

// تعریف یک نوع تایپ‌اسکریپتی برای محصول
interface Product {
  id: number;
  title: string;
  price: number;     // قیمت
  capacity: number;  // مثلاً آمپرساعت باتری
  brand: string;     // برند
  imageUrl: string;  // مسیر تصویر
}

// آرایه ثابت محصولات به‌عنوان نمونه
const productsData: Product[] = [
  {
    id: 1,
    title: "باتری مدل 1",
    price: 1000000,
    capacity: 60,
    brand: "brandA",
    imageUrl: "/images-compressed/product1.jpg"
  },
  {
    id: 2,
    title: "باتری مدل 2",
    price: 2000000,
    capacity: 30,
    brand: "brandB",
    imageUrl: "/images-compressed/product2.jpg"
  },
  {
    id: 3,
    title: "باتری مدل 3",
    price: 2500000,
    capacity: 45,
    brand: "brandB",
    imageUrl: "/images-compressed/product3.jpg"
  },
  {
    id: 4,
    title: "باتری مدل 4",
    price: 3000000,
    capacity: 50,
    brand: "brandA",
    imageUrl: "/images-compressed/product4.jpg"
  }
  // در صورت نیاز محصولات بیشتری اضافه کنید
];

// متغیرهایی برای نگهداری مقدار فیلتر و مرتب‌سازی
let currentBrandFilter: string = "all";
let currentMaxPrice: number = 0;
let currentSortType: string = "";

/**
 * تابعی برای رندر کردن آرایه محصولات در .product-grid
 * @param products آرایه محصولاتی که باید نمایش داده شوند
 */
function renderProducts(products: Product[]): void {
  const productGrid: HTMLElement | null = document.querySelector(".product-grid");
  if (!productGrid) return;

  // ابتدا محتوای قبلی را پاک می‌کنیم
  productGrid.innerHTML = "";

  // هر محصول را به شکل یک کارت ایجاد و اضافه می‌کنیم
  products.forEach((product) => {
    const cardDiv: HTMLDivElement = document.createElement("div");
    cardDiv.className = "product-card";

    // محتوای HTML داخل کارت
    cardDiv.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>قیمت: ${product.price.toLocaleString()} ریال</p>
      <p>ظرفیت: ${product.capacity} AH</p>
      <p>برند: ${product.brand}</p>
    `;

    // در نهایت کارت را به grid اضافه می‌کنیم
    productGrid.appendChild(cardDiv);
  });
}

/**
 * تابعی که بر اساس فیلترها (برند، قیمت) و مرتب‌سازی
 * محصولات را فیلتر، مرتب و سپس رندر می‌کند.
 */
function applyFiltersAndRender(): void {
  let filteredProducts = [...productsData]; // کپی از محصولات

  // 1) فیلتر برند (brand)
  if (currentBrandFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand === currentBrandFilter
    );
  }

  // 2) فیلتر قیمت
  if (currentMaxPrice > 0) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= currentMaxPrice
    );
  }

  // 3) مرتب‌سازی
  if (currentSortType === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (currentSortType === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (currentSortType === "new") {
    // مرتب‌سازی ساده فرضی بر اساس شناسه (id)
    filteredProducts.sort((a, b) => b.id - a.id);
  } else if (currentSortType === "bestseller") {
    // اینجا می‌توانید منطق پر فروش‌ترین‌ها را بگذارید
    // در حال حاضر صرفاً هیچ تغییری نمی‌دهیم
  } else if (currentSortType === "discount") {
    // اگر محصولات تخفیف‌دار داشتید اینجا مرتب کنید
    // فعلاً placeholder
  }

  // 4) رندر نهایی
  renderProducts(filteredProducts);
}

/**
 * آماده‌سازی DOM
 */
window.addEventListener("DOMContentLoaded", () => {
  const brandFilterSelect: HTMLSelectElement | null = document.querySelector("#brand-filter");
  const priceRangeInput: HTMLInputElement | null = document.querySelector("#price-range");
  const priceValueSpan: HTMLElement | null = document.querySelector("#price-value");
  const productGrid: HTMLElement | null = document.querySelector(".product-grid");
  const sortLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".sort-options li a");

  // مقدار پیش‌فرض: maxPrice = 0 یعنی بدون محدودیت
  currentMaxPrice = 0;

  // رندر اولیه محصولات (بدون فیلتر)
  renderProducts(productsData);

  // رویداد تغییر برند
  if (brandFilterSelect) {
    brandFilterSelect.addEventListener("change", () => {
      currentBrandFilter = brandFilterSelect.value;
      applyFiltersAndRender();
    });
  }

  // رویداد تغییر قیمت
  if (priceRangeInput && priceValueSpan) {
    // هنگام بارگذاری مقدار شروع را 0 نمایش می‌دهیم
    priceValueSpan.textContent = priceRangeInput.value;

    priceRangeInput.addEventListener("input", () => {
      // بروزرسانی محدوده قیمت در UI
      priceValueSpan.textContent = priceRangeInput.value;
      // تبدیل مقدار string به number
      currentMaxPrice = Number(priceRangeInput.value);
      applyFiltersAndRender();
    });
  }

  // مرتب‌سازی بر اساس لینک‌های موجود
  sortLinks.forEach((link) => {
    link.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      const targetLink = e.currentTarget as HTMLAnchorElement;
      // نوع مرتب‌سازی
      currentSortType = targetLink.dataset.sort || "";
      applyFiltersAndRender();
    });
  });
});
