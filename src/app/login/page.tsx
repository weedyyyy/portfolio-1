"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const sp = useSearchParams();
	const router = useRouter();
	const redirect = sp.get("redirect") || "/dashboard";

	// Check if user is already logged in
	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				router.push(redirect);
			}
		};
		checkAuth();
	}, [redirect, router]);

	const handleLogin = async () => {
		setLoading(true);
		setMessage(null);

		try {
			const result = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (result.error) {
				setMessage(result.error.message);
			} else if (result.data.session) {
				router.push(redirect);
			}
		} catch (error) {
			setMessage("An unexpected error occurred.");
		}
		setLoading(false);
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<div className='w-full max-w-md space-y-6'>
				<h1 className='text-2xl font-semibold text-center'>
					Dashboard Login
				</h1>

				<div className='space-y-4'>
					<Input
						placeholder='you@example.com'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div className='relative'>
						<Input
							placeholder='Password'
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
							className='pr-10'
						/>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
							onClick={() =>
								setShowPassword(!showPassword)
							}>
							{showPassword ? (
								<EyeOff className='h-4 w-4' />
							) : (
								<Eye className='h-4 w-4' />
							)}
						</Button>
					</div>
					<Button
						onClick={handleLogin}
						disabled={loading || !email || !password}
						className='w-full'>
						{loading ? "Loading..." : "Sign In"}
					</Button>
				</div>

				{message && (
					<p className='text-sm text-center text-red-600'>
						{message}
					</p>
				)}

				<Button
					variant='ghost'
					onClick={() => router.push("/")}
					className='w-full'>
					Back to site
				</Button>
			</div>
		</div>
	);
}
