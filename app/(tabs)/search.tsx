import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HasilData {
  id_surat?: number;
  nama_surat?: string;
  nama_surat_arab?: string;
  nomor_ayat?: number;
  isi?: string;
  teks_arab?: string;
  teks_latin?: string;
  terjemahan_id?: string;
  judul?: string;
  terjemahan?: string;
  sumber?: string;
  catatan?: string;
}

interface HasilPencarian {
  tipe: "ayat" | "tafsir" | "doa";
  relevansi: string;
  data: HasilData;
}

interface ApiResponse {
  status: string;
  hasil: HasilPencarian[];
  jumlah: number;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<HasilPencarian[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<boolean[]>([]);

  const exampleQueries = [
    "ayat tentang sabar",
    "doa untuk kesuksesan",
    "ayat tentang ilmu pengetahuan",
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError("Masukkan kata kunci pencarian");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("https://equran.id/api/vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cari: query,
          tipe: ["ayat", "tafsir", "doa"],
          skorMin: 0.5,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.status === "sukses" && data.hasil) {
        setResults(data.hasil);
        setExpanded(new Array(data.hasil.length).fill(false));
        if (data.hasil.length === 0) {
          setError("Tidak ada hasil ditemukan");
        }
      } else {
        setError("Terjadi kesalahan saat mencari");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ayat":
        return "#10b981";
      case "tafsir":
        return "#3b82f6";
      case "doa":
        return "#f59e0b";
    }
  };

  const renderAyat = (data: HasilData) => (
    <View style={styles.contentWrapper}>
      <View style={styles.info}>
        <Text style={styles.label}>Surat:</Text>
        <Text style={styles.value}>
          {data.nama_surat} ({data.nomor_ayat})
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.textArab}>{data.teks_arab}</Text>
      <Text style={styles.textLatin}>{data.teks_latin}</Text>
      <View style={styles.translationContainer}>
        <Text style={styles.terjemahanText}>{data.terjemahan_id}</Text>
      </View>
    </View>
  );

  const renderTafsir = (data: HasilData) => (
    <View style={styles.contentWrapper}>
      <View style={styles.info}>
        <Text style={styles.label}>Tafsir:</Text>
        <Text style={styles.value}>
          {data.nama_surat} ayat {data.nomor_ayat}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.tafsirContainer}>
        <Text style={styles.sectionLabel}>ISI TAFSIR:</Text>
        <Text style={styles.tafsirText}>{data.isi}</Text>
      </View>
    </View>
  );

  const renderDoa = (data: HasilData) => (
    <View style={styles.contentWrapper}>
      <Text style={styles.doaTitle}>{data.judul}</Text>
      <View style={styles.divider} />
      <Text style={styles.textArab}>{data.teks_arab}</Text>
      <Text style={styles.textLatin}>{data.teks_latin}</Text>
      <View style={styles.translationContainer}>
        <Text style={styles.artiText}>"{data.terjemahan}"</Text>
      </View>
      <View style={styles.doaContainer}>
        {data.sumber && (
          <View style={styles.doaRow}>
            <Feather name="book" size={12} color="#6b7280" />
            <Text style={styles.doaText}>Sumber: {data.sumber}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderHasil = (item: HasilPencarian, index: number) => {
    const isExpanded = expanded[index];
    const color = getTypeColor(item.tipe);
    const { data } = item;

    let titleHeader = "";
    let previewText = "";
    let contentToRender = null;

    switch (item.tipe) {
      case "ayat":
        titleHeader = `QS. ${data.nama_surat}: ${data.nomor_ayat}`;
        previewText = data.terjemahan_id || "";
        contentToRender = renderAyat(data);
        break;
      case "tafsir":
        titleHeader = `Tafsir ${data.nama_surat}: ${data.nomor_ayat}`;
        previewText = data.isi || "";
        contentToRender = renderTafsir(data);
        break;
      case "doa":
        titleHeader = data.judul || "Doa";
        previewText = data.terjemahan || "";
        contentToRender = renderDoa(data);
        break;
    }

    return (
      <View key={index} style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={[styles.typeBadge, { backgroundColor: color }]}>
            <Text style={styles.typeText}>{item.tipe.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => toggleExpanded(index)}>
          <View style={styles.accordionHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitleText}>{titleHeader}</Text>
              {!isExpanded && (
                <Text style={styles.previewText} numberOfLines={2}>
                  {previewText}
                </Text>
              )}
            </View>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#9ca3af"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.accordionContent}>{contentToRender}</View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            <Feather name="book-open" size={24} color="white" /> {""}
            QuranKu
          </Text>
          <Text style={styles.headerSubtitle}>Pencarian</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari sesuatu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(searchQuery)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Feather name="search" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>
            Masukkan setidaknya 2 kosakata untuk hasil yang akurat.
          </Text>
          <Text style={styles.examplesTitle}>Contoh:</Text>
          <View style={styles.examplesWrapper}>
            {exampleQueries.map((query, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleChip}
                onPress={() => {
                  setSearchQuery(query);
                  handleSearch(query);
                }}
              >
                <Text style={styles.exampleText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.resultsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={18} color="#dc2626" />
              <Text style={styles.errorText}>
                Error... Coba Lagi Beberapa Saat...
              </Text>
            </View>
          ) : null}

          {results.length > 0 && (
            <Text style={styles.resultsTitle}>
              Ditemukan {results.length} hasil
            </Text>
          )}
          {results.map((item, index) => renderHasil(item, index))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafa",
  },
  scrollView: {
    flex: 1,
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
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: -25,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#00a88c",
    width: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  examplesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  examplesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 8,
  },
  examplesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exampleChip: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00a88c",
  },
  exampleText: {
    fontSize: 12,
    color: "#00a88c",
    fontWeight: "500",
  },

  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  previewText: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
  },
  accordionContent: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 10,
  },
  contentWrapper: { gap: 10 },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  value: {
    fontSize: 12,
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  textArab: {
    fontSize: 24,
    color: "#1f2937",
    textAlign: "right",
    lineHeight: 45,
  },
  textLatin: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#00a88c",
  },
  translationContainer: {
    borderLeftWidth: 3,
    borderLeftColor: "#00a88c",
    paddingLeft: 12,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  terjemahanText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
  },
  tafsirContainer: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 4,
  },
  tafsirText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 24,
    textAlign: "justify",
  },
  doaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00a88c",
    textAlign: "center",
  },
  artiText: {
    fontSize: 14,
    color: "#4b5563",
    fontStyle: "italic",
  },
  doaContainer: {
    marginTop: 12,
  },
  doaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  doaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
  },
});
