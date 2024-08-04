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
} from "react-native";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function TabOneScreen() {
	const router = useRouter();
	const [goldPrice, setGoldPrice] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const { top } = useSafeAreaInsets();

	// State for modal visibility and selected product
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

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
		async function fetchCategoriesAndProducts() {
			const { data: variantsData, error: variantsError } = await supabase
				.from("categories")
				.select("id, name");

			if (variantsError) {
				console.error("Error fetching variants:", variantsError);
				return;
			}

			setCategories(variantsData);
			setSelectedCategory(variantsData[0]?.name);

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

		fetchCategoriesAndProducts();
	}, []);

	const handleCategoryPress = (category) => {
		setSelectedCategory(category);
	};

	const handleProductPress = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	console.log({ products, selectedCategory });

	return (
		<View style={{ paddingTop: top }} className="flex-1 bg-background">
			<View className="items-center justify-center gap-y-4 border-b-[#e6c300] p-3 border-b">
				{goldPrice ? (
					<Text
						style={{ color: "#e6c300" }}
						className="text-center text-2xl font-bold"
					>
						Gold Price 22 Carat: ₹{goldPrice}
					</Text>
				) : (
					<Text className="text-center">Fetching gold price...</Text>
				)}
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.categoryScroll}
			>
				{categories.map((category, index) => (
					<TouchableOpacity
						key={index}
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
					<View style={styles.modalContent}>
						{selectedProduct && (
							<>
								<Image
									source={{ uri: selectedProduct.image_urls?.[0] }}
									style={styles.modalImage}
								/>
								<Text style={styles.modalTitle}>{selectedProduct.name}</Text>
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
									style={{
										width: "50%",
										position: "absolute",
										left: 10,
										bottom: 10,
									}}
									onPress={() => {
										setModalVisible(!modalVisible);
									}}
								>
									<Text>Close</Text>
								</Button>
							</>
						)}
					</View>
				</View>
			</Modal>
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
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.9,
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		alignItems: "center",
	},
	modalImage: {
		width: "100%",
		height: "70%",
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
});
