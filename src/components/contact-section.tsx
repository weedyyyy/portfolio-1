import BlurFade from "@/components/magicui/blur-fade";
import { ContactForm } from "@/components/contact-form";

const BLUR_FADE_DELAY = 0.04;

export function ContactSection() {
	return (
		<section id='contact'>
			<div className='grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12'>
				<BlurFade delay={BLUR_FADE_DELAY * 16}>
					<div className='space-y-3'>
						<div className='inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-sm'>
							Contact
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
							Get in Touch
						</h2>
						<p className='mx-auto max-w-[600px] text-slate-600 dark:text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Have a question or want to work together?
							Fill out the form below and I&apos;ll get
							back to you as soon as possible.
						</p>
					</div>
					<ContactForm />
				</BlurFade>
			</div>
		</section>
	);
}
