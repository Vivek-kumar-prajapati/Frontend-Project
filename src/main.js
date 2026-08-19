import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const swiper = new Swiper(".mySwiper", {
  modules: [Navigation],
  slidesPerView: 1,
  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
  loop: true,
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");

cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active"),
);

closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active"),
);

let productList = [];
let cartItemList = [];

const updateTotal = () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  document.querySelectorAll(".item").forEach((item) => {
    const priceEl = item.querySelector(".total-item");

    if (!priceEl) return; // skip if not found

    const price = parseFloat(priceEl.textContent.replace("$", ""));

    totalPrice += price;
  });

  document.querySelectorAll(".item").forEach((item) => {
    const quantity1 = item.querySelector(".quantity-value");

    if (!quantity1) return;

    const quantity = parseInt(quantity1.textContent, 10);

    totalQuantity += quantity;
  });
  console.log(typeof totalQuantity);
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

let showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");
    orderCard.innerHTML = ` <div class="card-image">
              <img src="${product.image}" />
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="" class="btn card-btn">Add to Cart</a>
          </div>`;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();

      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));

  const alreadyExistInCart = cartItemList.some(
    (cartItem) => cartItem.id === product.id,
  );

  if (alreadyExistInCart) {
    alert("Item Already Exist");
  } else {
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    cartItem.innerHTML = ` <div class="item-image-container">
                <img src="${product.image}">

              </div>

              <div class="item-detail">

                <h4>${product.name}</h4>
                <h4 class="total-item">${product.price}</h4>
              </div>


              <div class="quantity-container">
                <a href="#" class="quantity-btn"><i class="fa-solid fa-minus minus"></i></a>
                <h4 class="quantity-value">${quantity}</h4>
                <a href="#" class="quantity-btn"><i class="fa-solid fa-plus  plus"></i></a>


              </div>`;

    cartList.appendChild(cartItem);
    cartItemList.push(product);
    updateTotal();

    const plusBtn = cartItem.querySelector(".plus");
    const minusBtn = cartItem.querySelector(".minus");
    const quantityValue = cartItem.querySelector(".quantity-value");
    const totalPrice = cartItem.querySelector(".total-item");

    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      quantity++;
      quantityValue.textContent = quantity;
      totalPrice.textContent = `$${(price * quantity).toFixed(2)}`;
      updateTotal();
    });

    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
        totalPrice.textContent = `$${(price * quantity).toFixed(2)}`;
      } else {
        cartItem.remove();
        cartItemList = cartItemList.filter((item) => item.id !== product.id);
      }
      updateTotal();
    });
  }
};

const initApp = () => {
  fetch("product.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      productList = data;
      showCards();
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

initApp();
