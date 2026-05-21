$(function () {
  common.common();
});

const common = (function () {
  return {
    common() {
      this.initGsap();
      this.handleResize();
      this.initScrollMotion();

      if ($(".main").length) {
        this.initIntro();
        this.initProject();
      }

      if ($(".sub").length) {
        this.subIntro();
      }
    },

    initGsap() {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        effects: true,
        smoothTouch: 0.5,
      });

      gsap.config({
        force3D: true,
        autoSleep: 60,
      });
    },

    // 리사이즈 대응
    handleResize() {
      let wasLargerThan1024 = window.innerWidth > 1024;

      window.addEventListener("resize", function () {
        const isLargerThan1024 = window.innerWidth > 1024;

        if (isLargerThan1024 !== wasLargerThan1024) {
          window.location.reload();
        }
      });
    },

    // 스크롤 모션
    initScrollMotion() {
      const self = this;

      function bindScrollMotion($el) {
        if ($el.data("init")) return;
        $el.data("init", true);

        const winH = $(window).height();
        const scrollTop = $(window).scrollTop();
        const elTop = $el.offset().top;
        const triggerPoint = scrollTop + winH * 0.85;

        if (elTop < triggerPoint) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              $el.addClass("active");
            });
          });
        }

        ScrollTrigger.create({
          trigger: $el[0],
          start: "top 85%",
          once: true,
          onEnter: () => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                $el.addClass("active");
              });
            });
          },
        });
      }

      self.scrollMotion = function () {
        $(".scroll-motion:visible").each(function () {
          bindScrollMotion($(this));
        });
      };

      self.scrollMotion();
    },

    // 인트로 애니메이션
    initIntro() {
      const delays = [0.5, 0.8, 0.9, 1.0];

      $(".main .intro .txt div > *").each(function (i, el) {
        gsap.to(el, {
          duration: 1.3,
          y: 0,
          delay: delays[i],
          ease: Power4.easeOut,
        });
      });

      gsap.fromTo(
        ".main .intro .path",
        { strokeDashoffset: 6000 },
        {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.4,
          ease: "power2.inOut",
        },
      );
    },

    // 프로젝트 영역
    initProject() {
      const isPC = window.innerWidth > 1024;

      if (!isPC) {
        $(".main .project .txt-pack p, .project .list li").addClass("scroll-motion");
        this.scrollMotion();
        return;
      }

      const $project = $(".main .project");
      const $list = $(".main .project .list");

      const getRem = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

      const getScrollDistance = () => {
        const listHeight = $list[0].scrollHeight;
        const viewportHeight = window.innerHeight;
        return listHeight - viewportHeight + getRem(200);
      };

      gsap.to($list, {
        y: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: $project[0],
          start: "top top",
          end: () => "+=" + getScrollDistance(),
          pin: true,
          scrub: 1,
          markers: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: $project[0],
            start: "top top",
            toggleActions: "play none none none",
            once: true,
          },
        })
        .fromTo(".main .project .txt-pack .p1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(".main .project .txt-pack .p2", { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
        .fromTo(".main .project .txt-pack .p3", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.6");
    },

    subIntro() {
      gsap.to(".sub .hero .txt-box .tit", { duration: 1, y: 0, opacity: 1, delay: 0.4, ease: Power3.easeOut });
      gsap.to(".sub .hero .txt-box .info", { duration: 1, y: 0, opacity: 1, delay: 0.5, ease: Power3.easeOut });
      gsap.to(".sub .hero .bg", { duration: 1.5, scale: 1, delay: 0.3, ease: Power3.easeOut });
    },
  };
})();
