// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initAnimations();
    initCardEffects();
    initScrollEffects();
    initKeyboardShortcuts();
    initializeFAQ();
    initializeGogHomepage();
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有活跃状态
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // 添加活跃状态
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // 添加导航点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 页面标题更新
            updatePageTitle(targetSection);
        });
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            let targetLink = null;
            switch(e.key) {
                case '1':
                    targetLink = document.querySelector('[data-section="home"]');
                    break;
                case '2':
                    targetLink = document.querySelector('[data-section="analyzer"]');
                    break;
                case '3':
                    targetLink = document.querySelector('[data-section="about"]');
                    break;
            }
            
            if (targetLink) {
                e.preventDefault();
                targetLink.click();
            }
        }
    });
}

// 更新页面标题
function updatePageTitle(section) {
    const titles = {
        'home': 'GameFlip - 首页',
        'analyzer': 'GameFlip - 解构师',
        'about': 'GameFlip - 关于我们'
    };
    
    if (titles[section]) {
        document.title = titles[section];
    }
}

// 动画效果初始化
function initAnimations() {
    // 页面加载动画
    const elements = document.querySelectorAll('.game-card, .digest-card');
    
    // 创建Intersection Observer监听元素进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // 错开动画时间
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // 为所有卡片添加初始样式和观察
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// 卡片交互效果
function initCardEffects() {
    // 游戏卡片效果
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // 鼠标移动视差效果
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.05;
            const deltaY = (e.clientY - centerY) * 0.05;
            
            card.style.transform = `translateY(-5px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
        
        // 点击效果 - 直接打开页面
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            openGamePage(this);
        });
    });
    
    // 解构师卡片效果
    const digestCards = document.querySelectorAll('.digest-card');
    digestCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (!card.classList.contains('locked')) {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.03;
                const deltaY = (e.clientY - centerY) * 0.03;
                
                card.style.transform = `translateY(-8px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
        
        // 点击效果 - 直接打开页面
        card.addEventListener('click', function() {
            openDigestPage(this);
        });
    });
}

// 滚动效果
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.card-image img');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index % 3) * 0.2;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// 键盘快捷键
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC键关闭模态框
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        // 空格键暂停/播放动画
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            toggleAnimations();
        }
    });
}

// 初始化FAQ手风琴效果
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // 为GOG风格的FAQ，默认显示答案，添加悬浮效果
        if (answer) {
            // 确保答案默认可见
            answer.style.display = 'block';
            answer.style.opacity = '1';
        }
        
        // 添加点击效果
        if (question) {
            question.addEventListener('click', () => {
                // 添加点击动画效果
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = 'translateY(-5px)';
                }, 100);
                
                // 切换高亮状态
                item.classList.toggle('highlighted');
                
                // 3秒后移除高亮
                setTimeout(() => {
                    item.classList.remove('highlighted');
                }, 3000);
            });
        }
    });
}

// 初始化GOG首页动画效果
function initializeGogHomepage() {
    // 英雄区域动画
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // 添加渐入动画
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // 特性项悬浮效果
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
    
    // 下载按钮脉冲效果
    const downloadBtns = document.querySelectorAll('.download-btn-large');
    downloadBtns.forEach(btn => {
        setInterval(() => {
            btn.style.boxShadow = '0 0 40px rgba(145, 70, 255, 0.8)';
            setTimeout(() => {
                btn.style.boxShadow = '0 10px 30px rgba(145, 70, 255, 0.4)';
            }, 1000);
        }, 5000);
    });
}

