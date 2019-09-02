const elements = {
  navbar: $('.navbar'),
  navbarTitle: $('.navbar__title'),
  navLinks: {
    all: $('.navbar__link'),
    footerLinks: $('.footer__link'),
    skills: $('#link-skills'),
    work: $('#link-work'),
    contact: $('#link-contact')
  },
  heroButton: $('.hero__btn'),
  headerDownArrow: $('.header__down-arrow'),
  contactForm: $('.contact__form')
};

const scrollPositions = {
  get header() {
    return $('.header').offset().top;
  },
  get skills() {
    return $('.skills').offset().top;
  },
  get work() {
    return $('.work').offset().top;
  },
  get contact() {
    return $('.contact').offset().top;
  },
  get footer() {
    return $('.footer').offset().top;
  },
  get window() {
    return $(window).scrollTop();
  },
  last: $(window).scrollTop()
};

const navbarHeight = parseInt(elements.navbar.css('height').slice(0, -2), 10);

$(window).scroll(handleNavbarScroll);
$(window).scroll(handleActiveLink);
elements.navLinks.all.click(handleNavLinkClick);
elements.navLinks.footerLinks.click(handleNavLinkClick);
elements.navbarTitle.click(() => goToSection('header'));
elements.heroButton.click(() => goToSection('work'));
elements.headerDownArrow.click(() => goToSection('skills'));

function handleNavbarScroll() {
  const { navbar } = elements;
  const { window: windowScroll } = scrollPositions;

  const offset = navbarHeight + 100;

  if (windowScroll < offset) {
    navbar.removeClass('fixed');
  } else {
    navbar.addClass('fixed');
  }
}

function handleActiveLink() {
  const {
    window: windowScroll,
    skills: skillsScroll,
    work: workScroll,
    contact: contactScroll
  } = scrollPositions;

  const { navLinks } = elements;
  const activeClass = 'navbar__link--active';
  const offset = navbarHeight + 100;

  navLinks.all.removeClass(activeClass);

  if (windowScroll > contactScroll - offset) {
    navLinks.contact.addClass(activeClass);
  } else if (windowScroll > workScroll - offset) {
    navLinks.work.addClass(activeClass);
  } else if (windowScroll > skillsScroll - offset) {
    navLinks.skills.addClass(activeClass);
  }
}

function handleNavLinkClick(event) {
  event.preventDefault();
  goToSection($(event.target).data('section'));
}

function goToSection(sectionName) {
  const scrollPosition = scrollPositions[sectionName] - navbarHeight;

  window.scrollTo(0, scrollPosition);
}

class Carousel {
  constructor({ element, activeClass = 'slide--active', interval = 5000 }) {
    this.element = $(element);
    this.activeClass = activeClass;
    this.interval = interval;

    this.slides = this.element.find('.slide');
    this.activeSlide = this.element.find(`.${this.activeClass}`);

    this.nextButton = this.element.find('[data-slideAction="next"]');
    this.prevButton = this.element.find('[data-slideAction="prev"]');

    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.startAutoPlay = this.startAutoPlay.bind(this);
    this.stopAutoplay = this.stopAutoplay.bind(this);
  }

  get numberOfSlides() {
    return this.slides.length;
  }

  get slideClasses() {
    return [
      'slideInRight',
      'slideOutRight',
      'slideInLeft',
      'slideOutLeft'
    ].join(' ');
  }

  get activeSlideId() {
    return this.activeSlide.data('slideid');
  }

  init() {
    this.nextButton.click(this.nextSlide);
    this.prevButton.click(this.prevSlide);

    this.slides.hover(this.stopAutoplay, this.startAutoPlay);
    this.nextButton.hover(this.stopAutoplay, this.startAutoPlay);
    this.prevButton.hover(this.stopAutoplay, this.startAutoPlay);

    this.startAutoPlay();
  }

  nextSlide() {
    this.activeSlide.removeClass(this.slideClasses).addClass('slideOutLeft');

    const nextSlideId =
      this.activeSlideId < this.numberOfSlides - 1 ? this.activeSlideId + 1 : 0;

    const nextSlide = $(this.slides[nextSlideId]);

    nextSlide
      .removeClass(this.slideClasses)
      .addClass('slideInRight slide--active');

    this.activeSlide = nextSlide;
  }

  prevSlide() {
    this.activeSlide.removeClass(this.slideClasses).addClass('slideOutRight');

    const prevSlideId =
      this.activeSlideId === 0
        ? this.numberOfSlides - 1
        : this.activeSlideId - 1;

    const prevSlide = $(this.slides[prevSlideId]);

    prevSlide
      .removeClass(this.slideClasses)
      .addClass('slideInLeft slide--active');

    this.activeSlide = prevSlide;
  }

  startAutoPlay() {
    this.intervalId = window.setInterval(this.nextSlide, this.interval);
  }

  stopAutoplay() {
    window.clearInterval(this.intervalId);
  }
}

new Carousel({
  element: '.work__carousel'
}).init();

const validators = {
  isMinimum(element, length = 0) {
    const isValid = element.val().length >= length;

    validators.handleInvalidClass(element, isValid);

    return isValid;
  },
  isEmail(element) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = emailRegex.test(element.val());

    validators.handleInvalidClass(element, isValid);

    return isValid;
  },
  handleInvalidClass(element, isValid) {
    if (!isValid) element.addClass('invalid');
    else element.removeClass('invalid');
  },
  isFormValid(element) {
    const parentForm = element.parent('form');

    if (parentForm.find('.invalid').length === 0)
      parentForm.find('[type="submit"]').attr('disabled', false);
    else parentForm.find('[type="submit"]').attr('disabled', true);
  }
};

const form = elements.contactForm;
const nameInput = form.find('[name="name"]');
const emailInput = form.find('[name="email"');
const messageInput = form.find('[name="message"]');

form.submit(event => {
  event.preventDefault();

  const submitButton = form.find('[type="submit"]');

  submitButton.text('Submitting...');

  window.setTimeout(() => {
    validators.isMinimum(nameInput, 3);
    validators.isEmail(emailInput);
    validators.isMinimum(messageInput, 10);

    const nOfInvalid = form.find('.invalid').length;

    if (nOfInvalid === 0) {
      nameInput.attr('disabled', true);
      emailInput.attr('disabled', true);
      messageInput.attr('disabled', true);
      submitButton.attr('disabled', true);

      submitButton.text('Submitted');
    } else submitButton.text('Submit');
  }, 1500);
});

nameInput.on('input', () => validators.isMinimum(nameInput, 3));
emailInput.on('input', () => validators.isEmail(emailInput));
messageInput.on('input', () => validators.isMinimum(messageInput, 10));
