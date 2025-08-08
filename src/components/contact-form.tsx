"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("loading");

		const res = await fetch("/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, message }),
		});

		if (res.ok) {
			setStatus("success");
			setName("");
			setEmail("");
			setMessage("");
		} else {
			setStatus("error");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4'>
			<Input
				type='text'
				placeholder='Name'
				value={name}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setName(e.target.value)
				}
				required
			/>
			<Input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setEmail(e.target.value)
				}
				required
			/>
			<Textarea
				placeholder='Message'
				value={message}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					setMessage(e.target.value)
				}
				required
			/>
			<Button
				type='submit'
				disabled={status === "loading"}>
				{status === "loading" ? "Sending..." : "Send Message"}
			</Button>
			{status === "success" && (
				<p className='text-green-500'>Message sent successfully!</p>
			)}
			{status === "error" && (
				<p className='text-red-500'>
					Something went wrong. Please try again.
				</p>
			)}
		</form>
	);
}
