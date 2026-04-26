// Background Particle Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / 100})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Enhanced Commit Graph with Tooltips
function generateCommits() {
    const container = document.getElementById('commit-container');
    const tooltip = document.getElementById('tooltip');
    const count = 365 * 2;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < count; i++) {
        const day = document.createElement('div');
        day.className = 'commit-day';
        
        const rand = Math.random();
        let commits = 0;
        if (rand > 0.95) { day.classList.add('lvl-4'); commits = Math.floor(Math.random() * 10) + 10; }
        else if (rand > 0.85) { day.classList.add('lvl-3'); commits = Math.floor(Math.random() * 5) + 5; }
        else if (rand > 0.7) { day.classList.add('lvl-2'); commits = Math.floor(Math.random() * 3) + 2; }
        else if (rand > 0.5) { day.classList.add('lvl-1'); commits = 1; }
        
        day.addEventListener('mouseover', (e) => {
            const date = new Date();
            date.setDate(date.getDate() - (count - i));
            tooltip.innerText = `${commits} commits on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            tooltip.style.opacity = 1;
            tooltip.style.left = `${e.pageX - container.getBoundingClientRect().left}px`;
            tooltip.style.top = `${e.pageY - container.getBoundingClientRect().top - 40}px`;
        });
        
        day.addEventListener('mouseout', () => {
            tooltip.style.opacity = 0;
        });
        
        container.appendChild(day);
    }
}

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    generateCommits();
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

window.addEventListener('resize', resize);
