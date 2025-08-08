"use client";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HomeIcon, NotebookIcon, FileDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icons } from "./icons";

export default function Navbar() {
	const [data, setData] = useState<any | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		fetch("/api/portfolio")
			.then((res) => res.json())
			.then((json) => setData(json))
			.catch(() => setData({}));
		setMounted(true);
	}, []);

	if (!data) {
		return null;
	}

	const navbar = [
		{ href: "/", icon: HomeIcon, label: "Home" },
		{ href: "/blog", icon: NotebookIcon, label: "Blog" },
	];

	return (
		<div className='pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14'>
			<div className='fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background'></div>
			<Dock className='z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] '>
				{navbar.map((item) => (
					<DockIcon key={item.href}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={item.href}
									className={cn(
										buttonVariants({
											variant: "ghost",
											size: "icon",
										}),
										"size-12",
									)}>
									<item.icon className='size-4' />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>{item.label}</p>
							</TooltipContent>
						</Tooltip>
					</DockIcon>
				))}
				{/* Resume download */}
				<DockIcon>
					<Tooltip>
						<TooltipTrigger asChild>
							<a
								href='/api/resume'
								download
								className={cn(
									buttonVariants({
										variant: "ghost",
										size: "icon",
									}),
									"size-12 transition-all duration-700",
									mounted
										? "opacity-100 translate-y-0 blur-0"
										: "opacity-0 translate-y-1 blur-[2px]",
								)}
								style={{ transitionDelay: "80ms" }}>
								<FileDown className='size-4' />
							</a>
						</TooltipTrigger>
						<TooltipContent>
							<p>Resume</p>
						</TooltipContent>
					</Tooltip>
				</DockIcon>
				<Separator
					orientation='vertical'
					className='h-full'
				/>
				{data?.contact &&
					data.contact.social &&
					Object.entries(data.contact.social).map(([name, url]) => {
						const Icon =
							Icons[
								name.toLowerCase() as keyof typeof Icons
							];
						if (!Icon) {
							return null;
						}
						return (
							<DockIcon key={name}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={
												url as string
											}
											className={cn(
												buttonVariants(
													{
														variant: "ghost",
														size: "icon",
													},
												),
												"size-12",
											)}>
											<Icon className='size-4' />
										</Link>
									</TooltipTrigger>
									<TooltipContent>
										<p>{name}</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						);
					})}
				<Separator
					orientation='vertical'
					className='h-full py-2'
				/>
				<DockIcon>
					<Tooltip>
						<TooltipTrigger asChild>
							<ModeToggle />
						</TooltipTrigger>
						<TooltipContent>
							<p>Theme</p>
						</TooltipContent>
					</Tooltip>
				</DockIcon>
			</Dock>
		</div>
	);
}
