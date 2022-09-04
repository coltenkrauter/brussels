import Image from 'next/image';

// https://unsplash.com/photos/3Sn1Ehg8AQ0
import background from '../public/lucas-davies-3Sn1Ehg8AQ0-unsplash.jpg';

export default function Background() {
	return (
		<div
			style={{
				position: 'fixed',
				height: '100vh',
				width: '100vw',
				overflow: 'hidden',
				zIndex: -10000,
			}}
			>
			<Image
				alt="Photo by Lucas Davies"
				layout="fill"
				src={background}
				placeholder="blur"
				objectFit="cover"
				quality={100}
				unoptimized
			/>
		</div>
	)
};
