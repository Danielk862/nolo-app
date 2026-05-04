import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import NoloLogo from "../components/NoloLogo";
import styles from "../styles/screens/simulator.styles";
import LogoutButton from "../components/LogoutButton";

export default function PodcastScreen({ navigation }) {
    const handleYoutube = () => {
        Linking.openURL('https://www.youtube.com');
    }
    const handleSpotify = () => {
        Linking.openURL('https://open.spotify.com/intl-es/');
    }
    const handleApplePodcast = () => {
        Linking.openURL('https://podcasts.apple.com/us/new');
    }

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

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.description}>
                    Escucha nuestro podcast para aprender sobre finanzas personales, inversiones, ahorro y más. Disponible en Youtube, Spotify y Apple Podcasts.
                </Text>

                <TouchableOpacity style={styles.youtubeCard} onPress={handleYoutube}>
                    <View style={styles.ytInner}>
                        <Image
                            source={require("../assets/images/youtube.png")}
                            style={styles.ytIcon}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.spotifyCard} onPress={handleSpotify}>
                    <View style={styles.ytInner}>
                        <Image
                            source={require("../assets/images/spotify.png")}
                            style={styles.ytIcon}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applePodcastCard} onPress={handleApplePodcast}>
                    <View style={styles.ytInner}>
                        <Image
                            source={require("../assets/images/applepodcast.png")}
                            style={styles.ytIcon}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.logoArea}>
                    <NoloLogo size="sm" color={COLORS.darkGray} />
                    <Text style={styles.byline}>by la Peliroja Financiera</Text>
                </View>   
            </ScrollView>
        </SafeAreaView>
    )
}