// 直接打开游戏页面
function openGamePage(gameCard) {
    const title = gameCard.querySelector('.game-title').textContent;
    const subtitle = gameCard.querySelector('.game-subtitle').textContent;
    
    // 创建游戏详情页面内容
    const gamePageContent = `
        <div class="page-header">
            <button class="back-btn" onclick="goBackToHome()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
            <h1 class="page-title">${title}</h1>
            <div class="page-subtitle">${subtitle}</div>
        </div>
        
        <div class="game-detail-content">
            <div class="game-preview">
                <div class="game-image-large">
                    <img src="https://via.placeholder.com/800x450/cccccc/666666?text=${encodeURIComponent(title)}" alt="${title}">
                    <div class="play-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="game-info-panel">
                <div class="game-stats">
                    <div class="stat-item">
                        <i class="fas fa-gamepad"></i>
                        <span>类型: 动作冒险</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-star"></i>
                        <span>评分: 9.2/10</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar"></i>
                        <span>发布日期: 2024年9月</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-download"></i>
                        <span>下载量: 125,847</span>
                    </div>
                </div>
                
                <div class="game-description">
                    <h3>游戏介绍</h3>
                    <p>这是一款精心设计的游戏，融合了优秀的AI系统和引人入胜的故事情节。玩家将体验到前所未有的游戏乐趣，探索充满挑战的虚拟世界。</p>
                    <p>游戏特色包括智能AI对手、动态剧情发展、丰富的角色定制系统，以及令人惊叹的视觉效果。无论您是休闲玩家还是硬核游戏爱好者，都能在这里找到属于自己的乐趣。</p>
                </div>
                
                <div class="game-actions">
                    <button class="btn-primary btn-large">
                        <i class="fas fa-play"></i>
                        立即开始
                    </button>
                    <button class="btn-secondary">
                        <i class="fas fa-heart"></i>
                        收藏游戏
                    </button>
                    <button class="btn-secondary">
                        <i class="fas fa-share"></i>
                        分享好友
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 隐藏当前页面，显示游戏详情页面
    showGameDetailPage(gamePageContent);
}

// 显示订阅信息页面
function showSubscriptionInfo() {
    const subscriptionPageContent = `
        <div class="page-header">
            <button class="back-btn" onclick="goBackToAnalyzer()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
            <h1 class="page-title"><i class="fas fa-lock"></i> 内容已锁定</h1>
            <div class="page-subtitle">此内容需要会员订阅才能访问</div>
        </div>
        
        <div class="subscription-content">
            <div class="subscription-intro">
                <p>解锁GMTK解构师的全部内容，获取深度游戏分析和独家见解。</p>
            </div>
            
            <div class="plans-container">
                <div class="plan-card">
                    <h3>基础会员</h3>
                    <div class="price">¥29<span>/月</span></div>
                    <ul class="features-list">
                        <li><i class="fas fa-check"></i>访问所有基础内容</li>
                        <li><i class="fas fa-check"></i>每月最新解构分析</li>
                        <li><i class="fas fa-check"></i>社区讨论权限</li>
                        <li><i class="fas fa-check"></i>游戏推荐算法</li>
                    </ul>
                    <button class="btn-secondary subscribe-btn">
                        选择基础会员
                    </button>
                </div>
                
                <div class="plan-card premium">
                    <div class="popular-badge">最受欢迎</div>
                    <h3>高级会员</h3>
                    <div class="price">¥59<span>/月</span></div>
                    <ul class="features-list">
                        <li><i class="fas fa-check"></i>所有基础会员权限</li>
                        <li><i class="fas fa-check"></i>独家深度分析</li>
                        <li><i class="fas fa-check"></i>提前访问新内容</li>
                        <li><i class="fas fa-check"></i>一对一游戏咨询</li>
                        <li><i class="fas fa-check"></i>游戏开发者访谈</li>
                    </ul>
                    <button class="btn-primary subscribe-btn">
                        <i class="fas fa-crown"></i>
                        选择高级会员
                    </button>
                </div>
            </div>
            
            <div class="subscription-benefits">
                <h3>会员专享权益</h3>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <i class="fas fa-book-open"></i>
                        <h4>深度解析</h4>
                        <p>获取游戏机制的深层解读</p>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-users"></i>
                        <h4>社区交流</h4>
                        <p>与其他游戏爱好者互动</p>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-star"></i>
                        <h4>独家内容</h4>
                        <p>优先体验最新游戏分析</p>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-headset"></i>
                        <h4>专业指导</h4>
                        <p>获得游戏专家的建议</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showSubscriptionPage(subscriptionPageContent);
}

