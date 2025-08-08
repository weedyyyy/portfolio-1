"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
	const [loading, setLoading] = useState<boolean>(false);
	const [result, setResult] = useState<{
		success?: boolean;
		message?: string;
		error?: string;
		data?: any;
	} | null>(null);

	const testDbConnection = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/test-db");
			const data = await response.json();
			setResult(data);
		} catch (error) {
			setResult({
				success: false,
				message: "Error testing database connection",
				error: error instanceof Error ? error.message : String(error),
			});
		} finally {
			setLoading(false);
		}
	};

	const seedDatabase = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/seed");
			const data = await response.json();
			setResult(data);
		} catch (error) {
			setResult({
				success: false,
				message: "Error seeding database",
				error: error instanceof Error ? error.message : String(error),
			});
		} finally {
			setLoading(false);
		}
	};

	const viewDbContent = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/db-content");
			const data = await response.json();
			setResult(data);
		} catch (error) {
			setResult({
				success: false,
				message: "Error fetching database content",
				error: error instanceof Error ? error.message : String(error),
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container py-10'>
			<h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Database Connection</CardTitle>
						<CardDescription>
							Test the connection to your Supabase
							PostgreSQL database
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={testDbConnection}
							disabled={loading}>
							{loading ? "Testing..." : "Test Connection"}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Seed Database</CardTitle>
						<CardDescription>
							Populate the database with initial data
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={seedDatabase}
							disabled={loading}
							variant='secondary'>
							{loading ? "Seeding..." : "Seed Database"}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>View Database</CardTitle>
						<CardDescription>
							View all content in the database
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={viewDbContent}
							disabled={loading}
							variant='outline'>
							{loading ? "Loading..." : "View Content"}
						</Button>
					</CardContent>
				</Card>
			</div>

			{result && (
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>Result</CardTitle>
						<CardDescription>
							Response from the last operation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div
							className={`p-4 rounded-md ${
								result.success
									? "bg-green-50"
									: "bg-red-50"
							}`}>
							<p className='font-medium'>
								{result.message}
							</p>
							{result.error && (
								<p className='text-red-600 mt-2'>
									{result.error}
								</p>
							)}
							{result.data && (
								<pre className='mt-4 p-2 bg-gray-100 rounded overflow-auto max-h-96 text-sm'>
									{JSON.stringify(
										result.data,
										null,
										2,
									)}
								</pre>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
