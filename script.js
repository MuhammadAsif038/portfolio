// Skeleton Loading Manager
class SkeletonLoader {
  constructor() {
    this.loadingElements = []
    this.loadingDuration = 2000 // 2 seconds minimum loading time
    this.startTime = Date.now()
  }

  init() {
    // Add loading class to body
    document.body.classList.add("loading")

    // Find all sections with skeleton content
    this.loadingElements = document.querySelectorAll("section")

    // Simulate loading for different sections with staggered timing
    this.simulateLoading()
  }

  simulateLoading() {
    const sections = [
      { selector: "#home", delay: 500 },
      { selector: "#showcase", delay: 800 },
      { selector: "#about", delay: 1200 },
      { selector: "#experience", delay: 1500 },
      { selector: "#skills", delay: 1800 },
      { selector: "#projects", delay: 2100 },
      { selector: "#education", delay: 2400 },
      { selector: "#contact", delay: 2700 },
    ]

    sections.forEach(({ selector, delay }) => {
      setTimeout(() => {
        this.loadSection(selector)
      }, delay)
    })

    // Remove loading class from body after all sections are loaded
    setTimeout(() => {
      document.body.classList.remove("loading")
      this.triggerLoadedAnimations()
    }, 3000)
  }

  loadSection(selector) {
    const section = document.querySelector(selector)
    if (section) {
      const skeletonContent = section.querySelector(".skeleton-content")
      const actualContent = section.querySelector(".actual-content")

      if (skeletonContent && actualContent) {
        // Hide skeleton
        skeletonContent.style.display = "none"

        // Show actual content with fade-in animation
        actualContent.style.display = "block"
        actualContent.classList.add("fade-in-loaded")

        // Trigger any section-specific animations
        this.triggerSectionAnimations(section)
      }
    }
  }

  triggerSectionAnimations(section) {
    // Trigger typing animation for hero section
    if (section.id === "home") {
      setTimeout(() => {
        const heroTitle = section.querySelector(".hero h1")
        if (heroTitle) {
          const originalText = heroTitle.innerHTML
          typeWriter(heroTitle, originalText, 50)
        }
      }, 300)
    }

    // Trigger stats animation for about section
    if (section.id === "about") {
      setTimeout(() => {
        animateStats()
      }, 500)
    }

    // Trigger skill items animation
    if (section.id === "skills") {
      setTimeout(() => {
        const skillItems = section.querySelectorAll(".skill-item")
        skillItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, index * 50)
        })
      }, 300)
    }
  }

  triggerLoadedAnimations() {
    // Re-initialize intersection observer for remaining animations
    document.querySelectorAll("section").forEach((section) => {
      if (!section.classList.contains("visible")) {
        observer.observe(section)
      }
    })
  }
}

// Image Loading Manager
class ImageLoader {
  constructor() {
    this.images = []
    this.loadedCount = 0
  }

  preloadImages() {
    const imageElements = document.querySelectorAll("img")
    this.images = Array.from(imageElements)

    if (this.images.length === 0) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      this.images.forEach((img) => {
        if (img.complete) {
          this.onImageLoad()
        } else {
          img.addEventListener("load", () => this.onImageLoad())
          img.addEventListener("error", () => this.onImageLoad())
        }
      })

      // Fallback timeout
      setTimeout(resolve, 5000)
    })
  }

  onImageLoad() {
    this.loadedCount++
    if (this.loadedCount >= this.images.length) {
      this.onAllImagesLoaded()
    }
  }

  onAllImagesLoaded() {
    // All images loaded, can trigger additional animations
    console.log("All images loaded")
  }
}

// Enhanced Page Loading
class PageLoader {
  constructor() {
    this.skeletonLoader = new SkeletonLoader()
    this.imageLoader = new ImageLoader()
  }

  async init() {
    // Show skeleton loading immediately
    this.skeletonLoader.init()

    // Preload images in background
    await this.imageLoader.preloadImages()

    // Add loading progress indicator
    this.showLoadingProgress()
  }

  showLoadingProgress() {
    // Create a subtle loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-indicator"
    loadingIndicator.innerHTML = `
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    `

    // Add styles for loading indicator
    const style = document.createElement("style")
    style.textContent = `
      .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        z-index: 9999;
        background: transparent;
      }
      
      .loading-bar {
        width: 100%;
        height: 100%;
        background: var(--secondary-color);
        overflow: hidden;
      }
      
      .loading-progress {
        width: 0%;
        height: 100%;
        background: var(--primary-color);
        animation: loading-progress 3s ease-out forwards;
      }
      
      @keyframes loading-progress {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
      
      .loading-complete {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
    `

    document.head.appendChild(style)
    document.body.appendChild(loadingIndicator)

    // Remove loading indicator after loading is complete
    setTimeout(() => {
      loadingIndicator.classList.add("loading-complete")
      setTimeout(() => {
        loadingIndicator.remove()
        style.remove()
      }, 500)
    }, 3000)
  }
}

// Initialize page loading when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const pageLoader = new PageLoader()
  pageLoader.init()
})

// Add smooth reveal animation for loaded content
function addRevealAnimation() {
  const revealElements = document.querySelectorAll(".actual-content")

  revealElements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "all 0.6s ease"

    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Enhanced intersection observer with loading states
const enhancedObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Add staggered animation for child elements
        const childElements = entry.target.querySelectorAll(".fade-in-child")
        childElements.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add("visible")
          }, index * 100)
        })
      }
    })
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
)

