import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/colors";

export default function HomeScreen() {
  const { username, avatar } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<"daily" | "weekly">("daily");
  const [tasks, setTasks] = useState<
    { id: string; text: string; completed: boolean }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSaveTask = () => {
    if (!currentTask.trim())
      return Alert.alert("Error", "Task cannot be empty");
    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId ? { ...t, text: currentTask } : t
        )
      );
      setEditingTaskId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        { id: Date.now().toString(), text: currentTask, completed: false },
      ]);
    }
    setCurrentTask("");
    setModalVisible(false);
  };

  const handleEditTask = (id: string, text: string) => {
    setEditingTaskId(id);
    setCurrentTask(text);
    setModalVisible(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            avatar
              ? { uri: avatar as string }
              : require("../../assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hello, {username || "Guest"}!</Text>
      </View>

      {/* Tabs for Daily/Weekly */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "daily" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("daily")}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={selectedTab === "daily" ? Colors.white : Colors.text}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "daily" && { color: Colors.white },
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "weekly" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("weekly")}
        >
          <Ionicons
            name="calendar-sharp"
            size={20}
            color={selectedTab === "weekly" ? Colors.white : Colors.text}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "weekly" && { color: Colors.white },
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <Ionicons
                name={
                  item.completed
                    ? "checkmark-circle"
                    : "checkmark-circle-outline"
                }
                size={24}
                color={item.completed ? Colors.primary : "#ccc"}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.taskText,
                item.completed && {
                  textDecorationLine: "line-through",
                  color: "#aaa",
                },
              ]}
            >
              {item.text}
            </Text>

            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => handleEditTask(item.id, item.text)}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Floating Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter task"
              value={currentTask}
              onChangeText={setCurrentTask}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveTask}
            >
              <Text style={styles.saveButtonText}>
                {editingTaskId ? "Update" : "Add"} Task
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "red", marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.accent,
    marginRight: 12,
  },
  greeting: { fontSize: 18, fontWeight: "bold", color: Colors.text },

  content: {
    flex: 1,
    marginHorizontal: 20, // <-- body content has margin
    marginTop: 20,
  },

  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ddd",
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { fontSize: 16, color: Colors.text, fontWeight: "600" },

  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  taskText: { fontSize: 16, flex: 1 },
  taskActions: { flexDirection: "row", gap: 15 },

  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },

  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  saveButton: { backgroundColor: Colors.primary, padding: 12, borderRadius: 8 },
  saveButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});