// 直接打开解构师内容页面
function openDigestPage(digestCard) {
    const title = digestCard.querySelector('.card-title').textContent;
    const description = digestCard.querySelector('.card-description').textContent;
    
    const digestPageContent = `
        <div class="page-header">
            <button class="back-btn" onclick="goBackToAnalyzer()">
                <i class="fas fa-arrow-left"></i> 返回解构师
            </button>
            <h1 class="page-title">${title}</h1>
            <div class="page-subtitle">游戏设计深度分析</div>
        </div>
        
        <div class="digest-detail-content">
            <div class="digest-meta">
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>发布时间: 2024年9月23日</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>阅读时长: 约15分钟</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-eye"></i>
                    <span>浏览量: 3,247</span>
                </div>
            </div>
            
            <div class="digest-main-content">
                <div class="content-intro">
                    <p class="intro-text">${description}</p>
                </div>
                
                <div class="content-sections">
                    <section class="content-section">
                        <h3><i class="fas fa-gamepad"></i> 游戏机制深度分析</h3>
                        <p>本期我们深入分析了现代游戏中AI系统的设计原理。通过对多款热门游戏的解构，我们发现优秀的AI不仅仅是复杂的算法，更是与玩家体验紧密结合的设计哲学。</p>
                        <p>从《巫师3》的NPC行为系统，到《文明6》的战略AI，每一个成功的案例都展现了游戏设计者对玩家心理的深刻理解。</p>
                    </section>
                    
                    <section class="content-section">
                        <h3><i class="fas fa-lightbulb"></i> 设计理念解读</h3>
                        <p>优秀的游戏AI应该是invisible的 - 它不应该让玩家感觉到是在与机器对话，而是在与一个有生命的角色互动。这种设计理念的核心在于：</p>
                        <ul>
                            <li>可预测性与惊喜的平衡</li>
                            <li>适应性学习机制</li>
                            <li>情境感知能力</li>
                            <li>错误恢复策略</li>
                        </ul>
                    </section>
                    
                    <section class="content-section">
                        <h3><i class="fas fa-microphone"></i> 开发者访谈摘要</h3>
                        <p>我们采访了几位知名游戏开发者，了解他们在AI设计过程中遇到的挑战和解决方案：</p>
                        <blockquote>
                            "最大的挑战不是让AI变得更聪明，而是让它变得更'人性化'。玩家能够容忍一个愚蠢但有趣的AI，但无法忍受一个完美但无聊的对手。"
                            <cite>- 某知名RPG制作人</cite>
                        </blockquote>
                    </section>
                    
                    <section class="content-section">
                        <h3><i class="fas fa-comments"></i> 社区反馈汇总</h3>
                        <p>来自玩家社区的反馈显示，最受欢迎的AI特征包括：</p>
                        <div class="feedback-stats">
                            <div class="stat">
                                <div class="stat-number">73%</div>
                                <div class="stat-label">喜欢有个性的AI角色</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">68%</div>
                                <div class="stat-label">重视AI的学习能力</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">81%</div>
                                <div class="stat-label">希望AI有适度挑战性</div>
                            </div>
                        </div>
                    </section>
                </div>
                
                <div class="digest-actions">
                    <button class="btn-primary">
                        <i class="fas fa-heart"></i>
                        收藏文章
                    </button>
                    <button class="btn-secondary">
                        <i class="fas fa-share"></i>
                        分享给朋友
                    </button>
                    <button class="btn-secondary">
                        <i class="fas fa-comment"></i>
                        参与讨论
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showDigestDetailPage(digestPageContent);
}

// 创建模态框
function createModal(id, content) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.innerHTML = content;
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(id);
        }
    });
    
    return modal;
}

// 关闭模态框
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// 关闭所有模态框
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        closeModal(modal.id);
    });
}

// 切换动画
function toggleAnimations() {
    const body = document.body;
    if (body.classList.contains('animations-paused')) {
        body.classList.remove('animations-paused');
        showNotification('动画已恢复', 'info');
    } else {
        body.classList.add('animations-paused');
        showNotification('动画已暂停', 'info');
    }
}

// 通知系统（已禁用）
function showNotification(message, type = 'info') {
    // 所有通知都已禁用，不显示任何弹出提示
    return;
}

// 辅助函数已删除（通知系统已禁用）

// 添加模态框样式到页面
// 显示游戏详情页面
function showGameDetailPage(content) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section class="content-section active game-detail-page">
            ${content}
        </section>
    `;
}

