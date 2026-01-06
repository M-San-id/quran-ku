import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}

interface Tafsir {
  ayat: number;
  teks: string;
}

interface Surat {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
}

export default function SuratDetail() {
  const { id } = useLocalSearchParams();
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const [tafsir, setTafsir] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  const [surat, setSurat] = useState<Surat | null>(null);
  const [expanded, setExpanded] = useState<{
    [key: number]: { arti: boolean; tafsir: boolean };
  }>({});

  const toggleExpanded = (ayatNumber: number, type: "arti" | "tafsir") => {
    setExpanded((prev) => ({
      ...prev,
      [ayatNumber]: {
        ...prev[ayatNumber],
        [type]: !prev[ayatNumber]?.[type],
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSurat = await axios.get(
          `https://equran.id/api/v2/surat/${id}`
        );
        const resTafsir = await axios.get(
          `https://equran.id/api/v2/tafsir/${id}`
        );

        setSurat(resSurat.data.data);
        setAyat(resSurat.data.data.ayat);
        setTafsir(resTafsir.data.data.tafsir);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00a88cff" />
        <Text style={styles.loadingText}>Memuat ayat-ayat...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.headerCard}>
        <Text style={styles.headerArabic}>{surat?.nama}</Text>
        <Text style={styles.headerLatin}>{surat?.namaLatin}</Text>
        <Text style={styles.headerInfo}>
          {surat?.arti} • {surat?.jumlahAyat} Ayat
        </Text>
      </View>

      <View style={styles.listContainer}>
        {ayat.map((item) => (
          <View key={item.nomorAyat} style={styles.ayatItem}>
            <View style={styles.ayatHeader}>
              <View style={styles.ayatNumberBadge}>
                <Text style={styles.ayatNumberText}>{item.nomorAyat}</Text>
              </View>
            </View>

            <Text style={styles.arabicText}>{item.teksArab}</Text>

            <View style={styles.latinContainer}>
              <Text style={styles.latinText}>{item.teksLatin}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => toggleExpanded(item.nomorAyat, "arti")}
                style={[
                  styles.actionButton,
                  expanded[item.nomorAyat]?.arti && styles.activeButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    expanded[item.nomorAyat]?.arti && styles.activeButtonText,
                  ]}
                >
                  Terjemahan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleExpanded(item.nomorAyat, "tafsir")}
                style={[
                  styles.actionButton,
                  expanded[item.nomorAyat]?.tafsir && styles.activeButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    expanded[item.nomorAyat]?.tafsir && styles.activeButtonText,
                  ]}
                >
                  Tafsir
                </Text>
              </TouchableOpacity>
            </View>

            {expanded[item.nomorAyat]?.arti && (
              <View style={styles.expandableBox}>
                <Text style={styles.translationText}>{item.teksIndonesia}</Text>
              </View>
            )}

            {expanded[item.nomorAyat]?.tafsir && (
              <View
                style={[styles.expandableBox, { backgroundColor: "#e0f2f1" }]}
              >
                <Text style={styles.sectionLabel}>Tafsir Ringkas:</Text>
                <Text style={styles.tafsirText}>
                  {tafsir.find((t) => t.ayat === item.nomorAyat)?.teks ||
                    "Tafsir tidak tersedia"}
                </Text>
              </View>
            )}

            <View style={styles.divider} />
          </View>
        ))}
      </View>
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
  },
  headerCard: {
    backgroundColor: "#00a88cff",
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
  },
  headerArabic: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerLatin: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  headerInfo: {
    fontSize: 13,
    color: "#e0f2f1",
    marginTop: 5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  listContainer: {
    padding: 15,
  },
  ayatItem: {
    marginBottom: 20,
  },
  ayatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  ayatNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#00a88cff",
    justifyContent: "center",
    alignItems: "center",
  },
  ayatNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  ayatActions: {
    flexDirection: "row",
  },
  arabicText: {
    fontSize: 26,
    textAlign: "right",
    lineHeight: 50,
    color: "#222",
    marginBottom: 15,
    fontWeight: "500",
  },
  latinContainer: {
    borderLeftWidth: 3,
    borderLeftColor: "#00a88cff",
    paddingLeft: 12,
    marginBottom: 15,
  },
  latinText: {
    fontSize: 14,
    color: "#00a88cff",
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00a88cff",
  },
  activeButton: {
    backgroundColor: "#00a88cff",
  },
  actionButtonText: {
    color: "#00a88cff",
    fontSize: 12,
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#fff",
  },
  expandableBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  translationText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "justify",
  },
  sectionLabel: {
    fontWeight: "bold",
    color: "#00a88cff",
    marginBottom: 5,
    fontSize: 13,
  },
  tafsirText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 25,
  },
});
