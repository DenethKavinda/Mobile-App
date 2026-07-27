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
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";

export default function HomeScreen() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  // Animation Refs
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Welcome Banner Animation
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

  // Interpolations for Floating Menu Animation
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
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.appBadge}>Community Food Bank</Text>
              <Text style={styles.heading}>Dashboard</Text>
              <Text style={styles.subHeading}>
                Sharing abundance, ending waste.
              </Text>
            </View>

            {/* Profile Glass Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Profile Summary</Text>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{profile?.name || "N/A"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>ID Number:</Text>
                <Text style={styles.value}>{profile?.nationalId || "N/A"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>
                  {profile?.email || user?.email}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{profile?.phone || "N/A"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{profile?.address || "N/A"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Birthday:</Text>
                <Text style={styles.value}>{profile?.birthday || "N/A"}</Text>
              </View>
            </View>

            {/* Sign Out Button */}
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
            {/* Expanded Menu Bar */}
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

            {/* Main Center Plus Floating Button */}
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

        {/* Animated Greeting Banner */}
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
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  container: {
    padding: 20,
    paddingBottom: 110,
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
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(203, 213, 225, 0.8)",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
    color: "#334155",
    width: "35%",
    fontSize: 14,
  },
  value: {
    color: "#0F172A",
    fontWeight: "600",
    width: "65%",
    textAlign: "right",
    fontSize: 14,
  },
  signOutButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
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

  /* Rudder FAB Floating Navigation Styles */
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
