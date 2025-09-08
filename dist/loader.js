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
        <h3 style="color: #007bff; margin-bottom: 20px;">${config.props.title || "Produtos Recomendados"}</h3>
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
          container.insertAdjacentElement("afterend", shelfElement);
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
      var _a, _b, _c, _d, _e, _f;
      const products = apiData.products || [];
      if (products.length === 0) {
        container.querySelector(".shelf-content").innerHTML = `
        <p>Nenhum produto encontrado.</p>
      `;
        return;
      }
      const gridColumns = ((_c = (_b = (_a = config.props) == null ? void 0 : _a.grid) == null ? void 0 : _b.desktop) == null ? void 0 : _c.columns) || 4;
      const gridSpacing = ((_f = (_e = (_d = config.props) == null ? void 0 : _d.grid) == null ? void 0 : _e.desktop) == null ? void 0 : _f.spacing) || 24;
      container.querySelector(".shelf-content").innerHTML = `
      <div class="products-grid" style="
        display: grid;
        grid-template-columns: repeat(${gridColumns}, 1fr);
        gap: ${gridSpacing}px;
        margin-top: 20px;
      ">
        ${products.map((product, index) => {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h;
        return `
          <div class="product-card" style="
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            cursor: pointer;
          " onclick="handleProductClick('${product.productId}', '${product.productName}', ${((_b2 = (_a2 = product.priceRange) == null ? void 0 : _a2.sellingPrice) == null ? void 0 : _b2.lowPrice) || 0})">
            <div class="product-image" style="
              width: 100%;
              height: 200px;
              background: #f8f9fa;
              border-radius: 4px;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #666;
            ">
              ${((_d2 = (_c2 = product.images) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.imageUrl) ? `<img src="${product.images[0].imageUrl}" alt="${product.productName}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : "Sem imagem"}
            </div>
            <h3 class="product-name" style="
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #333;
              line-height: 1.3;
            ">${product.productName}</h3>
            <div class="product-price" style="
              font-size: 18px;
              font-weight: bold;
              color: #2c5aa0;
              margin-bottom: 12px;
            ">R$ ${(((_f2 = (_e2 = product.priceRange) == null ? void 0 : _e2.sellingPrice) == null ? void 0 : _f2.lowPrice) || 0).toFixed(2)}</div>
            <button class="add-to-cart-btn" style="
              width: 100%;
              padding: 8px 16px;
              background: #2c5aa0;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            " onclick="event.stopPropagation(); handleAddToCart('${product.productId}', '${product.productName}', ${((_h = (_g = product.priceRange) == null ? void 0 : _g.sellingPrice) == null ? void 0 : _h.lowPrice) || 0})">
              Adicionar ao Carrinho
            </button>
          </div>
        `;
      }).join("")}
      </div>
    `;
      const style = document.createElement("style");
      style.textContent = `
      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
    `;
      document.head.appendChild(style);
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
