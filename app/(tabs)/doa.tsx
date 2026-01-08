import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Doa {
  id: number;
  nama: string;
  tentang: string;
  tag: string[];
}

export default function DetailDoa() {
  const [doa, setDoa] = useState<Doa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://equran.id/api/doa")
      .then((res) => {
        setDoa(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00a88cff" />
        <Text style={styles.loadingText}>Memuat daftar doa...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Feather name="book-open" size={24} color="white" /> {""}
          QuranKu
        </Text>
        <Text style={styles.headerSubtitle}>Daftar Doa</Text>
      </View>
      {doa.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            styles.doaCard,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          android_ripple={{ color: "#e0f2f1" }}
          onPress={() =>
            router.push({
              pathname: "/doa/[id]",
              params: { id: item.id.toString() },
            })
          }
        >
          <View style={styles.cardInternal}>
            <View style={styles.leftSection}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{item.id}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.doaTitle} numberOfLines={1}>
                  {item.nama}
                </Text>
                <Text style={styles.subtitleText} numberOfLines={1}>
                  Klik untuk melihat detail doa
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#00a88cff" />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#00a88cff",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#00a88cff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0f2f1",
    marginTop: 4,
  },
  doaCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 16,
    marginLeft: 16,
    marginTop: 16,
    padding: 16,
    // Shadow untuk iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation untuk Android
    elevation: 2,
  },
  cardInternal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  numberText: {
    color: "#00a88cff",
    fontWeight: "bold",
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  doaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 12,
    color: "#999",
  },
});
