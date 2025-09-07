var __defProp = Object.defineProperty;
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
(function() {
  "use strict";
  const customConfig = {
    clientId: "client-12345",
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
          apiEndpoint: "https://gol0qozv97.execute-api.us-east-1.amazonaws.com/qa/products/popular/shop",
          maxItems: 12,
          enablePagination: true,
          enableWishlist: true,
          enableRating: true,
          grid: {
            mobile: { columns: 2, rows: 2, cardHeight: 300, spacing: 16 },
            tablet: { columns: 3, rows: 2, cardHeight: 300, spacing: 20 },
            desktop: { columns: 4, rows: 2, cardHeight: 300, spacing: 24 },
            superapp: { columns: 2, rows: 3, cardHeight: 250, spacing: 12 }
          }
        }
      }
    ],
    analytics: {
      enabled: true,
      trackingId: "G-XXXXXXXXXX",
      events: ["shelf_view", "product_impression", "product_click", "add_to_cart", "add_to_wishlist"]
    },
    branding: {
      primaryColor: "#2c5aa0",
      companyName: "Coder Ivy",
      logo: "https://coderivy.com/logo.png"
    }
  };
  function initializeCustomConfig() {
    var _a;
    window.componentInjectorConfig = customConfig;
    if ((_a = customConfig.analytics) == null ? void 0 : _a.enabled) {
      setupAnalytics();
    }
    if (customConfig.branding) {
      applyBranding();
    }
    console.log("Custom configuration initialized for client:", customConfig.clientId);
  }
  function setupAnalytics() {
    if (typeof gtag !== "undefined") {
      gtag("config", customConfig.analytics.trackingId, {
        custom_map: {
          "client_id": "client_id",
          "component_type": "component_type",
          "component_id": "component_id"
        }
      });
      console.log("Analytics configured successfully");
    } else {
      console.warn("Google Analytics not available");
    }
  }
  function applyBranding() {
    const style = document.createElement("style");
    style.textContent = `
    :root {
      --primary-color: ${customConfig.branding.primaryColor || "#007bff"};
      --company-name: '${customConfig.branding.companyName || "Sua Empresa"}';
    }
    
    .component-injector {
      --brand-primary: var(--primary-color);
    }
    
    .chat-widget-header h3::before {
      content: var(--company-name);
    }
  `;
    document.head.appendChild(style);
  }
  function trackEvent(eventName, componentId, additionalData) {
    var _a;
    if (((_a = customConfig.analytics) == null ? void 0 : _a.enabled) && typeof gtag !== "undefined") {
      gtag("event", eventName, __spreadValues({
        component_id: componentId,
        client_id: customConfig.clientId
      }, additionalData));
    }
  }
  function updateConfig(newConfig) {
    var _a, _b;
    Object.assign(customConfig, newConfig);
    if ((_a = window.ComponentInjector) == null ? void 0 : _a.instance) {
      window.ComponentInjector.instance;
      (_b = newConfig.components) == null ? void 0 : _b.forEach((component) => {
        if (component) {
          console.log("Component update requested:", component.id);
        }
      });
      console.log("Configuration updated successfully");
    }
  }
  function getConfig() {
    return __spreadValues({}, customConfig);
  }
  function toggleComponent(componentId, enabled) {
    var _a;
    const component = customConfig.components.find((c) => c.id === componentId);
    if (component) {
      component.enabled = enabled;
      if ((_a = window.ComponentInjector) == null ? void 0 : _a.instance) {
        window.ComponentInjector.instance;
        if (enabled) {
          console.log("Component enabled:", componentId);
        } else {
          console.log("Component disabled:", componentId);
        }
      }
      console.log(`Component ${componentId} ${enabled ? "enabled" : "disabled"}`);
    }
  }
  window.ComponentInjectorCustom = {
    initialize: initializeCustomConfig,
    updateConfig,
    getConfig,
    toggleComponent,
    trackEvent
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCustomConfig);
  } else {
    initializeCustomConfig();
  }
})();
//# sourceMappingURL=custom.js.map
