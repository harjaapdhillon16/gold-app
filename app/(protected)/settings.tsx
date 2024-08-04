import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

export default function TabTwoScreen() {
	const { user, signOut } = useSupabase();
	const [amountContributed, setAmountContributed] = useState(0);

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

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Account Information</H1>
			<View className="p-4 rounded-lg shadow-md w-full">
				<Text className="text-lg font-bold mb-2">Phone Number:</Text>
				<Text className="text-gray-600">{user?.phone}</Text>
			</View>
			<View className="p-4 rounded-lg shadow-md w-full mt-4">
				<Text className="text-lg font-bold mb-2">Amount Contributed:</Text>
				<Text className="text-gray-600">₹ 10,000</Text>
			</View>
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
