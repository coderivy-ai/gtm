var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
(function(require$$0) {
  "use strict";
  (function() {
    function generateBrowserId2() {
      let browserId = localStorage.getItem("browserId");
      if (!browserId) {
        browserId = "browser_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
        localStorage.setItem("browserId", browserId);
      }
      return browserId;
    }
    function generateCustomerDocument2() {
      let customerDoc = localStorage.getItem("customerDocument");
      if (!customerDoc) {
        const randomNumbers = Math.floor(Math.random() * 9e8) + 1e8;
        customerDoc = randomNumbers.toString();
        localStorage.setItem("customerDocument", customerDoc);
      }
      return customerDoc;
    }
    if (window.ComponentInjector) {
      console.log("ComponentInjector already loaded");
      return;
    }
    const defaultConfig = {
      clientId: "default-client",
      theme: "light",
      position: "bottom-right",
      components: [
        {
          id: "product-shelf",
          type: "shelf",
          selector: "body",
          enabled: true,
          props: {
            title: "Produtos Recomendados",
            maxItems: 12,
            enablePagination: true,
            enableWishlist: true,
            enableRating: true,
            targetSelectors: [
              'section[aria-label="slider"]',
              ".vtex-slider-layout-0-x-sliderLayoutContainer",
              '[data-testid="slider-track"]',
              ".shelf",
              ".product-shelf",
              ".product-carousel",
              ".recommended-products",
              ".related-products",
              ".new-release"
            ],
            containerPosition: "after",
            containerStyles: {
              margin: "20px 0",
              padding: "0 20px"
            },
            grid: {
              mobile: { columns: 2, rows: 2, cardHeight: 300, spacing: 16 },
              tablet: { columns: 3, rows: 2, cardHeight: 300, spacing: 20 },
              desktop: { columns: 4, rows: 2, cardHeight: 300, spacing: 24 },
              superapp: { columns: 2, rows: 3, cardHeight: 250, spacing: 12 }
            }
          }
        }
      ]
    };
    function loadComponentInjector() {
      return __async(this, null, function* () {
        try {
          yield loadDependencies();
          const config = window.componentInjectorConfig || defaultConfig;
          console.log("Loading ComponentInjector with config:", config);
          yield initializeComponentsDirectly(config);
          console.log("ComponentInjector loaded successfully");
        } catch (error) {
          console.error("Failed to load ComponentInjector:", error);
          createFallbackShelf();
        }
      });
    }
    function loadDependencies() {
      return __async(this, null, function* () {
        if (window.React && window.ReactDOM) {
          return;
        }
        if (!window.React) {
          yield loadScript("https://unpkg.com/react@18/umd/react.production.min.js");
        }
        if (!window.ReactDOM) {
          yield loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js");
        }
      });
    }
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    }
    function loadReactComponents() {
      return __async(this, null, function* () {
        try {
          const { Shelf: Shelf2 } = yield Promise.resolve().then(() => Shelf$1);
          const { RecommendationsEngine: RecommendationsEngine2 } = yield Promise.resolve().then(() => RecommendationsEngine$1);
          return { Shelf: Shelf2, RecommendationsEngine: RecommendationsEngine2 };
        } catch (error) {
          console.error("Failed to load React components:", error);
          throw error;
        }
      });
    }
    function initializeComponentsDirectly(config) {
      return __async(this, null, function* () {
        console.log("Initializing components directly...");
        const components = yield loadReactComponents();
        for (const componentConfig of config.components) {
          if (!componentConfig.enabled)
            continue;
          try {
            if (componentConfig.type === "shelf") {
              yield initializeShelf(componentConfig, components.Shelf);
            } else if (componentConfig.type === "recommendations") {
              yield initializeRecommendations(componentConfig, components.RecommendationsEngine);
            }
          } catch (error) {
            console.error(`Failed to initialize component ${componentConfig.id}:`, error);
            if (componentConfig.type === "shelf") {
              yield initializeShelfDirectly(componentConfig);
            }
          }
        }
      });
    }
    function initializeShelf(config, Shelf2) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f;
        let container = document.querySelector(config.selector || "#product-showcase-container");
        if (!container) {
          container = createContainerAutomatically(config.props);
        }
        if (!container) {
          console.error("Could not create container for shelf component");
          return;
        }
        const shelfConfig = {
          title: ((_a = config.props) == null ? void 0 : _a.title) || "Produtos Recomendados",
          maxItems: ((_b = config.props) == null ? void 0 : _b.maxItems) || 12,
          enablePagination: ((_c = config.props) == null ? void 0 : _c.enablePagination) || true,
          enableWishlist: ((_d = config.props) == null ? void 0 : _d.enableWishlist) || true,
          enableRating: ((_e = config.props) == null ? void 0 : _e.enableRating) || true,
          grid: ((_f = config.props) == null ? void 0 : _f.grid) || {
            mobile: { columns: 2, rows: 2, cardHeight: 300, spacing: 16 },
            tablet: { columns: 3, rows: 2, cardHeight: 300, spacing: 20 },
            desktop: { columns: 4, rows: 2, cardHeight: 300, spacing: 24 },
            superapp: { columns: 2, rows: 3, cardHeight: 250, spacing: 12 }
          }
        };
        ReactDOM.render(React.createElement(Shelf2, {
          config: shelfConfig,
          onProductClick: (product) => {
            console.log("Product clicked:", product);
            if (window.dataLayer) {
              window.dataLayer.push({
                event: "product_click",
                ecommerce: {
                  click: {
                    products: [{
                      item_id: product.id,
                      item_name: product.name,
                      price: product.price,
                      quantity: 1
                    }]
                  }
                }
              });
            }
          },
          onAddToCart: (product) => {
            console.log("Product added to cart:", product);
            if (window.dataLayer) {
              window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                  add: {
                    products: [{
                      item_id: product.id,
                      item_name: product.name,
                      price: product.price,
                      quantity: 1
                    }]
                  }
                }
              });
            }
          },
          onAddToWishlist: (product) => {
            console.log("Product added to wishlist:", product);
            if (window.dataLayer) {
              window.dataLayer.push({
                event: "add_to_wishlist",
                ecommerce: {
                  add: {
                    products: [{
                      item_id: product.id,
                      item_name: product.name,
                      price: product.price,
                      quantity: 1
                    }]
                  }
                }
              });
            }
          }
        }), container);
        console.log("Shelf component initialized with React");
      });
    }
    function initializeShelfDirectly(config) {
      return __async(this, null, function* () {
        var _a;
        console.log("Initializing Shelf directly...", config);
        let container = document.getElementById("product-showcase-container");
        if (!container) {
          container = createContainerAutomatically(config.props);
        }
        if (!container) {
          console.error("Could not create container for shelf component");
          return;
        }
        container.innerHTML = `
      <div class="product-showcase" style="margin: 20px 0; padding: 0 20px;">
        <div class="showcase-header" style="margin-bottom: 20px;">
          <h2 class="showcase-title" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">
            ${((_a = config.props) == null ? void 0 : _a.title) || "Produtos Recomendados"}
          </h2>
        </div>
        <div class="showcase-content" style="text-align: center; padding: 40px;">
          <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 20px;">Carregando produtos recomendados...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
        setTimeout(() => {
          loadProductsForShelf(container, config);
        }, 2e3);
        console.log("Shelf component initialized directly");
      });
    }
    function loadProductsForShelf(container, config) {
      return __async(this, null, function* () {
        var _a, _b;
        try {
          console.log("Loading products for shelf...");
          const apiResponse = yield fetch("https://gol0qozv97.execute-api.us-east-1.amazonaws.com/qa/products/popular/shop", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "8QD7vDvrOn1D6goXfc5xg7p7OYNc71Tr7YI59xaI"
            },
            body: JSON.stringify({
              page: 1,
              perPage: ((_a = config.props) == null ? void 0 : _a.maxItems) || 12,
              products: [],
              browserId: generateBrowserId2(),
              documentType: "cpf",
              customerDocument: generateCustomerDocument2(),
              filterAlreadyBought: ((_b = config.props) == null ? void 0 : _b.excludeViewed) || false
            })
          });
          if (!apiResponse.ok) {
            throw new Error(`API request failed: ${apiResponse.status}`);
          }
          const apiData = yield apiResponse.json();
          console.log("API response:", apiData);
          renderProducts(container, apiData, config);
        } catch (error) {
          console.error("Failed to load products:", error);
          container.querySelector(".showcase-content").innerHTML = `
        <p style="color: #e74c3c;">Erro ao carregar produtos. Tente novamente mais tarde.</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar
        </button>
      `;
        }
      });
    }
    function renderProducts(container, apiData, config) {
      var _a, _b, _c, _d, _e, _f;
      const products = apiData.products || [];
      if (products.length === 0) {
        container.querySelector(".showcase-content").innerHTML = `
        <p>Nenhum produto encontrado.</p>
      `;
        return;
      }
      const gridColumns = ((_c = (_b = (_a = config.props) == null ? void 0 : _a.grid) == null ? void 0 : _b.desktop) == null ? void 0 : _c.columns) || 4;
      const gridSpacing = ((_f = (_e = (_d = config.props) == null ? void 0 : _d.grid) == null ? void 0 : _e.desktop) == null ? void 0 : _f.spacing) || 24;
      container.querySelector(".showcase-content").innerHTML = `
      <div class="products-grid" style="
        display: grid;
        grid-template-columns: repeat(${gridColumns}, 1fr);
        gap: ${gridSpacing}px;
        margin-top: 20px;
      ">
        ${products.map((product) => {
        var _a2;
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
          " onclick="handleProductClick('${product.id}', '${product.name}', ${product.price})">
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
              ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : "Sem imagem"}
            </div>
            <h3 class="product-name" style="
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #333;
              line-height: 1.3;
            ">${product.name}</h3>
            <div class="product-price" style="
              font-size: 18px;
              font-weight: bold;
              color: #2c5aa0;
              margin-bottom: 12px;
            ">R$ ${((_a2 = product.price) == null ? void 0 : _a2.toFixed(2)) || "0,00"}</div>
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
            " onclick="event.stopPropagation(); handleAddToCart('${product.id}', '${product.name}', ${product.price})">
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
    function initializeRecommendations(_config, _RecommendationsEngine) {
      return __async(this, null, function* () {
        console.log("RecommendationsEngine initialization not implemented yet");
      });
    }
    function createContainerAutomatically(props) {
      console.log("Container not found, creating automatically...");
      const defaultSelectors = [
        'section[aria-label="slider"]',
        ".vtex-slider-layout-0-x-sliderLayoutContainer",
        '[data-testid="slider-track"]',
        ".shelf",
        ".product-shelf",
        ".product-carousel",
        ".recommended-products",
        ".related-products",
        ".new-release"
      ];
      const customSelectors = props.targetSelectors || [];
      const selectors = customSelectors.length > 0 ? customSelectors : defaultSelectors;
      let targetElement = null;
      for (const selector of selectors) {
        targetElement = document.querySelector(selector);
        if (targetElement) {
          console.log("Found target element:", selector);
          break;
        }
      }
      if (!targetElement) {
        console.log("No target element found, appending to body");
        targetElement = document.body;
      }
      const container = document.createElement("div");
      container.id = "product-showcase-container";
      container.style.cssText = "margin: 20px 0; padding: 0 20px;";
      if (props.containerStyles) {
        for (const prop in props.containerStyles) {
          container.style[prop] = props.containerStyles[prop];
        }
      }
      const position = props.containerPosition || "after";
      if (position === "after") {
        targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
      } else if (position === "before") {
        targetElement.parentNode.insertBefore(container, targetElement);
      } else if (position === "inside") {
        targetElement.appendChild(container);
      }
      console.log("Container created " + position + " target element");
      return container;
    }
    function createFallbackShelf() {
      console.log("Creating fallback shelf...");
      const container = document.getElementById("product-showcase-container") || createContainerAutomatically({
        targetSelectors: [".new-release", "body"],
        containerPosition: "after"
      });
      if (container) {
        container.innerHTML = `
        <div class="product-showcase" style="margin: 20px 0; padding: 0 20px;">
          <div class="showcase-header" style="margin-bottom: 20px;">
            <h2 class="showcase-title" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">
              Produtos Recomendados
            </h2>
          </div>
          <div class="showcase-content" style="text-align: center; padding: 40px;">
            <p>Carregando produtos recomendados...</p>
          </div>
        </div>
      `;
        console.log("Fallback shelf created");
      }
    }
    function loadStyles() {
      if (document.getElementById("component-injector-styles")) {
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://c.usebeon.io/core/css/default.css";
      link.id = "component-injector-styles";
      document.head.appendChild(link);
    }
    window.ComponentInjector = {
      load: loadComponentInjector,
      version: "1.0.0",
      isLoaded: false
    };
    loadStyles();
  })();
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const useDeviceDetection = () => {
    const [deviceInfo, setDeviceInfo] = require$$0.useState({
      type: "desktop",
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isSuperApp: false,
      screenWidth: 0,
      screenHeight: 0,
      orientation: "landscape",
      pixelRatio: 1,
      touchSupport: false,
      userAgent: ""
    });
    require$$0.useEffect(() => {
      const detectDevice = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const userAgent = navigator.userAgent.toLowerCase();
        const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        const pixelRatio = window.devicePixelRatio || 1;
        const orientation = screenWidth > screenHeight ? "landscape" : "portrait";
        let type = "desktop";
        let isMobile = false;
        let isTablet = false;
        let isDesktop = true;
        let isSuperApp = false;
        if (userAgent.includes("micromessenger") || userAgent.includes("wechat")) {
          type = "superapp";
          isSuperApp = true;
          isDesktop = false;
        } else if (screenWidth <= 768 || /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
          if (screenWidth <= 480) {
            type = "mobile";
            isMobile = true;
            isDesktop = false;
          } else {
            type = "tablet";
            isTablet = true;
            isDesktop = false;
          }
        }
        setDeviceInfo({
          type,
          isMobile,
          isTablet,
          isDesktop,
          isSuperApp,
          screenWidth,
          screenHeight,
          orientation,
          pixelRatio,
          touchSupport,
          userAgent
        });
      };
      detectDevice();
      window.addEventListener("resize", detectDevice);
      window.addEventListener("orientationchange", detectDevice);
      return () => {
        window.removeEventListener("resize", detectDevice);
        window.removeEventListener("orientationchange", detectDevice);
      };
    }, []);
    return deviceInfo.type;
  };
  function usePerformanceMetrics() {
    const [state, setState] = require$$0.useState({
      metrics: [],
      isLoading: false,
      error: null
    });
    const startTimeRef = require$$0.useRef(0);
    const metricsRef = require$$0.useRef([]);
    const measureRenderTime = require$$0.useCallback((componentName, renderTime) => {
      const metric = {
        name: `${componentName}_render_time`,
        value: renderTime,
        unit: "ms",
        timestamp: /* @__PURE__ */ new Date(),
        category: "rendering"
      };
      metricsRef.current.push(metric);
      setState((prev) => __spreadProps(__spreadValues({}, prev), {
        metrics: [...metricsRef.current]
      }));
      if (typeof performance !== "undefined" && performance.mark) {
        performance.mark(`${componentName}_render_end`);
        performance.measure(
          `${componentName}_render`,
          `${componentName}_render_start`,
          `${componentName}_render_end`
        );
      }
    }, []);
    const startMeasure = require$$0.useCallback((componentName) => {
      startTimeRef.current = performance.now();
      if (typeof performance !== "undefined" && performance.mark) {
        performance.mark(`${componentName}_render_start`);
      }
    }, []);
    const endMeasure = require$$0.useCallback((componentName) => {
      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;
      measureRenderTime(componentName, duration);
    }, [measureRenderTime]);
    const measureMemoryUsage = require$$0.useCallback(() => {
      if (typeof performance !== "undefined" && performance.memory) {
        const memory = performance.memory;
        const metric = {
          name: "memory_usage",
          value: memory.usedJSHeapSize / 1024 / 1024,
          // Convert to MB
          unit: "MB",
          timestamp: /* @__PURE__ */ new Date(),
          category: "memory"
        };
        metricsRef.current.push(metric);
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          metrics: [...metricsRef.current]
        }));
      }
    }, []);
    const measureNetworkPerformance = require$$0.useCallback((url, startTime, endTime) => {
      const duration = endTime - startTime;
      const metric = {
        name: "network_request",
        value: duration,
        unit: "ms",
        timestamp: /* @__PURE__ */ new Date(),
        category: "loading"
      };
      metricsRef.current.push(metric);
      setState((prev) => __spreadProps(__spreadValues({}, prev), {
        metrics: [...metricsRef.current]
      }));
    }, []);
    const getMetricsByCategory = require$$0.useCallback((category) => {
      return metricsRef.current.filter((metric) => metric.category === category);
    }, []);
    const getAverageRenderTime = require$$0.useCallback(() => {
      const renderMetrics = getMetricsByCategory("rendering");
      if (renderMetrics.length === 0)
        return 0;
      const total = renderMetrics.reduce((sum, metric) => sum + metric.value, 0);
      return total / renderMetrics.length;
    }, [getMetricsByCategory]);
    const clearMetrics = require$$0.useCallback(() => {
      metricsRef.current = [];
      setState((prev) => __spreadProps(__spreadValues({}, prev), {
        metrics: []
      }));
    }, []);
    const getPerformanceSummary = require$$0.useCallback(() => {
      const renderMetrics = getMetricsByCategory("rendering");
      const memoryMetrics = getMetricsByCategory("memory");
      const loadingMetrics = getMetricsByCategory("loading");
      return {
        totalMetrics: metricsRef.current.length,
        renderMetrics: renderMetrics.length,
        memoryMetrics: memoryMetrics.length,
        loadingMetrics: loadingMetrics.length,
        averageRenderTime: getAverageRenderTime(),
        lastMemoryUsage: memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1].value : 0
      };
    }, [getMetricsByCategory, getAverageRenderTime]);
    require$$0.useEffect(() => {
      const interval = setInterval(() => {
        measureMemoryUsage();
      }, 3e4);
      return () => clearInterval(interval);
    }, [measureMemoryUsage]);
    return {
      // State
      metrics: state.metrics,
      isLoading: state.isLoading,
      error: state.error,
      // Actions
      measureRenderTime,
      startMeasure,
      endMeasure,
      measureMemoryUsage,
      measureNetworkPerformance,
      getMetricsByCategory,
      getAverageRenderTime,
      clearMetrics,
      getPerformanceSummary
    };
  }
  function useUserBehavior() {
    const [userBehavior, setUserBehavior] = require$$0.useState({
      pageViews: 0,
      timeOnPage: 0,
      scrollDepth: 0,
      hasInteracted: false,
      lastActivity: /* @__PURE__ */ new Date(),
      interactions: []
    });
    const [currentPage, setCurrentPage] = require$$0.useState("");
    const [sessionId] = require$$0.useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const [userGroup, setUserGroup] = require$$0.useState("default");
    const pageLoadTime = require$$0.useRef(Date.now());
    const lastScrollTop = require$$0.useRef(0);
    const interactionTimeout = require$$0.useRef(null);
    const scrollTimeout = require$$0.useRef(null);
    const detectDevice = require$$0.useCallback(() => {
      const userAgent = navigator.userAgent;
      const screen = window.screen;
      let type = "desktop";
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        type = "mobile";
        if (screen.width >= 768) {
          type = "tablet";
        }
      }
      return {
        type,
        screen: {
          width: screen.width,
          height: screen.height,
          orientation: screen.width > screen.height ? "landscape" : "portrait",
          pixelRatio: window.devicePixelRatio || 1
        },
        capabilities: {
          touch: "ontouchstart" in window,
          geolocation: "geolocation" in navigator,
          notifications: "Notification" in window
        },
        userAgent,
        browser: getBrowser(userAgent),
        os: getOS(userAgent)
      };
    }, []);
    const getBrowser = (userAgent) => {
      if (userAgent.includes("Chrome"))
        return "Chrome";
      if (userAgent.includes("Firefox"))
        return "Firefox";
      if (userAgent.includes("Safari"))
        return "Safari";
      if (userAgent.includes("Edge"))
        return "Edge";
      return "Unknown";
    };
    const getOS = (userAgent) => {
      if (userAgent.includes("Windows"))
        return "Windows";
      if (userAgent.includes("Mac"))
        return "macOS";
      if (userAgent.includes("Linux"))
        return "Linux";
      if (userAgent.includes("Android"))
        return "Android";
      if (userAgent.includes("iOS"))
        return "iOS";
      return "Unknown";
    };
    const trackInteraction = require$$0.useCallback((type, data) => {
      const interaction = {
        type,
        timestamp: /* @__PURE__ */ new Date(),
        data
      };
      setUserBehavior((prev) => __spreadProps(__spreadValues({}, prev), {
        hasInteracted: true,
        lastActivity: /* @__PURE__ */ new Date(),
        interactions: [...prev.interactions, interaction]
      }));
      if (interactionTimeout.current) {
        clearTimeout(interactionTimeout.current);
      }
      interactionTimeout.current = setTimeout(() => {
        setUserBehavior((prev) => __spreadProps(__spreadValues({}, prev), {
          hasInteracted: false
        }));
      }, 3e5);
    }, []);
    const handleScroll = require$$0.useCallback(() => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDepth = Math.round(scrollTop / scrollHeight * 100);
        setUserBehavior((prev) => __spreadProps(__spreadValues({}, prev), {
          scrollDepth: Math.max(prev.scrollDepth, scrollDepth),
          lastActivity: /* @__PURE__ */ new Date()
        }));
        lastScrollTop.current = scrollTop;
      }, 100);
    }, []);
    const handleMouseMove = require$$0.useCallback(() => {
      trackInteraction("mouse_movement");
    }, [trackInteraction]);
    const handleClick = require$$0.useCallback((event) => {
      var _a;
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      trackInteraction("click", {
        tagName,
        className,
        id,
        text: (_a = target.textContent) == null ? void 0 : _a.substring(0, 100),
        position: { x: event.clientX, y: event.clientY }
      });
    }, [trackInteraction]);
    const handleFormInteraction = require$$0.useCallback((event) => {
      var _a;
      const target = event.target;
      const type = event.type;
      const name = target.name;
      const value = target.value;
      trackInteraction("form_interaction", {
        type,
        name,
        value: type === "submit" ? void 0 : value,
        formId: (_a = target.form) == null ? void 0 : _a.id
      });
    }, [trackInteraction]);
    const handleSearch = require$$0.useCallback((query) => {
      trackInteraction("search", { query });
    }, [trackInteraction]);
    require$$0.useEffect(() => {
      const interval = setInterval(() => {
        setUserBehavior((prev) => __spreadProps(__spreadValues({}, prev), {
          timeOnPage: Date.now() - pageLoadTime.current
        }));
      }, 1e3);
      return () => clearInterval(interval);
    }, []);
    require$$0.useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("click", handleClick, { passive: true });
      document.addEventListener("input", handleFormInteraction, { passive: true });
      document.addEventListener("change", handleFormInteraction, { passive: true });
      document.addEventListener("submit", handleFormInteraction, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleClick);
        document.removeEventListener("input", handleFormInteraction);
        document.removeEventListener("change", handleFormInteraction);
        document.removeEventListener("submit", handleFormInteraction);
      };
    }, [handleScroll, handleMouseMove, handleClick, handleFormInteraction]);
    require$$0.useEffect(() => {
      const updatePage = () => {
        const newPage = window.location.pathname;
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
          setUserBehavior((prev) => __spreadProps(__spreadValues({}, prev), {
            pageViews: prev.pageViews + 1,
            scrollDepth: 0,
            timeOnPage: 0
          }));
          pageLoadTime.current = Date.now();
        }
      };
      const observer = new MutationObserver(updatePage);
      observer.observe(document.body, { childList: true, subtree: true });
      updatePage();
      return () => observer.disconnect();
    }, [currentPage]);
    require$$0.useEffect(() => {
      return () => {
        if (interactionTimeout.current) {
          clearTimeout(interactionTimeout.current);
        }
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }, []);
    return {
      userBehavior,
      currentPage,
      sessionId,
      userGroup,
      device: detectDevice(),
      trackInteraction,
      handleSearch,
      setUserGroup
    };
  }
  const STORAGE_KEY = "product_interactions";
  function useProductInteractions() {
    const [interactions, setInteractions] = require$$0.useState({
      viewHistory: [],
      purchaseHistory: [],
      searchHistory: [],
      cartHistory: [],
      wishlistHistory: []
    });
    require$$0.useEffect(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setInteractions(parsed);
        }
      } catch (error) {
        console.warn("Failed to load product interactions from storage:", error);
      }
    }, []);
    require$$0.useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
      } catch (error) {
        console.warn("Failed to save product interactions to storage:", error);
      }
    }, [interactions]);
    const addToViewHistory = require$$0.useCallback((productId) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        viewHistory: [...prev.viewHistory.filter((id) => id !== productId), productId]
      }));
    }, []);
    const addToPurchaseHistory = require$$0.useCallback((productId) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        purchaseHistory: [...prev.purchaseHistory.filter((id) => id !== productId), productId]
      }));
    }, []);
    const addToSearchHistory = require$$0.useCallback((searchTerm) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        searchHistory: [...prev.searchHistory.filter((term) => term !== searchTerm), searchTerm]
      }));
    }, []);
    const addToCartHistory = require$$0.useCallback((productId) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        cartHistory: [...prev.cartHistory.filter((id) => id !== productId), productId]
      }));
    }, []);
    const addToWishlistHistory = require$$0.useCallback((productId) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        wishlistHistory: [...prev.wishlistHistory.filter((id) => id !== productId), productId]
      }));
    }, []);
    const removeFromWishlistHistory = require$$0.useCallback((productId) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        wishlistHistory: prev.wishlistHistory.filter((id) => id !== productId)
      }));
    }, []);
    const clearAllInteractions = require$$0.useCallback(() => {
      setInteractions({
        viewHistory: [],
        purchaseHistory: [],
        searchHistory: [],
        cartHistory: [],
        wishlistHistory: []
      });
    }, []);
    const clearHistory = require$$0.useCallback((type) => {
      setInteractions((prev) => __spreadProps(__spreadValues({}, prev), {
        [type]: []
      }));
    }, []);
    const getInteractionStats = require$$0.useCallback(() => {
      return {
        totalViews: interactions.viewHistory.length,
        totalPurchases: interactions.purchaseHistory.length,
        totalSearches: interactions.searchHistory.length,
        totalCartAdds: interactions.cartHistory.length,
        totalWishlistAdds: interactions.wishlistHistory.length,
        conversionRate: interactions.viewHistory.length > 0 ? interactions.purchaseHistory.length / interactions.viewHistory.length * 100 : 0
      };
    }, [interactions]);
    const hasViewedProduct = require$$0.useCallback((productId) => {
      return interactions.viewHistory.includes(productId);
    }, [interactions.viewHistory]);
    const hasPurchasedProduct = require$$0.useCallback((productId) => {
      return interactions.purchaseHistory.includes(productId);
    }, [interactions.purchaseHistory]);
    const isInWishlist = require$$0.useCallback((productId) => {
      return interactions.wishlistHistory.includes(productId);
    }, [interactions.wishlistHistory]);
    return {
      // State
      productInteractions: interactions,
      // Actions
      addToViewHistory,
      addToPurchaseHistory,
      addToSearchHistory,
      addToCartHistory,
      addToWishlistHistory,
      removeFromWishlistHistory,
      clearAllInteractions,
      clearHistory,
      // Utilities
      getInteractionStats,
      hasViewedProduct,
      hasPurchasedProduct,
      isInWishlist
    };
  }
  function useRecommendationsAPI(apiEndpoint) {
    const [isLoading, setIsLoading] = require$$0.useState(false);
    const [error, setError] = require$$0.useState(null);
    const fetchRecommendations = require$$0.useCallback((request) => __async(this, null, function* () {
      var _a;
      setIsLoading(true);
      setError(null);
      try {
        const response = yield fetch(`${apiEndpoint}/recommendations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        const results = ((_a = data.recommendations) == null ? void 0 : _a.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description || "",
            price: item.product.price,
            currency: item.product.currency || "BRL",
            category: item.product.category || "",
            images: item.product.images || [],
            sku: item.product.sku,
            originalPrice: item.product.originalPrice,
            rating: item.product.rating,
            reviewCount: item.product.reviewCount,
            availability: item.product.availability || "in_stock",
            url: item.product.url
          },
          score: item.score || 0,
          reason: item.reason || "Recomendado para você",
          algorithm: request.algorithm,
          confidence: item.confidence || 0.8
        }))) || [];
        return results;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch recommendations";
        setError(errorMessage);
        console.error("Recommendations API error:", err);
        return getFallbackRecommendations(request.config.maxResults || 12);
      } finally {
        setIsLoading(false);
      }
    }), [apiEndpoint]);
    const trackInteraction = require$$0.useCallback((interaction) => __async(this, null, function* () {
      try {
        yield fetch(`${apiEndpoint}/interactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(interaction)
        });
      } catch (err) {
        console.warn("Failed to track interaction:", err);
      }
    }), [apiEndpoint]);
    const getFallbackRecommendations = require$$0.useCallback((maxResults) => {
      const mockProducts = [
        {
          id: "1",
          name: "Produto Recomendado 1",
          description: "Descrição do produto recomendado",
          price: 99.9,
          currency: "BRL",
          category: "Categoria A",
          images: [{ url: "https://via.placeholder.com/300x300", alt: "Produto 1" }],
          availability: "in_stock"
        },
        {
          id: "2",
          name: "Produto Recomendado 2",
          description: "Descrição do produto recomendado",
          price: 149.9,
          currency: "BRL",
          category: "Categoria B",
          images: [{ url: "https://via.placeholder.com/300x300", alt: "Produto 2" }],
          availability: "in_stock"
        },
        {
          id: "3",
          name: "Produto Recomendado 3",
          description: "Descrição do produto recomendado",
          price: 199.9,
          currency: "BRL",
          category: "Categoria C",
          images: [{ url: "https://via.placeholder.com/300x300", alt: "Produto 3" }],
          availability: "in_stock"
        }
      ];
      return mockProducts.slice(0, maxResults).map((product, index) => ({
        product,
        score: 0.8 - index * 0.1,
        reason: "Produtos populares",
        algorithm: "popularity",
        confidence: 0.7
      }));
    }, []);
    return {
      fetchRecommendations,
      trackInteraction,
      isLoading,
      error
    };
  }
  const RecommendationsEngine = ({
    config,
    onProductClick,
    onAddToCart,
    onAddToWishlist
  }) => {
    var _a, _b;
    const [recommendations, setRecommendations] = require$$0.useState([]);
    const [isLoading, setIsLoading] = require$$0.useState(false);
    const [currentAlgorithm, setCurrentAlgorithm] = require$$0.useState("collaborative");
    const [userSegment, setUserSegment] = require$$0.useState("general");
    const [lastFetchTime, setLastFetchTime] = require$$0.useState(0);
    const { userBehavior } = useUserBehavior();
    const { productInteractions } = useProductInteractions();
    const { fetchRecommendations, trackInteraction } = useRecommendationsAPI(config.apiEndpoint);
    const determineUserSegment = require$$0.useCallback(() => {
      const { pageViews, hasInteracted, scrollDepth } = userBehavior;
      if (pageViews > 10 && hasInteracted) {
        return "engaged";
      } else if (pageViews > 5) {
        return "active";
      } else if (pageViews > 2) {
        return "returning";
      } else {
        return "new";
      }
    }, [userBehavior]);
    const selectOptimalAlgorithm = require$$0.useCallback(() => {
      const { hasInteracted, pageViews } = userBehavior;
      const { viewHistory, purchaseHistory, searchHistory } = productInteractions;
      if (viewHistory.length > 5 && purchaseHistory.length > 2) {
        return "collaborative";
      }
      if (searchHistory.length > 3) {
        return "content_based";
      }
      if (pageViews > 3 && hasInteracted) {
        return "hybrid";
      }
      return "popularity";
    }, [userBehavior, productInteractions]);
    const generateRecommendations = require$$0.useCallback(() => __async(this, null, function* () {
      var _a2, _b2;
      if (isLoading)
        return;
      const now = Date.now();
      if (now - lastFetchTime < 5e3) {
        console.log("Debouncing recommendation request");
        return;
      }
      setIsLoading(true);
      setLastFetchTime(now);
      try {
        const algorithm = selectOptimalAlgorithm();
        setCurrentAlgorithm(algorithm);
        const userSegment2 = determineUserSegment();
        setUserSegment(userSegment2);
        const apiResponse = yield fetch("https://gol0qozv97.execute-api.us-east-1.amazonaws.com/qa/products/popular/shopwake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "8QD7vDvrOn1D6goXfc5xg7p7OYNc71Tr7YI59xaI"
          },
          body: JSON.stringify({
            page: 1,
            perPage: config.maxResults || 12,
            products: [],
            browserId: generateBrowserId(),
            documentType: "cpf",
            customerDocument: generateCustomerDocument(),
            filterAlreadyBought: config.excludeViewed || false
          })
        });
        if (!apiResponse.ok) {
          throw new Error(`API request failed: ${apiResponse.status}`);
        }
        const apiData = yield apiResponse.json();
        const results = convertApiDataToRecommendations(apiData, algorithm, userSegment2);
        setRecommendations(results);
        if ((_a2 = config.analytics) == null ? void 0 : _a2.enabled) {
          (_b2 = window.gtag) == null ? void 0 : _b2.call(window, "event", "recommendations_generated", {
            algorithm,
            user_segment: userSegment2,
            result_count: results.length,
            user_behavior_score: calculateUserBehaviorScore(),
            api_source: "coder_ivy"
          });
        }
      } catch (error) {
        console.error("Failed to generate recommendations:", error);
        setRecommendations([]);
        setCurrentAlgorithm("popularity");
      } finally {
        setIsLoading(false);
      }
    }), [config.maxResults, config.excludeViewed, (_a = config.analytics) == null ? void 0 : _a.enabled, isLoading, lastFetchTime]);
    const calculateUserBehaviorScore = require$$0.useCallback(() => {
      const { pageViews, hasInteracted, scrollDepth } = userBehavior;
      const { viewHistory, purchaseHistory, searchHistory } = productInteractions;
      let score = 0;
      score += Math.min(pageViews * 0.1, 1);
      score += scrollDepth * 0.01;
      if (hasInteracted)
        score += 0.5;
      if (viewHistory.length > 0)
        score += Math.min(viewHistory.length * 0.1, 1);
      if (purchaseHistory.length > 0)
        score += Math.min(purchaseHistory.length * 0.2, 1);
      if (searchHistory.length > 0)
        score += Math.min(searchHistory.length * 0.15, 1);
      return Math.min(score, 5);
    }, [userBehavior, productInteractions]);
    const handleProductInteraction = require$$0.useCallback((product, interactionType) => __async(this, null, function* () {
      var _a2, _b2;
      try {
        yield trackInteraction({
          productId: product.id,
          interactionType,
          algorithm: currentAlgorithm,
          userSegment,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        switch (interactionType) {
          case "view":
            onProductClick == null ? void 0 : onProductClick(product);
            break;
          case "add_to_cart":
            onAddToCart == null ? void 0 : onAddToCart(product);
            break;
          case "add_to_wishlist":
            onAddToWishlist == null ? void 0 : onAddToWishlist(product);
            break;
        }
        if ((_a2 = config.analytics) == null ? void 0 : _a2.enabled) {
          (_b2 = window.gtag) == null ? void 0 : _b2.call(window, "event", "recommendation_interaction", {
            product_id: product.id,
            interaction_type: interactionType,
            algorithm: currentAlgorithm,
            user_segment: userSegment
          });
        }
      } catch (error) {
        console.error("Failed to track interaction:", error);
      }
    }), [currentAlgorithm, userSegment, trackInteraction, onProductClick, onAddToCart, onAddToWishlist, (_b = config.analytics) == null ? void 0 : _b.enabled]);
    require$$0.useEffect(() => {
      generateRecommendations();
    }, []);
    require$$0.useEffect(() => {
      const interval = setInterval(() => {
        if (userBehavior.pageViews > 0 && !isLoading) {
          generateRecommendations();
        }
      }, config.refreshInterval || 3e5);
      return () => clearInterval(interval);
    }, [userBehavior.pageViews, config.refreshInterval, isLoading]);
    const renderRecommendations = require$$0.useMemo(() => {
      if (isLoading) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-loading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Carregando recomendações..." })
        ] });
      }
      if (recommendations.length === 0) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-empty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-icon", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Nenhuma recomendação disponível" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Continue navegando para receber recomendações personalizadas" })
        ] });
      }
      switch (config.layout) {
        case "grid":
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendations-grid", children: recommendations.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecommendationCard,
            {
              result,
              onInteraction: handleProductInteraction,
              showAlgorithm: config.showAlgorithm,
              showScore: config.showScore
            },
            `${result.product.id}-${index}`
          )) });
        case "carousel":
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-carousel", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "carousel-container", children: recommendations.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              RecommendationCard,
              {
                result,
                onInteraction: handleProductInteraction,
                showAlgorithm: config.showAlgorithm,
                showScore: config.showScore,
                compact: true
              },
              `${result.product.id}-${index}`
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "carousel-controls", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "carousel-prev", children: "‹" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "carousel-next", children: "›" })
            ] })
          ] });
        case "list":
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendations-list", children: recommendations.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecommendationListItem,
            {
              result,
              onInteraction: handleProductInteraction,
              showAlgorithm: config.showAlgorithm,
              showScore: config.showScore
            },
            `${result.product.id}-${index}`
          )) });
        default:
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendations-default", children: recommendations.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecommendationCard,
            {
              result,
              onInteraction: handleProductInteraction,
              showAlgorithm: config.showAlgorithm,
              showScore: config.showScore
            },
            `${result.product.id}-${index}`
          )) });
      }
    }, [recommendations, isLoading, config.layout, config.showAlgorithm, config.showScore, handleProductInteraction]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-engine", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "recommendations-title", children: config.title || "Recomendados para Você" }),
        config.showAlgorithm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "algorithm-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "algorithm-label", children: "Algoritmo:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "algorithm-value", children: getAlgorithmDisplayName(currentAlgorithm) })
        ] }),
        config.showRefreshButton && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "refresh-button",
            onClick: generateRecommendations,
            disabled: isLoading,
            children: "🔄 Atualizar"
          }
        )
      ] }),
      config.allowAlgorithmSelection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "algorithm-selector", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "algorithm-select", children: "Algoritmo de Recomendação:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "algorithm-select",
            value: currentAlgorithm,
            onChange: (e) => setCurrentAlgorithm(e.target.value),
            disabled: isLoading,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "collaborative", children: "Filtragem Colaborativa" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "content_based", children: "Baseado em Conteúdo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hybrid", children: "Híbrido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "popularity", children: "Popularidade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "recent", children: "Mais Recentes" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendations-content", children: renderRecommendations }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendations-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "user-segment-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Segmento: ",
            getUserSegmentDisplayName(userSegment)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Score: ",
            calculateUserBehaviorScore().toFixed(1),
            "/5.0"
          ] })
        ] }),
        config.showPoweredBy && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "powered-by", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Powered by AI Recommendations" }) })
      ] })
    ] });
  };
  const RecommendationCard = ({
    result,
    onInteraction,
    showAlgorithm,
    showScore,
    compact = false
  }) => {
    var _a, _b;
    const { product, score, reason, algorithm } = result;
    const handleView = () => onInteraction(product, "view");
    const handleAddToCart = () => onInteraction(product, "add_to_cart");
    const handleAddToWishlist = () => onInteraction(product, "add_to_wishlist");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `recommendation-card ${compact ? "compact" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-image", onClick: handleView, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: (_a = product.images[0]) == null ? void 0 : _a.url,
            alt: ((_b = product.images[0]) == null ? void 0 : _b.alt) || product.name,
            loading: "lazy"
          }
        ),
        showScore && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendation-score", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "score-value", children: score.toFixed(1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "score-label", children: "Score" })
        ] }),
        product.originalPrice && product.originalPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "discount-badge", children: [
          "-",
          Math.round((product.originalPrice - product.price) / product.originalPrice * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "product-name", onClick: handleView, children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-category", children: product.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-price", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "current-price", children: [
            product.currency,
            " ",
            product.price.toFixed(2)
          ] }),
          product.originalPrice && product.originalPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "original-price", children: [
            product.currency,
            " ",
            product.originalPrice.toFixed(2)
          ] })
        ] }),
        showAlgorithm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendation-reason", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reason-label", children: "Por que recomendamos:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reason-text", children: reason })
        ] }),
        !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "action-button view",
              onClick: handleView,
              children: "Ver Produto"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "action-button add-to-cart",
              onClick: handleAddToCart,
              children: "🛒"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "action-button wishlist",
              onClick: handleAddToWishlist,
              children: "❤️"
            }
          )
        ] })
      ] })
    ] });
  };
  const RecommendationListItem = ({
    result,
    onInteraction,
    showAlgorithm,
    showScore
  }) => {
    var _a, _b;
    const { product, score, reason, algorithm } = result;
    const handleView = () => onInteraction(product, "view");
    const handleAddToCart = () => onInteraction(product, "add_to_cart");
    const handleAddToWishlist = () => onInteraction(product, "add_to_wishlist");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recommendation-list-item", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "item-image", onClick: handleView, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: (_a = product.images[0]) == null ? void 0 : _a.url,
          alt: ((_b = product.images[0]) == null ? void 0 : _b.alt) || product.name,
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "item-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "product-name", onClick: handleView, children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-category", children: product.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-price", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "current-price", children: [
            product.currency,
            " ",
            product.price.toFixed(2)
          ] }),
          product.originalPrice && product.originalPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "original-price", children: [
            product.currency,
            " ",
            product.originalPrice.toFixed(2)
          ] })
        ] }),
        showAlgorithm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendation-reason", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reason-text", children: reason }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "item-meta", children: [
        showScore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recommendation-score", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "score-value", children: score.toFixed(1) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "item-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "action-button add-to-cart",
              onClick: handleAddToCart,
              title: "Adicionar ao carrinho",
              children: "🛒"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "action-button wishlist",
              onClick: handleAddToWishlist,
              title: "Adicionar à lista de desejos",
              children: "❤️"
            }
          )
        ] })
      ] })
    ] });
  };
  const generateBrowserId = () => {
    let browserId = localStorage.getItem("coder_ivy_browser_id");
    if (!browserId) {
      browserId = "browser_" + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem("coder_ivy_browser_id", browserId);
    }
    return browserId;
  };
  const generateCustomerDocument = () => {
    const browserId = generateBrowserId();
    return "customer_" + browserId.split("_")[1] + "_" + Math.random().toString(36).substr(2, 8);
  };
  const convertApiDataToRecommendations = (apiData, algorithm, userSegment) => {
    const products = apiData.products || [];
    return products.map((product, index) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const firstSku = ((_a = product.skus) == null ? void 0 : _a[0]) || {};
      const sellingPrice = ((_c = (_b = product.priceRange) == null ? void 0 : _b.sellingPrice) == null ? void 0 : _c.lowPrice) || firstSku.price || product.price || 0;
      const listPrice = ((_e = (_d = product.priceRange) == null ? void 0 : _d.listPrice) == null ? void 0 : _e.lowPrice) || firstSku.listPrice || product.listPrice;
      const hasDiscount = listPrice && listPrice > sellingPrice;
      return {
        product: {
          id: product.productId || `product_${index}`,
          name: product.productName || "Produto sem nome",
          description: product.description || "",
          price: parseFloat(sellingPrice.toString()),
          originalPrice: hasDiscount ? parseFloat(listPrice.toString()) : void 0,
          currency: "BRL",
          // API sempre retorna em BRL
          category: ((_g = (_f = product.categories) == null ? void 0 : _f[0]) == null ? void 0 : _g.replace("/Category/", "").replace("/", "")) || "Geral",
          sku: firstSku.id || product.refId || product.productId || `sku_${index}`,
          availability: firstSku.isAvailable !== false ? "in_stock" : "out_of_stock",
          rating: void 0,
          // API não retorna rating
          reviewCount: void 0,
          // API não retorna review count
          url: product.link || "#",
          images: ((_h = product.images) == null ? void 0 : _h.map((img) => ({
            url: img.imageUrl,
            alt: img.imageLabel || product.productName || "Imagem do produto"
          }))) || [{
            url: product.image || "https://via.placeholder.com/300x300",
            alt: product.productName || "Imagem do produto"
          }]
        },
        score: 1 - index * 0.1,
        // Score decrescente baseado na posição
        reason: getRecommendationReason(algorithm),
        algorithm,
        userSegment
      };
    });
  };
  const getRecommendationReason = (algorithm, product) => {
    const reasons = {
      collaborative: "Baseado em usuários similares",
      content_based: "Similar ao seu histórico de visualizações",
      hybrid: "Combinação de fatores personalizados",
      popularity: "Produto popular entre nossos clientes",
      recent: "Produto recentemente adicionado"
    };
    return reasons[algorithm] || "Recomendado para você";
  };
  const getAlgorithmDisplayName = (algorithm) => {
    const names = {
      collaborative: "Filtragem Colaborativa",
      content_based: "Baseado em Conteúdo",
      hybrid: "Híbrido",
      popularity: "Popularidade",
      recent: "Mais Recentes"
    };
    return names[algorithm] || algorithm;
  };
  const getUserSegmentDisplayName = (segment) => {
    const names = {
      new: "Novo Usuário",
      returning: "Usuário Retornante",
      active: "Usuário Ativo",
      engaged: "Usuário Engajado",
      general: "Geral"
    };
    return names[segment] || segment;
  };
  const RecommendationsEngine$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    RecommendationsEngine
  }, Symbol.toStringTag, { value: "Module" }));
  const Shelf = ({
    config,
    onProductClick,
    onAddToWishlist,
    onAddToCart
  }) => {
    const device = useDeviceDetection();
    const { measureRenderTime } = usePerformanceMetrics();
    const gridConfig = require$$0.useMemo(() => {
      switch (device) {
        case "mobile":
          return config.grid.mobile;
        case "tablet":
          return config.grid.tablet;
        case "superapp":
          return config.grid.superapp || config.grid.mobile;
        default:
          return config.grid.desktop;
      }
    }, [device, config.grid]);
    const recommendationsConfig = require$$0.useMemo(() => ({
      apiEndpoint: "https://gol0qozv97.execute-api.us-east-1.amazonaws.com/qa/products/popular/shopwake",
      maxResults: config.maxItems || 12,
      layout: "grid",
      showAlgorithm: false,
      showScore: false,
      showRefreshButton: false,
      allowAlgorithmSelection: false,
      showPoweredBy: false,
      refreshInterval: 3e5,
      // 5 minutes
      includeOutOfStock: false,
      excludeViewed: true,
      analytics: {
        enabled: true
      }
    }), [config.maxItems]);
    require$$0.useEffect(() => {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        measureRenderTime("Shelf", endTime - startTime);
      };
    }, [measureRenderTime]);
    const gridStyles = require$$0.useMemo(() => ({
      "--bnly-grid-visible-rows": gridConfig.rows,
      "--bnly-grid-columns": gridConfig.columns,
      "--bnly-grid-card-height": `${gridConfig.cardHeight}px`,
      "--bnly-grid-spacing": `${gridConfig.spacing}px`
    }), [gridConfig]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-showcase", style: gridStyles, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "showcase-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "showcase-title", children: config.title || "Produtos Recomendados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "showcase-controls" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecommendationsEngine,
        {
          config: recommendationsConfig,
          onProductClick,
          onAddToWishlist,
          onAddToCart
        }
      )
    ] });
  };
  const Shelf$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Shelf
  }, Symbol.toStringTag, { value: "Module" }));
})(React);
//# sourceMappingURL=loader.js.map
