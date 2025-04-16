document.addEventListener('DOMContentLoaded', () => {
    // Theme switching functionality
    const themeSwitch = document.querySelector('.theme-switch');
    const themeFrog = document.querySelector('.theme-frog');
    let currentTheme = 'light';

    // Set initial theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
    }

    // Theme switching logic
    themeSwitch.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // Add animation to the frog
        themeFrog.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeFrog.style.transform = 'scale(1)';
        }, 300);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Product cards functionality
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Initialize all cards as visible
    productCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });

    // Add hover effects to product cards
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    // Product filtering and pagination
    const pagination = document.querySelector('.pagination');
    const pageButtons = document.querySelectorAll('.page-btn');
    const nextPageBtn = document.querySelector('.next-page');
    
    let currentPage = 1;
    const itemsPerPage = 8;
    let currentCategory = 'all';
    let isAnimating = false;
    
    // Filter products by category
    function filterProducts(category) {
        if (isAnimating) return;
        isAnimating = true;
        
        currentCategory = category;
        currentPage = 1;
        
        // Add transition class to all cards
        productCards.forEach(card => {
            card.classList.add('transitioning');
        });
        
        setTimeout(() => {
            updatePagination();
            showProducts();
            isAnimating = false;
        }, 300);
    }
    
    // Show products for current page and category
    function showProducts() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        let visibleCount = 0;
        
        productCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            if (currentCategory === 'all' || cardCategory === currentCategory) {
                if (visibleCount >= startIndex && visibleCount < endIndex) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        updatePageButtons();
        scrollToTop();
    }
    
    // Update pagination buttons
    function updatePagination() {
        const totalItems = Array.from(productCards).filter(card => 
            currentCategory === 'all' || card.getAttribute('data-category') === currentCategory
        ).length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Clear existing page buttons
        pagination.innerHTML = '';
        
        // Add page buttons
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            button.textContent = i;
            button.addEventListener('click', () => {
                if (!isAnimating) {
                    currentPage = i;
                    showProducts();
                }
            });
            pagination.appendChild(button);
        }
        
        // Add next page button if there are multiple pages
        if (totalPages > 1) {
            const nextButton = document.createElement('button');
            nextButton.className = 'next-page';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => {
                if (!isAnimating && currentPage < totalPages) {
                    currentPage++;
                    showProducts();
                }
            });
            pagination.appendChild(nextButton);
        }
    }
    
    // Update active state of page buttons
    function updatePageButtons() {
        const buttons = document.querySelectorAll('.page-btn');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.textContent) === currentPage) {
                button.classList.add('active');
            }
        });
    }
    
    // Scroll to top of products section
    function scrollToTop() {
        const productsSection = document.querySelector('.products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Add event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!isAnimating) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterProducts(button.getAttribute('data-filter'));
            }
        });
    });
    
    // Initialize
    filterProducts('all');
    
    // Quick view functionality with modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-product">
                        <img src="${productImage}" alt="${productName}">
                        <div class="modal-info">
                            <h3>${productName}</h3>
                            <p class="price">${productPrice}</p>
                            <button class="add-to-cart">В корзину</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
    
    // Add to cart functionality with animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Add animation
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.style.background = '#2ed573';
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Товар "${productName}" добавлен в корзину!</p>
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
                this.style.background = '';
            }, 2000);
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s';
    });

    // Обработка раскрытия карточек
    productCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.toggle('expanded');
            });
        }
    });

    // Обработка фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Обработка пагинации
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('next-page')) {
                const currentPage = document.querySelector('.product-page.active');
                const nextPage = currentPage.nextElementSibling;
                
                if (nextPage && nextPage.classList.contains('product-page')) {
                    currentPage.classList.remove('active');
                    nextPage.classList.add('active');
                    
                    const currentBtn = document.querySelector('.page-btn.active');
                    const nextBtn = currentBtn.nextElementSibling;
                    
                    if (nextBtn && !nextBtn.classList.contains('next-page')) {
                        currentBtn.classList.remove('active');
                        nextBtn.classList.add('active');
                    }
                }
            } else {
                const pageNumber = this.textContent;
                
                document.querySelectorAll('.product-page').forEach(page => page.classList.remove('active'));
                pageButtons.forEach(btn => btn.classList.remove('active'));
                
                document.querySelector(`.product-page[data-page="${pageNumber}"]`).classList.add('active');
                this.classList.add('active');
            }
        });
    });
});
