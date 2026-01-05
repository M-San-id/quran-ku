import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
  audioFull: object;
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
      .catch((err) => console.error("Error:", err));
  }, []);

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
      {surat.map((surat) => (
        <Pressable
          key={surat.nomor}
          style={{
            padding: 20,
            width: "100%",
            height: 100,
          }}
          onPress={() =>
            router.navigate({
              pathname: "/surat{id}",
            })
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
              <Feather name="book-open" size={22} color="black" /> {surat.nama}
            </Text>
            <Text>{surat.jumlahAyat} ayat</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>
              {surat.nomor}. {surat.namaLatin}
            </Text>
            <FontAwesome name="angle-right" size={34} color="black" />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
