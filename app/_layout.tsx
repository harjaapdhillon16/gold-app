import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { SupabaseProvider } from "@/context/supabase-provider";
import { useAutoUpdate } from "@/lib/useAutoUpdate";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	useAutoUpdate();
	return (
		<>
			<SupabaseProvider>
				<SafeAreaProvider>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name="(protected)" />
						<Stack.Screen name="(public)" />
						<Stack.Screen
							name="modal"
							options={{
								presentation: "modal",
							}}
						/>
					</Stack>
				</SafeAreaProvider>
			</SupabaseProvider>
			<Toast />
		</>
	);
}
