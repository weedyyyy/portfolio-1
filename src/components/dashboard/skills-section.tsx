"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Skill {
	id?: number;
	name: string;
	icon: string;
	category?: string;
}

export function SkillsSection() {
	const [skills, setSkills] = useState<Skill[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [newSkill, setNewSkill] = useState<Skill>({
		name: "",
		icon: "",
		category: "Technology",
	});
	const [editingSkill, setEditingSkill] = useState<{ index: number; skill: Skill } | null>(
		null,
	);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		fetchSkills();
	}, []);

	const fetchSkills = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/skills");

			if (response.ok) {
				const data = await response.json();
				setSkills(data);
			} else {
				toast.error("Error fetching skills");
			}
		} catch (error) {
			console.error("Error fetching skills:", error);
			toast.error("Failed to load skills");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddSkill = async () => {
		if (newSkill.name && newSkill.icon) {
			try {
				setIsSaving(true);
				const response = await fetch("/api/dashboard/skills", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newSkill),
				});

				if (response.ok) {
					const addedSkill = await response.json();
					setSkills([...skills, addedSkill]);
					setNewSkill({ name: "", icon: "", category: "Technology" });
					setIsAddDialogOpen(false);
					toast.success("Skill added successfully");
				} else {
					const error = await response.json();
					throw new Error(error.error || "Failed to add skill");
				}
			} catch (error) {
				console.error("Error adding skill:", error);
				toast.error("Failed to add skill");
			} finally {
				setIsSaving(false);
			}
		}
	};

	const handleEditSkill = async () => {
		if (editingSkill && editingSkill.skill.name && editingSkill.skill.icon) {
			try {
				setIsSaving(true);
				const response = await fetch(
					`/api/dashboard/skills/${editingSkill.skill.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editingSkill.skill),
					},
				);

				if (response.ok) {
					const updatedSkill = await response.json();
					const updatedSkills = [...skills];
					updatedSkills[editingSkill.index] = updatedSkill;
					setSkills(updatedSkills);
					setEditingSkill(null);
					setIsEditDialogOpen(false);
					toast.success("Skill updated successfully");
				} else {
					const error = await response.json();
					throw new Error(error.error || "Failed to update skill");
				}
			} catch (error) {
				console.error("Error updating skill:", error);
				toast.error("Failed to update skill");
			} finally {
				setIsSaving(false);
			}
		}
	};

	const handleDeleteSkill = async (index: number, id?: number) => {
		if (!id) return;

		try {
			const response = await fetch(`/api/dashboard/skills/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setSkills(skills.filter((_, i) => i !== index));
				toast.success("Skill deleted successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete skill");
			}
		} catch (error) {
			console.error("Error deleting skill:", error);
			toast.error("Failed to delete skill");
		}
	};

	const startEdit = (index: number) => {
		setEditingSkill({ index, skill: { ...skills[index] } });
		setIsEditDialogOpen(true);
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
					<h1 className='text-3xl font-bold'>Skills</h1>
					<p className='text-muted-foreground'>
						Manage your technical skills and expertise.
					</p>
				</div>
				<Dialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className='mr-2 h-4 w-4' />
							Add Skill
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Skill</DialogTitle>
							<DialogDescription>
								Add a new skill to your portfolio.
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='skillName'>
									Skill Name
								</Label>
								<Input
									id='skillName'
									value={newSkill.name}
									onChange={(e) =>
										setNewSkill({
											...newSkill,
											name: e
												.target
												.value,
										})
									}
									placeholder='e.g., React.js'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='skillIcon'>
									Icon Name
								</Label>
								<Input
									id='skillIcon'
									value={newSkill.icon}
									onChange={(e) =>
										setNewSkill({
											...newSkill,
											icon: e
												.target
												.value,
										})
									}
									placeholder='e.g., react'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='skillCategory'>
									Category
								</Label>
								<Input
									id='skillCategory'
									value={
										newSkill.category ||
										""
									}
									onChange={(e) =>
										setNewSkill({
											...newSkill,
											category: e
												.target
												.value,
										})
									}
									placeholder='e.g., Frontend, Backend, Database'
								/>
							</div>
						</div>
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
								onClick={handleAddSkill}
								disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									"Add Skill"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Current Skills</CardTitle>
					<CardDescription>
						Your technical skills and technologies you work
						with.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{skills.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>
							No skills added yet. Click &quot;Add
							Skill&quot; to get started.
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{skills.map((skill, index) => (
								<div
									key={skill.id || index}
									className='flex items-center justify-between p-3 border rounded-lg'>
									<div className='flex items-center space-x-2'>
										<Badge variant='secondary'>
											{skill.name}
										</Badge>
										{skill.category && (
											<span className='text-xs text-muted-foreground'>
												{
													skill.category
												}
											</span>
										)}
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
												handleDeleteSkill(
													index,
													skill.id,
												)
											}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Skill</DialogTitle>
						<DialogDescription>
							Update the skill information.
						</DialogDescription>
					</DialogHeader>
					{editingSkill && (
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='editSkillName'>
									Skill Name
								</Label>
								<Input
									id='editSkillName'
									value={
										editingSkill.skill
											.name
									}
									onChange={(e) =>
										setEditingSkill({
											...editingSkill,
											skill: {
												...editingSkill.skill,
												name: e
													.target
													.value,
											},
										})
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='editSkillIcon'>
									Icon Name
								</Label>
								<Input
									id='editSkillIcon'
									value={
										editingSkill.skill
											.icon
									}
									onChange={(e) =>
										setEditingSkill({
											...editingSkill,
											skill: {
												...editingSkill.skill,
												icon: e
													.target
													.value,
											},
										})
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='editSkillCategory'>
									Category
								</Label>
								<Input
									id='editSkillCategory'
									value={
										editingSkill.skill
											.category ||
										""
									}
									onChange={(e) =>
										setEditingSkill({
											...editingSkill,
											skill: {
												...editingSkill.skill,
												category: e
													.target
													.value,
											},
										})
									}
									placeholder='e.g., Frontend, Backend, Database'
								/>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}
							disabled={isSaving}>
							Cancel
						</Button>
						<Button
							onClick={handleEditSkill}
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
