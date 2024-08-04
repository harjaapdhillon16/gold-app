import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";
import { useState, useRef } from "react";
import PhoneInput from "react-native-phone-input";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { useColorScheme } from "@/lib/useColorScheme";

const phoneSchema = z.object({
	phone: z
		.string()
		.min(10, "Please enter a valid phone number.")
		.max(15, "Please enter a valid phone number."),
});

const otpSchema = z.object({
	phone: z
		.string()
		.min(10, "Please enter a valid phone number.")
		.max(15, "Please enter a valid phone number."),
	otp: z.string().length(6, "Please enter a valid OTP."),
});

export default function SignUp() {
	const { signInWithOTP, verifyOTP } = useSupabase();
	const [otpSent, setOTPSent] = useState(false);
	const phoneInputRef = useRef(null);
	const router = useRouter();

	const phoneForm = useForm<z.infer<typeof phoneSchema>>({
		resolver: zodResolver(phoneSchema),
		defaultValues: {
			phone: "",
		},
	});

	const otpForm = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			phone: "",
			otp: "",
		},
	});

	const { isDarkColorScheme } = useColorScheme();

	async function onSendOtp() {
		try {
			if (phoneInputRef.current) {
				const fullPhone = phoneInputRef.current.getValue();
				await signInWithOTP(fullPhone);
				console.log(phoneInputRef.current.getValue());
				setOTPSent(true);
			}
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	async function onVerifyOtp(data) {
		try {
			if (phoneInputRef.current) {
				const fullPhone = phoneInputRef.current.getValue();
				await verifyOTP(fullPhone, data.otp);

				otpForm.reset();
			}
		} catch (error: Error | any) {
			console.log(error.message);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-background p-4">
			<View className="flex-1">
				<H1 className="self-start">Sign Up</H1>
				<Muted className="self-start mb-5">to continue to Lalit Jwellers</Muted>
				<View className="gap-4">
					<PhoneInput
						ref={phoneInputRef}
						initialCountry="in"
						textStyle={{ color: isDarkColorScheme ? "white" : "black" }}
						allowZeroAfterCountryCode={false}
					/>
					<Button size="default" variant="default" onPress={onSendOtp}>
						{phoneForm.formState.isSubmitting ? (
							<ActivityIndicator size="small" />
						) : (
							<Text>Send OTP</Text>
						)}
					</Button>
				</View>
				{otpSent && (
					<Form {...otpForm}>
						<View className="gap-4 mt-4">
							<FormField
								control={otpForm.control}
								name="otp"
								render={({ field }) => (
									<FormInput
										label="OTP"
										placeholder="OTP"
										autoCapitalize="none"
										autoComplete="off"
										autoCorrect={false}
										keyboardType="number-pad"
										{...field}
									/>
								)}
							/>
							<Button
								size="default"
								variant="default"
								onPress={() => {
									onVerifyOtp({ otp: otpForm.getValues("otp") });
								}}
							>
								{otpForm.formState.isSubmitting ? (
									<ActivityIndicator size="small" />
								) : (
									<Text>Verify OTP</Text>
								)}
							</Button>
						</View>
					</Form>
				)}
			</View>
		</SafeAreaView>
	);
}
