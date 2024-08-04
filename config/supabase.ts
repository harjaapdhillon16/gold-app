import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
	getItem: (key: string) => {
		return SecureStore.getItemAsync(key);
	},
	setItem: (key: string, value: string) => {
		SecureStore.setItemAsync(key, value);
	},
	removeItem: (key: string) => {
		SecureStore.deleteItemAsync(key);
	},
};
const supabaseUrl = "https://cuzhhhvjleswemngrogo.supabase.co" as string;
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1emhoaHZqbGVzd2Vtbmdyb2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAyNzE2NjYsImV4cCI6MjAzNTg0NzY2Nn0.AvyFtL8TeHd5EdKV6R7p6VZIvTRweotoclO2462PhOM" as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		storage: ExpoSecureStoreAdapter as any,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
