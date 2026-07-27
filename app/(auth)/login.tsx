import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/logAndSignUp.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {/* Glassmorphic Container Card */}
            <View style={styles.glassCard}>
              <View style={styles.badgeContainer}>
                <Text style={styles.appBadge}>Nourish & Share</Text>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Connecting surplus food with community needs.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#2D3748"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#2D3748"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>New to the platform? </Text>
                <Link href="/(auth)/register" style={styles.linkBold}>
                  Create Account
                </Link>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
    backgroundColor: "rgba(15, 23, 42, 0.5)", // Dark overlay for contrast
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.78)", // Opaque enough for sharp readability
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)", // Crisp glass edges
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  appBadge: {
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
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A", // Deep high-contrast navy/black
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#1E293B", // High-visibility subtext
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.88)", // Bright white-tinted input
    borderWidth: 1.5,
    borderColor: "rgba(203, 213, 225, 0.8)",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#059669", // Vibrant, accessible green
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
  },
  linkBold: {
    color: "#047857",
    fontWeight: "800",
    fontSize: 14,
  },
});
