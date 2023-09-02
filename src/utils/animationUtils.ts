import { gsap } from 'gsap';

export function setupAnimations() {
  const tl = gsap.timeline({ smoothChildTiming: true, repeat: 0 });

  tl.fromTo(
    '.paintbrush',
    { x: '100%', y: '-100%', rotation: 360 },
    { x: '0%', y: '0%', rotation: 0, duration: 2, ease: 'power3.out' },
  );

  gsap.utils.toArray('.icon-mask').forEach((mask: any, index: number) => {
    gsap.set(mask, { y: '0%', autoAlpha: 1 });
    tl.fromTo(
      mask,
      { y: '100%', autoAlpha: 0 },
      {
        y: '0%',
        duration: 0.5,
        ease: 'bounce.out',
        autoAlpha: 0.5,
      },
      index * 0.0025,
    ).to(mask, {
      y: '0%',
      duration: 0.01 + index * 0.1,
      ease: 'power2.out',
      autoAlpha: 1,
      blur: index * 2,
    });
  });

  return tl;
}
