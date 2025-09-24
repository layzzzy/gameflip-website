// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initLoading();
    initNavigation();
    initHeroAnimations();
    initScrollEffects();
    initGameCarousel();
    initContactForm();
    initParticleEffects();
    initAOS();
    initSmoothScroll();
});

// 加载屏幕动画
function initLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    // 模拟加载进度
    let progress = 0;
    const loadingTexts = [
        '正在加载游戏世界...',
        '准备精彩内容...',
        '马上就好...',
        '欢迎来到GameFlip!'
    ];
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // 完成加载后隐藏加载屏幕
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
        
        loadingProgress.style.width = progress + '%';
        
        // 更新加载文本
        const textIndex = Math.floor((progress / 100) * (loadingTexts.length - 1));
        loadingText.textContent = loadingTexts[textIndex];
    }, 200);
}

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 导航链接活跃状态
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + targetId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.6 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 主页动画效果
function initHeroAnimations() {
    const heroCards = document.querySelectorAll('.preview-card');
    const floatingShapes = document.querySelectorAll('.shape');
    
    // 鼠标移动视差效果
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        heroCards.forEach((card, index) => {
            const speed = (index + 1) * 0.3;
            const x = (mouseX - 0.5) * speed * 30;
            const y = (mouseY - 0.5) * speed * 30;
            
            card.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
        });
    });
    
    // 卡片点击效果
    heroCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });
}

// 滚动效果
function initScrollEffects() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // 返回顶部按钮
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动时元素动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .game-card, .contact-info, .contact-form');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // 初始化元素状态
    const elements = document.querySelectorAll('.feature-card, .game-card, .contact-info, .contact-form');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查
}

// 游戏轮播图
function initGameCarousel() {
    const track = document.querySelector('.games-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const gameCards = document.querySelectorAll('.game-card');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cardWidth = 320; // 卡片宽度 + 间距
    const maxIndex = gameCards.length - 3; // 显示3张卡片
    
    // 下一张
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // 上一张
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // 更新轮播位置
    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // 更新按钮状态
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }
    
    // 自动轮播
    setInterval(() => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 5000);
    
    // 卡片悬停效果
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // 下载按钮点击效果
        const downloadBtn = card.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDownloadModal(card);
            });
        }
        
        // 信息按钮点击效果
        const infoBtn = card.querySelector('.info-btn');
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showGameInfo(card);
            });
        }
    });
    
    // 初始状态
    updateCarousel();
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // 验证表单
        if (!name || !email || !message) {
            showNotification('请填写所有必填字段', 'error');
            return;
        }
        
        // 提交动画
        submitBtn.style.transform = 'scale(0.95)';
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        
        // 模拟提交
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功!';
            showNotification('消息发送成功！我们会尽快回复您。', 'success');
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>发送消息</span><i class="fas fa-paper-plane"></i>';
                submitBtn.style.transform = '';
            }, 2000);
        }, 2000);
    });
    
    // 输入框焦点效果
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// 粒子效果
function initParticleEffects() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    
    // 创建粒子
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(22, 217, 227, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: particleMove ${5 + Math.random() * 10}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particles.appendChild(particle);
    }
    
    // 添加粒子动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleMove {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(100px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 动画库初始化
function initAOS() {
    // 简单的动画观察器
    const observeElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-aos');
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, { threshold: 0.1 });
    
    observeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 显示下载模态框
function showDownloadModal(gameCard) {
    const gameName = gameCard.querySelector('h3').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>下载 ${gameName}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>您即将下载 <strong>${gameName}</strong></p>
                <div class="download-info">
                    <div class="info-item">
                        <i class="fas fa-hdd"></i>
                        <span>文件大小: 2.5GB</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-star"></i>
                        <span>评分: 4.5/5</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-download"></i>
                        <span>下载次数: 12,345</span>
                    </div>
                </div>
                <div class="download-buttons">
                    <button class="btn-primary download-confirm">
                        <i class="fas fa-download"></i>
                        开始下载
                    </button>
                    <button class="btn-secondary cancel-download">取消</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .download-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: modalFadeIn 0.3s forwards;
        }
        
        .modal-content {
            background: var(--darker-bg);
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(22, 217, 227, 0.2);
            transform: scale(0.8);
            animation: modalScaleIn 0.3s forwards;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(22, 217, 227, 0.1);
        }
        
        .close-btn {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 1.5rem;
            cursor: pointer;
            transition: var(--transition-smooth);
        }
        
        .close-btn:hover {
            color: var(--primary-color);
            transform: rotate(90deg);
        }
        
        .download-info {
            margin: 1.5rem 0;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 0.5rem;
            color: var(--text-muted);
        }
        
        .info-item i {
            color: var(--primary-color);
            width: 20px;
        }
        
        .download-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        @keyframes modalFadeIn {
            to { opacity: 1; }
        }
        
        @keyframes modalScaleIn {
            to { transform: scale(1); }
        }
    `;
    
    document.head.appendChild(modalStyle);
    document.body.appendChild(modal);
    
    // 事件监听
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-download');
    const confirmBtn = modal.querySelector('.download-confirm');
    
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyle);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    confirmBtn.addEventListener('click', () => {
        showNotification(`${gameName} 开始下载！`, 'success');
        closeModal();
    });
}

// 显示游戏信息
function showGameInfo(gameCard) {
    const gameName = gameCard.querySelector('h3').textContent;
    showNotification(`${gameName} 的详细信息功能开发中...`, 'info');
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // 添加样式
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--darker-bg);
                color: var(--text-light);
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                border-left: 4px solid var(--primary-color);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                max-width: 400px;
                animation: notificationSlideIn 0.3s ease;
            }
            
            .notification.success {
                border-left-color: #4CAF50;
            }
            
            .notification.error {
                border-left-color: #f44336;
            }
            
            .notification.warning {
                border-left-color: #FF9800;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                font-size: 1.2rem;
                margin-left: auto;
                transition: var(--transition-smooth);
            }
            
            .notification-close:hover {
                color: var(--primary-color);
            }
            
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const modal = document.querySelector('.download-modal');
        if (modal) {
            modal.click();
        }
    }
    
    // Ctrl + K 搜索
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        showNotification('搜索功能开发中...', 'info');
    }
});

// 性能优化：节流函数
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
