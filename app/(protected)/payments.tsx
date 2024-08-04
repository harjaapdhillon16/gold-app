import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { GoldSchemeDetails } from "@/components/paymentTerms";

const schema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email(),
	phone: z.string().min(10).max(15),
	address: z.string().min(10).max(200),
	amount: z.string(),
});

export default function PaymentsScreen() {
	const { colorScheme } = useColorScheme();
	const form = useForm({
		resolver: zodResolver(schema),
	});
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = form;
	const { user } = useSupabase(); // Assuming you have supabase context

	useEffect(() => {
		if (user?.phone) {
			setValue("phone", user?.phone);
		}
	}, [user]);

	const onSubmit = async (data: any) => {
		try {
			// Implement your submission logic here
			console.log("Form submitted with data:", data);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<SafeAreaView className="flex-1 px-4 bg-background">
			<ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
				<Form {...form} onSubmit={handleSubmit(onSubmit)}>
					<GoldSchemeDetails />
					<FormField
						control={control}
						name="name"
						render={({ field }) => (
							<FormInput
								label="Name"
								placeholder="Enter your name"
								autoCapitalize="words"
								error={errors?.name?.message}
								{...field}
								className="mb-4"
							/>
						)}
					/>

					<FormField
						control={control}
						name="email"
						render={({ field }) => (
							<FormInput
								label="Email"
								placeholder="Enter your email"
								autoCapitalize="none"
								error={errors?.email?.message}
								{...field}
								className="mb-4"
							/>
						)}
					/>

					<FormField
						control={control}
						name="phone"
						render={({ field }) => (
							<FormInput
								label="Phone Number"
								placeholder="Enter your phone number"
								keyboardType="phone-pad"
								{...field}
								className="mb-4"
							/>
						)}
					/>

					<FormField
						control={control}
						name="address"
						render={({ field }) => (
							<FormInput
								label="Address"
								placeholder="Enter your address"
								autoCapitalize="words"
								{...field}
								className="mb-4"
							/>
						)}
					/>

					<FormField
						control={control}
						name="amount"
						render={({ field }) => (
							<FormInput
								label="Amount"
								placeholder="Enter the amount"
								keyboardType="numeric"
								{...field}
								className="mb-4"
							/>
						)}
					/>

					<Button size="default" variant="default" onPress={handleSubmit(onSubmit)}>
						<Text>Submit</Text>
					</Button>
				</Form>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	form: {
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
});
