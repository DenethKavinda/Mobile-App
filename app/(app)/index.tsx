import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";

export default function HomeScreen() {
  const { profile, user } = useAuth();
  const router = useRouter();

  // Navigation State
  const [navOpen, setNavOpen] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  // Animation Refs
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Welcome Banner Entry Animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss welcome popup after 3.5s
    const timer = setTimeout(() => {
      dismissWelcome();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const dismissWelcome = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setWelcomeVisible(false));
  };

  const toggleRudderNav = () => {
    const toValue = navOpen ? 0 : 1;
    Animated.spring(navAnim, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setNavOpen(!navOpen);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";

  // Interpolations for FAB Menu
  const rotatePlus = navAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const menuScale = navAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuTranslateY = navAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <ImageBackground
      source={require("../../assets/images/logAndSignUp.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* Dashboard Header */}
            <View style={styles.header}>
              <Text style={styles.appBadge}>Community Food Bank</Text>
              <Text style={styles.heading}>Welcome Dashboard</Text>
              <Text style={styles.subHeading}>
                Sharing abundance, reducing food waste together.
              </Text>
            </View>

            {/* Feature Video Section */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>🎥 How Food Donation Works</Text>
              <Text style={styles.cardSubtitle}>
                Watch how your surplus meals help families in need.
              </Text>

              <View style={styles.videoContainer}>
                <WebView
                  style={styles.video}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{
                    uri: "https://youtu.be/CiFoHm7HD94?si=W1Atg2lw3xpIs2Yl",
                  }}
                />
              </View>
            </View>

            {/* Suggested Food Items Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>🥫 High-Demand Items Needed</Text>
              <Text style={styles.cardSubtitle}>
                Consider donating these requested food items:
              </Text>

              <View style={styles.suggestionGrid}>
                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionEmoji}>🌾</Text>
                  <Text style={styles.suggestionTitle}>Grains & Rice</Text>
                  <Text style={styles.suggestionDesc}>
                    Rice, Oats, Pasta & Flour
                  </Text>
                </View>

                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionEmoji}>🥫</Text>
                  <Text style={styles.suggestionTitle}>Canned Goods</Text>
                  <Text style={styles.suggestionDesc}>
                    Soups, Beans & Vegetables
                  </Text>
                </View>

                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionEmoji}>🥛</Text>
                  <Text style={styles.suggestionTitle}>Dairy & Milk</Text>
                  <Text style={styles.suggestionDesc}>
                    Powdered or UHT Shelf-stable
                  </Text>
                </View>

                <View style={styles.suggestionItem}>
                  <Text style={styles.suggestionEmoji}>🍎</Text>
                  <Text style={styles.suggestionTitle}>Fresh Produce</Text>
                  <Text style={styles.suggestionDesc}>
                    Uninjured Fruits & Veggies
                  </Text>
                </View>
              </View>
            </View>

            {/* Donation Safety Guidelines Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>💡 Safe Donation Tips</Text>

              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>✓</Text>
                <Text style={styles.tipText}>
                  Ensure packaged food is within valid expiration dates.
                </Text>
              </View>

              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>✓</Text>
                <Text style={styles.tipText}>
                  Keep cooked surplus hot/frozen in sealed containers.
                </Text>
              </View>

              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>✓</Text>
                <Text style={styles.tipText}>
                  Avoid donating unsealed, highly perishable, or damaged
                  packages.
                </Text>
              </View>
            </View>

            {/* Logout Action Button */}
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Text style={styles.signOutText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Rudder / Plus Navigation System */}
          <View pointerEvents="box-none" style={styles.navContainer}>
            {navOpen && (
              <Animated.View
                style={[
                  styles.expandedMenu,
                  {
                    opacity: navAnim,
                    transform: [
                      { scale: menuScale },
                      { translateY: menuTranslateY },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleRudderNav();
                    router.push("/");
                  }}
                >
                  <Text style={styles.menuIcon}>🏠</Text>
                  <Text style={[styles.menuText, styles.activeMenuText]}>
                    Home
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleRudderNav();
                    console.log("Navigate to Donate");
                  }}
                >
                  <Text style={styles.menuIcon}>🎁</Text>
                  <Text style={styles.menuText}>Donate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleRudderNav();
                    console.log("Navigate to Claim");
                  }}
                >
                  <Text style={styles.menuIcon}>📦</Text>
                  <Text style={styles.menuText}>Claim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleRudderNav();
                    router.push("/profile");
                  }}
                >
                  <Text style={styles.menuIcon}>👤</Text>
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Main Floating Action Plus Button */}
            <TouchableOpacity
              style={styles.fabButton}
              onPress={toggleRudderNav}
              activeOpacity={0.9}
            >
              <Animated.Text
                style={[
                  styles.fabIcon,
                  { transform: [{ rotate: rotatePlus }] },
                ]}
              >
                +
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Welcome Pop-up Modal */}
        {welcomeVisible && (
          <Modal transparent visible={welcomeVisible} animationType="none">
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.welcomeBanner,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Text style={styles.welcomeEmoji}>🌱</Text>
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeName}>{displayName}</Text>
                <Text style={styles.welcomeSubtext}>
                  Thank you for nourishing our community today.
                </Text>

                <TouchableOpacity
                  style={styles.closeBannerButton}
                  onPress={dismissWelcome}
                >
                  <Text style={styles.closeBannerText}>Continue</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  appBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#065F46",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    letterSpacing: 0.5,
    overflow: "hidden",
    marginBottom: 8,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subHeading: {
    fontSize: 14,
    color: "#E2E8F0",
    fontWeight: "500",
    marginTop: 2,
  },

  /* Glass Card Styles */
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
    marginBottom: 16,
  },

  /* Video Embed Styles */
  videoContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },

  /* Suggestion Grid Styles */
  suggestionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  suggestionItem: {
    width: "48%",
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  suggestionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  suggestionDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  /* Guidelines Styles */
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tipIcon: {
    color: "#059669",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 8,
    marginTop: -2,
  },
  tipText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },

  signOutButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  signOutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Rudder FAB Navigation Styles */
  navContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  fabIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "300",
    marginTop: -2,
  },
  expandedMenu: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    gap: 16,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  menuIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  menuText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
  },
  activeMenuText: {
    color: "#059669",
    fontWeight: "800",
  },

  /* Welcome Banner Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  welcomeBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  welcomeEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
    textAlign: "center",
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  closeBannerButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  closeBannerText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
