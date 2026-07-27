import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !address ||
      !birthday ||
      !nationalId
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const idQuery = query(
        collection(db, "users"),
        where("nationalId", "==", nationalId.trim()),
      );
      const idQuerySnapshot = await getDocs(idQuery);

      if (!idQuerySnapshot.empty) {
        Alert.alert(
          "Registration Error",
          "A user with this National ID already exists.",
        );
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        birthday: birthday.trim(),
        nationalId: nationalId.trim(),
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "That email address is already registered!");
      } else {
        Alert.alert("Registration Error", error.message);
      }
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
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Glassmorphic Container Card */}
              <View style={styles.glassCard}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.appBadge}>Join the Movement</Text>
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Become a donor or recipient in your area
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#2D3748"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telephone Number"
                  placeholderTextColor="#2D3748"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <TextInput
                  style={styles.input}
                  placeholder="National ID / Registration ID"
                  placeholderTextColor="#2D3748"
                  value={nationalId}
                  onChangeText={setNationalId}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#2D3748"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#2D3748"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#2D3748"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Birthday (YYYY-MM-DD)"
                  placeholderTextColor="#2D3748"
                  value={birthday}
                  onChangeText={setBirthday}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Register Now</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                  <Text style={styles.linkText}>Already registered? </Text>
                  <Link href="/(auth)/login" style={styles.linkBold}>
                    Sign In
                  </Link>
                </View>
              </View>
            </ScrollView>
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
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
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
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(203, 213, 225, 0.8)",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#059669",
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
    marginTop: 18,
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
