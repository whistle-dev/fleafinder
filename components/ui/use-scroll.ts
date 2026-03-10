'use client';
import React from 'react';

export function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	React.useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			const next = window.scrollY > threshold;
			setScrolled((current) => (current === next ? current : next));
		};

		const onScroll = () => {
			if (frame !== 0) {
				return;
			}

			frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			if (frame !== 0) {
				window.cancelAnimationFrame(frame);
			}

			window.removeEventListener('scroll', onScroll);
		};
	}, [threshold]);

	return scrolled;
}
