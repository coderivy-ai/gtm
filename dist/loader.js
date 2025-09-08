var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function() {
  "use strict";
  (function() {
    console.log("🚀 Iniciando ComponentInjector...");
    if (window.ComponentInjector) {
      console.log("⚠️ ComponentInjector já existe");
      return;
    }
    console.log("✅ Inicializando com JavaScript puro...");
    initializeComponentInjector();
    function initializeComponentInjector() {
      console.log("🔧 Inicializando ComponentInjector...");
      window.ComponentInjector = {
        load: function() {
          console.log("📦 Carregando componentes...");
          if (!window.componentInjectorConfig) {
            console.error("❌ Configuração não encontrada");
            return;
          }
          initializeComponents();
        }
      };
      console.log("✅ ComponentInjector criado");
    }
    function initializeComponents() {
      console.log("🎯 Inicializando componentes...");
      const config = window.componentInjectorConfig;
      if (!config || !config.components) {
        console.error("❌ Configuração de componentes não encontrada");
        return;
      }
      config.components.forEach((component) => {
        if (component.type === "shelf" && component.enabled) {
          console.log("🛍️ Inicializando Shelf...");
          initializeShelf(component);
        }
      });
    }
    function initializeShelf(config) {
      return __async(this, null, function* () {
        var _a, _b;
        console.log("🛍️ Inicializando Shelf com config:", config);
        const container = document.querySelector(config.selector);
        if (!container) {
          console.error("❌ Container não encontrado:", config.selector);
          return;
        }
        console.log("✅ Container encontrado:", container);
        const shelfElement = document.createElement("div");
        shelfElement.className = "shelf-container";
        shelfElement.innerHTML = `
      <div style="padding: 20px; border: 2px solid #007bff; border-radius: 8px; margin: 20px 0;">
        <div class="shelf-content" style="text-align: center; padding: 40px;">
          <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
          <p style="color: #666; font-size: 16px;">Carregando produtos...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
        if (config.props.containerPosition === "after") {
          const recommendationsElement = document.querySelector(".recommendations.bg-mainBg");
          const newReleaseElement = document.querySelector(".new-release.bg-mainBg");
          if (recommendationsElement) {
            console.log("📍 Inserindo após recommendations");
            recommendationsElement.insertAdjacentElement("afterend", shelfElement);
          } else if (newReleaseElement) {
            console.log("�� Inserindo após new-release");
            newReleaseElement.insertAdjacentElement("afterend", shelfElement);
          } else {
            console.log("📍 Inserindo após container original");
            container.insertAdjacentElement("afterend", shelfElement);
          }
        } else {
          container.appendChild(shelfElement);
        }
        try {
          console.log("🔄 Carregando produtos da API...");
          const apiResponse = yield fetch("https://gol0qozv97.execute-api.us-east-1.amazonaws.com/qa/products/popular/shopwake", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "8QD7vDvrOn1D6goXfc5xg7p7OYNc71Tr7YI59xaI"
            },
            body: JSON.stringify({
              page: 1,
              perPage: ((_a = config.props) == null ? void 0 : _a.maxItems) || 12,
              products: [],
              browserId: generateBrowserId(),
              documentType: "cpf",
              customerDocument: generateCustomerDocument(),
              filterAlreadyBought: ((_b = config.props) == null ? void 0 : _b.excludeViewed) || false
            })
          });
          if (!apiResponse.ok) {
            throw new Error(`API request failed: ${apiResponse.status}`);
          }
          const apiData = yield apiResponse.json();
          console.log("✅ Produtos carregados:", apiData);
          renderProducts(shelfElement, apiData, config);
        } catch (error) {
          console.error("❌ Erro ao carregar produtos:", error);
          shelfElement.querySelector(".shelf-content").innerHTML = `
        <p style="color: #e74c3c;">Erro ao carregar produtos. Tente novamente mais tarde.</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar
        </button>
      `;
        }
        console.log("✅ Shelf JavaScript puro inicializado!");
      });
    }
    function renderProducts(container, apiData, config) {
      var _a;
      const products = apiData.products || [];
      if (products.length === 0) {
        container.querySelector(".shelf-content").innerHTML = `
        <p>Nenhum produto encontrado.</p>
      `;
        return;
      }
      const isMobile = window.innerWidth <= 768 || window.matchMedia("(max-width: 768px)").matches;
      console.log("Detecção mobile:", {
        windowWidth: window.innerWidth,
        isMobile
      });
      const template = isMobile ? getMobileTemplate() : getDesktopTemplate();
      const productsHTML = products.map((product, index) => {
        return renderProductCard(product);
      }).join("");
      const shelfHTML = template.replace("{{TITLE}}", ((_a = config.props) == null ? void 0 : _a.title) || "Produtos Recomendados").replace("{{PRODUCTS}}", productsHTML);
      container.querySelector(".shelf-content").innerHTML = shelfHTML;
    }
    function getDesktopTemplate() {
      return `
      <div class="flex flex-col my-4 w-full lg:flex-row lg:justify-center new-release bg-mainBg">
        <div class="flex flex-col items-start w-full lg:max-w-[1330px] px-2 relative">
          <h2 class="w-full text-lg lg:text-2xl uppercase mb-4 pb-4 border-b">
            {{TITLE}}
          </h2>
          <div class="swiffy-slider slider-nav-dark slider-nav-visible slider-nav-autoplay slider-nav-autopause slider-indicators-round slider-indicators-dark slider-indicators-highlight slider-indicators-sm slider-item-show4 slider-item-show2-sm slider-item-snapstart" data-slider-nav-autoplay-interval="5000">
            <div class="slider-container">
              {{PRODUCTS}}
            </div>
            <div>
              <div class="absolute bg-inherit shadow-none rounded-none outline-none p-0 z-10 text-4xl left-auto -top-12 right-16">
                <button type="button" class="slider-nav">
                  <img src="https://coderivy.fbitsstatic.net/sf/img/icons/arrow-left.svg?theme=main&v=202509081621" alt="arrow-left" class="w-6 h-6 m-2" />
                </button>
              </div>
              <div class="absolute bg-inherit shadow-none rounded-none outline-none p-0 z-10 text-4xl left-auto -top-12 right-0">
                <button type="button" class="slider-nav slider-nav-next">
                  <img src="https://coderivy.fbitsstatic.net/sf/img/icons/arrow-right.svg?theme=main&v=202509081621" alt="arrow-right" class="w-6 h-6 m-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    function getMobileTemplate() {
      return `
      <div class="flex flex-col my-4 w-full lg:flex-row lg:justify-center new-release bg-mainBg">
        <div class="flex flex-col items-start w-full lg:max-w-[1330px] px-2 relative">
          <h2 class="w-full text-lg lg:text-2xl uppercase mb-4 pb-4 border-b">
            {{TITLE}}
          </h2>
          <div class="swiffy-slider slider-nav-dark slider-nav-visible slider-nav-autoplay slider-nav-autopause slider-indicators-round slider-indicators-dark slider-indicators-highlight slider-indicators-sm slider-item-show4 slider-item-show2-sm slider-item-snapstart" data-slider-nav-autoplay-interval="5000">
            <div class="slider-container">
              {{PRODUCTS}}
            </div>
            <div>
              <div class="absolute bg-inherit shadow-none rounded-none outline-none p-0 z-10 text-4xl left-auto -top-12 right-16">
                <button type="button" class="slider-nav">
                  <img src="https://coderivy.fbitsstatic.net/sf/img/icons/arrow-left.svg?theme=main&v=202509081621" alt="arrow-left" class="w-6 h-6 m-2" />
                </button>
              </div>
              <div class="absolute bg-inherit shadow-none rounded-none outline-none p-0 z-10 text-4xl left-auto -top-12 right-0">
                <button type="button" class="slider-nav slider-nav-next">
                  <img src="https://coderivy.fbitsstatic.net/sf/img/icons/arrow-right.svg?theme=main&v=202509081621" alt="arrow-right" class="w-6 h-6 m-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    function renderProductCard(product, index, isMobile) {
      var _a, _b, _c, _d, _e, _f;
      const discount = product.listPrice > product.price ? Math.round((product.listPrice - product.price) / product.listPrice * 100) : 0;
      const productSlug = product.productName ? `${product.productName.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}-${product.productId}` : product.productId;
      const mainImage = ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.imageUrl) || product.image;
      const hoverImage = ((_d = (_c = product.images) == null ? void 0 : _c[1]) == null ? void 0 : _d.imageUrl) || ((_f = (_e = product.images) == null ? void 0 : _e[0]) == null ? void 0 : _f.imageUrl) || product.image;
      return `
      <div class="flex flex-col justify-center items-center hover:shadow-xl p-2 mr-2 mb-1 lg:mr-7 lg:last:mr-0 group">
        <div class="flex flex-col relative justify-start items-center lg:w-60 w-full min-h-[530px]">
          <div spot-container="" class="flex justify-center w-full max-h-auto box-content group">
            <a href="/produto/${productSlug}">
              <img src="${mainImage}" alt="Product image" class="w-full group-hover:hidden" fetchpriority="high" width="640" height="360" />
              <img src="${hoverImage}" alt="Product image" class="group-hover:flex hidden" fetchpriority="high" width="640" height="360" />
            </a>
          </div>
          <div class="flex justify-start items-center w-full"></div>
          <div class="flex flex-col justify-between h-full">
            <div class="flex flex-col">
              <a href="/produto/${productSlug}">
                <span class="text-xl my-2 text-[#1E1E1E]">${product.productName}</span>
              </a>
              <div class="stamps d-flex row"></div>
              <div class="text-xl">
                ${product.listPrice > product.price ? `<p class="text-base text-[#1E1E1E]"><s>R$ ${product.listPrice.toFixed(2)}</s></p>` : ""}
                <h2><b>R$ ${product.price.toFixed(2)}</b></h2>
              </div>
              <div>
                <p>ou <b>em 0x de R$ 0,00 com juros</b></p>
              </div>
              ${discount > 0 ? `
                <div class="absolute top-1 left-1 py-1 px-2 rounded-full text-white shadow-xl bg-primary-700 origin-top-right">
                  - ${discount}%
                </div>
              ` : ""}
            </div>
            <div class="flex justify-end">
              <div class="flex justify-between items-center w-full my-3 py-3 lg:group-hover:translate-y-5 lg:translate-y-0 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:duration-500 lg:ease-in-out lg:group-hover:transform">
                <div class="flex flex-col lg:flex-row justify-between items-center w-full">
                  <button add-to-cart-button="" type="button" class="flex items-center justify-center w-full lg:w-2/4 p-2 text-white bg-primary-500 lg:hover:bg-primary-600" value="" onclick="spotAddToCartButtonClick(${product.productId})">
                    <img src="https://coderivy.fbitsstatic.net/sf/img/icons/plus.svg?theme=main&v=202509081621" alt="Add to cart" class="w-6 h-6 mr-2 stroke-white" />
                    Adicionar
                  </button>
                  <button buy-button="" type="button" class="flex items-center justify-center w-full lg:w-2/4 p-2 text-white bg-gray-1000 lg:bg-secondary-500 lg:hover:bg-gray-1000" value="" onclick="spotBuyButtonClick(${product.productId})">
                    <img src="https://coderivy.fbitsstatic.net/sf/img/icons/cart.svg?theme=main&v=202509081621" alt="Buy button" class="w-6 h-6 mr-2" />
                    COMPRAR
                  </button>
                </div>
              </div>
              <div class="absolute top-1 right-1">
                <button type="button" id="wishlist-button-${product.productId}" aria-label="Add to wishlist" alt="wishlist" onclick='wishlistAddClick(this,"${product.productId}")'>
                  <svg class="w-6 h-6" id="wishlist-icon-${product.productId}" width="24" height="24" viewBox="0 0 23 20" fill="none" stroke="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.12825 3.05745C2.67628 3.50942 2.31775 4.04599 2.07314 4.63652C1.82853 5.22705 1.70264 5.85997 1.70264 6.49916C1.70264 7.13834 1.82853 7.77127 2.07314 8.3618C2.31775 8.95233 2.67628 9.4889 3.12825 9.94087L11.4372 18.2499L19.7462 9.94087C20.659 9.02807 21.1718 7.79005 21.1718 6.49916C21.1718 5.20827 20.659 3.97025 19.7462 3.05745C18.8334 2.14465 17.5954 1.63185 16.3045 1.63185C15.0136 1.63185 13.7756 2.14465 12.8628 3.05745L11.4372 4.48302L10.0117 3.05745C9.5597 2.60548 9.02313 2.24695 8.4326 2.00234C7.84207 1.75773 7.20915 1.63184 6.56996 1.63184C5.93078 1.63184 5.29785 1.75773 4.70732 2.00234C4.11679 2.24695 3.58022 2.60548 3.12825 3.05745Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal" id="add-to-cart-modal-${product.productId}" aria-labelledby="addToCartFromSpot" aria-hidden="true">
          <div class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered">
            <div id="add-to-cart-modal-content-${product.productId}"></div>
          </div>
        </div>
      </div>
    `;
    }
    function generateBrowserId() {
      let browserId = localStorage.getItem("browserId");
      if (!browserId) {
        browserId = "browser_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
        localStorage.setItem("browserId", browserId);
      }
      return browserId;
    }
    function generateCustomerDocument() {
      let customerDoc = localStorage.getItem("customerDocument");
      if (!customerDoc) {
        const randomNumbers = Math.floor(Math.random() * 9e8) + 1e8;
        customerDoc = randomNumbers.toString();
        localStorage.setItem("customerDocument", customerDoc);
      }
      return customerDoc;
    }
    window.handleProductClick = function(productId, productName, price) {
      console.log("Product clicked:", { productId, productName, price });
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "product_click",
          ecommerce: {
            click: {
              products: [{
                item_id: productId,
                item_name: productName,
                price,
                quantity: 1
              }]
            }
          }
        });
      }
    };
    window.handleAddToCart = function(productId, productName, price) {
      console.log("Product added to cart:", { productId, productName, price });
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            add: {
              products: [{
                item_id: productId,
                item_name: productName,
                price,
                quantity: 1
              }]
            }
          }
        });
      }
    };
    console.log("✅ Loader carregado");
  })();
})();
//# sourceMappingURL=loader.js.map
