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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    // 1. Basic validation
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
      // 2. Check if National ID is unique in Firestore
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

      // 3. Create Firebase Authentication account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      // 4. Save custom user metadata to Firestore using Auth UID
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Telephone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="National ID / Registration ID (Unique)"
        value={nationalId}
        onChangeText={setNationalId}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address (Unique)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday (YYYY-MM-DD)"
        value={birthday}
        onChangeText={setBirthday}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Link href="/(auth)/login" style={styles.linkText}>
          Already have an account? Log In
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e4e8",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 18,
    marginBottom: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
