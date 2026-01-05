import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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

const surat = () => {
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const [tafsir, setTafsir] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`https://equran.id/api/v2/surat/{id}`)
      .then((res) => {
        setAyat(res.data.ayat);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);
  useEffect(() => {
    axios
      .get(`https://equran.id/api/v2/tafsir/{id}`)
      .then((res) => {
        setTafsir(res.data.tafsir);
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
    <View>
      <Text>surat</Text>
    </View>
  );
};

export default surat;
