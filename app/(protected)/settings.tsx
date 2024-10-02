import React, { useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { useRouter } from 'expo-router'

export default function TabTwoScreen() {
	const { user, signOut } = useSupabase();
	const [amountContributed, setAmountContributed] = useState(0);
	const router = useRouter()

	// useEffect(() => {
	// 	fetchAmountContributed();
	// }, []);

	// const fetchAmountContributed = async () => {
	// 	try {
	// 		const { data, error } = await supabase
	// 			.from("contributions")
	// 			.select("amount")
	// 			.eq("user_id", user.id)
	// 			.single();

	// 		if (error) {
	// 			throw error;
	// 		}

	// 		if (data) {
	// 			setAmountContributed(data.amount);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching amount contributed:", error.message);
	// 	}
	// };

	const { colorScheme } = useColorScheme();
	const isDarkMode = colorScheme === "dark";

	if (!user) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
				<H1 className="text-center">Login To View Account Info</H1>
				<Button
					className="w-full mt-4"
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up")
					}}
				>
					<Text style={!isDarkMode ? {
						fontSize: 16,
					} : {
						fontSize: 16,
						color: "#fff",
					}}>
						Sign In
					</Text>
				</Button>
			</View>
		)
	}

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Account Information</H1>
			<View className="p-4 rounded-lg shadow-md w-full">
				<Text className="text-lg font-bold mb-2">Phone Number:</Text>
				<Text className="text-gray-600">{user?.phone}</Text>
			</View>
			<View className="p-4 rounded-lg shadow-md w-full mt-4">
				<Text className="text-lg font-bold mb-2">Amount Contributed:</Text>
				<Text className="text-gray-600">₹0</Text>
			</View>
			<Button
				className="w-full mt-4"
				size="default"
				variant="default"
				onPress={() => {
					signOut();
					alert("Your account has been deleted successfully.");
				}}
			>
				<Text>Delete Acount</Text>
			</Button>
			<Button
				className="w-full mt-4"
				size="default"
				variant="default"
				onPress={() => {
					signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}
