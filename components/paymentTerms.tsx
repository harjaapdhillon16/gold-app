import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Modal,
	ScrollView,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";

export function GoldSchemeDetails() {
	const { top } = useSafeAreaInsets();
	const [modalVisible, setModalVisible] = useState(false);

	const points = [
		"You will need to pay 11 monthly installments, and you can purchase jewelry in the 12th month.",
		"If the customer discontinues during the 7th or 8th month of enrollment, the member will be entitled to 50% discount on the wastage (VA), and for discontinuation during the 9th or 10th month, the member will be entitled to 70% discount on the wastage (VA), limited to the gold weight applicable for the accumulated value under the plan.",
		"In case the Customer does not redeem within 1 month from the maturity date, he/she will be provided with a refund or a voucher of the amount aggregating all the installments paid by the Customer until the date of the voucher.",
		"The final product invoice value should be equal to or in excess of the purchase eligibility amount.",
		"Customers cannot enroll with any money borrowed by him from any other persons.",
		"Cash refunds are typically not available under this scheme.",
		"Payment of monthly installment(s) may be made by cash, credit/debit cards, NEFT/RTGS, local cheques in favor of “Lalit JEWELLERS.” payable in the city in where the Lalit JEWELLERS Showroom in which the account was opened is located, ECS (Electronic Clearing Service).",
		"Amount of deposit of Rs.2 Lakhs and above shall be accepted by way of cheque, bankers cheque or by way of electric fund transfer to the designated account of the Company.",
		"At the time of purchase of jewellery, the account holder has to personally come and should produce a valid photo identity proof and PAN Card.",
		"The customer will have to purchase the jewelry for the total installments amount paid and partial purchase is not allowed.",
	];

	return (
		<View style={[styles.container]}>
			<View style={styles.mainContainer}>
				<Text style={styles.header}>Gold Scheme Details</Text>
				<View style={styles.pointContainer}>
					<Text style={styles.pointText}>{points[0]}</Text>
				</View>
				<TouchableOpacity
					style={styles.viewDetailsButton}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.viewDetailsText}>View Details</Text>
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
						<ScrollView contentContainerStyle={styles.modalScrollView}>
							{points.map((point, index) => (
								<View key={index} style={styles.modalPointContainer}>
									<Text style={styles.modalPointText}>{point}</Text>
								</View>
							))}
							<Button onPress={() => setModalVisible(false)}>
								<Text>Close</Text>
							</Button>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	mainContainer: {},
	header: {
		fontSize: 24,
		paddingTop: 10,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	pointContainer: {
		marginBottom: 12,
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
	},
	pointText: {
		fontSize: 16,
		color: "#333",
	},
	viewDetailsButton: {
		marginTop: 10,
		padding: 10,
		marginBottom: 10,
		alignItems: "center",
		borderRadius: 5,
		backgroundColor: "#007bff",
	},
	viewDetailsText: {
		fontSize: 16,
		color: "#fff",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "100%",
		height: "90%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalScrollView: {
		paddingVertical: 20,
	},
	modalPointContainer: {
		marginBottom: 12,
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
	},
	modalPointText: {
		fontSize: 16,
		color: "#333",
	},
});
