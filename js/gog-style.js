// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initAnimations();
    initScrollEffects();
    initKeyboardShortcuts();
    initializeFAQ();
    initializeGogHomepage();
    initUserCounter();
    
    // 加载视频数据并初始化卡片
    loadVideoData();
    
    // 延迟处理页面导航状态，确保所有组件都已初始化
    setTimeout(handlePageNavigation, 100);
});

// 处理页面导航状态
function handlePageNavigation() {
    // 检查是否需要显示解构师页面（从详情页面返回）
    if (sessionStorage.getItem('showAnalyzer')) {
        const analyzerLink = document.querySelector('.nav-link[data-section="analyzer"]');
        if (analyzerLink) {
            analyzerLink.click();
        }
        // 清除标记，避免下次刷新时重复跳转
        sessionStorage.removeItem('showAnalyzer');
        return; // 已处理返回导航，无需处理其他情况
    }
    
    // 处理URL哈希值（仅在首次访问时，不在刷新时）
    const hash = window.location.hash.substring(1);
    if (hash && !sessionStorage.getItem('hasVisited')) {
        const targetLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
    
    // 标记已访问过页面，防止刷新时重复处理哈希
    sessionStorage.setItem('hasVisited', 'true');
    
    // 清理URL中的哈希值，确保URL干净
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

// 加载视频数据
async function loadVideoData() {
    const digestGrid = document.querySelector('.digest-grid');
    
    try {
        console.log('正在加载视频数据...');
        const response = await fetch('data/games_video.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const videoData = await response.json();
        console.log('视频数据加载成功:', videoData);
        
        // 生成解构师卡片
        generateDigestCards(videoData);
        
        // 初始化卡片效果
        initCardEffects();
        
    } catch (error) {
        console.error('Failed to load video data:', error);
        console.log('使用备用数据...');
        
        // 使用内嵌的备用数据
        const fallbackData = [
            {
                "num": 1,
                "title": "《空洞骑士》音乐全拆解（总集）",
                "desc": "全网最细140分钟",
                "link": "<iframe src=\"//player.bilibili.com/player.html?isOutside=true&aid=114945270222668&bvid=BV1J48CzUEbt&cid=31388861896&p=1\" scrolling=\"no\" border=\"0\" frameborder=\"no\" framespacing=\"0\" allowfullscreen=\"true\"></iframe>",
                "cover": "data/covers/1.jpg",
                "date": "20250925"
            }
        ];
        
        // 生成解构师卡片
        generateDigestCards(fallbackData);
        
        // 初始化卡片效果
        initCardEffects();
    }
}

// 生成解构师卡片
function generateDigestCards(videoData) {
    const digestGrid = document.querySelector('.digest-grid');
    if (!digestGrid) {
        console.error('找不到 .digest-grid 元素');
        return;
    }
    
    console.log(`生成 ${videoData.length} 个视频卡片`);
    
    // 清空现有内容（包括加载占位符）
    digestGrid.innerHTML = '';
    
    // 检查是否有数据
    if (!videoData || videoData.length === 0) {
        digestGrid.innerHTML = `
            <div class="no-data-message" style="grid-column: 1 / -1; text-align: center; color: #888; padding: 40px;">
                <i class="fas fa-video-slash" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3 style="color: #ccc; margin: 20px 0;">暂无视频内容</h3>
                <p>请检查 data/games_video.json 文件是否包含有效数据</p>
            </div>
        `;
        return;
    }
    
    // 为每个视频数据生成卡片
    videoData.forEach((video, index) => {
        console.log(`生成卡片 ${index + 1}: ${video.title}`);
        
        // 转义单引号和双引号以避免HTML属性冲突
        const escapedCover = video.cover.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        const escapedTitle = video.title.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        
        // 使用相对路径处理图片URL
        let imageUrl = video.cover;
        
        // 使用本地图片，如果加载失败则使用placeholder
        // imageUrl = 'https://via.placeholder.com/400x250/8B5CF6/ffffff?text=Video+Thumbnail';
        
        const cardHTML = `
            <article class="digest-card" data-video="${video.link.replace(/"/g, "&quot;")}">
                <div class="card-image">
                    <img src="${imageUrl}" 
                         alt="${video.title}" 
                         onerror="console.error('图片加载失败:', this.src); this.src='https://via.placeholder.com/400x250/8B5CF6/ffffff?text=Video';"
                         onload="console.log('图片加载成功:', this.src);"
                         style="display: block;">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${video.title}</h3>
                    <p class="card-description">${video.desc}</p>
                </div>
            </article>
        `;
        
        console.log('即将插入卡片HTML，图片URL:', imageUrl);
        
        digestGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // 添加淡入动画效果和事件绑定
    const cards = digestGrid.querySelectorAll('.digest-card');
    console.log(`添加动画效果到 ${cards.length} 个卡片`);
    
    cards.forEach((card, index) => {
        // 添加动画效果
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // 绑定点击事件
        card.addEventListener('click', function() {
            console.log('卡片被点击:', this);
            openDigestPage(this);
        });
        
        // 绑定悬停效果
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
    });
    
    console.log('卡片生成完成，事件已绑定');
}

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
                <p>解锁游戏解构师的全部内容，获取深度游戏分析和独家见解。</p>
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

// 直接打开哔哩哔哩视频
function openDigestPage(digestCard) {
    console.log('🎬 openDigestPage 被调用，卡片:', digestCard);
    
    const videoUrl = digestCard.getAttribute('data-video');
    const videoTitle = digestCard.querySelector('.card-title')?.textContent || '游戏解构师视频';
    
    console.log('📹 视频URL:', videoUrl);
    console.log('🏷️ 视频标题:', videoTitle);
    
    if (videoUrl) {
        // 转换为嵌入式播放链接并打开弹窗
        const embedUrl = convertBilibiliToEmbedUrl(videoUrl);
        console.log('🔗 转换后的嵌入URL:', embedUrl);
        
        if (embedUrl) {
            openVideoModalWithUrl(embedUrl, videoTitle);
        } else {
            console.warn('⚠️ 转换失败，降级为新窗口打开');
            // 如果转换失败，降级为新窗口打开
            window.open(videoUrl, '_blank');
        }
    } else {
        console.error('❌ 没有找到视频链接');
        // 如果没有视频链接，显示提示
        alert('该内容的视频链接暂未配置');
    }
}

// 将B站视频链接转换为嵌入式播放链接
function convertBilibiliToEmbedUrl(videoUrl) {
    try {
        console.log('🔄 开始转换视频URL:', videoUrl);
        
        // 如果是iframe代码，提取src
        if (videoUrl.includes('<iframe')) {
            console.log('📄 检测到iframe代码，提取src...');
            const srcMatch = videoUrl.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
                let src = srcMatch[1];
                console.log('📄 提取的src:', src);
                // 处理协议相对URL
                if (src.startsWith('//')) {
                    src = 'https:' + src;
                    console.log('🔗 添加协议后:', src);
                }
                videoUrl = src;
            } else {
                console.error('❌ 无法从iframe中提取src');
                return null;
            }
        }
        
        // 检查是否是B站链接
        if (!videoUrl.includes('bilibili.com')) {
            return null;
        }
        
        // 如果已经是嵌入式链接，直接返回并添加自动播放参数
        if (videoUrl.includes('player.bilibili.com')) {
            // 确保包含自动播放和声音参数
            const url = new URL(videoUrl);
            url.searchParams.set('autoplay', '1');
            url.searchParams.set('muted', '0'); // 不静音
            url.searchParams.set('high_quality', '1');
            url.searchParams.set('danmaku', '1');
            url.searchParams.set('as_wide', '1');
            url.searchParams.set('t', '0'); // 从头播放
            url.searchParams.set('volume', '0.2'); // 设置音量为20%
            return url.toString();
        }
        
        // 提取BV号或aid
        let bvid = null;
        let aid = null;
        
        // 从URL中提取BV号
        const bvMatch = videoUrl.match(/BV[0-9A-Za-z]+/);
        if (bvMatch) {
            bvid = bvMatch[0];
        }
        
        // 从URL中提取aid（如果有）
        const aidMatch = videoUrl.match(/av(\d+)/);
        if (aidMatch) {
            aid = aidMatch[1];
        }
        
        // 构建嵌入式播放链接
        if (bvid) {
            return `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&muted=0&high_quality=1&danmaku=1&as_wide=1&t=0&volume=0.2`;
        } else if (aid) {
            return `https://player.bilibili.com/player.html?aid=${aid}&autoplay=1&muted=0&high_quality=1&danmaku=1&as_wide=1&t=0&volume=0.2`;
        }
        
        return null;
    } catch (error) {
        console.error('转换B站链接失败:', error);
        return null;
    }
}

// 用指定URL打开视频模态框
function openVideoModalWithUrl(embedUrl, title = '视频播放') {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (videoModal && modalVideo) {
        // 立即显示模态框，不等待视频加载
        videoModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 添加键盘事件监听（仅支持ESC关闭）
        document.addEventListener('keydown', handleVideoModalKeydown);
        
        console.log('✅ 视频弹窗已立即打开，开始加载视频...');
        console.log('🎬 视频标题:', title);
        
        // 设置iframe的src开始加载视频
        modalVideo.src = embedUrl;
        
        // 监听iframe加载完成事件
        modalVideo.onload = function() {
            console.log('🎥 视频加载完成');
            
            // 尝试设置视频音量为20%
            setTimeout(() => {
                try {
                    setVideoVolume(modalVideo, 0.2);
                } catch (error) {
                    console.log('无法直接控制iframe内视频音量，依赖URL参数设置');
                }
            }, 1000); // 等待1秒让B站播放器完全初始化
        };
        
        // 监听iframe加载错误事件
        modalVideo.onerror = function() {
            console.error('❌ 视频加载失败');
        };
        
        console.log('🔗 开始加载视频URL:', embedUrl);
        
    } else {
        console.error('找不到视频模态框元素');
        // 降级为新窗口打开
        window.open(embedUrl, '_blank');
    }
}


// 设置视频音量
function setVideoVolume(modalVideo, volume) {
    try {
        console.log(`🔊 尝试设置视频音量为 ${Math.round(volume * 100)}%`);
        
        // 方法1: 通过postMessage与B站播放器通信
        modalVideo.contentWindow.postMessage({
            type: 'bilibili_player_cmd',
            cmd: 'volume',
            data: volume
        }, '*');
        
        // 方法2: 尝试其他可能的命令格式
        modalVideo.contentWindow.postMessage({
            type: 'volume',
            volume: volume
        }, '*');
        
        // 方法3: 尝试直接访问iframe内的视频元素（可能因跨域限制失败）
        try {
            const iframeDoc = modalVideo.contentDocument || modalVideo.contentWindow.document;
            const videos = iframeDoc.querySelectorAll('video');
            videos.forEach(video => {
                if (video.volume !== undefined) {
                    video.volume = volume;
                    video.muted = false;
                    console.log(`✅ 已设置视频音量为 ${Math.round(volume * 100)}%`);
                }
            });
        } catch (e) {
            console.log('跨域限制：无法直接访问iframe内容');
        }
        
    } catch (error) {
        console.warn('设置视频音量失败:', error);
    }
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

// 打开哔哩哔哩视频模态框
function openVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (videoModal) {
        videoModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 设置哔哩哔哩视频iframe
        if (modalVideo) {
            const videoSrc = modalVideo.getAttribute('data-video-src');
            modalVideo.src = videoSrc;
        }
        
        // 添加键盘事件监听（仅支持ESC关闭）
        document.addEventListener('keydown', handleVideoModalKeydown);
        
        // 播放按钮点击效果
        const playButton = document.querySelector('.video-play-button');
        if (playButton) {
            playButton.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 150);
        }
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const playIcon = document.getElementById('heroPlayIcon');
    
    if (videoModal) {
        videoModal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
        
        // 停止哔哩哔哩视频播放
        if (modalVideo) {
            modalVideo.src = 'about:blank'; // 清空iframe内容，停止播放
            modalVideo.onload = null; // 清理事件监听器
            modalVideo.onerror = null; // 清理事件监听器
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
        // iframe模式下不支持视频控制快捷键
    }
}

// 哔哩哔哩iframe播放器初始化
function initializeVideoPlayer() {
    console.log('哔哩哔哩视频播放器已初始化');
    
    const modalVideo = document.getElementById('modalVideo');
    if (modalVideo) {
        // iframe加载完成监听
        modalVideo.addEventListener('load', function() {
            console.log('哔哩哔哩视频iframe加载完成');
        });
        
        // iframe加载错误监听
        modalVideo.addEventListener('error', function(e) {
            console.error('哔哩哔哩视频iframe加载错误:', e);
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

// 用户计数器功能
function initUserCounter() {
    const userCountElement = document.getElementById('userCount');
    const userCountElement2 = document.getElementById('userCount2');
    const downloadBtn1 = document.getElementById('download-btn-1');
    const downloadBtn2 = document.getElementById('download-btn-2');
    
    if (!userCountElement && !userCountElement2) return;
    
    // 从localStorage获取当前计数，如果不存在则使用基础值1000
    let currentCount = localStorage.getItem('gameflip_user_count');
    if (currentCount === null) {
        currentCount = 1000;
        localStorage.setItem('gameflip_user_count', currentCount);
    } else {
        currentCount = parseInt(currentCount);
    }
    
    // 更新显示
    function updateCounter() {
        const formattedCount = currentCount.toLocaleString();
        if (userCountElement) {
            userCountElement.textContent = formattedCount;
        }
        if (userCountElement2) {
            userCountElement2.textContent = formattedCount;
        }
    }
    
    // 增加计数
    function incrementCounter() {
        currentCount++;
        localStorage.setItem('gameflip_user_count', currentCount);
        updateCounter();
        
        // 简单的动画效果
        const elements = [userCountElement, userCountElement2].filter(el => el);
        elements.forEach(element => {
            element.style.transform = 'scale(1.1)';
            element.style.color = '#A855F7';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '#8B5CF6';
            }, 200);
        });
    }
    
    // 初始显示
    updateCounter();
    
    // 为两个下载按钮添加点击事件
    if (downloadBtn1) {
        downloadBtn1.addEventListener('click', incrementCounter);
    }
    
    if (downloadBtn2) {
        downloadBtn2.addEventListener('click', incrementCounter);
    }
}

// 在DOM加载完成后初始化视频播放器
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保所有元素都已加载
    setTimeout(initializeVideoPlayer, 100);
    setTimeout(initializeHeroVideo, 100);
});
