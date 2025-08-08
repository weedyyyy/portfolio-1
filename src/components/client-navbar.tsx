"use client";

import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function ClientNavbar() {
	const pathname = usePathname();

	if (pathname?.startsWith("/dashboard")) {
		return null;
	}

	return <Navbar />;
}
