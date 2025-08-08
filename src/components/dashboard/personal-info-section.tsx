"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PersonalInfoSection() {
	const [personalInfo, setPersonalInfo] = useState({
		name: "",
		initials: "",
		url: "",
		location: "",
		locationLink: "",
		description: "",
		summary: "",
		avatarUrl: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetchPersonalInfo();
	}, []);

	const fetchPersonalInfo = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/personal-info");

			if (response.ok) {
				const data = await response.json();
				setPersonalInfo({
					name: data.name || "",
					initials: data.initials || "",
					url: data.url || "",
					location: data.location || "",
					locationLink: data.locationLink || "",
					description: data.description || "",
					summary: data.summary || "",
					avatarUrl: data.avatarUrl || "",
				});
			} else {
				// If 404, we'll keep the default empty values to create a new record
				if (response.status !== 404) {
					toast.error("Error fetching data");
					console.error("Failed to fetch personal info");
				}
			}
		} catch (error) {
			console.error("Error fetching personal info:", error);
			toast.error("Error fetching data");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setPersonalInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);

			const response = await fetch("/api/dashboard/personal-info", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(personalInfo),
			});

			if (response.ok) {
				toast.success("Personal information saved successfully");
			} else {
				const error = await response.json();
				throw new Error(
					error.error || "Failed to save personal information",
				);
			}
		} catch (error) {
			console.error("Error saving personal info:", error);
			toast.error("Error saving data");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Personal Information</h1>
				<p className='text-muted-foreground'>
					Manage your personal details and profile information.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Profile Details</CardTitle>
					<CardDescription>
						Update your personal information and profile
						picture.
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='flex items-center space-x-4'>
						<Avatar className='h-20 w-20'>
							<AvatarImage
								src={
									personalInfo.avatarUrl ||
									"/placeholder.svg"
								}
								alt={personalInfo.name}
							/>
							<AvatarFallback>
								{personalInfo.initials}
							</AvatarFallback>
						</Avatar>
						<Button
							variant='outline'
							size='sm'>
							<Upload className='mr-2 h-4 w-4' />
							Change Avatar
						</Button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								id='name'
								value={personalInfo.name}
								onChange={(e) =>
									handleInputChange(
										"name",
										e.target.value,
									)
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='initials'>Initials</Label>
							<Input
								id='initials'
								value={personalInfo.initials}
								onChange={(e) =>
									handleInputChange(
										"initials",
										e.target.value,
									)
								}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='url'>Portfolio URL</Label>
						<Input
							id='url'
							value={personalInfo.url}
							onChange={(e) =>
								handleInputChange(
									"url",
									e.target.value,
								)
							}
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='location'>Location</Label>
							<Input
								id='location'
								value={personalInfo.location}
								onChange={(e) =>
									handleInputChange(
										"location",
										e.target.value,
									)
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='locationLink'>
								Location Link
							</Label>
							<Input
								id='locationLink'
								value={personalInfo.locationLink}
								onChange={(e) =>
									handleInputChange(
										"locationLink",
										e.target.value,
									)
								}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							value={personalInfo.description}
							onChange={(e) =>
								handleInputChange(
									"description",
									e.target.value,
								)
							}
							rows={3}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='summary'>Summary</Label>
						<Textarea
							id='summary'
							value={personalInfo.summary}
							onChange={(e) =>
								handleInputChange(
									"summary",
									e.target.value,
								)
							}
							rows={5}
						/>
					</div>

					<Button
						onClick={handleSave}
						className='w-full md:w-auto'
						disabled={isSaving}>
						{isSaving ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
