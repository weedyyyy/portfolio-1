import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Markdown from "react-markdown";
import { ContactForm } from "@/components/contact-form";
import { getPortfolioData } from "@/data/get-portfolio-data";
import { Button } from "@/components/ui/button";
import TextType from "@/components/magicui/TextAnimations/TextType/TextType";
import ClickSpark from "@/components/magicui/Animations/ClickSpark/ClickSpark";
import RotatingText from "@/components/magicui/TextAnimations/RotatingText/RotatingText";

const BLUR_FADE_DELAY = 0.04;

export default async function Page() {
	const DATA = await getPortfolioData();

	return (
		<ClickSpark
			sparkColor='#3b82f6'
			sparkSize={12}
			sparkRadius={25}
			sparkCount={6}
			duration={600}
			easing='ease-out'
			extraScale={1.2}>
			<main className='flex flex-col min-h-[100dvh] space-y-10'>
				<section id='hero'>
					<div className='mx-auto w-full max-w-2xl space-y-8'>
						<div className='gap-2 flex justify-between'>
							<div className='flex-col flex flex-1 space-y-1.5'>
								<BlurFade delay={BLUR_FADE_DELAY}>
									<div className='min-h-[80px] sm:min-h-[100px] xl:min-h-[120px] flex items-start'>
										<TextType
											text={[
												`Hi, I'm ${
													DATA.name.split(
														" ",
													)[0]
												} 👋`,
												"Welcome to my portfolio",
												"Let's build something amazing",
											]}
											className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-5xl/none bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
											typingSpeed={
												100
											}
											pauseDuration={
												2000
											}
											deletingSpeed={
												50
											}
											loop={true}
											showCursor={
												true
											}
											cursorCharacter='|'
											cursorClassName='text-blue-600'
										/>
									</div>
								</BlurFade>
								<BlurFadeText
									className='max-w-[600px] md:text-xl text-slate-600 dark:text-slate-300'
									delay={BLUR_FADE_DELAY * 2}
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
					<div className='pt-4'>
						<BlurFade delay={BLUR_FADE_DELAY * 4.5}>
							<a
								href='/api/resume'
								className='inline-flex items-center rounded-md bg-foreground text-background px-3 py-1.5 text-sm font-medium shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition'>
								Download Resume
							</a>
						</BlurFade>
					</div>
				</section>
				{DATA.work.length > 0 && (
					<section id='work'>
						<div className='flex min-h-0 flex-col gap-y-3 '>
							<BlurFade delay={BLUR_FADE_DELAY * 5}>
								<h2 className='text-xl font-bold  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
									Work Experience
								</h2>
							</BlurFade>
							{DATA.work.map((work: any, id: number) => (
								<BlurFade
									key={work.company}
									delay={
										BLUR_FADE_DELAY *
											6 +
										id * 0.05
									}>
									<ResumeCard
										key={work.company}
										logoUrl={
											work.logoUrl
										}
										altText={
											work.company
										}
										title={work.company}
										subtitle={
											work.title
										}
										href={work.href}
										badges={work.badges}
										period={`${
											work.start
										} - ${
											work.end ??
											"Present"
										}`}
										description={
											work.description
										}
									/>
								</BlurFade>
							))}
						</div>
					</section>
				)}
				<section id='education'>
					<div className='flex min-h-0 flex-col gap-y-3'>
						<BlurFade delay={BLUR_FADE_DELAY * 7}>
							<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
								Education
							</h2>
						</BlurFade>
						{DATA.education.map(
							(education: any, id: number) => (
								<BlurFade
									key={education.degree}
									delay={
										BLUR_FADE_DELAY *
											8 +
										id * 0.05
									}>
									<ResumeCard
										key={
											education.degree
										}
										href={
											education.href
										}
										logoUrl={
											education.logoUrl
										}
										altText={
											education.school
										}
										title={
											education.school
										}
										subtitle={
											education.degree
										}
										period={`${education.start} - ${education.end}`}
									/>
								</BlurFade>
							),
						)}
					</div>
				</section>
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
											BLUR_FADE_DELAY *
												10 +
											id * 0.05
										}>
										<Badge className='flex items-center gap-2'>
											{typeof Icon ===
											"function" ? (
												<Icon className='size-5' />
											) : (
												<span className='text-sm'>
													{
														Icon
													}
												</span> // Fallback for string
											)}
											<span>
												{
													skill.name
												}
											</span>
										</Badge>
									</BlurFade>
								);
							})}
						</div>
					</div>
				</section>
				{DATA.languages && DATA.languages.length > 0 && (
					<section id='languages'>
						<div className='flex min-h-0 flex-col gap-y-3'>
							<BlurFade delay={BLUR_FADE_DELAY * 9.5}>
								<h2 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
									Languages
								</h2>
							</BlurFade>
							<div className='flex flex-wrap gap-2'>
								{DATA.languages.map(
									(lang: any, id: number) => (
										<BlurFade
											key={id}
											delay={
												BLUR_FADE_DELAY *
													10.5 +
												id *
													0.05
											}>
											<Badge className='flex items-center gap-2'>
												{lang.flagIcon && (
													<span className='text-base'>
														{
															lang.flagIcon
														}
													</span>
												)}
												<span>
													{
														lang.name
													}
												</span>
												<span className='text-muted-foreground text-xs'>
													(
													{
														lang.level
													}

													)
												</span>
											</Badge>
										</BlurFade>
									),
								)}
							</div>
						</div>
					</section>
				)}
				<section id='projects'>
					<div className='space-y-12 w-full py-12'>
						<BlurFade delay={BLUR_FADE_DELAY * 11}>
							<div className='flex flex-col items-center justify-center space-y-4 text-center'>
								<div className='space-y-2'>
									<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
										My Work
									</div>
									<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
										My Work
									</h2>
									<p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
										Here are some of the
										projects I&apos;ve
										worked on. Click to
										see more.
									</p>
								</div>
							</div>
						</BlurFade>
						<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto'>
							{DATA.projects.map(
								(project: any, id: number) => (
									<BlurFade
										key={project.title}
										delay={
											BLUR_FADE_DELAY *
												12 +
											id * 0.05
										}>
										<Link
											href={`/projects/${project.slug}`}>
											<ProjectCard
												key={
													project.title
												}
												title={
													project.title
												}
												description={
													project.description
												}
												dates={
													project.dates
												}
												tags={
													project.technologies
												}
												image={
													project.image
												}
												video={
													project.video
												}
												links={
													project.links
												}
											/>
										</Link>
									</BlurFade>
								),
							)}
						</div>
					</div>
				</section>
				{DATA.hackathons && DATA.hackathons.length > 0 && (
					<section id='hackathons'>
						<div className='space-y-12 w-full py-12'>
							<BlurFade delay={BLUR_FADE_DELAY * 13}>
								<div className='flex flex-col items-center justify-center space-y-4 text-center'>
									<div className='space-y-2'>
										<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
											Hackathons
										</div>
										<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
											I like
											building
											things
										</h2>
										<p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
											During my
											time in
											university,
											I attended{" "}
											{
												DATA
													.hackathons
													.length
											}
											+
											hackathons.
											People from
											around the
											country
											would come
											together and
											build
											incredible
											things in
											2-3 days. It
											was
											eye-opening
											to see the
											endless
											possibilities
											brought to
											life by a
											group of
											motivated
											and
											passionate
											individuals.
										</p>
									</div>
								</div>
							</BlurFade>
							<BlurFade delay={BLUR_FADE_DELAY * 14}>
								<ul className='mb-4 ml-4 divide-y divide-dashed border-l'>
									{DATA.hackathons.map(
										(
											project: any,
											id: number,
										) => (
											<BlurFade
												key={
													project.title +
													project.dates
												}
												delay={
													BLUR_FADE_DELAY *
														15 +
													id *
														0.05
												}>
												<HackathonCard
													title={
														project.title
													}
													description={
														project.description
													}
													location={
														project.location
													}
													dates={
														project.dates
													}
													image={
														project.image
													}
													links={
														project.links
													}
												/>
											</BlurFade>
										),
									)}
								</ul>
							</BlurFade>
						</div>
					</section>
				)}
				<section id='contact'>
					<div className='grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12'>
						<BlurFade delay={BLUR_FADE_DELAY * 16}>
							<div className='space-y-3'>
								<div className='inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm'>
									Contact
								</div>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl flex justify-center items-center gap-3'>
									<span className='text-foreground'>
										Let&apos;s
									</span>
									<RotatingText
										texts={[
											"Connect",
											"Get in Touch",
											"Chat",
										]}
										rotationInterval={
											3000
										}
										transition={{
											type: "spring",
											damping: 25,
											stiffness: 200,
										}}
										initial={{
											y: "100%",
											opacity: 0,
											scale: 0.8,
										}}
										animate={{
											y: 0,
											opacity: 1,
											scale: 1,
										}}
										exit={{
											y: "-100%",
											opacity: 0,
											scale: 0.8,
										}}
										staggerDuration={
											0.05
										}
										staggerFrom='center'
										splitBy='characters'
										mainClassName='text-3xl font-bold tracking-tighter sm:text-5xl text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-transparent hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25'
									/>
								</h2>
								<p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Have a question or want to
									work together? Fill out the
									form below and I&apos;ll get
									back to you as soon as
									possible.
								</p>
							</div>
							<ContactForm />
						</BlurFade>
					</div>
				</section>
			</main>
		</ClickSpark>
	);
}
