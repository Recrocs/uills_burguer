// DADOS DO CARDÁPIO
// Quando receber o cardápio real, altere nomes, descrições, fotos e ingredientes aqui.
// Deixe price como null até definir os preços verdadeiros.

const products = [
  {
    id: 1, name: "Classic Burger", category: "hamburguer",
    description: "Pão, hambúrguer artesanal, queijo, alface e molho especial.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80",
    price: null, ingredients: ["Pão", "Hambúrguer artesanal", "Queijo", "Alface", "Molho especial"],
    extras: ["Bacon", "Cheddar", "Cebola caramelizada", "Ovo"]
  },
  {
    id: 2, name: "Cheese Burger", category: "hamburguer",
    description: "Pão, carne artesanal, queijo cheddar e molho da casa.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJe4M_evR3eypdpeWNz1NmCE2Z6tYPYN_uK5gfdR8xCraxvkaaTXjAaa0&s=10",
    price: null, ingredients: ["Pão", "Hambúrguer artesanal", "Cheddar", "Molho da casa"],
    extras: ["Bacon", "Queijo extra", "Cebola", "Alface"]
  },
  {
    id: 3, name: "Bacon Burger", category: "hamburguer",
    description: "Carne artesanal, queijo, bacon crocante e molho especial.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&auto=format&fit=crop&q=80",
    price: null, ingredients: ["Pão", "Hambúrguer artesanal", "Queijo", "Bacon", "Molho especial"],
    extras: ["Cheddar", "Cebola caramelizada", "Ovo", "Alface"]
  },
  {
    id: 4, name: "Batata Frita", category: "acompanhamento",
    description: "Porção de batatas fritas crocantes e deliciosas.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&auto=format&fit=crop&q=80",
    price: null, ingredients: ["Batata", "Sal"], extras: ["Cheddar", "Bacon"]
  },
  {
    id: 5, name: "Batata Especial", category: "acompanhamento",
    description: "Batata frita com cheddar e bacon.",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=700&auto=format&fit=crop&q=80",
    price: null, ingredients: ["Batata", "Cheddar", "Bacon"], extras: ["Catupiry", "Cebola"]
  },
  {
    id: 6, name: "Refrigerante", category: "bebida",
    description: "Uma bebida gelada para acompanhar seu lanche.",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=700&auto=format&fit=crop&q=80",
    price: null, ingredients: [], extras: []
  }
];

// Coloque o telefone depois, com código do país + DDD + número.
// Exemplo de formato: "5511999999999"
const whatsappNumber = "5519997195735";

let selectedProduct = null;
let cart = [];

const productGrid = document.getElementById("productGrid");
const customModal = document.getElementById("customModal");
const cartModal = document.getElementById("cartModal");
const toast = document.getElementById("toast");

function priceText(price) {
  return price === null ? "PREÇO A CONFIRMAR" :
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderProducts(category = "todos") {
  const visibleProducts = products.filter(product =>
    category === "todos" || product.category === category
  );

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-label">${categoryName(product.category)}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${priceText(product.price)}</span>
          <button class="customize-btn" data-customize="${product.id}">PERSONALIZAR +</button>
        </div>
      </div>
    </article>
  `).join("");
}

function categoryName(category) {
  if (category === "hamburguer") return "HAMBÚRGUER";
  if (category === "acompanhamento") return "ACOMPANHAMENTO";
  return "BEBIDA";
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal-backdrop.open")) {
    document.body.classList.remove("modal-open");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function openCustomizer(productId) {
  selectedProduct = products.find(product => product.id === productId);
  if (!selectedProduct) return;

  document.getElementById("customImage").src = selectedProduct.image;
  document.getElementById("customImage").alt = selectedProduct.name;
  document.getElementById("customTitle").textContent = selectedProduct.name;
  document.getElementById("customDescription").textContent = selectedProduct.description;
  document.getElementById("orderObservation").value = "";

  const ingredientList = document.getElementById("ingredientList");
  const allIngredients = [
    ...selectedProduct.ingredients.map(name => ({ name, included: true })),
    ...selectedProduct.extras.map(name => ({ name, included: false }))
  ];

  if (allIngredients.length === 0) {
    ingredientList.innerHTML = "<p class='modal-description'>Este item não possui ingredientes para personalizar.</p>";
  } else {
    ingredientList.innerHTML = allIngredients.map((ingredient, index) => `
      <label class="ingredient-option">
        <input type="checkbox" data-ingredient="${ingredient.name}" ${ingredient.included ? "checked" : ""}>
        <span>${ingredient.name}</span>
      </label>
    `).join("");
  }

  openModal(customModal);
}

function addSelectedToCart() {
  if (!selectedProduct) return;

  const ingredients = [...document.querySelectorAll("#ingredientList input:checked")]
    .map(input => input.dataset.ingredient);
  const observation = document.getElementById("orderObservation").value.trim();

  cart.push({
    cartId: Date.now() + Math.random(),
    productName: selectedProduct.name,
    ingredients,
    observation,
    price: selectedProduct.price
  });

  closeModal(customModal);
  renderCart();
  showToast("Adicionado ao seu pedido! 🍔");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  document.getElementById("cartCount").textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = "<div class='empty-cart'>Seu carrinho está vazio.<br>Que tal escolher um hambúrguer?</div>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.productName}</strong>
        <small>${item.ingredients.length ? item.ingredients.join(", ") : "Sem ingredientes selecionados"}</small>
        ${item.observation ? `<small>Obs.: ${escapeHtml(item.observation)}</small>` : ""}
      </div>
      <button class="remove-item" data-remove="${item.cartId}">REMOVER ×</button>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function checkout() {
  if (cart.length === 0) {
    showToast("Seu carrinho está vazio!");
    return;
  }

  if (!whatsappNumber.trim()) {
    showToast("O WhatsApp ainda precisa ser configurado no script.js.");
    return;
  }

  let message = "Olá! Vim pelo site da Uills Burguer e gostaria de fazer este pedido:\n\n";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.productName}\n`;
    message += `Ingredientes: ${item.ingredients.join(", ") || "Não informado"}\n`;
    if (item.observation) message += `Observação: ${item.observation}\n`;
    message += "\n";
  });
  message += "Podem confirmar os valores e a disponibilidade?";

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// Eventos do cardápio e carrinho
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-customize]");
  if (button) openCustomizer(Number(button.dataset.customize));
});

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(filter => filter.classList.remove("active"));
  button.classList.add("active");
  renderProducts(button.dataset.filter);
});

document.getElementById("addToCart").addEventListener("click", addSelectedToCart);
document.getElementById("openCart").addEventListener("click", () => {
  renderCart();
  openModal(cartModal);
});
document.getElementById("checkoutButton").addEventListener("click", checkout);

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart = cart.filter(item => String(item.cartId) !== button.dataset.remove);
  renderCart();
  showToast("Item removido do pedido.");
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeModal(document.getElementById(button.dataset.close)));
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) closeModal(backdrop);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.open").forEach(closeModal);
  }
});

// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Animações conforme os elementos aparecem na tela
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

// Tela de abertura
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hide");
  }, 1500);
});

// Inicialização
renderProducts();
renderCart();
