import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function ProfileScreen() {
  const { profile, user } = useAuth();
  const router = useRouter();

  // Rudder Nav States & Animations
  const [navOpen, setNavOpen] = useState(false);
  const navAnim = useRef(new Animated.Value(0)).current;

  // Form states initialized with context values
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile?.name || "User",
  )}&background=059669&color=fff&size=256`;

  const [profileImage, setProfileImage] = useState<string>(
    (profile as any)?.profileImage || defaultAvatar,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setProfileImage((profile as any).profileImage || defaultAvatar);
    }
  }, [profile]);

  const toggleRudderNav = () => {
    const toValue = navOpen ? 0 : 1;
    Animated.spring(navAnim, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setNavOpen(!navOpen);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to change your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;
      setProfileImage(selectedUri);

      if (user?.uid) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            profileImage: selectedUri,
          });
        } catch (error: any) {
          Alert.alert("Error", "Could not update profile photo.");
        }
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert(
        "Validation Error",
        "Name, Phone, and Address cannot be empty.",
      );
      return;
    }

    setSaving(true);
    try {
      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          profileImage: profileImage,
        });
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  // Interpolations for Floating Nav
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Card */}
              <View style={styles.glassCard}>
                <View style={styles.avatarContainer}>
                  <TouchableOpacity activeOpacity={0.8} onPress={pickImage}>
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.avatar}
                    />
                    <View style={styles.cameraBadge}>
                      <Text style={styles.cameraIcon}>📷</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.changePhotoText}>
                    Tap to change photo
                  </Text>
                </View>

                {/* Read-Only Info */}
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyLabel}>
                    Email (Cannot be changed)
                  </Text>
                  <Text style={styles.readOnlyValue}>
                    {profile?.email || user?.email}
                  </Text>
                </View>

                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyLabel}>National ID</Text>
                  <Text style={styles.readOnlyValue}>
                    {profile?.nationalId || "N/A"}
                  </Text>
                </View>

                {/* Editable Inputs */}
                <Text style={styles.sectionHeader}>Personal Details</Text>

                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder="Enter full name"
                  placeholderTextColor="#2D3748"
                />

                <Text style={styles.inputLabel}>Telephone Number</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  placeholder="Enter telephone number"
                  placeholderTextColor="#2D3748"
                />

                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.disabledInput]}
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  multiline
                  placeholder="Enter address"
                  placeholderTextColor="#2D3748"
                />

                {/* Action Buttons */}
                {isEditing ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => {
                        setIsEditing(false);
                        setName(profile?.name || "");
                        setPhone(profile?.phone || "");
                        setAddress(profile?.address || "");
                      }}
                      disabled={saving}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.buttonText}>Edit Details</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

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
                  <Text style={styles.menuText}>Home</Text>
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
                  <Text style={[styles.menuText, styles.activeMenuText]}>
                    Profile
                  </Text>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 110,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.82)",
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#059669",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#059669",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cameraIcon: {
    fontSize: 14,
  },
  changePhotoText: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "700",
    marginTop: 6,
  },
  readOnlyBox: {
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  readOnlyLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  readOnlyValue: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(203, 213, 225, 0.8)",
    paddingBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1.5,
    borderColor: "rgba(203, 213, 225, 0.8)",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: "rgba(248, 250, 252, 0.7)",
    borderColor: "rgba(226, 232, 240, 0.8)",
    color: "#334155",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#059669",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#059669",
    flex: 1,
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: "#64748B",
    flex: 1,
    marginRight: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
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
});
