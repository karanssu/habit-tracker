import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as api from "../lib/api";

type Habit = { id: string; name: string; emoji: string; doneToday: boolean; streak: number };

export function HabitsScreen({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { habits } = await api.getHabits(token);
    setHabits(habits);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(id: string) {
    // optimistic update, then reconcile with the server response
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, doneToday: !h.doneToday } : h))
    );
    const result = await api.toggleHabit(token, id);
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...result } : h))
    );
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    await api.createHabit(token, newName.trim(), "✅");
    setNewName("");
    load();
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("token");
    onLogout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your habits</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          placeholder="New habit"
          value={newName}
          onChangeText={setNewName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await load();
          setRefreshing(false);
        }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.habitRow} onPress={() => handleToggle(item.id)}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.streak}>
                {item.streak > 0 ? `🔥 ${item.streak} day streak` : "No streak yet"}
              </Text>
            </View>
            <View style={[styles.badge, item.doneToday && styles.badgeDone]}>
              <Text style={item.doneToday ? styles.badgeTextDone : styles.badgeText}>
                {item.doneToday ? "Done" : "Todo"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No habits yet — add one above.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 60, paddingHorizontal: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "600" },
  logout: { color: "#64748b", textDecorationLine: "underline" },
  addRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  addInput: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10 },
  addButton: { backgroundColor: "#0f172a", borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  addButtonText: { color: "white", fontWeight: "600" },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  emoji: { fontSize: 24 },
  habitName: { fontSize: 16, fontWeight: "500" },
  streak: { color: "#64748b", fontSize: 13, marginTop: 2 },
  badge: { backgroundColor: "#e2e8f0", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  badgeDone: { backgroundColor: "#16a34a" },
  badgeText: { color: "#334155", fontSize: 12, fontWeight: "600" },
  badgeTextDone: { color: "white", fontSize: 12, fontWeight: "600" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
