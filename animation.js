
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});


function initAnimations() {
    initScrollAnimations();
    
    initButtonRippleEffect();

}

function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.section-title, .product-card, .category-card');
    
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        if (element.classList.contains('section-title')) {
            element.classList.add('fade-in-element');
        } else if (element.classList.contains('product-card')) {
            element.classList.add('slide-up-element');
        } else if (element.classList.contains('category-card')) {
            element.classList.add('slide-up-element');
        }
    });

    checkAnimationElements();

    window.addEventListener('scroll', checkAnimationElements);
}

function checkAnimationElements() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    elementsToAnimate.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('visible')) {
            element.classList.add('visible');
        }
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

function initButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    const rippleElement = document.createElement('span');
    rippleElement.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    rippleElement.style.width = rippleElement.style.height = `${size}px`;
    rippleElement.style.left = `${event.clientX - rect.left - size / 2}px`;
    rippleElement.style.top = `${event.clientY - rect.top - size / 2}px`;
   
    button.appendChild(rippleElement);
    
    setTimeout(() => {
        rippleElement.remove();
    }, 600);
}

function addToCartAnimation(event, productElement) {
    const clickPosition = {
        x: event.clientX,
        y: event.clientY
    };
    
    const cartIcon = document.querySelector('.cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();
    const cartPosition = {
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2
    };
    

    const animationElement = document.createElement('div');
    animationElement.classList.add('add-to-cart-animation');
    
    animationElement.style.left = `${clickPosition.x}px`;
    animationElement.style.top = `${clickPosition.y}px`;
    
    document.body.appendChild(animationElement);

    setTimeout(() => {
        animationElement.style.transform = 'scale(0.5)';
        animationElement.style.left = `${cartPosition.x}px`;
        animationElement.style.top = `${cartPosition.y}px`;
        animationElement.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        animationElement.remove();
        
        cartIcon.style.animation = 'pulse 0.5s ease';

        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 500);
    }, 800);
} 