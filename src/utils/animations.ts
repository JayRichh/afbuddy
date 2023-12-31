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

  const popin = gsap.timeline();
  gsap.utils.toArray('.masked-icon:not(:first-child)').forEach((mask: any, index: number) => {
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
  gsap.utils.toArray('.masked-icon:not(:first-child)').forEach((mask: any, index: number) => {
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
    '.masked-icon:first-child',
    { y: '100%', autoAlpha: 0 },
    { y: '0%', autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
  );

  return { tl, popin, popout, firstIcon };
}
