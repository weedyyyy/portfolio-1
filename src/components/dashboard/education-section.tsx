"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Education {
	id?: number;
	school: string;
	href?: string | null;
	degree: string;
	logoUrl?: string | null;
	start: string;
	end: string;
	order?: number;
}

export function EducationSection() {
	const [educationEntries, setEducationEntries] = useState<Education[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [newEducation, setNewEducation] = useState<Education>({
		school: "",
		href: "",
		degree: "",
		logoUrl: "",
		start: "",
		end: "",
	});

	const [editingEducation, setEditingEducation] = useState<{
		index: number;
		education: Education;
	} | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		fetchEducation();
	}, []);

	const fetchEducation = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/education");

			if (response.ok) {
				const data = await response.json();
				setEducationEntries(data);
			} else {
				toast.error("Error fetching education records");
			}
		} catch (error) {
			console.error("Error fetching education:", error);
			toast.error("Failed to load education data");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddEducation = async () => {
		if (
			newEducation.school &&
			newEducation.degree &&
			newEducation.start &&
			newEducation.end
		) {
			try {
				setIsSaving(true);
				const response = await fetch("/api/dashboard/education", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newEducation),
				});

				if (response.ok) {
					const addedEducation = await response.json();
					setEducationEntries([...educationEntries, addedEducation]);
					setNewEducation({
						school: "",
						href: "",
						degree: "",
						logoUrl: "",
						start: "",
						end: "",
					});
					setShowAddForm(false);
					toast.success("Education record added successfully");
				} else {
					const error = await response.json();
					throw new Error(
						error.error || "Failed to add education record",
					);
				}
			} catch (error) {
				console.error("Error adding education:", error);
				toast.error("Failed to add education record");
			} finally {
				setIsSaving(false);
			}
		} else {
			toast.error("Please fill in all required fields");
		}
	};

	const handleEditEducation = async () => {
		if (
			editingEducation &&
			editingEducation.education.school &&
			editingEducation.education.degree
		) {
			try {
				setIsSaving(true);
				const response = await fetch(
					`/api/dashboard/education/${editingEducation.education.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editingEducation.education),
					},
				);

				if (response.ok) {
					const updatedEducation = await response.json();
					const updatedEntries = [...educationEntries];
					updatedEntries[editingEducation.index] = updatedEducation;
					setEducationEntries(updatedEntries);
					setEditingEducation(null);
					setIsEditDialogOpen(false);
					toast.success("Education record updated successfully");
				} else {
					const error = await response.json();
					throw new Error(
						error.error || "Failed to update education record",
					);
				}
			} catch (error) {
				console.error("Error updating education:", error);
				toast.error("Failed to update education record");
			} finally {
				setIsSaving(false);
			}
		} else {
			toast.error("Please fill in all required fields");
		}
	};

	const handleDeleteEducation = async (index: number, id?: number) => {
		if (!id) return;

		try {
			const response = await fetch(`/api/dashboard/education/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setEducationEntries(educationEntries.filter((_, i) => i !== index));
				toast.success("Education record deleted successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete education record");
			}
		} catch (error) {
			console.error("Error deleting education:", error);
			toast.error("Failed to delete education record");
		}
	};

	const startEdit = (index: number) => {
		setEditingEducation({ index, education: { ...educationEntries[index] } });
		setIsEditDialogOpen(true);
	};

	// Stable onChange handler for editing using useRef
	const handleEditChange = useRef((education: Education) => {
		setEditingEducation((prev) => (prev ? { ...prev, education } : null));
	}).current;

	const EducationForm = ({
		education,
		onChange,
	}: {
		education: Education;
		onChange: (education: Education) => void;
	}) => {
		// Simple, direct handler without complex dependencies
		const handleInputChange = (field: keyof Education, value: string) => {
			onChange({ ...education, [field]: value });
		};

		return (
			<div className='space-y-6'>
				<div className='space-y-2'>
					<Label
						htmlFor='school'
						className='text-sm font-medium'>
						School/University *
					</Label>
					<Input
						id='school'
						value={education.school}
						onChange={(e) =>
							handleInputChange("school", e.target.value)
						}
						placeholder='University name'
						className='w-full'
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label
						htmlFor='degree'
						className='text-sm font-medium'>
						Degree *
					</Label>
					<Input
						id='degree'
						value={education.degree}
						onChange={(e) =>
							handleInputChange("degree", e.target.value)
						}
						placeholder='Bachelor of Computer Science'
						className='w-full'
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label
						htmlFor='schoolUrl'
						className='text-sm font-medium'>
						School URL
					</Label>
					<Input
						id='schoolUrl'
						type='url'
						value={education.href || ""}
						onChange={(e) =>
							handleInputChange("href", e.target.value)
						}
						placeholder='https://university.edu'
						className='w-full'
					/>
				</div>

				<div className='space-y-2'>
					<Label
						htmlFor='logoUrl'
						className='text-sm font-medium'>
						Logo URL
					</Label>
					<Input
						id='logoUrl'
						type='url'
						value={education.logoUrl || ""}
						onChange={(e) =>
							handleInputChange("logoUrl", e.target.value)
						}
						placeholder='/university-logo.png'
						className='w-full'
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label
							htmlFor='startYear'
							className='text-sm font-medium'>
							Start Year *
						</Label>
						<Input
							id='startYear'
							value={education.start}
							onChange={(e) =>
								handleInputChange(
									"start",
									e.target.value,
								)
							}
							placeholder='2019'
							className='w-full'
							required
						/>
					</div>
					<div className='space-y-2'>
						<Label
							htmlFor='endYear'
							className='text-sm font-medium'>
							End Year *
						</Label>
						<Input
							id='endYear'
							value={education.end}
							onChange={(e) =>
								handleInputChange(
									"end",
									e.target.value,
								)
							}
							placeholder='2022'
							className='w-full'
							required
						/>
					</div>
				</div>
			</div>
		);
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
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold'>Education</h1>
					<p className='text-muted-foreground'>
						Manage your educational background.
					</p>
				</div>
				<Button
					onClick={() => setShowAddForm(!showAddForm)}
					className='bg-primary hover:bg-primary/90'>
					<Plus className='mr-2 h-4 w-4' />
					{showAddForm ? "Cancel" : "Add Education"}
				</Button>
			</div>

			{showAddForm && (
				<Card className='border-2 border-dashed border-primary/20'>
					<CardHeader>
						<CardTitle className='text-lg'>
							Add New Education
						</CardTitle>
						<CardDescription>
							Add a new educational entry to your
							portfolio.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='py-4'>
							<EducationForm
								education={newEducation}
								onChange={setNewEducation}
							/>
						</div>
						<div className='flex gap-3 pt-4'>
							<Button
								variant='outline'
								onClick={() => {
									setShowAddForm(false);
									setNewEducation({
										school: "",
										href: "",
										degree: "",
										logoUrl: "",
										start: "",
										end: "",
									});
								}}
								disabled={isSaving}
								className='min-w-[80px]'>
								Cancel
							</Button>
							<Button
								onClick={handleAddEducation}
								disabled={isSaving}
								className='min-w-[120px]'>
								{isSaving ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									"Add Education"
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<div className='space-y-4'>
				{educationEntries.length === 0 ? (
					<div className='text-center py-8 text-muted-foreground'>
						No education records added yet. Click &quot;Add
						Education&quot; to get started.
					</div>
				) : (
					educationEntries.map((education, index) => (
						<Card key={education.id || index}>
							<CardHeader>
								<div className='flex justify-between items-start'>
									<div className='flex items-center space-x-3'>
										<div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden'>
											{education.logoUrl ? (
												<img
													src={
														education.logoUrl
													}
													alt={
														education.school
													}
													className='w-full h-full object-cover'
												/>
											) : (
												<GraduationCap className='h-6 w-6' />
											)}
										</div>
										<div>
											<CardTitle className='text-lg'>
												{
													education.degree
												}
											</CardTitle>
											<CardDescription>
												{
													education.school
												}
											</CardDescription>
										</div>
									</div>
									<div className='flex space-x-1'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												startEdit(
													index,
												)
											}>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												handleDeleteEducation(
													index,
													education.id,
												)
											}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
									<span>
										{education.start}
									</span>
									<span>-</span>
									<span>{education.end}</span>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader className='space-y-3'>
						<DialogTitle className='text-xl font-semibold'>
							Edit Education
						</DialogTitle>
						<DialogDescription className='text-muted-foreground'>
							Update the education information.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
						{editingEducation && (
							<EducationForm
								education={
									editingEducation.education
								}
								onChange={handleEditChange}
							/>
						)}
					</div>
					<DialogFooter className='flex gap-3'>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							disabled={isSaving}
							className='min-w-[80px]'>
							Cancel
						</Button>
						<Button
							onClick={handleEditEducation}
							disabled={isSaving}
							className='min-w-[120px]'>
							{isSaving ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
