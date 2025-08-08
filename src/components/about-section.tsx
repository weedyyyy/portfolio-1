import BlurFade from "@/components/magicui/blur-fade";
import { PortfolioData } from "@/data/get-portfolio-data";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export function AboutSection({ DATA }: { DATA: PortfolioData }) {
	return (
		<section id='about'>
			<BlurFade delay={BLUR_FADE_DELAY * 3}>
				<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
					About
				</h2>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 4}>
				<Markdown className='prose max-w-full text-pretty font-sans text-sm text-slate-600 dark:text-slate-300 dark:prose-invert'>
					{DATA.summary}
				</Markdown>
			</BlurFade>
		</section>
	);
}
