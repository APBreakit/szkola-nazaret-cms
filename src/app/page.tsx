import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Strona Główna - Katolicka Szkoła Podstawowa im. Świętej Rodziny Szkoła Nazaret",
  description:
    "Katolicka Szkoła Podstawowa parafialne w Gdyni z 34-letnim doświadczeniem. Wykwalifikowana kadra pedagogiczna, rodzinna atmosfera, edukacja katolicka. Zapisz ucznia już dziś!",
  alternates: {
    canonical: "https://szkołanazaret.pl",
  },
  openGraph: {
    title: "Katolicka Szkoła Podstawowa im. Świętej Rodziny - Szkoła Nazaret",
    description: "34 lata doświadczenia w wychowaniu uczniów w duchu wartości chrześcijańskich",
    url: "https://szkołanazaret.pl",
    type: "website",
  },
}

export default function Page() {
  return <ClientPage />
}
