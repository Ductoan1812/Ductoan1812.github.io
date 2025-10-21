// Data Loader for Portfolio
// Fetches JSON data and renders content dynamically

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getCurrentLanguage();
        this.translations = {};
        this.loadTranslations();
    }

    getCurrentLanguage() {
        return sessionStorage.getItem('portfolio-language') || 'vi';
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        sessionStorage.setItem('portfolio-language', lang);
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'vi' ? 'en' : 'vi';
        this.setLanguage(newLang);
        this.updateLanguageToggle();
        return newLang;
    }

    async loadTranslations() {
        try {
            const response = await fetch('data/translations.json');
            if (response.ok) {
                this.translations = await response.json();
            }
        } catch (error) {
            console.warn('Could not load translations:', error);
        }
    }

    translate(key, originalData = null) {
        if (this.currentLanguage === 'vi') {
            return originalData;
        }

        const keys = key.split('.');
        let translation = this.translations.en;
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return originalData;
            }
        }

        // If translation is an object, merge with original data
        if (typeof translation === 'object' && originalData) {
            return { ...originalData, ...translation };
        }

        return translation || originalData;
    }

    updateLanguageToggle() {
        const flag = document.getElementById('language-flag');
        const text = document.getElementById('language-text');
        
        if (flag && text) {
            if (this.currentLanguage === 'en') {
                flag.textContent = '🇺🇸';
                text.textContent = 'EN';
            } else {
                flag.textContent = '🇻🇳';
                text.textContent = 'VN';
            }
        }
    }
}

class PortfolioDataLoader {
    constructor() {
        this.data = {};
        this.languageManager = new LanguageManager();
        this.init();
    }

    async init() {
        try {
            await this.loadAllData();
            await this.languageManager.loadTranslations();
            this.renderAllContent();
            this.setupLanguageToggle();
            
            // Expose data to global scope for debugging
            window.portfolioData = this.data.profile;
            window.skillsData = this.data.skills;
            window.projectsData = this.data.projects;
            window.contactData = this.data.contact;
            
            console.log('Portfolio data loaded successfully:', this.data);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Fallback to static content if JSON loading fails
        }
    }

