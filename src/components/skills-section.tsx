import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { PortfolioData } from "@/data/get-portfolio-data";

const BLUR_FADE_DELAY = 0.04;

export function SkillsSection({ DATA }: { DATA: PortfolioData }) {
	return (
		<section id='skills'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={BLUR_FADE_DELAY * 9}>
					<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						Skills
					</h2>
				</BlurFade>
				<div className='flex flex-wrap gap-2'>
					{DATA.skills.map((skill, id) => {
						const Icon = skill.icon;
						return (
							<BlurFade
								key={id}
								delay={
									BLUR_FADE_DELAY * 10 +
									id * 0.05
								}>
								<Badge className='flex items-center gap-2'>
									{typeof Icon ===
									"function" ? (
										<Icon className='size-5' />
									) : (
										<span className='text-sm'>
											{Icon}
										</span> // Fallback for string
									)}
									<span>{skill.name}</span>
								</Badge>
							</BlurFade>
						);
					})}
				</div>
			</div>
		</section>
	);
}
