"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Save, Flag } from "lucide-react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Language {
	id?: number;
	name: string;
	level: string;
	flagIcon?: string | null;
}

export function LanguagesSection() {
	const [languages, setLanguages] = useState<Language[]>([]);
	const [newLanguage, setNewLanguage] = useState<Language>({
		name: "",
		level: "Beginner",
		flagIcon: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		fetchLanguages();
	}, []);

	const fetchLanguages = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/dashboard/languages");

			if (response.ok) {
				const data = await response.json();
				setLanguages(data);
			} else {
				toast.error("Error fetching languages");
			}
		} catch (error) {
			console.error("Error fetching languages:", error);
			toast.error("Error loading languages");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddLanguage = async () => {
		if (!newLanguage.name || !newLanguage.level) {
			toast.error("Please enter both language name and proficiency level");
			return;
		}

		try {
			setIsSubmitting(true);

			const response = await fetch("/api/dashboard/languages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newLanguage),
			});

			if (response.ok) {
				const addedLanguage = await response.json();
				setLanguages([...languages, addedLanguage]);
				setNewLanguage({ name: "", level: "Beginner", flagIcon: "" });
				toast.success("Language added successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to add language");
			}
		} catch (error) {
			console.error("Error adding language:", error);
			toast.error("Failed to add language");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateLanguage = async (language: Language) => {
		if (!language.id) return;

		try {
			setIsSubmitting(true);

			const response = await fetch("/api/dashboard/languages", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(language),
			});

			if (response.ok) {
				const updatedLanguage = await response.json();
				setLanguages(
					languages.map((lang) =>
						lang.id === updatedLanguage.id
							? updatedLanguage
							: lang,
					),
				);
				toast.success("Language updated successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to update language");
			}
		} catch (error) {
			console.error("Error updating language:", error);
			toast.error("Failed to update language");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteLanguage = async (id: number) => {
		try {
			setIsSubmitting(true);

			const response = await fetch(`/api/dashboard/languages?id=${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setLanguages(languages.filter((lang) => lang.id !== id));
				toast.success("Language deleted successfully");
			} else {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete language");
			}
		} catch (error) {
			console.error("Error deleting language:", error);
			toast.error("Failed to delete language");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setNewLanguage((prev) => ({ ...prev, [field]: value }));
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
				<h1 className='text-3xl font-bold'>Languages</h1>
				<p className='text-muted-foreground'>
					Manage your language proficiencies.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Add New Language</CardTitle>
					<CardDescription>
						Add a language you are proficient in.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
						<div>
							<Label htmlFor='language-name'>
								Language Name
							</Label>
							<Input
								id='language-name'
								value={newLanguage.name}
								onChange={(e) =>
									handleInputChange(
										"name",
										e.target.value,
									)
								}
								placeholder='e.g., English, French'
							/>
						</div>
						<div>
							<Label htmlFor='language-level'>
								Proficiency Level
							</Label>
							<Select
								value={newLanguage.level}
								onValueChange={(value) =>
									handleInputChange(
										"level",
										value,
									)
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select level' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Beginner'>
										Beginner
									</SelectItem>
									<SelectItem value='Intermediate'>
										Intermediate
									</SelectItem>
									<SelectItem value='Advanced'>
										Advanced
									</SelectItem>
									<SelectItem value='Native'>
										Native
									</SelectItem>
									<SelectItem value='Fluent'>
										Fluent
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor='language-flag'>
								Flag Icon (optional)
							</Label>
							<Input
								id='language-flag'
								value={newLanguage.flagIcon || ""}
								onChange={(e) =>
									handleInputChange(
										"flagIcon",
										e.target.value,
									)
								}
								placeholder='e.g., 🇺🇸 or flag-icon-class'
							/>
						</div>
					</div>
					<Button
						onClick={handleAddLanguage}
						disabled={isSubmitting}
						className='w-full md:w-auto'>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Adding...
							</>
						) : (
							<>
								<Plus className='mr-2 h-4 w-4' />
								Add Language
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Languages</CardTitle>
					<CardDescription>
						Your current language proficiencies.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{languages.length === 0 ? (
						<p className='text-center text-muted-foreground py-4'>
							No languages added yet.
						</p>
					) : (
						<div className='space-y-4'>
							{languages.map((language) => (
								<div
									key={language.id}
									className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg'>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
										<div>
											<Label
												htmlFor={`language-name-${language.id}`}>
												Language
												Name
											</Label>
											<Input
												id={`language-name-${language.id}`}
												value={
													language.name
												}
												onChange={(
													e,
												) =>
													setLanguages(
														languages.map(
															(
																lang,
															) =>
																lang.id ===
																language.id
																	? {
																			...lang,
																			name: e
																				.target
																				.value,
																	  }
																	: lang,
														),
													)
												}
											/>
										</div>
										<div>
											<Label
												htmlFor={`language-level-${language.id}`}>
												Proficiency
												Level
											</Label>
											<Select
												value={
													language.level
												}
												onValueChange={(
													value,
												) =>
													setLanguages(
														languages.map(
															(
																lang,
															) =>
																lang.id ===
																language.id
																	? {
																			...lang,
																			level: value,
																	  }
																	: lang,
														),
													)
												}>
												<SelectTrigger
													id={`language-level-${language.id}`}>
													<SelectValue placeholder='Select level' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='Beginner'>
														Beginner
													</SelectItem>
													<SelectItem value='Intermediate'>
														Intermediate
													</SelectItem>
													<SelectItem value='Advanced'>
														Advanced
													</SelectItem>
													<SelectItem value='Native'>
														Native
													</SelectItem>
													<SelectItem value='Fluent'>
														Fluent
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label
												htmlFor={`language-flag-${language.id}`}>
												Flag
												Icon
											</Label>
											<Input
												id={`language-flag-${language.id}`}
												value={
													language.flagIcon ||
													""
												}
												onChange={(
													e,
												) =>
													setLanguages(
														languages.map(
															(
																lang,
															) =>
																lang.id ===
																language.id
																	? {
																			...lang,
																			flagIcon: e
																				.target
																				.value,
																	  }
																	: lang,
														),
													)
												}
											/>
										</div>
									</div>
									<div className='flex gap-2 mt-4 md:mt-6 w-full md:w-auto'>
										<Button
											variant='outline'
											size='icon'
											onClick={() =>
												handleUpdateLanguage(
													language,
												)
											}
											disabled={
												isSubmitting
											}>
											<Save className='h-4 w-4' />
										</Button>
										<Button
											variant='destructive'
											size='icon'
											onClick={() =>
												language.id &&
												handleDeleteLanguage(
													language.id,
												)
											}
											disabled={
												isSubmitting
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
		</div>
	);
}
