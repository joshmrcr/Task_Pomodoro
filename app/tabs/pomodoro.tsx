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
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(15 * 60);
  const [time, setTime] = useState(focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customFocus, setCustomFocus] = useState("");
  const [customBreak, setCustomBreak] = useState("");
  const [modeSelection, setModeSelection] = useState<"focus" | "break">(
    "focus"
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const maxTime = isBreak ? breakDuration : focusDuration;
  const progress = time / maxTime;
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

  const getEncouragement = () => {
    const percent = progress * 100;
    if (isBreak) {
      if (percent > 75) return "Relax, you deserve this!";
      if (percent > 50) return "Unwind and recharge.";
      if (percent > 25) return "Almost back to focus!";
      return "Get ready to crush it!";
    } else {
      if (percent > 75) return "You got this!";
      if (percent > 50) return "Keep going!";
      if (percent > 25) return "Halfway there!";
      return "Almost done!";
    }
  };

  const saveCustomTimes = () => {
    const focusMinutes = parseInt(customFocus);
    const breakMinutes = parseInt(customBreak);

    if (!isNaN(focusMinutes) && focusMinutes > 0)
      setFocusDuration(focusMinutes * 60);
    if (!isNaN(breakMinutes) && breakMinutes > 0)
      setBreakDuration(breakMinutes * 60);

    const newIsBreak = modeSelection === "break";
    setIsBreak(newIsBreak);
    setTime(
      newIsBreak
        ? breakMinutes
          ? breakMinutes * 60
          : breakDuration
        : focusMinutes
        ? focusMinutes * 60
        : focusDuration
    );

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
            stroke={isBreak ? Colors.primary : Colors.green}
            strokeWidth="22"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            originX="150"
            originY="150"
          />
        </Svg>
        <View style={styles.timerTextWrapper}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
          <Text style={styles.modeText}>{isBreak ? "Break" : "Focus"}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.encourageText}>{getEncouragement()}</Text>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.controlButton} onPress={restart}>
          <Ionicons name="refresh" size={32} color={Colors.secondary} />
        </TouchableOpacity>

        {/* Circular Play/Pause Button */}
        <TouchableOpacity
          style={[
            styles.playPauseButton,
            { backgroundColor: isBreak ? Colors.primary : Colors.green },
          ]}
          onPress={startPause}
        >
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={42}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            setModeSelection(isBreak ? "break" : "focus");
            setModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={32} color={Colors.secondary} />
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

            {/* Mode Switch */}
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchOption,
                  modeSelection === "focus" && styles.switchSelected,
                ]}
                onPress={() => setModeSelection("focus")}
              >
                <Text
                  style={[
                    styles.switchText,
                    modeSelection === "focus" && styles.switchTextSelected,
                  ]}
                >
                  Focus
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchOption,
                  modeSelection === "break" && styles.switchSelected,
                ]}
                onPress={() => setModeSelection("break")}
              >
                <Text
                  style={[
                    styles.switchText,
                    modeSelection === "break" && styles.switchTextSelected,
                  ]}
                >
                  Break
                </Text>
              </TouchableOpacity>
            </View>

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
    alignItems: "center",
  },
  controlButton: { alignItems: "center" },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  switchOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  switchSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  switchText: { color: "#333", fontWeight: "600" },
  switchTextSelected: { color: "#fff" },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  saveButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 10, alignSelf: "center" },
  encourageText: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
});
