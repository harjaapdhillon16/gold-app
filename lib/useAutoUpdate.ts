import { useEffect } from "react";
import * as Updates from "expo-updates";
import Toast from "react-native-toast-message";

export const useAutoUpdate = () => {
  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Toast.show({
            type: "success",
            text1: "Loading the latest verion for the app",
          });
          Updates.reloadAsync(); // Apply the update and restart the app
        } else {
          Toast.show({
            type: "success",
            text1: "You have the latest version of the app",
          });
        }
      } catch (e) {
        Toast.show({
          type: "success",
          text1: "Welcome to Lalit Jewellers",
        });
        console.error("Error checking for updates:", e);
      }
    };

    checkAndUpdate();
  }, []);
};
