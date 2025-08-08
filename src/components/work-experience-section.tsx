import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { PortfolioData } from "@/data/get-portfolio-data";

const BLUR_FADE_DELAY = 0.04;

export function WorkExperienceSection({ DATA }: { DATA: PortfolioData }) {
	if (DATA.work.length === 0) {
		return null;
	}

	return (
		<section id='work'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={BLUR_FADE_DELAY * 5}>
					<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						Work Experience
					</h2>
				</BlurFade>
				{DATA.work.map((work: any, id: number) => (
					<BlurFade
						key={work.company}
						delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
						<ResumeCard
							key={work.company}
							logoUrl={work.logoUrl}
							altText={work.company}
							title={work.company}
							subtitle={work.title}
							href={work.href}
							badges={work.badges}
							period={`${work.start} - ${
								work.end ?? "Present"
							}`}
							description={work.description}
						/>
					</BlurFade>
				))}
			</div>
		</section>
	);
}
