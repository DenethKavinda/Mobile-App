import { signOut } from "firebase/auth";
import {
  Platform,
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

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Home Dashboard</Text>
      <Text style={styles.subHeading}>
        Welcome back, {profile?.name || user?.email}!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Profile Information</Text>

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
          <Text style={styles.value}>{profile?.email || user?.email}</Text>
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

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subHeading: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: "35%",
  },
  value: {
    color: "#1a1a1a",
    width: "65%",
    textAlign: "right",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
