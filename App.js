import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator} from "react-native";
import * as Location from "expo-location";
import WeatherInfo from "./components/WeatherInfo";
import UnitPicker from "./components/UnitPicker";
import ReloadIcon from "./components/ReloadIcon";
import WeatherDetails from "./components/WeatherDetails";
import { colors } from "./utils/index";

const WEATHER_API_KEY = "5c3cc3667458eebe2b977819d4bcb613";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState("metric");


  useEffect(() => {
    load();
  }, [unitsSystem]);
  async function load() {
    setCurrentWeather(null);
    setErrorMessage(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("To run the app, please allow access to the location ");
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl);
      const result = await response.json();

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  if (currentWeather) {

    return (
      
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitPicker
            unitsSystem={unitsSystem}
            setUnitsSystem={setUnitsSystem}
          />
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem} />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>{errorMessage}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
  },
});