    async loadAllData() {
        const dataFiles = ['data/profile.json', 'data/skills.json', 'data/projects.json', 'data/contact.json'];
        
        for (const file of dataFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Failed to load ${file}`);
                const data = await response.json();
                const fileName = file.split('/').pop().replace('.json', '');
                this.data[fileName] = data;
            } catch (error) {
                console.warn(`Could not load ${file}:`, error);
            }
        }
    }

    renderAllContent() {
        this.renderProfile();
        this.renderSkills();
        this.renderProjects();
        this.renderContact();
        this.renderNavigation();
    }

    setupLanguageToggle() {
        const toggle = document.getElementById('language-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.languageManager.toggleLanguage();
                this.renderAllContent();
            });
        }
        this.languageManager.updateLanguageToggle();
    }

    renderNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const translations = [
            this.languageManager.translate('navigation.home', 'Trang chủ'),
            this.languageManager.translate('navigation.about', 'Giới thiệu'),
            this.languageManager.translate('navigation.projects', 'Dự án'),
            this.languageManager.translate('navigation.skills', 'Kỹ năng'),
            this.languageManager.translate('navigation.contact', 'Liên hệ')
        ];

        navLinks.forEach((link, index) => {
            if (translations[index]) {
                link.textContent = translations[index];
            }
        });
    }

    renderProfile() {
        if (!this.data.profile) return;

        const profile = this.data.profile;

        // Update navigation logo
        const navLogo = document.querySelector('.nav-logo span');
        if (navLogo) navLogo.textContent = profile.personal.name;

        // Update page title
        document.title = `${profile.personal.name} - ${profile.personal.title} Portfolio`;

        // Update hero section with translations
        const heroTitle = document.querySelector('.hero-title .gradient-text');
        if (heroTitle) heroTitle.textContent = this.languageManager.translate('hero.title', profile.hero.title);

        const heroSubtitle = document.querySelector('.hero-title br');
        if (heroSubtitle) {
            heroSubtitle.nextSibling.textContent = this.languageManager.translate('hero.subtitle', profile.hero.subtitle);
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) heroDescription.textContent = this.languageManager.translate('hero.description', profile.hero.description);

        // Update hero buttons with translations
        const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
        if (primaryBtn && profile.hero.buttons.primary) {
            const translatedPrimary = this.languageManager.translate('hero.buttons.primary', profile.hero.buttons.primary);
            primaryBtn.innerHTML = `<i class="${translatedPrimary.icon}"></i> ${translatedPrimary.text}`;
            primaryBtn.href = translatedPrimary.link;
        }

        const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');
        if (secondaryBtn && profile.hero.buttons.secondary) {
            const translatedSecondary = this.languageManager.translate('hero.buttons.secondary', profile.hero.buttons.secondary);
            secondaryBtn.innerHTML = `<i class="${translatedSecondary.icon}"></i> ${translatedSecondary.text}`;
            secondaryBtn.href = translatedSecondary.link;
        }

        // Update about section with translations
        const aboutTitle = document.querySelector('.about-text h3');
        if (aboutTitle) aboutTitle.textContent = this.languageManager.translate('about.title', profile.about.title);

        const aboutDescription = document.querySelector('.about-text p');
        if (aboutDescription) aboutDescription.textContent = this.languageManager.translate('about.description', profile.about.description);

        // Update stats with translations
        const stats = document.querySelectorAll('.stat');
        profile.about.stats.forEach((stat, index) => {
            if (stats[index]) {
                const numberEl = stats[index].querySelector('h4');
                const labelEl = stats[index].querySelector('p');
                if (numberEl) numberEl.textContent = stat.number; // Keep numbers unchanged
                if (labelEl) {
                    const translatedLabel = this.languageManager.translate(`about.stats.${index}.label`, stat.label);
                    labelEl.textContent = translatedLabel;
                }
            }
        });

        // Update about image
        const aboutImage = document.querySelector('.about-image .image-placeholder');
        if (aboutImage) {
            if (profile.about.image.placeholder) {
                aboutImage.innerHTML = `<i class="${profile.about.image.icon}"></i><p>${profile.about.image.text}</p>`;
            } else if (profile.about.image.src) {
                aboutImage.innerHTML = `<img src="${profile.about.image.src}" alt="${profile.about.image.alt || profile.personal.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        }

        // Update footer with translations
        const footerText = document.querySelector('.footer-text p');
        if (footerText) {
            const translatedCopyright = this.languageManager.translate('footer.copyright', profile.footer.copyright);
            footerText.textContent = `© ${translatedCopyright}`;
        }

        // Auto-generate footer social links from profile.personal
        const footerSocial = document.querySelector('.footer-social');
        if (footerSocial && profile.personal) {
            footerSocial.innerHTML = '';

            // GitHub link
            if (profile.personal.github) {
                const githubLink = document.createElement('a');
                githubLink.className = 'social-link';
                githubLink.href = profile.personal.github;
                githubLink.target = '_blank';
                githubLink.innerHTML = '<i class="fab fa-github"></i>';
                footerSocial.appendChild(githubLink);
            }

            // LinkedIn link
            if (profile.personal.linkedin) {
                const linkedinLink = document.createElement('a');
                linkedinLink.className = 'social-link';
                linkedinLink.href = profile.personal.linkedin;
                linkedinLink.target = '_blank';
                linkedinLink.innerHTML = '<i class="fab fa-linkedin"></i>';
                footerSocial.appendChild(linkedinLink);
            }

            // Facebook link
            if (profile.personal.facebook) {
                const facebookLink = document.createElement('a');
                facebookLink.className = 'social-link';
                facebookLink.href = profile.personal.facebook;
                facebookLink.target = '_blank';
                facebookLink.innerHTML = '<i class="fab fa-facebook"></i>';
                footerSocial.appendChild(facebookLink);
            }

            // Zalo link
            if (profile.personal.zalo) {
                const zaloLink = document.createElement('a');
                zaloLink.className = 'social-link';
                zaloLink.href = profile.personal.zalo;
                zaloLink.target = '_blank';
                zaloLink.innerHTML = '<i class="fab fa-facebook-messenger"></i>';
                footerSocial.appendChild(zaloLink);
            }

            // Twitter link (optional - can be added to profile.personal if needed)
            const twitterLink = document.createElement('a');
            twitterLink.className = 'social-link';
            twitterLink.href = '#';
            twitterLink.innerHTML = '<i class="fab fa-twitter"></i>';
            footerSocial.appendChild(twitterLink);
        }
    }

    renderSkills() {
        if (!this.data.skills) return;

        const skillsContent = document.querySelector('.skills-content');
        if (!skillsContent) return;

        // Update skills section title
        const skillsTitle = document.querySelector('#skills .section-title');
        if (skillsTitle) {
            skillsTitle.textContent = this.languageManager.translate('skills.title', 'Kỹ năng kỹ thuật');
        }

        // Clear existing content
        skillsContent.innerHTML = '';

        this.data.skills.categories.forEach((category, categoryIndex) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skills-category';

            const categoryTitle = document.createElement('h3');
            const translatedTitle = this.languageManager.translate(`skills.categories.${categoryIndex === 0 ? 'gameDevelopment' : categoryIndex === 1 ? 'toolsTechnologies' : 'softSkills'}`, category.title);
            categoryTitle.innerHTML = `<i class="${category.icon}"></i> ${translatedTitle}`;

            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'skills-grid';

            category.skills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';

                skillItem.innerHTML = `
                    <div class="skill-icon">
                        <i class="${skill.icon}"></i>
                    </div>
                    <div class="skill-info">
                        <h4>${skill.name}</h4>
                        <div class="skill-bar">
                            <div class="skill-progress" data-width="${skill.percentage}%"></div>
                        </div>
                    </div>
                `;

                skillsGrid.appendChild(skillItem);
            });

            categoryDiv.appendChild(categoryTitle);
            categoryDiv.appendChild(skillsGrid);
            skillsContent.appendChild(categoryDiv);
        });

        // Add animation for skill progress bars
        this.animateSkillBars();
    }

    animateSkillBars() {
        const progressBars = document.querySelectorAll('.skill-progress');
        console.log('Found progress bars:', progressBars.length);
        
        progressBars.forEach((bar, index) => {
            // Get the target width from data attribute
            const targetWidth = bar.getAttribute('data-width');
            console.log(`Bar ${index}: target width = ${targetWidth}`);
            
            // Set initial width to 0
            bar.style.width = '0%';
            
            // Animate to target width after a short delay
            setTimeout(() => {
                console.log(`Animating bar ${index} to ${targetWidth}`);
                bar.style.width = targetWidth;
            }, index * 150 + 100); // Stagger animation with initial delay
        });
    }

    renderProjects() {
        if (!this.data.projects) return;

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Update projects section title
        const projectsTitle = document.querySelector('#projects .section-title');
        if (projectsTitle) {
            projectsTitle.textContent = this.languageManager.translate('projects.title', 'Dự án nổi bật');
        }

        // Clear existing content
        projectsGrid.innerHTML = '';

        this.data.projects.projects.forEach((project, idx) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const techTags = project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            // Determine image content
            let imageContent;
            if (project.image) {
                imageContent = `<img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                imageContent = `<i class="${project.icon}"></i>`;
            }

            projectCard.innerHTML = `
                <div class="project-image">
                    <div class="image-placeholder">
                        ${imageContent}
                    </div>
                    <div class="project-overlay">
                        <a href="${project.links.external}" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <div class="project-links">
                        <a href="${project.links.github}" class="project-btn" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i>
                            Code
                        </a>
                        <a href="${project.links.demo}" class="project-btn" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-play"></i>
                            Demo
                        </a>
                    </div>
                </div>
            `;

            // Open modal on click the card, but ignore clicks on Code/Demo buttons
            projectCard.addEventListener('click', (e) => {
                if (e.target && (e.target.closest('.project-btn'))) {
                    // allow default navigation for buttons
                    e.stopPropagation();
                    return;
                }
                e.preventDefault();
                this.openProjectModal(project);
            });

            const overlayLink = projectCard.querySelector('.project-link');
            if (overlayLink) {
                overlayLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openProjectModal(project);
                });
            }

            // Ensure Code/Demo clicks don't bubble to card
            const projectButtons = projectCard.querySelectorAll('.project-btn');
            projectButtons.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // let default anchor behavior occur (open in new tab)
                });
            });

            projectsGrid.appendChild(projectCard);
        });
    }

    openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalClose = document.getElementById('modal-close');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = project.title + (project.subtitle ? ` - ${project.subtitle}` : '');

        // Build media block
        let mediaHtml = '';
        if (project.media && project.media.type === 'video' && project.media.url) {
            mediaHtml = `
                <div style="position:relative; padding-top:56.25%; background:#000;">
                    <iframe src="${project.media.url}" title="${project.title} video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; inset:0; width:100%; height:100%"></iframe>
                </div>`;
        } else if (project.image) {
            mediaHtml = `<img src="${project.image}" alt="${project.title}" style="width:100%; height:auto; display:block;">`;
        }

        // Translate project description
        let translatedDescription = project.description;
        if (this.languageManager.currentLanguage === 'en') {
            translatedDescription = this.languageManager.translate('projects.description', project.description);
        }

        const technologies = (project.technologies || []).map(t => `<span class="tech-tag" style="display:inline-block; background:#f0f0f0; padding:4px 8px; margin:2px; border-radius:4px; font-size:0.85rem;">${t}</span>`).join('');
        
        // Translate features based on content (keep Unity technical terms)
        const features = (project.features || []).map(f => {
            let translatedFeature = f;
            if (this.languageManager.currentLanguage === 'en') {
                if (f.includes('Hệ thống tu luyện với 7 chỉ số')) {
                    translatedFeature = this.languageManager.translate('projects.features.cultivation', f);
                } else if (f.includes('Hệ thống Kho đồ & Trang bị')) {
                    translatedFeature = this.languageManager.translate('projects.features.inventory', f);
                } else if (f.includes('Hệ thống Chiến đấu real-time')) {
                    translatedFeature = this.languageManager.translate('projects.features.combat', f);
                } else if (f.includes('Hệ thống quản lý người chơi')) {
                    translatedFeature = this.languageManager.translate('projects.features.playerManagement', f);
                } else if (f.includes('Hệ thống giao diện')) {
                    translatedFeature = this.languageManager.translate('projects.features.ui', f);
                } else if (f.includes('Hệ thống Event Bus')) {
                    translatedFeature = this.languageManager.translate('projects.features.eventBus', f);
                }
            }
            return `<li style="margin:4px 0;">${translatedFeature}</li>`;
        }).join('');
        
        // Translate achievements based on content (keep Unity technical terms)
        const achievements = (project.achievements || []).map(a => {
            let translatedAchievement = a;
            if (this.languageManager.currentLanguage === 'en') {
                if (a.includes('Hoàn thành toàn bộ event-driven architecture')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.architecture', a);
                } else if (a.includes('Phát triển hệ thống tu luyện')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.cultivationSystem', a);
                } else if (a.includes('Phát triển drag & drop inventory')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.inventorySystem', a);
                } else if (a.includes('Tối ưu performance')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.optimization', a);
                } else if (a.includes('Phát triển UI real-time động')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.uiDevelopment', a);
                } else if (a.includes('Viết Tool Editor')) {
                    translatedAchievement = this.languageManager.translate('projects.achievements.toolEditor', a);
                }
            }
            return `<li style="margin:4px 0;">${translatedAchievement}</li>`;
        }).join('');
        
        // Translate skills based on content (keep Unity technical terms)
        const skills = (project.skills || []).map(s => {
            let translatedSkill = s;
            if (this.languageManager.currentLanguage === 'en') {
                if (s.includes('C# nâng cao')) {
                    translatedSkill = this.languageManager.translate('projects.skills.advancedCSharp', s);
                } else if (s.includes('Unity 2D')) {
                    translatedSkill = this.languageManager.translate('projects.skills.unity2D', s);
                } else if (s.includes('Event-driven programming')) {
                    translatedSkill = this.languageManager.translate('projects.skills.eventDriven', s);
                } else if (s.includes('Tilemap')) {
                    translatedSkill = this.languageManager.translate('projects.skills.tilemap', s);
                } else if (s.includes('Cinemachine')) {
                    translatedSkill = this.languageManager.translate('projects.skills.cinemachine', s);
                } else if (s.includes('Animation 2D')) {
                    translatedSkill = this.languageManager.translate('projects.skills.animation2D', s);
                } else if (s.includes('JSON serialization')) {
                    translatedSkill = this.languageManager.translate('projects.skills.jsonSerialization', s);
                } else if (s.includes('Performance optimization')) {
                    translatedSkill = this.languageManager.translate('projects.skills.performanceOptimization', s);
                }
            }
            return `<span class="tech-tag" style="display:inline-block; background:#e8f4fd; padding:4px 8px; margin:2px; border-radius:4px; font-size:0.85rem;">${translatedSkill}</span>`;
        }).join('');

        modalBody.innerHTML = `
            ${mediaHtml}
            <div style="padding:20px">
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.description', 'Mô tả dự án')}</h4>
                    <p style="margin:0; color:#444; line-height:1.5;">${translatedDescription || ''}</p>
                </div>
                
                ${project.status ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.status', 'Trạng thái')}</h4>
                    <p style="margin:0; color:#666; font-weight:500;">${project.status}</p>
                </div>
                ` : ''}
                
                ${project.role ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.role', 'Vai trò')}</h4>
                    <p style="margin:0; color:#444;">${project.role}</p>
                </div>
                ` : ''}
                
                ${technologies ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.technologies', 'Công nghệ sử dụng')}</h4>
                    <div style="margin:8px 0;">${technologies}</div>
                </div>
                ` : ''}
                
                ${features ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.features', 'Tính năng chính')}</h4>
                    <ul style="margin:8px 0 0 20px; padding:0;">${features}</ul>
                </div>
                ` : ''}
                
                ${achievements ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.achievements', 'Thành quả đạt được')}</h4>
                    <ul style="margin:8px 0 0 20px; padding:0;">${achievements}</ul>
                </div>
                ` : ''}
                
                ${skills ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="margin:0 0 8px 0; color:#333; font-size:1.1rem;">${this.languageManager.translate('projects.modal.skills', 'Kỹ năng áp dụng')}</h4>
                    <div style="margin:8px 0;">${skills}</div>
                </div>
                ` : ''}
                
                <div style="display:flex; gap:10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee;">
                    ${project.links?.github ? `<a href="${project.links.github}" target="_blank" class="project-btn" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#333; color:#fff; text-decoration:none; border-radius:6px; font-size:0.9rem;"><i class="fab fa-github"></i> ${this.languageManager.translate('projects.modal.buttons.github', 'GitHub Code')}</a>` : ''}
                    ${project.links?.demo ? `<a href="${project.links.demo}" target="_blank" class="project-btn" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#007bff; color:#fff; text-decoration:none; border-radius:6px; font-size:0.9rem;"><i class="fas fa-play"></i> ${this.languageManager.translate('projects.modal.buttons.demo', 'Live Demo')}</a>` : ''}
                </div>
            </div>
        `;

        // Show modal
        modal.style.display = 'block';

        // Close logic
        const closeHandler = () => {
            modal.style.display = 'none';
            modal.removeEventListener('click', backdropHandler);
            if (modalClose) modalClose.removeEventListener('click', closeHandler);
            document.removeEventListener('keydown', escHandler);
        };
        const backdropHandler = (e) => {
            if (e.target === modal) closeHandler();
        };
        const escHandler = (e) => {
            if (e.key === 'Escape') closeHandler();
        };

        modal.addEventListener('click', backdropHandler);
        if (modalClose) modalClose.addEventListener('click', closeHandler);
        document.addEventListener('keydown', escHandler);
    }

    renderContact() {
        if (!this.data.contact) return;

        const contact = this.data.contact;

        // Update contact section title
        const contactTitle = document.querySelector('#contact .section-title');
        if (contactTitle) {
            contactTitle.textContent = this.languageManager.translate('navigation.contact', 'Liên hệ');
        }

        // Update contact info with translations
        const contactInfoTitle = document.querySelector('.contact-info h3');
        if (contactInfoTitle) contactInfoTitle.textContent = this.languageManager.translate('contact.title', contact.info.title);

        const contactDescription = document.querySelector('.contact-info p');
        if (contactDescription) contactDescription.textContent = this.languageManager.translate('contact.description', contact.info.description);

        // Update contact methods - Auto-generate from profile.personal
        const contactMethods = document.querySelector('.contact-methods');
        if (contactMethods && this.data.profile && this.data.profile.personal) {
            contactMethods.innerHTML = '';
            // Set layout for 2 columns
            contactMethods.style.cssText = `
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                max-width: 800px;
                margin: 0 auto;
            `;
        }

        // Fix contact-content layout to remove empty space
        const contactContent = document.querySelector('.contact-content');
        if (contactContent) {
            contactContent.style.cssText = `
                display: block;
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
            `;
        }

        if (contactMethods && this.data.profile && this.data.profile.personal) {
            const personal = this.data.profile.personal;
            
            // Email method
            if (personal.email) {
                const emailDiv = document.createElement('div');
                emailDiv.className = 'contact-method';
                emailDiv.innerHTML = `
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.email', 'Email')}</h4>
                        <p>${personal.email}</p>
                    </div>
                `;
                emailDiv.style.cursor = 'pointer';
                emailDiv.addEventListener('click', () => {
                    window.open(`mailto:${personal.email}`, '_blank');
                });
                contactMethods.appendChild(emailDiv);
            }

            // LinkedIn method
            if (personal.linkedin) {
                const linkedinDiv = document.createElement('div');
                linkedinDiv.className = 'contact-method';
                const linkedinUsername = personal.linkedin.split('/').pop() || 'LinkedIn Profile';
                linkedinDiv.innerHTML = `
                    <i class="fab fa-linkedin"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.linkedin', 'LinkedIn')}</h4>
                        <p>${linkedinUsername}</p>
                    </div>
                `;
                linkedinDiv.style.cursor = 'pointer';
                linkedinDiv.addEventListener('click', () => {
                    window.open(personal.linkedin, '_blank');
                });
                contactMethods.appendChild(linkedinDiv);
            }

            // GitHub method
            if (personal.github) {
                const githubDiv = document.createElement('div');
                githubDiv.className = 'contact-method';
                const githubUsername = personal.github.split('/').pop() || 'GitHub Profile';
                githubDiv.innerHTML = `
                    <i class="fab fa-github"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.github', 'GitHub')}</h4>
                        <p>@${githubUsername}</p>
                    </div>
                `;
                githubDiv.style.cursor = 'pointer';
                githubDiv.addEventListener('click', () => {
                    window.open(personal.github, '_blank');
                });
                contactMethods.appendChild(githubDiv);
            }

            // Phone method
            if (personal.phone) {
                const phoneDiv = document.createElement('div');
                phoneDiv.className = 'contact-method';
                phoneDiv.innerHTML = `
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.phone', 'Số điện thoại')}</h4>
                        <p>${personal.phone}</p>
                    </div>
                `;
                phoneDiv.style.cursor = 'pointer';
                phoneDiv.addEventListener('click', () => {
                    window.open(`tel:${personal.phone}`, '_self');
                });
                contactMethods.appendChild(phoneDiv);
            }

            // Zalo method
            if (personal.zalo) {
                const zaloDiv = document.createElement('div');
                zaloDiv.className = 'contact-method';
                zaloDiv.innerHTML = `
                    <i class="fab fa-facebook-messenger"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.zalo', 'Zalo')}</h4>
                        <p>${personal.phone || 'Zalo Chat'}</p>
                    </div>
                `;
                zaloDiv.style.cursor = 'pointer';
                zaloDiv.addEventListener('click', () => {
                    window.open(personal.zalo, '_blank');
                });
                contactMethods.appendChild(zaloDiv);
            }

            // Facebook method
            if (personal.facebook) {
                const facebookDiv = document.createElement('div');
                facebookDiv.className = 'contact-method';
                const facebookUsername = personal.facebook.split('/').pop() || 'Facebook Profile';
                facebookDiv.innerHTML = `
                    <i class="fab fa-facebook"></i>
                    <div>
                        <h4>${this.languageManager.translate('contact.methods.facebook', 'Facebook')}</h4>
                        <p>${facebookUsername}</p>
                    </div>
                `;
                facebookDiv.style.cursor = 'pointer';
                facebookDiv.addEventListener('click', () => {
                    window.open(personal.facebook, '_blank');
                });
                contactMethods.appendChild(facebookDiv);
            }
        }

        // Remove contact form section completely from DOM
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.remove(); // Completely remove from DOM
        }

        // Add responsive CSS for contact methods
        if (!document.querySelector('#contact-responsive-styles')) {
            const style = document.createElement('style');
            style.id = 'contact-responsive-styles';
            style.textContent = `
                .contact-content {
                    display: block !important;
                    width: 100% !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                }
                @media (max-width: 768px) {
                    .contact-methods {
                        grid-template-columns: 1fr !important;
                        max-width: 100% !important;
                        padding: 0 1rem !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add CSS for skill progress bars
        if (!document.querySelector('#skill-progress-styles')) {
            const style = document.createElement('style');
            style.id = 'skill-progress-styles';
            style.textContent = `
                .skill-progress {
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    transition: width 1s ease-in-out;
                }
                .skill-bar {
                    width: 100%;
                    height: 8px;
                    background: #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioDataLoader();
});
