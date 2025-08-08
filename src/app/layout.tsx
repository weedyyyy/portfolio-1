import ClientNavbar from "@/components/client-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getPortfolioData } from "@/data/get-portfolio-data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import BackgroundLightRays from "@/components/BackgroundLightRays";
import "./globals.css";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
	const data = await getPortfolioData();
	return {
		metadataBase: new URL(data.url),
		title: {
			default: data.name,
			template: `%s | ${data.name}`,
		},
		description: data.description,
		openGraph: {
			title: `${data.name}`,
			description: data.description,
			url: data.url,
			siteName: `${data.name}`,
			locale: "en_US",
			type: "website",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		twitter: {
			title: `${data.name}`,
			card: "summary_large_image",
		},
		verification: {
			google: "",
			yandex: "",
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
					fontSans.variable,
				)}
				suppressHydrationWarning>
				<BackgroundLightRays />
				<ThemeProvider
					attribute='class'
					defaultTheme='light'>
					<TooltipProvider delayDuration={0}>
						{children}
						<ClientNavbar />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
