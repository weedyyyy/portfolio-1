"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Work {
	id?: number;
	company: string;
	href?: string | null;
	badges?: string[];
	location?: string;
	title: string;
	logoUrl?: string | null;
	start: string;
	end?: string | null;
	description: string;
	order?: number;
}

export function WorkSection() {
	const [workExperiences, setWorkExperiences] = useState<Work[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [newWork, setNewWork] = useState<Work>({
		company: "",
		href: "",
		badges: [],
		location: "",
		title: "",
		logoUrl: "",
		start: "",
		end: "",
		description: "",
	});

	const [editingWork, setEditingWork] = useState<{ index: number; work: Work } | null>(null);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		fetchWorkExperiences();
	}, []);

	const fetchWorkExperiences = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/work-experience");

			if (response.ok) {
				const data = await response.json();
				setWorkExperiences(data);
			} else {
				toast.error("Error fetching work experiences");
			}
		} catch (error) {
			console.error("Error fetching work experiences:", error);
			toast.error("Failed to load work experiences");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddWork = async () => {
		if (newWork.company && newWork.title && newWork.start && newWork.description) {
			try {
				setIsSaving(true);
				const response = await fetch("/api/dashboard/work-experience", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newWork),
				});

				if (response.ok) {
					const addedWork = await response.json();
					setWorkExperiences([...workExperiences, addedWork]);
					setNewWork({
						company: "",
						href: "",
						badges: [],
						location: "",
						title: "",
						logoUrl: "",
						start: "",
						end: "",
						description: "",
					});
					setIsAddDialogOpen(false);
					toast.success("Work experience added successfully");
				} else {
					const error = await response.json();
					throw new Error(
						error.error || "Failed to add work experience",
					);
				}
			} catch (error) {
				console.error("Error adding work experience:", error);
				toast.error("Failed to add work experience");
			} finally {
				setIsSaving(false);
			}
		} else {
			toast.error("Please fill in all required fields");
		}
	};

	const handleEditWork = async () => {
		if (editingWork && editingWork.work.company && editingWork.work.title) {
			try {
				setIsSaving(true);
				const response = await fetch(
					`/api/dashboard/work-experience/${editingWork.work.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editingWork.work),
					},
				);

				if (response.ok) {
					const updatedWork = await response.json();
					const updatedExperiences = [...workExperiences];
					updatedExperiences[editingWork.index] = updatedWork;
					setWorkExperiences(updatedExperiences);
					setEditingWork(null);
					setIsEditDialogOpen(false);
					toast.success("Work experience updated successfully");
				} else {
					const error = await response.json();
					throw new Error(
						error.error || "Failed to update work experience",
					);
				}
			} catch (error) {
				console.error("Error updating work experience:", error);
				toast.error("Failed to update work experience");
			} finally {
				setIsSaving(false);
			}
		} else {
			toast.error("Please fill in all required fields");
		}
	};

	const handleDeleteWork = async (index: number, id?: number) => {
		if (!id) return;

		try {
			const response = await fetch(`/api/dashboard/work-experience/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setWorkExperiences(workExperiences.filter((_, i) => i !== index));
				toast.success("Work experience deleted successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete work experience");
			}
		} catch (error) {
			console.error("Error deleting work experience:", error);
			toast.error("Failed to delete work experience");
		}
	};

	const startEdit = (index: number) => {
		setEditingWork({ index, work: { ...workExperiences[index] } });
		setIsEditDialogOpen(true);
	};

	// Stable onChange handler for editing using useRef
	const handleEditChange = useRef((work: Work) => {
		setEditingWork((prev) => (prev ? { ...prev, work } : null));
	}).current;

	const WorkForm = ({ work, onChange }: { work: Work; onChange: (work: Work) => void }) => {
		// Simple, direct handler without complex dependencies
		const handleInputChange = (field: keyof Work, value: string) => {
			onChange({ ...work, [field]: value });
		};

		return (
			<div className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Company Name *</Label>
						<Input
							value={work.company}
							onChange={(e) =>
								handleInputChange(
									"company",
									e.target.value,
								)
							}
							placeholder='Company name'
						/>
					</div>
					<div className='space-y-2'>
						<Label>Job Title *</Label>
						<Input
							value={work.title || ""}
							onChange={(e) =>
								handleInputChange(
									"title",
									e.target.value,
								)
							}
							placeholder='Job title'
						/>
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Location</Label>
						<Input
							value={work.location || ""}
							onChange={(e) =>
								handleInputChange(
									"location",
									e.target.value,
								)
							}
							placeholder='Location'
						/>
					</div>
					<div className='space-y-2'>
						<Label>Company URL</Label>
						<Input
							value={work.href || ""}
							onChange={(e) =>
								handleInputChange(
									"href",
									e.target.value,
								)
							}
							placeholder='https://company.com'
						/>
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Start Date *</Label>
						<Input
							value={work.start || ""}
							onChange={(e) =>
								handleInputChange(
									"start",
									e.target.value,
								)
							}
							placeholder='Jul 2025'
						/>
					</div>
					<div className='space-y-2'>
						<Label>End Date</Label>
						<Input
							value={work.end || ""}
							onChange={(e) =>
								handleInputChange(
									"end",
									e.target.value,
								)
							}
							placeholder='Present'
						/>
					</div>
				</div>
				<div className='space-y-2'>
					<Label>Logo URL</Label>
					<Input
						value={work.logoUrl || ""}
						onChange={(e) =>
							handleInputChange("logoUrl", e.target.value)
						}
						placeholder='/company-logo.png'
					/>
				</div>
				<div className='space-y-2'>
					<Label>Description *</Label>
					<Textarea
						value={work.description || ""}
						onChange={(e) =>
							handleInputChange(
								"description",
								e.target.value,
							)
						}
						placeholder='Describe your role and achievements...'
						rows={4}
					/>
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
					<h1 className='text-3xl font-bold'>Work Experience</h1>
					<p className='text-muted-foreground'>
						Manage your professional work history.
					</p>
				</div>
				<Dialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className='mr-2 h-4 w-4' />
							Add Experience
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>
								Add Work Experience
							</DialogTitle>
							<DialogDescription>
								Add a new work experience to your
								portfolio.
							</DialogDescription>
						</DialogHeader>
						<WorkForm
							work={newWork}
							onChange={setNewWork}
						/>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() =>
									setIsAddDialogOpen(false)
								}
								disabled={isSaving}>
								Cancel
							</Button>
							<Button
								onClick={handleAddWork}
								disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									"Add Experience"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className='space-y-4'>
				{workExperiences.length === 0 ? (
					<div className='text-center py-8 text-muted-foreground'>
						No work experiences added yet. Click &quot;Add
						Experience&quot; to get started.
					</div>
				) : (
					workExperiences.map((work, index) => (
						<Card key={work.id || index}>
							<CardHeader>
								<div className='flex justify-between items-start'>
									<div className='flex items-center space-x-3'>
										<div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden'>
											{work.logoUrl ? (
												<img
													src={
														work.logoUrl
													}
													alt={
														work.company
													}
													className='w-full h-full object-cover'
												/>
											) : (
												<Building className='h-6 w-6' />
											)}
										</div>
										<div>
											<CardTitle className='text-lg'>
												{
													work.title
												}
											</CardTitle>
											<CardDescription>
												{
													work.company
												}{" "}
												{work.location &&
													`• ${work.location}`}
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
												handleDeleteWork(
													index,
													work.id,
												)
											}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
										<span>
											{work.start}
										</span>
										<span>-</span>
										<span>
											{work.end ||
												"Present"}
										</span>
									</div>
									{work.description && (
										<p className='text-sm'>
											{
												work.description
											}
										</p>
									)}
									{work.badges &&
										work.badges.length >
											0 && (
											<div className='flex flex-wrap gap-1'>
												{work.badges.map(
													(
														badge,
														badgeIndex,
													) => (
														<Badge
															key={
																badgeIndex
															}
															variant='secondary'
															className='text-xs'>
															{
																badge
															}
														</Badge>
													),
												)}
											</div>
										)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Edit Work Experience</DialogTitle>
						<DialogDescription>
							Update the work experience information.
						</DialogDescription>
					</DialogHeader>
					{editingWork && (
						<WorkForm
							work={editingWork.work}
							onChange={handleEditChange}
						/>
					)}
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							disabled={isSaving}>
							Cancel
						</Button>
						<Button
							onClick={handleEditWork}
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
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
