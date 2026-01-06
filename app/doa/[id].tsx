import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, StyleSheet, SafeAreaView } from "react-native";

interface Doa {
  id: number;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

export default function DoaDetail() {
  const { id } = useLocalSearchParams();
  const [doa, setDoa] = useState<Doa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://equran.id/api/doa/${id}`)
      .then((res) => {
        setDoa(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00a88cff" />
        <Text style={styles.loadingText}>Memuat data doa...</Text>
      </View>
    );
  }

  if (!doa) {
    return (
      <View style={styles.centerContainer}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{doa.id}</Text>
          </View>
          <Text style={styles.titleText}>{doa.nama}</Text>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <Text style={styles.arabicText}>{doa.ar}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.transliterationText}>{doa.tr}</Text>
          <Text style={styles.translationText}>"{doa.idn}"</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Tentang Doa</Text>
          <Text style={styles.descriptionText}>{doa.tentang || "Tidak ada deskripsi tambahan."}</Text>
          
          <Text style={styles.sectionTitle}>Tag</Text>
          <View style={styles.tagContainer}>
            {doa.tag.map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#00a88cff",
    fontWeight: "500",
  },
  headerCard: {
    backgroundColor: "#00a88cff",
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  idBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  idText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  titleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  arabicText: {
    fontSize: 28,
    textAlign: "right",
    lineHeight: 45,
    color: "#333",
    marginBottom: 20,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  transliterationText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#00a88cff",
    marginBottom: 10,
    lineHeight: 24,
  },
  translationText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  infoSection: {
    paddingHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "justify",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tagBadge: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#00a88cff",
  },
  tagText: {
    color: "#00a88cff",
    fontSize: 12,
    fontWeight: "600",
  },
});