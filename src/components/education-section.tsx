import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { PortfolioData } from "@/data/get-portfolio-data";

const BLUR_FADE_DELAY = 0.04;

export function EducationSection({ DATA }: { DATA: PortfolioData }) {
	return (
		<section id='education'>
			<div className='flex min-h-0 flex-col gap-y-3'>
				<BlurFade delay={BLUR_FADE_DELAY * 7}>
					<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						Education
					</h2>
				</BlurFade>
				{DATA.education.map((education: any, id: number) => (
					<BlurFade
						key={education.degree}
						delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
						<ResumeCard
							key={education.degree}
							href={education.href}
							logoUrl={education.logoUrl}
							altText={education.school}
							title={education.school}
							subtitle={education.degree}
							period={`${education.start} - ${education.end}`}
						/>
					</BlurFade>
				))}
			</div>
		</section>
	);
}
