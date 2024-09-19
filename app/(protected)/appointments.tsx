import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	ActivityIndicator,
	FlatList,
	useColorScheme,
	StyleSheet,
	Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../config/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSupabase } from "@/context/supabase-provider";

export default function AppointmentScreen({ navigation }: any) {
	const [appointmentDate, setAppointmentDate] = useState(new Date());
	const [appointmentTime, setAppointmentTime] = useState(new Date());
	const [description, setDescription] = useState("");
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [pickerMode, setPickerMode] = useState("date");
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === "dark";
	const { user } = useSupabase();
	// Fetch appointments from Supabase
	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("appointments")
			.select("*")
			.match({ user_id: user?.id });

		if (error) {
			console.log("Error fetching appointments:", error);
		} else {
			setAppointments(data as any);
		}
		setLoading(false);
	};

	const createAppointment = async () => {
		setLoading(true);
		function convertTo24Hour(timeString) {
			// Parse the input time string
			const [time, modifier] = timeString.split(" ");
			const [hours, minutes] = time.split(":").map(Number);

			// Convert hours to 24-hour format
			let hours24 = hours;
			if (modifier === "PM" && hours !== 12) {
				hours24 = hours + 12;
			} else if (modifier === "AM" && hours === 12) {
				hours24 = 0;
			}

			// Format hours and minutes as two-digit numbers
			const formattedHours = hours24.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// Return the time in 24-hour format without seconds
			return `${formattedHours}:${formattedMinutes}`;
		}
		const { data, error } = await supabase.from("appointments").insert([
			{
				date: appointmentDate,
				time: convertTo24Hour(appointmentTime.toLocaleTimeString()),
				description,
				user_id: user?.id,
			},
		]);

		if (error) {
			console.log("Error creating appointment:", error);
		} else {
			fetchAppointments(); // Refresh appointments list
			setModalVisible(false); // Close the modal
			setAppointmentDate(new Date());
			setAppointmentTime(new Date());
			setDescription("");
		}
		setLoading(false);
	};
	const { top } = useSafeAreaInsets();

	const handleDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || appointmentDate;
		setShowDatePicker(Platform.OS === "ios");
		setAppointmentDate(currentDate);
	};

	const handleTimeChange = (event, selectedTime) => {
		const currentTime = selectedTime || appointmentTime;
		setShowTimePicker(Platform.OS === "ios");
		setAppointmentTime(currentTime);
	};

	const renderAppointment = ({ item }) => (
		<View
			style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}
		>
			<Text style={!isDarkMode ? styles.text : styles.darkText}>
				Date: {new Date(item.date).toLocaleDateString()}
			</Text>
			<Text style={!isDarkMode ? styles.text : styles.darkText}>
				Time: {item.time}
			</Text>
			<Text style={!isDarkMode ? styles.text : styles.darkText}>
				Purpose of appointment {"\n"}{item.description}
			</Text>
		</View>
	);

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: top },
				isDarkMode ? styles.containerDark : styles.containerLight,
			]}
		>
			<Text
				style={[
					styles.header,
					isDarkMode ? styles.headerDark : styles.headerLight,
				]}
			>
				Appointments
			</Text>

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<FlatList
					data={appointments}
					renderItem={renderAppointment}
					keyExtractor={(item) => item.id.toString()}
				/>
			)}

			<TouchableOpacity
				style={styles.button}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.buttonText}>Create Appointment</Text>
			</TouchableOpacity>

			{/* Modal for creating a new appointment */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View
						style={[
							styles.modalContent,
							isDarkMode ? styles.modalDark : styles.modalLight,
						]}
					>
						<Text
							style={[
								styles.modalHeader,
								isDarkMode ? styles.modalHeaderDark : styles.modalHeaderLight,
							]}
						>
							New Appointment
						</Text>

						<TouchableOpacity
							onPress={() => {
								setPickerMode("date");
								setShowDatePicker(true);
							}}
							style={[
								styles.input,
								isDarkMode ? styles.inputDark : styles.inputLight,
							]}
						>
							<Text style={styles.text}>{appointmentDate.toDateString()}</Text>
						</TouchableOpacity>
						{/* Date Picker */}
						{showDatePicker && (
							<DateTimePicker
								mode="date"
								minimumDate={new Date(Date.now())}
								value={appointmentDate}
								onChange={handleDateChange}
								display="default"
							/>
						)}

						{/* Time Picker */}

						<TouchableOpacity
							onPress={() => {
								setPickerMode("time");
								setShowTimePicker(true);
							}}
							style={[
								styles.input,
								isDarkMode ? styles.inputDark : styles.inputLight,
							]}
						>
							<Text style={styles.text}>
								{appointmentTime.toLocaleTimeString()}
							</Text>
						</TouchableOpacity>
						{showTimePicker && (
							<DateTimePicker
								mode="time"
								value={appointmentTime}
								onChange={handleTimeChange}
								display="default"
							/>
						)}
						<TextInput
							style={[
								styles.input,
								isDarkMode ? styles.inputDark : styles.inputLight,
							]}
							placeholder="Description"
							placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
							value={description}
							onChangeText={setDescription}
						/>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.button, styles.modalButton]}
								onPress={createAppointment}
							>
								<Text style={styles.buttonText}>Save</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.button, styles.modalButton]}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	containerLight: {
		backgroundColor: "#ffffff",
	},
	containerDark: {
		backgroundColor: "#000000",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	headerLight: {
		color: "#000000",
	},
	headerDark: {
		color: "#ffffff",
	},
	card: {
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	cardLight: {
		backgroundColor: "#f9f9f9",
		borderColor: "#cccccc",
		borderWidth: 1,
	},
	cardDark: {
		backgroundColor: "#2a2a2a",
		borderColor: "#444444",
		borderWidth: 1,
	},
	text: {
		fontSize: 16,
	},
	darkText: {
		fontSize: 16,
		color: "#fff",
	},
	button: {
		backgroundColor: "#1f7a8c",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalContainer: {
		top: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "90%",
		borderRadius: 10,
		padding: 20,
	},
	modalLight: {
		backgroundColor: "#ffffff",
	},
	modalDark: {
		backgroundColor: "#333333",
	},
	modalHeader: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	modalHeaderLight: {
		color: "#000000",
	},
	modalHeaderDark: {
		color: "#ffffff",
	},
	input: {
		width: "100%",
		padding: 12,
		marginVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16,
	},
	inputLight: {
		backgroundColor: "#f9f9f9",
		borderColor: "#cccccc",
	},
	inputDark: {
		backgroundColor: "#f9f9f9",
		borderColor: "#444444",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	modalButton: {
		flex: 1,
		marginHorizontal: 5,
	},
});
