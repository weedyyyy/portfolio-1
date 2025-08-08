import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PortfolioData } from "@/data/get-portfolio-data";

const BLUR_FADE_DELAY = 0.04;

export function HeroSection({ DATA }: { DATA: PortfolioData }) {
	return (
		<section
			id='hero'
			className='relative'>
			<div className='mx-auto w-full max-w-2xl space-y-8'>
				<div className='gap-2 flex justify-between'>
					<div className='flex-col flex flex-1 space-y-1.5'>
						<BlurFadeText
							delay={BLUR_FADE_DELAY}
							className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-5xl/none bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
							yOffset={8}
							text={`Hi, I'm ${
								DATA.name.split(" ")[0]
							} 👋`}
						/>
						<BlurFadeText
							className='max-w-[600px] md:text-xl text-slate-600 dark:text-slate-300'
							delay={BLUR_FADE_DELAY}
							text={DATA.description}
						/>
					</div>
					<BlurFade delay={BLUR_FADE_DELAY}>
						<Avatar className='size-40 border-4 border-white/30 shadow-2xl backdrop-blur-sm ring-2 ring-blue-200/50'>
							<AvatarImage
								alt={DATA.name}
								src={DATA.avatarUrl}
								className='object-cover'
							/>
							<AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-900'>
								{DATA.initials}
							</AvatarFallback>
						</Avatar>
					</BlurFade>
				</div>
			</div>
		</section>
	);
}
