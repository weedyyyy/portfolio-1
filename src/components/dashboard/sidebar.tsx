"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	User,
	Code,
	Briefcase,
	GraduationCap,
	FolderOpen,
	Mail,
	Languages,
	Home,
	ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
	activeSection: string;
	onSectionChange: (section: string) => void;
	collapsed?: boolean;
	onCollapseToggle?: () => void;
	embedded?: boolean;
}

const sidebarItems = [
	{ id: "personal", label: "Personal Info", icon: User },
	{ id: "skills", label: "Skills", icon: Code },
	{ id: "work", label: "Work Experience", icon: Briefcase },
	{ id: "education", label: "Education", icon: GraduationCap },
	{ id: "projects", label: "Projects", icon: FolderOpen },
	{ id: "contact", label: "Contact", icon: Mail },
	{ id: "languages", label: "Languages", icon: Languages },
	{ id: "resume", label: "Resume", icon: FolderOpen },
];

export function Sidebar({
	activeSection,
	onSectionChange,
	collapsed = false,
	onCollapseToggle,
	embedded = false,
}: SidebarProps) {
	return (
		<aside
			className={cn(
				"h-full flex flex-col",
				embedded ? "w-full" : collapsed ? "w-16" : "w-64",
				embedded ? "" : "border-r bg-card",
			)}
			role='navigation'
			aria-label='Dashboard sections'>
			{!embedded && (
				<div
					className={cn(
						"flex items-center gap-2 p-3 border-b",
						collapsed && "justify-center",
					)}>
					{!collapsed && (
						<h2 className='text-sm font-semibold tracking-tight'>
							Portfolio Dashboard
						</h2>
					)}
					<Button
						variant='ghost'
						size='icon'
						aria-label={
							collapsed
								? "Expand sidebar"
								: "Collapse sidebar"
						}
						className={cn("ml-auto", collapsed && "ml-0")}
						onClick={onCollapseToggle}>
						<ChevronLeft
							className={cn(
								"h-4 w-4 transition-transform",
								collapsed && "rotate-180",
							)}
						/>
					</Button>
				</div>
			)}

			<ScrollArea className='flex-1 px-2 py-2'>
				<ul className='space-y-1'>
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeSection === item.id;

						const content = (
							<button
								key={item.id}
								onClick={() =>
									onSectionChange(item.id)
								}
								aria-current={
									isActive
										? "page"
										: undefined
								}
								className={cn(
									"w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
									"hover:bg-accent hover:text-accent-foreground",
									isActive &&
										"bg-accent text-accent-foreground",
									collapsed &&
										"justify-center",
								)}>
								<Icon
									className={cn(
										"h-4 w-4",
										!collapsed &&
											"shrink-0",
									)}
								/>
								{!collapsed && (
									<span className='truncate'>
										{item.label}
									</span>
								)}
							</button>
						);

						return (
							<li key={item.id}>
								{collapsed ? (
									<Tooltip delayDuration={0}>
										<TooltipTrigger
											asChild>
											{content}
										</TooltipTrigger>
										<TooltipContent side='right'>
											<p>
												{
													item.label
												}
											</p>
										</TooltipContent>
									</Tooltip>
								) : (
									content
								)}
							</li>
						);
					})}
				</ul>
			</ScrollArea>

			{!embedded && (
				<div className='p-3 border-t'>
					<Link
						href='/'
						passHref>
						{collapsed ? (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<Button
										variant='outline'
										size='icon'
										className='w-full'>
										<Home className='h-4 w-4' />
									</Button>
								</TooltipTrigger>
								<TooltipContent side='right'>
									<p>View Frontend</p>
								</TooltipContent>
							</Tooltip>
						) : (
							<Button
								variant='outline'
								className='w-full justify-start'>
								<Home className='mr-2 h-4 w-4' />
								View Frontend
							</Button>
						)}
					</Link>
				</div>
			)}
		</aside>
	);
}
