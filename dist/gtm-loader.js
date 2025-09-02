
// CoderShelf GTM Loader
(function() {
  'use strict'
  
  if (window.CoderShelfGTM) {
    console.log('CoderShelfGTM already loaded')
    return
  }

  const defaultConfig = {
    clientId: 'test-client',
    components: [
      {
        id: 'product-showcase',
        type: 'showcase',
        selector: '#product-showcase-container',
        enabled: true,
        props: {
          title: 'Produtos Recomendados',
          maxResults: 8
        }
      }
    ]
  }

  const mockProducts = [
    {
      id: '1',
      name: 'Tênis Esportivo Premium',
      price: 299.90,
      originalPrice: 399.90,
      currency: 'BRL',
      category: 'Calçados',
      rating: 4.5,
      reviewCount: 128,
      availability: 'in_stock',
      url: '/produto/tenis-esportivo-premium',
      images: [{
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        alt: 'Tênis Esportivo Premium'
      }]
    },
    {
      id: '2',
      name: 'Camiseta Básica Algodão',
      price: 49.90,
      currency: 'BRL',
      category: 'Roupas',
      rating: 4.2,
      reviewCount: 89,
      availability: 'in_stock',
      url: '/produto/camiseta-basica-algodao',
      images: [{
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        alt: 'Camiseta Básica Algodão'
      }]
    }
  ]

  function createProductShowcaseHTML(config) {
    const products = mockProducts.slice(0, config.maxResults || 8)
    
    return `
      <div class="coder-shelf-gtm" style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h2 style="font-size: 28px; font-weight: 600; color: #1a1a1a; margin: 0 0 24px 0; text-align: center;">${config.title || 'Produtos Recomendados'}</h2>
        
        <div class="showcase-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
          ${products.map(product => `
            <div class="product-card" style="background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative; height: 400px; display: flex; flex-direction: column;" data-product-id="${product.id}">
              
              <div class="product-image-container" style="position: relative; width: 100%; height: 60%; overflow: hidden; background: #f8f9fa;">
                <img src="${product.images[0].url}" alt="${product.images[0].alt}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" loading="lazy">
                
                ${product.originalPrice && product.originalPrice > product.price ? `
                  <div style="position: absolute; top: 12px; left: 12px; background: #ff4757; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                ` : ''}
              </div>
              
              <div class="product-info" style="padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-size: 16px; font-weight: 500; color: #1a1a1a; margin: 0; line-height: 1.4; cursor: pointer;">${product.name}</h3>
                
                <div style="font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px;">${product.category}</div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-top: auto;">
                  <span style="font-size: 18px; font-weight: 600; color: #1a1a1a;">${product.currency} ${product.price.toFixed(2)}</span>
                  
                  ${product.originalPrice && product.originalPrice > product.price ? `
                    <span style="font-size: 14px; color: #6c757d; text-decoration: line-through;">${product.currency} ${product.originalPrice.toFixed(2)}</span>
                  ` : ''}
                </div>
                
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px;">
                  <span style="color: #ffc107; font-size: 14px;">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                  </span>
                  <span style="color: #6c757d; font-weight: 500;">(${product.rating})</span>
                  <span style="color: #6c757d;">(${product.reviewCount} avaliações)</span>
                </div>
                
                <div style="margin-top: 4px;">
                  <span style="font-size: 12px; font-weight: 500; padding: 2px 6px; border-radius: 4px; background: #d4edda; color: #155724;">Em estoque</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  function addEventListeners(container) {
    container.addEventListener('click', function(e) {
      const productCard = e.target.closest('.product-card')
      if (productCard) {
        const productId = productCard.getAttribute('data-product-id')
        const product = mockProducts.find(p => p.id === productId)
        
        if (product) {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event: 'product_click',
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_category: product.category
          })
          
          console.log('Product clicked:', product)
          
          if (product.url) {
            window.open(product.url, '_blank')
          }
        }
      }
    })
    
    const productCards = container.querySelectorAll('.product-card')
    productCards.forEach((card, index) => {
      const productId = card.getAttribute('data-product-id')
      const product = mockProducts.find(p => p.id === productId)
      
      if (product) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'product_impression',
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_category: product.category,
          position: index + 1
        })
      }
    })
  }

  function initializeCoderShelf() {
    try {
      const config = window.coderShelfConfig || defaultConfig
      
      config.components.forEach(component => {
        if (component.enabled && component.type === 'showcase') {
          const container = document.querySelector(component.selector)
          
          if (container) {
            const html = createProductShowcaseHTML(component.props)
            container.innerHTML = html
            
            addEventListeners(container)
            
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
              event: 'shelf_view',
              shelf_name: component.props.title || 'Product Showcase',
              items_count: mockProducts.length
            })
            
            console.log('ProductShowcase initialized successfully')
          } else {
            console.warn(`Container not found: ${component.selector}`)
          }
        }
      })
      
    } catch (error) {
      console.error('Error initializing CoderShelf:', error)
    }
  }

  window.CoderShelfGTM = {
    init: initializeCoderShelf,
    version: '1.0.0'
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoderShelf)
  } else {
    initializeCoderShelf()
  }

})()
  