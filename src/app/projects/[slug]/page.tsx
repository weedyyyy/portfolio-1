import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { getPortfolioData } from "@/data/get-portfolio-data";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
	const data = await getPortfolioData();
	const project = data.projects.find((p: any) => p.slug === params.slug);

	if (!project) {
		notFound();
	}

	return (
		<div className='container py-12'>
			<Card className='mx-auto max-w-4xl'>
				<CardHeader>
					<CardTitle className='text-3xl font-bold'>
						{project.title}
					</CardTitle>
					<time className='font-sans text-sm text-muted-foreground'>
						{project.dates}
					</time>
				</CardHeader>
				<CardContent className='space-y-6'>
					{project.video && (
						<video
							src={project.video}
							autoPlay
							loop
							muted
							playsInline
							className='w-full'
						/>
					)}
					{project.image && (
						<Image
							src={project.image}
							alt={project.title}
							width={800}
							height={600}
							className='w-full rounded-lg object-cover'
						/>
					)}
					<Markdown className='prose max-w-full text-pretty font-sans text-base text-muted-foreground dark:prose-invert'>
						{project.description}
					</Markdown>
					{Array.isArray(project.images) &&
						project.images.length > 0 && (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{(project.images as string[]).map(
									(
										img: string,
										idx: number,
									) => (
										<Image
											key={idx}
											src={img}
											alt={`${
												project.title
											} screenshot ${
												idx +
												1
											}`}
											width={400}
											height={300}
											className='w-full rounded-lg object-cover'
										/>
									),
								)}
							</div>
						)}
				</CardContent>
				<CardFooter className='flex flex-col items-start gap-4'>
					{project.technologies.length > 0 && (
						<div className='flex flex-wrap gap-2'>
							{project.technologies.map((tag: string) => (
								<Badge
									key={tag}
									variant='secondary'>
									{tag}
								</Badge>
							))}
						</div>
					)}
					{project.links && (
						<div className='flex flex-row flex-wrap items-start gap-2'>
							{Object.entries(
								project.links as Record<
									string,
									string
								>,
							).map(([key, value]) =>
								value ? (
									<Link
										href={value}
										key={key}
										target='_blank'>
										<Badge className='flex gap-2 px-3 py-1 text-sm'>
											{key
												.charAt(
													0,
												)
												.toUpperCase() +
												key.slice(
													1,
												)}
										</Badge>
									</Link>
								) : null,
							)}
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
