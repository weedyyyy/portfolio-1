"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PersonalInfoSection } from "@/components/dashboard/personal-info-section";
import { SkillsSection } from "@/components/dashboard/skills-section";
import { WorkSection } from "@/components/dashboard/work-section";
import { EducationSection } from "@/components/dashboard/education-section";
import { ProjectsSection } from "@/components/dashboard/projects-section";
import { ContactSection } from "@/components/dashboard/contact-section";
import { LanguagesSection } from "@/components/dashboard/languages-section";
import { ResumeSection } from "@/components/dashboard/resume-section";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@/components/ui/sheet";
import { Menu, LogOut, Loader2 } from "lucide-react";

export default function DashboardPage() {
	const [activeSection, setActiveSection] = useState("personal");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	// Check authentication status
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (!session) {
					router.push("/login");
					return;
				}
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Auth check failed:", error);
				router.push("/login");
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT" || !session) {
				router.push("/login");
			} else if (event === "SIGNED_IN") {
				setIsAuthenticated(true);
			}
		});

		return () => subscription.unsubscribe();
	}, [router]);

	const signOut = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	}; // Keyboard shortcuts: Alt+1..7 to switch sections
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (!e.altKey) return;
			// Don't trigger shortcuts when user is typing in input fields
			const activeElement = document.activeElement;
			if (
				activeElement &&
				(activeElement.tagName === "INPUT" ||
					activeElement.tagName === "TEXTAREA" ||
					activeElement.getAttribute("contenteditable") === "true")
			) {
				return;
			}
			const mapping: Record<string, string> = {
				"1": "personal",
				"2": "skills",
				"3": "work",
				"4": "education",
				"5": "projects",
				"6": "contact",
				"7": "languages",
			};
			const next = mapping[e.key as keyof typeof mapping];
			if (next) {
				setActiveSection(next);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	const sectionTitle = useMemo(() => {
		switch (activeSection) {
			case "personal":
				return "Personal Info";
			case "skills":
				return "Skills";
			case "work":
				return "Work Experience";
			case "education":
				return "Education";
			case "projects":
				return "Projects";
			case "contact":
				return "Contact";
			case "languages":
				return "Languages";
			default:
				return "Dashboard";
		}
	}, [activeSection]);

	const renderSection = () => {
		switch (activeSection) {
			case "personal":
				return <PersonalInfoSection />;
			case "skills":
				return <SkillsSection />;
			case "work":
				return <WorkSection />;
			case "education":
				return <EducationSection />;
			case "projects":
				return <ProjectsSection />;
			case "contact":
				return <ContactSection />;
			case "languages":
				return <LanguagesSection />;
			case "resume":
				return <ResumeSection />;
			default:
				return <PersonalInfoSection />;
		}
	};

	// Show loading spinner while checking authentication
	if (isLoading) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-background'>
				<div className='flex items-center gap-2'>
					<Loader2 className='h-6 w-6 animate-spin' />
					<span>Checking authentication...</span>
				</div>
			</div>
		);
	}

	// Don't render dashboard if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className='fixed inset-0 w-screen h-screen bg-background'>
			{/* Top bar (mobile and desktop) */}
			<div className='flex h-14 items-center border-b px-3 md:px-4 lg:px-6 gap-2'>
				{/* Mobile: sidebar trigger */}
				<Sheet
					open={isSidebarOpen}
					onOpenChange={setIsSidebarOpen}>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='lg:hidden'
							aria-label='Open menu'>
							<Menu className='h-5 w-5' />
						</Button>
					</SheetTrigger>
					<SheetContent
						side='left'
						className='p-0 w-80'>
						<SheetTitle className='sr-only'>
							Navigation
						</SheetTitle>
						<SheetDescription className='sr-only'>
							Dashboard sections
						</SheetDescription>
						<Sidebar
							activeSection={activeSection}
							onSectionChange={(s) => {
								setActiveSection(s);
								setIsSidebarOpen(false);
							}}
							collapsed={false}
							embedded
						/>
						<div className='p-3'>
							<SheetClose asChild>
								<Button
									variant='secondary'
									className='w-full'>
									Close
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>

				{/* Title */}
				<div className='flex items-center gap-2'>
					<span className='text-sm text-muted-foreground hidden sm:inline'>
						Dashboard
					</span>
					<span className='text-base font-semibold'>
						{sectionTitle}
					</span>
				</div>

				<div className='ml-auto flex items-center gap-3'>
					<span className='text-xs text-muted-foreground hidden md:block'>
						Alt + 1-7 to switch sections
					</span>
					<Button
						variant='ghost'
						size='sm'
						onClick={signOut}
						className='gap-1'>
						<LogOut className='h-4 w-4' />
						<span className='hidden sm:inline'>Sign out</span>
					</Button>
				</div>
			</div>

			{/* Content area */}
			<div className='flex h-[calc(100vh-3.5rem)]'>
				{/* Desktop sidebar */}
				<div className='hidden lg:block h-full'>
					<Sidebar
						activeSection={activeSection}
						onSectionChange={setActiveSection}
						collapsed={isCollapsed}
						onCollapseToggle={() => setIsCollapsed((v) => !v)}
					/>
				</div>

				{/* Main content */}
				<main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8'>
					<div className='mx-auto max-w-5xl'>{renderSection()}</div>
				</main>
			</div>
		</div>
	);
}
