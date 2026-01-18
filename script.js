document.addEventListener('DOMContentLoaded', () => {
    
    const githubUsername = 'mirouhlar'; 
    const AUTO_SLIDE_DELAY = 5000; 
    
    const track = document.getElementById('github-list');
    const container = document.querySelector('.carousel-container'); 
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let slides = [];
    let currentSlideIndex = 0;
    let autoSlideInterval; 
    
    const isMobile = () => window.innerWidth <= 768;

    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=5`);
            const repos = await response.json();

            track.innerHTML = '';

            if (repos.length === 0) {
                track.innerHTML = '<li class="carousel-slide">No projects found.</li>';
                return;
            }

            repos.forEach(repo => {
                const li = document.createElement('li');
                li.classList.add('carousel-slide');
                li.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available for this project.'}</p>
                    <div style="margin-top: auto;">
                         <a href="${repo.html_url}" target="_blank" class="btn">View Source</a>
                    </div>
                `;
                track.appendChild(li);
            });

            slides = Array.from(track.children);
            updateCarouselPosition();
            startAutoSlide(); 

        } catch (error) {
            track.innerHTML = '<li class="carousel-slide">Error loading projects. Check API rate limit.</li>';
            console.error('GitHub Fetch Error:', error);
        }
    }

function updateCarouselPosition() {
        if(slides.length === 0) return;
        
        if (isMobile()) {
            track.style.transform = 'translateX(0)';
            return;
        }

        const width = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentSlideIndex * width}px)`;
    }

    function moveToNextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
        } else {
            currentSlideIndex = 0; 
        }
        updateCarouselPosition();
    }

    function moveToPrevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
        } else {
            currentSlideIndex = slides.length - 1; 
        }
        updateCarouselPosition();
    }

    nextBtn.addEventListener('click', () => {
        moveToNextSlide();
        resetAutoSlideTimer(); 
    });

    prevBtn.addEventListener('click', () => {
        moveToPrevSlide();
        resetAutoSlideTimer();
    });
    
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(moveToNextSlide, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlideTimer() {
        stopAutoSlide();
        startAutoSlide();
    }

    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
        updateCarouselPosition();
        resetAutoSlideTimer();
    });


    const certificates = [
                {
            name: "Competence in Electrical Engineering (§4)",
            platform: "Siemens",
            desc: "Professional qualification in electrical safety and standards.",
            date: "2023",
            link: "#",
            image: "" 
        },
         {
            name: "Data Engineering",
            platform: "AWS, DeepLearning.AI",
            desc: "Building data pipelines and cloud infrastructure.",
            date: "2025",
            link: "#",
            image: "certificates/dataEng.png" 
        },
                {
            name: "Machine Learning",
            platform: "DeepLearning.AI, Stanford",
            desc: "Supervised and unsupervised learning algorithms.",
            date: "2023",
            link: "#",
            image: "certificates/MachineLearning.png" 
        },
        {
            name: "MySQL for Data Analytics",
            platform: "365 Careers",
            desc: "Relational database management and SQL analysis.",
            date: "2024",
            link: "#",
            image: "certificates/sql.jpg" 
        },
        {
            name: "Python for Data Science",
            platform: "Udemy",
            desc: "Data manipulation, visualization, and analysis with Python.",
            date: "2024",
            link: "#",
            image: "certificates/pythonData.jpg"
        },
        {
            name: "Statistics for Data Science",
            platform: "365 Careers",
            desc: "Statistical analysis and probability theory for data.",
            date: "2024",
            link: "#",
            image: "certificates/statistics.jpg"
        },
        {
            name: "Unreal Development in C++",
            platform: "Coursera",
            desc: "Game development and engine programming.",
            date: "2023",
            link: "#",
            image: "" 
        },
        {
            name: "Google UX Design",
            platform: "Google",
            desc: "User experience research, prototyping, and design.",
            date: "2025",
            link: "#",
            image: "certificates/uxdesign.png" 
        }
    ];

    const certGrid = document.getElementById('cert-grid');

    certificates.forEach(cert => {
        const card = document.createElement('div');
        card.classList.add('cert-card');
        
        const imageHTML = cert.image 
            ? `<div class="cert-img-container"><img src="${cert.image}" alt="${cert.name}" class="cert-preview"></div>` 
            : '';

        card.innerHTML = `
            <div>
                <div class="cert-platform">${cert.platform}</div>
                <h3>${cert.name}</h3>
                <p>${cert.desc}</p>
            </div>
            ${imageHTML}
            <span class="cert-date">Issued: ${cert.date}</span>
        `;
        card.style.cursor = 'pointer';
        // card.addEventListener('click', () => window.open(cert.link, '_blank'));
        
        certGrid.appendChild(card);
    });


    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        updateCanvasColors(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- 4. Background Animation ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;
    let canvasColor = 'rgba(0,0,0,1)';

    updateCanvasColors(htmlElement.getAttribute('data-theme') || 'light');

    function updateCanvasColors(theme) {
        if (theme === 'dark') {
            canvasColor = 'rgba(255,255,255,1)';
        } else {
            canvasColor = 'rgba(0,0,0,1)';
        }
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = canvasColor; 
            ctx.globalAlpha = 0.3;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, canvasColor));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = canvasColor;
                    ctx.globalAlpha = opacityValue * 0.1;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        updateCarouselPosition();
        if (!isMobile()) {
            resetAutoSlideTimer();
        } else {
            stopAutoSlide();
        }
    });

    fetchGitHubProjects();
    initParticles();
    animateParticles();
});
