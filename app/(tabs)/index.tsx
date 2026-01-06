import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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

interface Surat {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
}

export default function Index() {
  const [surat, setSurat] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://equran.id/api/v2/surat")
      .then((res) => {
        setSurat(res.data.data);
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
        <Text style={styles.loadingText}>Memuat Daftar Surat...</Text>
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
      {surat.map((item) => (
        <Pressable
          key={item.nomor}
          style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() =>
            router.push({
              pathname: "/surat/[id]",
              params: { id: item.nomor.toString() },
            })
          }
        >
          <View style={styles.cardContent}>
            <View style={styles.leftSection}>
              <View style={styles.numberWrapper}>
                <Text style={styles.numberText}>{item.nomor}</Text>
              </View>
              <View style={styles.infoWrapper}>
                <Text style={styles.latinName}>{item.namaLatin}</Text>
                <Text style={styles.subInfo}>
                  {item.tempatTurun} • {item.jumlahAyat} Ayat
                </Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.arabicName}>{item.nama}</Text>
              <FontAwesome
                name="angle-right"
                size={18}
                color="#ccc"
                style={{ marginLeft: 10 }}
              />
            </View>
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
    padding: 25,
    backgroundColor: "#00a88cff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0f2f1",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 16,
    marginLeft: 16,
    marginTop: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  numberWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e0f2f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    transform: [{ rotate: "45deg" }],
  },
  numberText: {
    color: "#00a88cff",
    fontWeight: "bold",
    fontSize: 14,
    transform: [{ rotate: "-45deg" }],
  },
  infoWrapper: {
    justifyContent: "center",
  },
  latinName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subInfo: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  arabicName: {
    fontSize: 20,
    color: "#00a88cff",
    fontWeight: "500",
  },
});
