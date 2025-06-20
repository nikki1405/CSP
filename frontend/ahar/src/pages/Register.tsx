import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["donor", "ngo"] as const),
    organization: z.string().optional(),
    phoneNumber: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            displayName: "",
            role: "donor",
            organization: "",
            phoneNumber: ""
        },
    });

    const selectedRole = form.watch("role");

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            await signUp(data.email, data.password, data.role, {
                displayName: data.displayName,
                organization: data.organization,
                phoneNumber: data.phoneNumber
            });
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-blue-900 tracking-tight">
                        Join Our Mission
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Create an account to start making a difference
                    </p>
                </div>

                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                        <CardDescription className="text-center">
                            Choose your role and fill in your details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>I want to register as</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 gap-4"
                                                >
                                                    <div 
                                                        className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-4 cursor-pointer hover:border-blue-600 transition-all ${field.value === 'donor' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                                                        onClick={() => field.onChange('donor')}
                                                    >
                                                        <Icons.heart className="h-6 w-6 mb-2 text-blue-600" />
                                                        <div className="text-center">
                                                            <h3 className="font-semibold">Donor</h3>
                                                            <p className="text-sm text-gray-500">I want to donate food</p>
                                                        </div>
                                                        <FormControl>
                                                            <RadioGroupItem 
                                                                value="donor" 
                                                                className="absolute top-2 right-2"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div 
                                                        className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-4 cursor-pointer hover:border-blue-600 transition-all ${field.value === 'ngo' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                                                        onClick={() => field.onChange('ngo')}
                                                    >
                                                        <Icons.building className="h-6 w-6 mb-2 text-blue-600" />
                                                        <div className="text-center">
                                                            <h3 className="font-semibold">NGO</h3>
                                                            <p className="text-sm text-gray-500">I represent an organization</p>
                                                        </div>
                                                        <FormControl>
                                                            <RadioGroupItem 
                                                                value="ngo" 
                                                                className="absolute top-2 right-2"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="displayName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        {...field}
                                                        className="bg-white"
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email"
                                                        type="email"
                                                        {...field}
                                                        className="bg-white"
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {selectedRole === "ngo" && (
                                    <FormField
                                        control={form.control}
                                        name="organization"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organization Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your organization name"
                                                        {...field}
                                                        className="bg-white"
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your phone number"
                                                    type="tel"
                                                    {...field}
                                                    className="bg-white"
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Create a password"
                                                        type="password"
                                                        {...field}
                                                        className="bg-white"
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Confirm your password"
                                                        type="password"
                                                        {...field}
                                                        className="bg-white"
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center">
                        <div className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
