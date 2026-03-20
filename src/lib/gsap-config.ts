import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, TextPlugin);

gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
});

ScrollTrigger.matchMedia({
  '(prefers-reduced-motion: reduce)': () => {
    gsap.globalTimeline.timeScale(100);
  },
});

export { gsap, ScrollTrigger, Flip, TextPlugin };
