"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
	id?: number;
	title: string;
	slug: string;
	href?: string; // mapped into links json
	dates?: string;
	featured: boolean; // maps to featured field
	description: string;
	technologies: string[];
	image?: string | null;
	video?: string | null;
	order?: number;
}

export function ProjectsSection() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [newProject, setNewProject] = useState<Project>({
		title: "",
		slug: "",
		href: "",
		dates: "",
		featured: false,
		description: "",
		technologies: [],
		image: "",
		video: "",
	});

	const [editingProject, setEditingProject] = useState<{
		index: number;
		project: Project;
	} | null>(null);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [techInput, setTechInput] = useState("");

	// Fetch projects on mount
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setIsLoading(true);
				const res = await fetch("/api/dashboard/projects");
				if (!res.ok) throw new Error("Failed to load projects");
				const data = await res.json();
				// Map backend shape to component shape
				const mapped: Project[] = data.map((p: any) => ({
					id: p.id,
					title: p.title,
					slug: p.slug,
					href: p.links?.url || "",
					dates: p.dates || "",
					featured: p.featured,
					// ensure array
					technologies: Array.isArray(p.technologies)
						? p.technologies
						: [],
					description: p.description,
					image: p.image,
					video: p.video,
					order: p.order,
				}));
				setProjects(mapped);
			} catch (e: any) {
				console.error(e);
				toast.error(e.message || "Error loading projects");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProjects();
	}, []);

	const handleAddProject = async () => {
		if (!newProject.title || !newProject.description) {
			toast.error("Title and description are required");
			return;
		}
		try {
			setIsSaving(true);
			const body: any = {
				title: newProject.title,
				slug:
					newProject.slug ||
					newProject.title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/(^-|-$)/g, ""),
				description: newProject.description,
				dates: newProject.dates || null,
				image: newProject.image || null,
				video: newProject.video || null,
				technologies: newProject.technologies,
				links: newProject.href ? { url: newProject.href } : null,
				featured: newProject.featured,
			};
			const res = await fetch("/api/dashboard/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to create project");
			}
			const created = await res.json();
			setProjects([
				...projects,
				{
					id: created.id,
					title: created.title,
					slug: created.slug,
					href: created.links?.url || "",
					dates: created.dates || "",
					featured: created.featured,
					description: created.description,
					technologies: created.technologies || [],
					image: created.image,
					video: created.video,
					order: created.order,
				},
			]);
			setNewProject({
				title: "",
				slug: "",
				href: "",
				dates: "",
				featured: false,
				description: "",
				technologies: [],
				image: "",
				video: "",
			});
			setIsAddDialogOpen(false);
			toast.success("Project added");
		} catch (e: any) {
			console.error(e);
			toast.error(e.message || "Failed to add project");
		} finally {
			setIsSaving(false);
		}
	};

	const handleEditProject = async () => {
		if (!editingProject) return;
		const p = editingProject.project;
		if (!p.title || !p.description) {
			toast.error("Title and description required");
			return;
		}
		try {
			setIsSaving(true);
			const body: any = {
				id: p.id,
				title: p.title,
				slug: p.slug,
				description: p.description,
				dates: p.dates || null,
				image: p.image || null,
				video: p.video || null,
				technologies: p.technologies,
				links: p.href ? { url: p.href } : null,
				featured: p.featured,
				order: p.order,
			};
			const res = await fetch("/api/dashboard/projects", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to update project");
			}
			const updated = await res.json();
			const updatedProjects = [...projects];
			updatedProjects[editingProject.index] = {
				id: updated.id,
				title: updated.title,
				slug: updated.slug,
				href: updated.links?.url || "",
				dates: updated.dates || "",
				featured: updated.featured,
				description: updated.description,
				technologies: updated.technologies || [],
				image: updated.image,
				video: updated.video,
				order: updated.order,
			};
			setProjects(updatedProjects);
			setEditingProject(null);
			setIsEditDialogOpen(false);
			toast.success("Project updated");
		} catch (e: any) {
			console.error(e);
			toast.error(e.message || "Failed to update project");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteProject = async (index: number) => {
		const proj = projects[index];
		if (!proj?.id) {
			// just remove locally (shouldn't happen normally)
			setProjects(projects.filter((_, i) => i !== index));
			return;
		}
		try {
			const res = await fetch(`/api/dashboard/projects?id=${proj.id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to delete project");
			}
			setProjects(projects.filter((_, i) => i !== index));
			toast.success("Project deleted");
		} catch (e: any) {
			console.error(e);
			toast.error(e.message || "Failed to delete project");
		}
	};

	const startEdit = (index: number) => {
		setEditingProject({ index, project: { ...projects[index] } });
		setIsEditDialogOpen(true);
	};

	// Stable onChange handler for editing using useRef
	const handleEditChange = useRef((project: Project) => {
		setEditingProject((prev) => (prev ? { ...prev, project } : null));
	}).current;

	const addTechnology = (
		project: Project,
		onChange: (project: Project) => void,
		tech: string,
	) => {
		const trimmed = tech.trim();
		if (trimmed && !project.technologies.includes(trimmed)) {
			onChange({ ...project, technologies: [...project.technologies, trimmed] });
		}
	};

	const removeTechnology = (
		project: Project,
		onChange: (project: Project) => void,
		tech: string,
	) => {
		onChange({
			...project,
			technologies: project.technologies.filter((t) => t !== tech),
		});
	};

	const ProjectForm = ({
		project,
		onChange,
	}: {
		project: Project;
		onChange: (project: Project) => void;
	}) => {
		const [localTechInput, setLocalTechInput] = useState("");
		const [uploading, setUploading] = useState(false);

		const handleInputChange = (field: keyof Project, value: string | boolean) => {
			onChange({ ...project, [field]: value } as Project);
		};

		const handleFile = async (file: File | null) => {
			if (!file) return;
			try {
				setUploading(true);
				const ext = file.name.split(".").pop();
				const path = `${Date.now()}-${Math.random()
					.toString(36)
					.slice(2)}.${ext}`;
				const { error } = await supabase.storage
					.from("project-images")
					.upload(path, file, { upsert: false });
				if (error) throw error;
				const { data } = supabase.storage
					.from("project-images")
					.getPublicUrl(path);
				onChange({ ...project, image: data.publicUrl });
			} catch (e) {
				console.error("Upload failed", e);
				toast.error("Upload failed");
			} finally {
				setUploading(false);
			}
		};

		return (
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label>Project Title *</Label>
					<Input
						value={project.title}
						onChange={(e) =>
							handleInputChange("title", e.target.value)
						}
						placeholder='Project name'
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Slug</Label>
						<Input
							value={project.slug}
							onChange={(e) =>
								handleInputChange(
									"slug",
									e.target.value,
								)
							}
							placeholder='project-slug'
						/>
					</div>
					<div className='space-y-2'>
						<Label>Project URL</Label>
						<Input
							value={project.href || ""}
							onChange={(e) =>
								handleInputChange(
									"href",
									e.target.value,
								)
							}
							placeholder='https://github.com/username/project'
						/>
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Dates</Label>
						<Input
							value={project.dates || ""}
							onChange={(e) =>
								handleInputChange(
									"dates",
									e.target.value,
								)
							}
							placeholder='2023 - Present'
						/>
					</div>
					<div className='flex items-center space-x-2'>
						<Switch
							checked={project.featured}
							onCheckedChange={(checked) =>
								handleInputChange(
									"featured",
									checked,
								)
							}
						/>
						<Label>Featured Project</Label>
					</div>
				</div>
				<div className='space-y-2'>
					<Label>Description *</Label>
					<Textarea
						value={project.description}
						onChange={(e) =>
							handleInputChange(
								"description",
								e.target.value,
							)
						}
						placeholder='Describe your project...'
						rows={4}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Technologies</Label>
					<div className='flex space-x-2'>
						<Input
							value={localTechInput}
							onChange={(e) =>
								setLocalTechInput(e.target.value)
							}
							placeholder='Add technology'
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTechnology(
										project,
										onChange,
										localTechInput,
									);
									setLocalTechInput("");
								}
							}}
						/>
						<Button
							type='button'
							onClick={() => {
								addTechnology(
									project,
									onChange,
									localTechInput,
								);
								setLocalTechInput("");
							}}>
							Add
						</Button>
					</div>
					<div className='flex flex-wrap gap-2 mt-2'>
						{project.technologies.map((tech, index) => (
							<Badge
								key={index}
								variant='secondary'
								className='cursor-pointer'
								onClick={() =>
									removeTechnology(
										project,
										onChange,
										tech,
									)
								}>
								{tech} ×
							</Badge>
						))}
					</div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label>Project Image</Label>
						{project.image && (
							<img
								src={project.image}
								alt='preview'
								className='h-24 w-32 object-cover rounded border'
							/>
						)}
						<Input
							type='file'
							accept='image/*'
							disabled={uploading}
							onChange={(e) =>
								handleFile(
									e.target.files?.[0] || null,
								)
							}
						/>
					</div>
					<div className='space-y-2'>
						<Label>Video URL</Label>
						<Input
							value={project.video || ""}
							onChange={(e) =>
								handleInputChange(
									"video",
									e.target.value,
								)
							}
							placeholder='https://example.com/video.mp4'
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
					<h1 className='text-3xl font-bold'>Projects</h1>
					<p className='text-muted-foreground'>
						Manage your portfolio projects and showcase your
						work.
					</p>
				</div>
				<Dialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className='mr-2 h-4 w-4' />
							Add Project
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>Add New Project</DialogTitle>
							<DialogDescription>
								Add a new project to your portfolio.
							</DialogDescription>
						</DialogHeader>
						<ProjectForm
							project={newProject}
							onChange={setNewProject}
						/>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() =>
									setIsAddDialogOpen(false)
								}>
								Cancel
							</Button>
							<Button
								onClick={handleAddProject}
								disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									"Add Project"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{projects.map((project, index) => (
					<Card
						key={index}
						className='flex flex-col'>
						<CardHeader>
							<div className='flex justify-between items-start'>
								<div className='flex-1'>
									<div className='flex items-center space-x-2'>
										<CardTitle className='text-lg'>
											{
												project.title
											}
										</CardTitle>
										{/* Removed project.active badge as 'active' does not exist on Project */}
									</div>
									<CardDescription className='flex items-center space-x-2'>
										<span>
											{
												project.dates
											}
										</span>
										{project.href && (
											<ExternalLink className='h-3 w-3' />
										)}
									</CardDescription>
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
											handleDeleteProject(
												index,
											)
										}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className='flex-1'>
							<div className='space-y-3'>
								<p className='text-sm text-muted-foreground line-clamp-3'>
									{project.description}
								</p>
								<div className='flex flex-wrap gap-1'>
									{project.technologies
										.slice(0, 4)
										.map(
											(
												tech,
												techIndex,
											) => (
												<Badge
													key={
														techIndex
													}
													variant='outline'
													className='text-xs'>
													{
														tech
													}
												</Badge>
											),
										)}
									{project.technologies
										.length > 4 && (
										<Badge
											variant='outline'
											className='text-xs'>
											+
											{project
												.technologies
												.length -
												4}{" "}
											more
										</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Edit Project</DialogTitle>
						<DialogDescription>
							Update the project information.
						</DialogDescription>
					</DialogHeader>
					{editingProject && (
						<ProjectForm
							project={editingProject.project}
							onChange={handleEditChange}
						/>
					)}
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsEditDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleEditProject}
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
