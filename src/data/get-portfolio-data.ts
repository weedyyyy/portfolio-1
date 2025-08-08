import prisma from "@/lib/prisma";
import { ensureArray, safeJsonParse } from "@/lib/utils";
import { Icons } from "@/components/icons";

// Define types for our data structures
interface WorkExperience {
	id?: number;
	company: string;
	title: string;
	logoUrl?: string | null;
	href?: string | null;
	description: string;
	start: string;
	end?: string | null;
	badges: string[];
	order?: number;
}

interface Education {
	id?: number;
	school: string;
	degree: string;
	logoUrl?: string | null;
	href?: string | null;
	start: string;
	end: string;
	order?: number;
}

export interface PortfolioData {
	name: string;
	initials: string;
	url: string;
	location: string;
	locationLink?: string;
	description: string;
	summary: string;
	avatarUrl: string;
	skills: { name: string; icon: any }[];
	work: WorkExperience[];
	education: Education[];
	projects: any[];
	hackathons: any[];
	contact?: {
		email: string;
		tel: string;
		social: Record<string, any>;
	};
	navbar?: any[];
    languages?: { name: string; level: string; flagIcon?: string | null }[];
}

export async function getPortfolioData(): Promise<PortfolioData> {
	try {
		console.log("Fetching portfolio data from database...");

        const [personalInfo, skills, work, education, projects, hackathons, languages] =
			await prisma.$transaction([
				prisma.personalInfo.findFirst(),
				prisma.skill.findMany({ orderBy: { name: "asc" } }),
				prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
				prisma.education.findMany({ orderBy: { order: "asc" } }),
				prisma.project.findMany({ orderBy: { order: "asc" } }),
				prisma.hackathon.findMany({ orderBy: { order: "asc" } }),
                prisma.language.findMany({ orderBy: { id: "asc" } }),
			]);

		console.log("All data fetched in a single transaction.");

		// Throw error if no personal info exists
		if (!personalInfo) {
			throw new Error(
				"No personal information found in the database. Please seed the database first.",
			);
		}

		// Create data object with safe fallbacks
        const data = {
			name: personalInfo.name,
			initials: personalInfo.initials,
			url: personalInfo.url,
			location: personalInfo.location,
			locationLink: personalInfo.locationLink || "",
			description: personalInfo.description,
			summary: personalInfo.summary,
            avatarUrl: personalInfo.avatarUrl || "",
			skills: skills.map((skill) => ({
				name: skill.name,
				icon: Icons[skill.icon as keyof typeof Icons] || skill.icon,
			})),
			work: work.map((item) => ({
				company: item.company,
				title: item.title,
				logoUrl: item.logoUrl || undefined,
				href: item.href || undefined,
				description: item.description,
				start: item.start,
				end: item.end || undefined,
				badges: ensureArray(item.badges),
			})),
			education: education.map((item) => ({
				school: item.school,
				degree: item.degree,
				logoUrl: item.logoUrl || undefined,
				href: item.href || undefined,
				start: item.start,
				end: item.end,
			})),
			projects: projects.map((project) => ({
				title: project.title,
				slug: project.slug,
				description: project.description,
				dates: project.dates || undefined,
				image: project.image || undefined,
				video: project.video || undefined,
				technologies: ensureArray(project.technologies),
				links: safeJsonParse(project.links, undefined),
				featured: project.featured,
			})),
			hackathons: hackathons.map((hackathon) => ({
				title: hackathon.title,
				description: hackathon.description,
				location: hackathon.location,
				dates: hackathon.dates,
				image: hackathon.image || undefined,
				links: safeJsonParse(hackathon.links, undefined),
			})),
            languages: languages.map((lang) => ({
                name: lang.name,
                level: lang.level,
                flagIcon: lang.flagIcon || null,
            })),
		};

		console.log("Portfolio data successfully processed");
		return data;
	} catch (error) {
		console.error("Error fetching portfolio data:", error);
		// Instead of returning fallback data, throw an error to show we need database data
		throw new Error(
			`Failed to fetch portfolio data from database: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
} 