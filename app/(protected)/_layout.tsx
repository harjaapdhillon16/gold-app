import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Ionicons ,FontAwesome5} from "@expo/vector-icons"; // Import Ionicons from Expo

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	console.log({ colorScheme });
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "light"
							? theme.dark.background
							: theme.light.background,
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="payments"
				options={{
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5 name="cc-amazon-pay" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
