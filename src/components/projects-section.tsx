import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { PortfolioData } from "@/data/get-portfolio-data";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export function ProjectsSection({ DATA }: { DATA: PortfolioData }) {
	return (
		<section id='projects'>
			<div className='space-y-12 w-full py-12'>
				<BlurFade delay={BLUR_FADE_DELAY * 11}>
					<div className='flex flex-col items-center justify-center space-y-4 text-center'>
						<div className='space-y-2'>
							<div className='inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-sm'>
								My Work
							</div>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
								My Work
							</h2>
							<p className='text-slate-600 dark:text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
								Here are some of the projects
								I&apos;ve worked on. Click to see
								more.
							</p>
						</div>
					</div>
				</BlurFade>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto'>
					{DATA.projects.map((project: any, id: number) => (
						<BlurFade
							key={project.title}
							delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
							<Link href={`/projects/${project.slug}`}>
								<ProjectCard
									key={project.title}
									title={project.title}
									description={
										project.description
									}
									dates={project.dates}
									tags={project.technologies}
									image={project.image}
									video={project.video}
									links={project.links}
								/>
							</Link>
						</BlurFade>
					))}
				</div>
			</div>
		</section>
	);
}
