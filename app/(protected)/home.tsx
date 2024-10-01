import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
	View,
	FlatList,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Modal,
	Dimensions,
	TextInput,
} from "react-native";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { useSupabase } from "@/context/supabase-provider";

export default function TabOneScreen() {
	const router = useRouter();
	const { isDarkColorScheme } = useColorScheme();
	const [goldPrice, setGoldPrice] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const { top } = useSafeAreaInsets();

	const [userStatus, setUserStatus] = useState("approved"); // User's request status
	const [formVisible, setFormVisible] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		phone: "",
	});

	// State for modal visibility and selected product
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const { user, signOut } = useSupabase();
	useEffect(() => {
		async function fetchGoldPrice() {
			try {
				const headers = {
					"x-access-token": "goldapi-4hajslyjc5y81-io",
					"Content-Type": "application/json",
				};
				axios
					.get("https://www.goldapi.io/api/XAU/INR", { headers })
					.then((response) => {
						setGoldPrice(response.data.price_gram_22k);
					})
					.catch((error) => {
						console.log("error", error);
					});
			} catch (error) {
				console.error("Error fetching gold price:", error);
			}
		}
		fetchGoldPrice();
	}, []);

	useEffect(() => {
		async function checkUserStatus() {
			const { data: userData, error: userError } = await supabase
				.from("allow_users")
				.select("status")
				.eq("user_phone", user?.phone)
				.single();

			if (userError) {
				console.error("Error checking user status:", userError);
				setFormVisible(true);
				return;
			}

			if (userData) {
				setUserStatus(userData.status);
				if (userData.status === "accepted") {
					fetchCategoriesAndProducts();
				}
			} else {
				setFormVisible(true);
			}
		}

		if (user?.phone) {
			fetchCategoriesAndProducts();
		} else {
			fetchCategoriesAndProducts();
		}
	}, [user?.phone]);

	async function fetchCategoriesAndProducts() {
		const { data: categoriesData, error: categoriesError } = await supabase
			.from("categories")
			.select("id, name");

		if (categoriesError) {
			console.error("Error fetching categories:", categoriesError);
			return;
		}

		setCategories(categoriesData);
		setSelectedCategory(categoriesData[0]?.name);

		const { data: productsData, error: productsError } = await supabase
			.from("products")
			.select("*");

		if (productsError) {
			console.error("Error fetching products:", productsError);
			return;
		}

		const mappedProducts = productsData.map((product) => {
			return { ...product };
		});

		setProducts(mappedProducts);
	}

	const handleCategoryPress = (category) => {
		setSelectedCategory(category);
	};

	const handleProductPress = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const handleFormSubmit = async () => {
		try {
			const { data, error } = await supabase.from("allow_users").insert({
				user_data: formData,
				user_phone: user?.phone,
				status: "pending",
				user_id: user?.id,
			});

			if (error) {
				console.error("Error submitting request:", error, {
					user_data: formData,
					user_phone: user?.phone,
					status: "pending",
					user_id: user?.id,
				});
			} else {
				setFormVisible(false);
				setUserStatus("pending");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<View style={{ paddingTop: top }} className="flex-1 bg-background">
			<View className="items-center justify-center gap-y-4 border-b-[#e6c300] p-3 border-b">
				<Text
					style={{ color: "#e6c300" }}
					className="text-center text-2xl font-bold"
				>
					Gold Price 22 Carat: ₹690000
				</Text>
			</View>
			{formVisible ? (
				<View style={styles.formContainer}>
					<Text style={styles.formTitle}>Request Access</Text>
					<TextInput
						style={{
							...styles.input,
							color: !isDarkColorScheme ? "black" : "white",
						}}
						placeholder="Name"
						placeholderTextColor={!isDarkColorScheme ? "black" : "white"}
						value={formData.name}
						onChangeText={(text) => setFormData({ ...formData, name: text })}
					/>
					<TextInput
						style={{
							...styles.input,
							color: !isDarkColorScheme ? "black" : "white",
						}}
						placeholder="Address"
						value={formData.address}
						placeholderTextColor={!isDarkColorScheme ? "black" : "white"}
						onChangeText={(text) => setFormData({ ...formData, address: text })}
					/>
					<TextInput
						style={{
							...styles.input,
							color: !isDarkColorScheme ? "black" : "white",
						}}
						placeholder="Phone"
						keyboardType="numeric"
						value={formData.phone}
						placeholderTextColor={!isDarkColorScheme ? "black" : "white"}
						onChangeText={(text) => setFormData({ ...formData, phone: text })}
					/>
					<Button onPress={handleFormSubmit}>
						<Text>Submit</Text>
					</Button>
				</View>
			) : userStatus === "pending" ? (
				<View style={styles.pendingContainer}>
					<Text>Your request is pending. Please wait for approval.</Text>
				</View>
			) : (
				<>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.categoryScroll}
					>
						{categories.map((category) => (
							<TouchableOpacity
								key={category.id}
								style={[
									styles.categoryCapsule,
									selectedCategory === category.name &&
									styles.selectedCategoryCapsule,
								]}
								onPress={() => handleCategoryPress(category.name)}
							>
								<Text
									style={[
										styles.categoryText,
										selectedCategory === category.name &&
										styles.selectedCategoryText,
									]}
								>
									{category.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
					<FlatList
						data={products.filter(
							(product) => product.variant === selectedCategory,
						)}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.gridItem}
								onPress={() => handleProductPress(item)}
							>
								<Image
									source={{ uri: item.image_urls?.[0] }}
									style={styles.image}
								/>
								<Text style={styles.title}>{item.name}</Text>
							</TouchableOpacity>
						)}
						contentContainerStyle={styles.gridContainer}
					/>

					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<View style={styles.modalOverlay}>
							<ScrollView contentContainerStyle={styles.modalContentContainer}>
								<View
									style={{
										...styles.modalContent,
										backgroundColor: isDarkColorScheme ? "black" : "white",
									}}
								>
									{selectedProduct && (
										<>
											<Image
												source={{ uri: selectedProduct.image_urls?.[0] }}
												style={styles.modalImage}
											/>
											<Text style={styles.modalTitle}>
												{selectedProduct.name}
											</Text>
											<Text
												style={{
													...styles.modalTitle,
													fontWeight: "normal",
													marginTop: -10,
												}}
											>
												{selectedProduct.description}
											</Text>
											<Button
												style={styles.closeButton}
												onPress={() => {
													setModalVisible(!modalVisible);
												}}
											>
												<Text>Close</Text>
											</Button>
										</>
									)}
								</View>
							</ScrollView>
						</View>
					</Modal>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	gridContainer: {
		paddingTop: 16,
	},
	gridItem: {
		flex: 1,
		margin: 8,
		alignItems: "center",
	},
	image: {
		width: 150,
		height: 150,
		borderRadius: 20,
		marginBottom: 8,
	},
	title: {
		textAlign: "center",
		fontWeight: "bold",
	},
	categoryScroll: {
		paddingHorizontal: 8,
		marginVertical: 16,
	},
	categoryCapsule: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		height: 40,
		marginRight: 8,
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 16,
		backgroundColor: "#ffff",
	},
	selectedCategoryCapsule: {
		backgroundColor: "#ffc107", // Change this to your desired selected color
		borderWidth: 0,
	},
	categoryText: {
		color: "#000",
		paddingBottom: 5,
		fontWeight: "bold",
	},
	selectedCategoryText: {
		color: "#000", // Change this to your desired selected text color
	},
	modalOverlay: {
		flex: 1,
		paddingTop: 100,
		minHeight: Dimensions.get("window").height - 100,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContentContainer: {
		justifyContent: "center",
		alignItems: "center",
		minHeight: Dimensions.get("window").height - 100,
	},
	modalContent: {
		width: Dimensions.get("window").width,
		padding: 20,
		minHeight: Dimensions.get("window").height - 100,
		backgroundColor: "white",
		borderRadius: 10,
		alignItems: "center",
	},
	modalImage: {
		width: "100%",
		height: 300,
		borderRadius: 10,
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "left",
		width: "100%",
		paddingLeft: 5,
		marginBottom: 20,
	},
	closeButton: {
		width: "50%",
		bottom: 10,
	},
	formContainer: {
		padding: 20,
	},
	formTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	pendingContainer: {
		padding: 20,
		alignItems: "center",
	},
});