// 显示解构师详情页面
function showDigestDetailPage(content) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section class="content-section active digest-detail-page">
            ${content}
        </section>
    `;
}

// 显示订阅页面
function showSubscriptionPage(content) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section class="content-section active subscription-page">
            ${content}
        </section>
    `;
}

// 返回首页
function goBackToHome() {
    location.reload(); // 简单重新加载页面
}

// 返回解构师页面
function goBackToAnalyzer() {
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const analyzerSection = document.getElementById('analyzer');
    
    // 重新加载原始页面内容
    location.reload();
}

const modalStyles = `
<style>
.modal {
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
    transition: opacity 0.3s ease;
}

.modal.show {
    opacity: 1;
}

.modal-content {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.modal.show .modal-content {
    transform: scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
    color: #ff6b6b;
    font-size: 1.5rem;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 25px;
}

.modal-subtitle {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 20px;
    font-size: 1.1rem;
}

.game-details, .subscription-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 0;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.9);
}

.detail-item i {
    color: #4ecdc4;
    width: 20px;
}

.plan {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.plan.premium {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.plan h3 {
    color: #ff6b6b;
    margin-bottom: 10px;
}

.price {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 15px;
}

.plan ul {
    list-style: none;
    padding: 0;
}

.plan li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
}

.plan li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #4ecdc4;
}

.modal-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
    justify-content: center;
}

.btn-primary, .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.content-preview {
    margin-top: 20px;
}

.content-preview h3 {
    color: #4ecdc4;
    margin-bottom: 15px;
}

.content-preview ul {
    list-style: none;
    padding: 0;
}

.content-preview li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
}

.content-preview li::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: #ff6b6b;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.animations-paused * {
    animation-play-state: paused !important;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);

// 首页视频播放控制
function toggleHeroVideo() {
    const heroVideo = document.getElementById('heroVideo');
    const playIcon = document.getElementById('heroPlayIcon');
    const playButton = document.querySelector('.video-play-button');
    
    if (heroVideo && playIcon && playButton) {
        // 播放按钮点击效果
        playButton.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
        
        if (heroVideo.paused) {
            // 播放视频并开启声音
            heroVideo.muted = false;
            heroVideo.play().then(() => {
                playIcon.innerHTML = '<i class="fas fa-pause"></i>';
                showNotification('视频播放中', 'success');
            }).catch(err => {
                console.error('视频播放失败:', err);
                showNotification('视频播放失败，请检查文件是否存在', 'error');
            });
        } else {
            // 暂停视频
            heroVideo.pause();
            playIcon.innerHTML = '<i class="fas fa-play"></i>';
            showNotification('视频已暂停', 'info');
        }
    }
}

// 打开本地视频模态框
function openVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (videoModal) {
        videoModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 播放本地视频
        if (modalVideo) {
            modalVideo.currentTime = 0; // 重置到开始位置
            modalVideo.play().catch(e => {
                console.log('自动播放被浏览器阻止，需要用户手动播放');
                showNotification('请点击视频播放按钮开始播放', 'info');
            });
        }
        
        // 添加键盘事件监听（支持ESC关闭和空格播放/暂停）
        document.addEventListener('keydown', handleVideoModalKeydown);
        
        // 播放按钮点击效果
        const playButton = document.querySelector('.video-play-button');
        if (playButton) {
            playButton.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 150);
        }
        
        // 显示通知
        showNotification('视频播放器已打开', 'info');
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const playIcon = document.getElementById('heroPlayIcon');
    
    if (videoModal) {
        videoModal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
        
        // 停止本地视频播放
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0; // 重置到开始位置
        }
        
        // 重置播放按钮图标为播放状态
        if (playIcon) {
            playIcon.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // 移除键盘事件监听
        document.removeEventListener('keydown', handleVideoModalKeydown);
        
        // 显示通知
        showNotification('视频播放器已关闭', 'info');
    }
}

// 处理视频模态框的键盘事件
function handleVideoModalKeydown(e) {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!videoModal || !videoModal.classList.contains('show')) {
        return;
    }
    
    switch(e.key) {
        case 'Escape':
            e.preventDefault();
            closeVideoModal();
            break;
        case ' ': // 空格键
            e.preventDefault();
            if (modalVideo) {
                if (modalVideo.paused) {
                    modalVideo.play();
                    showNotification('视频已播放', 'info');
                } else {
                    modalVideo.pause();
                    showNotification('视频已暂停', 'info');
                }
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (modalVideo) {
                modalVideo.currentTime = Math.max(0, modalVideo.currentTime - 10);
                showNotification('后退10秒', 'info');
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (modalVideo) {
                modalVideo.currentTime = Math.min(modalVideo.duration, modalVideo.currentTime + 10);
                showNotification('前进10秒', 'info');
            }
            break;
    }
}

// 本地视频播放器初始化
function initializeVideoPlayer() {
    console.log('本地视频播放器已初始化');
    
    const modalVideo = document.getElementById('modalVideo');
    if (modalVideo) {
        // 监听视频加载事件
        modalVideo.addEventListener('loadeddata', function() {
            console.log('视频数据加载完成');
        });
        
        modalVideo.addEventListener('error', function(e) {
            console.error('视频加载错误:', e);
            showNotification('视频加载失败，请检查视频文件是否存在', 'error');
        });
        
        modalVideo.addEventListener('ended', function() {
            console.log('视频播放结束');
            showNotification('视频播放完毕', 'info');
        });
    }
}


// 初始化首页视频
function initializeHeroVideo() {
    const heroVideo = document.getElementById('heroVideo');
    const playIcon = document.getElementById('heroPlayIcon');
    
    // 确保播放按钮初始状态为播放图标
    if (playIcon) {
        playIcon.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    if (heroVideo) {
        // 视频加载完成事件
        heroVideo.addEventListener('loadeddata', function() {
            console.log('首页视频加载完成');
            // 确保按钮显示播放图标（因为视频是静音循环的）
            if (playIcon) {
                playIcon.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        // 视频播放事件（这个是针对背景视频的，不影响按钮状态）
        heroVideo.addEventListener('play', function() {
            // 背景视频播放不改变按钮图标，因为按钮是用来打开弹窗的
            console.log('背景视频开始播放');
        });
        
        // 视频暂停事件
        heroVideo.addEventListener('pause', function() {
            console.log('背景视频暂停');
        });
        
        // 视频结束事件
        heroVideo.addEventListener('ended', function() {
            console.log('背景视频结束');
        });
        
        // 视频错误事件
        heroVideo.addEventListener('error', function(e) {
            console.error('视频加载错误:', e);
            showNotification('视频文件加载失败，请检查 res/display.mp4 是否存在', 'error');
        });
    }
}

// 在DOM加载完成后初始化视频播放器
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保所有元素都已加载
    setTimeout(initializeVideoPlayer, 100);
    setTimeout(initializeHeroVideo, 100);
});