// Lazy loading for images
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  lazyImages.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", setupLazyLoading)

// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  }),
)

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar background change on scroll with theme support
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// Observe all sections for animation
document.querySelectorAll("section").forEach((section) => {
  section.classList.add("fade-in")
  observer.observe(section)
})

// Contact form handling
const contactForm = document.getElementById("contact-form")
contactForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  // Simple validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address")
    return
  }

  // Simulate form submission (replace with actual form handling)
  alert("Thank you for your message! I'll get back to you soon.")
  this.reset()
})

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  type()
}

// Initialize typing animation when page loads
// window.addEventListener("load", () => {
//   const heroTitle = document.querySelector(".hero h1")
//   if (heroTitle) {
//     const originalText = heroTitle.innerHTML
//     setTimeout(() => {
//       typeWriter(heroTitle, originalText, 50)
//     }, 500)
//   }
// })

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Add scroll to top button
const scrollTopBtn = document.createElement("button")
scrollTopBtn.innerHTML = "↑"
scrollTopBtn.className = "scroll-top-btn"
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`

document.body.appendChild(scrollTopBtn)

scrollTopBtn.addEventListener("click", scrollToTop)

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.opacity = "1"
    scrollTopBtn.style.visibility = "visible"
  } else {
    scrollTopBtn.style.opacity = "0"
    scrollTopBtn.style.visibility = "hidden"
  }
})

// Skills animation on scroll
const skillItems = document.querySelectorAll(".skill-item")
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }, index * 100)
    }
  })
})

// skillItems.forEach((item) => {
//   item.style.opacity = "0"
//   item.style.transform = "translateY(20px)"
//   item.style.transition = "all 0.5s ease"
//   skillObserver.observe(item)
// })

// Stats counter animation
function animateStats() {
  const stats = document.querySelectorAll(".stat h3")
  const targets = ["20+", "15+", "8+"]

  stats.forEach((stat, index) => {
    const target = Number.parseInt(targets[index])
    let current = 0
    const increment = target / 50

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        stat.textContent = targets[index]
        clearInterval(timer)
      } else {
        stat.textContent = Math.floor(current) + "+"
      }
    }, 50)
  })
}

// Trigger stats animation when about section is visible
// const aboutSection = document.querySelector(".about")
// const statsObserver = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       animateStats()
//       statsObserver.unobserve(entry.target)
//     }
//   })
// })

// if (aboutSection) {
//   statsObserver.observe(aboutSection)
// }

// Add active state to navigation links based on scroll position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Add CSS for active nav link
const style = document.createElement("style")
style.textContent = `
    .nav-link.active {
        color: #e74c3c !important;
        font-weight: 600;
    }
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
    }
    .dark-mode .navbar.scrolled {
        background: rgba(0, 0, 0, 0.98) !important;
        box-shadow: 0 2px 20px rgba(255, 255, 255, 0.1) !important;
    }
`
document.head.appendChild(style)

// Theme toggle logic
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body
  const icon = themeToggle.querySelector("i")

  // Load theme from localStorage or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem("theme")
    if (saved) return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode")
      body.classList.remove("light-mode")
      icon.classList.remove("fa-moon")
      icon.classList.add("fa-sun")
    } else {
      body.classList.add("light-mode")
      body.classList.remove("dark-mode")
      icon.classList.remove("fa-sun")
      icon.classList.add("fa-moon")
    }
  }

  // Initial theme
  let theme = getPreferredTheme()
  applyTheme(theme)

  themeToggle.addEventListener("click", () => {
    theme = body.classList.contains("dark-mode") ? "light" : "dark"
    localStorage.setItem("theme", theme)
    applyTheme(theme)
  })
})

// Carousel functionality
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel")
  const slides = carousel.querySelectorAll(".carousel-slide")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const indicatorsContainer = document.getElementById("indicators")

  let currentSlide = 0

  // Create indicators
  slides.forEach((_, index) => {
    const indicator = document.createElement("div")
    indicator.classList.add("indicator")
    if (index === 0) indicator.classList.add("active")
    indicator.addEventListener("click", () => goToSlide(index))
    indicatorsContainer.appendChild(indicator)
  })

  const indicators = indicatorsContainer.querySelectorAll(".indicator")

  function updateSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide)
    })

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide)
    })
  }

  function goToSlide(index) {
    currentSlide = index
    updateSlide()
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length
    updateSlide()
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length
    updateSlide()
  }

  // Event listeners
  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  // Auto-play carousel
  setInterval(nextSlide, 5000)

  // Pause auto-play on hover
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoPlayInterval)
  })

  let autoPlayInterval = setInterval(nextSlide, 5000)

  carousel.addEventListener("mouseleave", () => {
    autoPlayInterval = setInterval(nextSlide, 5000)
  })
})

// Keyboard navigation for carousel
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    document.getElementById("prevBtn").click()
  } else if (e.key === "ArrowRight") {
    document.getElementById("nextBtn").click()
  }
})

// Touch/swipe support for carousel
let startX = 0
let endX = 0

document.getElementById("carousel").addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX
})

document.getElementById("carousel").addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX
  handleSwipe()
})

function handleSwipe() {
  const threshold = 50
  const diff = startX - endX

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe left - next slide
      document.getElementById("nextBtn").click()
    } else {
      // Swipe right - previous slide
      document.getElementById("prevBtn").click()
    }
  }
}
