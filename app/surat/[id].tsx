import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
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
        [type]: !prev[ayatNumber]?.[type] || false,
      },
    }));
  };

  useEffect(() => {
    axios
      .get(`https://equran.id/api/v2/surat/${id}`)
      .then((res) => {
        setSurat(res.data.data);
        setAyat(res.data.data.ayat);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`https://equran.id/api/v2/tafsir/${id}`)
      .then((res) => {
        setTafsir(res.data.data.tafsir);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Memuat data...</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <View
        style={{
          height: 100,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#46C9B0",
        }}
      >
        <Text style={{ fontSize: 28 }}>{surat?.nama}</Text>
        <Text style={{ fontSize: 16 }}>{surat?.namaLatin}</Text>
      </View>
      {ayat.map((ayat) => (
        <View
          key={ayat.nomorAyat}
          style={{
            padding: 20,
            flex: 1,
          }}
        >
          <View>
            <View
              style={{
                backgroundColor: "#46C9B0",
                width: 30,
                height: 30,
                borderRadius: 50,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{ayat.nomorAyat}</Text>
            </View>
            <Text style={{ fontSize: 28, textAlign: "right" }}>
              {ayat.teksArab}
            </Text>

            <View
              style={{
                backgroundColor: "#46c9b145",
                padding: 10,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                {ayat.teksLatin}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => toggleExpanded(ayat.nomorAyat, "arti")}
              style={{
                backgroundColor: "#46C9B0",
                padding: 10,
                borderRadius: 15,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
              >
                Arti
              </Text>
              <Text style={{ color: "white" }}>
                {expanded[ayat.nomorAyat]?.arti ? "-" : "+"}
              </Text>
            </TouchableOpacity>
            {expanded[ayat.nomorAyat]?.arti && (
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 15,
                  marginTop: 5,
                }}
              >
                <Text style={{ textAlign: "justify", fontSize: 16 }}>
                  {ayat.teksIndonesia}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => toggleExpanded(ayat.nomorAyat, "tafsir")}
              style={{
                backgroundColor: "#46C9B0",
                padding: 10,
                borderRadius: 15,
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
              >
                Tafsir
              </Text>
              <Text style={{ color: "white" }}>
                {expanded[ayat.nomorAyat]?.tafsir ? "-" : "+"}
              </Text>
            </TouchableOpacity>
            {expanded[ayat.nomorAyat]?.tafsir && (
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 15,
                  marginTop: 5,
                }}
              >
                <Text style={{ textAlign: "justify", fontSize: 16 }}>
                  {tafsir.find((t) => t.ayat === ayat.nomorAyat)?.teks ||
                    "Tafsir tidak tersedia"}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
