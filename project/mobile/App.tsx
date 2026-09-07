import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { LoginScreen } from "./components/LoginScreen";
import { HabitsScreen } from "./components/HabitsScreen";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((stored) => {
      setToken(stored);
      setCheckingStorage(false);
    });
  }, []);

  if (checkingStorage) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {token ? (
        <HabitsScreen token={token} onLogout={() => setToken(null)} />
      ) : (
        <LoginScreen onLogin={setToken} />
      )}
    </>
  );
}
