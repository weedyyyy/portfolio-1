"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ResumeSection() {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	async function handleUpload() {
		if (!file) return;
		setIsUploading(true);
		try {
			const fd = new FormData();
			fd.append("file", file);
			const res = await fetch("/api/resume", { method: "PUT", body: fd });
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.error || "Upload failed");
		} catch (e) {
			console.error(e);
			alert(e instanceof Error ? e.message : "Upload failed");
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resume</CardTitle>
			</CardHeader>
			<CardContent className='space-y-3'>
				<Input
					type='file'
					accept='application/pdf'
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>
				<div className='flex gap-2'>
					<Button
						onClick={handleUpload}
						disabled={!file || isUploading}>
						{isUploading
							? "Uploading..."
							: "Upload & Set Current"}
					</Button>
					<Button
						variant='outline'
						asChild>
						<a
							href='/api/resume'
							target='_blank'
							rel='noopener noreferrer'>
							Preview Current
						</a>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
