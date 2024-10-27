import React, { useEffect, useState } from "react";
import {
	View,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	Image,
	Linking,
	Alert,
	Modal,
	TextInput,
	Button
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";
import { Text } from "@/components/ui/text";
import axios from 'axios';


export default function TabOneScreen() {
	const [goldPrice22k, setGoldPrice22k] = useState(null);
	const [goldPrice24k, setGoldPrice24k] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState("");
	const [userName, setUserName] = useState("");
	const { top } = useSafeAreaInsets();

	useEffect(() => {
		async function fetchGoldPrices() {
			try {
				const { data, error } = await supabase.from("price").select("*");

				if (data) {
					setGoldPrice22k(data[0]?.goldprice_22k);
					setGoldPrice24k(data[0]?.goldprice_24k);
				}

				if (error) {
					console.error("Error fetching gold prices:", error);
				}
			} catch (error) {
				console.error("Error fetching gold prices:", error);
			}
		}
		fetchGoldPrices();
	}, []);

	const handleKittyPayment = async () => {
		// Validate if both input fields are filled
		if (!paymentAmount.trim() || !userName.trim()) {
			Alert.alert("Error", "Both fields are required.");
			return;
		}

		// Add payment processing logic here

		const { data: { paymentLink: { short_url } } } = await axios.post(`https://goldapi-498824964394.us-central1.run.app?amount=${paymentAmount * 100}`)
		Linking.openURL(short_url)

		// Reset form and close modal
		setModalVisible(false);
		setPaymentAmount("");
		setUserName("");
	};

	return (
		<ImageBackground
			source={{
				uri: "https://images.unsplash.com/photo-1602536643790-98b54146fea1",
			}}
			style={{ paddingTop: top }}
			className="flex-1 bg-background"
		>
			<View className="items-center justify-center gap-y-4 border-b-[#e6c300] p-3 border-b">
				<Text style={{ color: "#00000" }} className="text-center text-2xl font-bold">
					Gold Price 22K (10gm): ₹{goldPrice22k}
				</Text>
				<Text style={{ color: "#00000" }} className="text-center text-2xl font-bold">
					Gold Price 24K (10gm): ₹{goldPrice24k}
				</Text>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.kittyButton}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.kittyButtonText}>Kitty Payment</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => Alert.alert("No Records Found")}
					style={styles.kittyButton}
				>
					<Text style={styles.kittyButtonText}>Latest Product Collection</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => Linking.openURL("https://www.instagram.com/lalit.jewellers/")}
					style={{
						...styles.kittyButton,
						backgroundColor: "transparent",
						justifyContent: "flex-end",
						paddingRight: 20,
						position: "absolute",
						bottom: 20,
						right: 20
					}}
				>
					<Image
						style={{ width: 50, height: 50, borderRadius: 100 }}
						source={{ uri: "https://img.freepik.com/free-vector/instagram-logo_1199-122.jpg?semt=ais_hybrid" }}
					/>
				</TouchableOpacity>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Kitty Payment</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter Your Name"
							value={userName}
							onChangeText={setUserName}
						/>
						<TextInput
							style={styles.input}
							placeholder="Enter Payment Amount"
							value={paymentAmount}
							onChangeText={setPaymentAmount}
							keyboardType="numeric"
						/>
						<View style={styles.modalButtons}>
							<Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
							<Button title="Submit" onPress={handleKittyPayment} />
						</View>
					</View>
				</View>
			</Modal>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	kittyButton: {
		paddingVertical: 15,
		width: 300,
		textAlign: "center",
		justifyContent: "center",
		flexDirection: "row",
		backgroundColor: "#000000",
		borderRadius: 100,
		marginBottom: 10,
	},
	kittyButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
	},
	input: {
		width: "100%",
		padding: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
});

