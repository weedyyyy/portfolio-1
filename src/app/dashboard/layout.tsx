import "@/app/globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	// Dashboard should render full-bleed inside the existing root layout shell
	return <div className='min-h-screen'>{children}</div>;
}
