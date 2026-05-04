import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import NoloLogo from "../components/NoloLogo";
import styles from "../styles/screens/simulator.styles";
import LogoutButton from "../components/LogoutButton";

export default function PodcastScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🎙️ Podcast</Text>
                <View style={styles.backBtn} />
                <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
            </View>
        </SafeAreaView>
    )
}