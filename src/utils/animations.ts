import { gsap } from 'gsap';

export function setupAnimations() {
  const tl = gsap.timeline({ smoothChildTiming: true, repeat: 0 });

  tl.fromTo(
    '.paintbrush',
    { x: '100%', y: '-100%', rotation: 360 },
    { x: '0%', y: '0%', rotation: 0, duration: 1, ease: 'power3.out' },
  )
    .to('.paintbrush', { rotation: 10, duration: 0.1, ease: 'power1.inOut' })
    .to('.paintbrush', { rotation: 0, duration: 0.1, ease: 'power1.inOut' });

  const hoverAnim = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
  hoverAnim
    .to('.paintbrush', {
      rotation: 10,
      duration: 0.375,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    })
    .to('.paintbrush', {
      rotation: -10,
      duration: 0.75,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    })
    .to('.paintbrush', {
      rotation: 5,
      duration: 0.375,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    });

  const activeAnim = gsap.timeline({ paused: true });
  activeAnim
    .to('.paintbrush', {
      rotation: 360,
      y: '+=10',
      duration: 1,
      ease: 'ease',
    })
    .to('.paintbrush', {
      rotation: 365,
      y: '+=5',
      duration: 0.1,
      ease: 'back.out(4)',
    })
    .to('.paintbrush', {
      rotation: 360,
      y: '+=0',
      duration: 0.1,
      ease: 'power1.inOut',
    });

  const spinAnim = gsap.timeline({ paused: true, repeat: -1 });
  spinAnim.to('.paintbrush', {
    rotation: '+=360',
    duration: 1,
    ease: 'linear',
  });

  // Attach event listeners
  // const paintbrush = document.querySelector('.paintbrush');
  // if (paintbrush) {
  //   paintbrush.addEventListener('mouseenter', () => hoverAnim.play());
  //   paintbrush.addEventListener('mouseleave', () => hoverAnim.pause());
  //   paintbrush.addEventListener('mousedown', () => activeAnim.restart());
  //   paintbrush.addEventListener('dblclick', () => {
  //     if (spinAnim.isActive()) {
  //       spinAnim.pause();
  //     } else {
  //       spinAnim.play();
  //     }
  //   });
  // }

  const popin = gsap.timeline();
  gsap.utils
    .toArray('.icon-mask:not(:first-child)')
    .forEach((mask: any, index: number) => {
      popin
        .to(
          mask,
          {
            y: `${10 + index * 2}%`,
            duration: 0.2,
            ease: 'power1.inOut',
          },
          `0.${index}`,
        )
        .to(
          mask,
          {
            y: '0%',
            duration: 0.2,
            ease: 'power1.inOut',
          },
          `0.${index + 2}`,
        );
    });

  const popout = gsap.timeline();
  gsap.utils
    .toArray('.icon-mask:not(:first-child)')
    .forEach((mask: any, index: number) => {
      popout.to(
        mask,
        {
          y: '0%',
          duration: 0.2,
          ease: 'power1.inOut',
        },
        `0.${index}`,
      );
    });

  const firstIcon = gsap.timeline();
  firstIcon.fromTo(
    '.icon-mask:first-child',
    { y: '-100%', autoAlpha: 0 },
    { y: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
  );

  return { tl, hoverAnim, activeAnim, spinAnim, popin, popout, firstIcon };
}
