import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "../../constants/colors";

export default function PomodoroScreen() {
  // Default times
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(15 * 60);
  const [time, setTime] = useState(focusDuration);

  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customFocus, setCustomFocus] = useState("");
  const [customBreak, setCustomBreak] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const maxTime = isBreak ? breakDuration : focusDuration;
  const progress = time / maxTime; // progress based on remaining time
  const strokeDashoffset = circumference * (1 - progress);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startPause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const restart = () => {
    clearInterval(intervalRef.current!);
    setTime(isBreak ? breakDuration : focusDuration);
    setIsRunning(false);
  };

  const saveCustomTimes = () => {
    const focusMinutes = parseInt(customFocus);
    const breakMinutes = parseInt(customBreak);

    if (!isNaN(focusMinutes) && focusMinutes > 0) {
      setFocusDuration(focusMinutes * 60);
      if (!isBreak) setTime(focusMinutes * 60);
    }

    if (!isNaN(breakMinutes) && breakMinutes > 0) {
      setBreakDuration(breakMinutes * 60);
      if (isBreak) setTime(breakMinutes * 60);
    }

    setModalVisible(false);
    setIsRunning(false);
    clearInterval(intervalRef.current!);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            // Switch between Focus and Break
            if (isBreak) {
              setIsBreak(false);
              return focusDuration;
            } else {
              setIsBreak(true);
              return breakDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, isBreak, focusDuration, breakDuration]);

  return (
    <View style={styles.container}>
      {/* Circle Timer */}
      <View style={styles.timerWrapper}>
        <Svg height="300" width="300">
          <Circle
            cx="150"
            cy="150"
            r={radius}
            stroke="#ddd"
            strokeWidth="25"
            fill="none"
          />
          <Circle
            cx="150"
            cy="150"
            r={radius}
            stroke={isBreak ? Colors.accent : Colors.primary}
            strokeWidth="22"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90} // <--- Rotates the circle
            originX="150" // <--- Pivot at circle center
            originY="150" // <--- Pivot at circle center
          />
        </Svg>
        <View style={styles.timerTextWrapper}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
          <Text style={styles.modeText}>{isBreak ? "Break" : "Focus"}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={restart}>
          <Ionicons name="refresh" size={32} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={startPause}>
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={48}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Edit Time Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Timer (minutes)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Focus time"
              value={customFocus}
              onChangeText={setCustomFocus}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Break time"
              value={customBreak}
              onChangeText={setCustomBreak}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveCustomTimes}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  timerWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  timerTextWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: { fontSize: 48, fontWeight: "bold", color: Colors.text },
  modeText: { fontSize: 20, color: "#666", marginTop: 8 },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-between",
    width: "80%",
  },
  controlButton: { alignItems: "center" },
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
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: "100%",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  saveButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 10, alignSelf: "center" },
});
