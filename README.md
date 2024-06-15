# She-Shield-Shecodes2024-
# Women Safety Wearable Band Device

## Introduction
The Women Safety Wearable Band is an innovative device designed to enhance personal safety for women. It features live video streaming, location tracking, and an SOS alert system. The device is built using an ESP32-CAM for video streaming, a GPS NEO-6M for location tracking, a GSM module for sending SOS alerts, and an Arduino ESP32 for overall control and integration.

## Features
- **Live Video Streaming:** Real-time video feed using ESP32-CAM.
- **Location Tracking:** Continuous GPS tracking using the NEO-6M module.
- **SOS Alert:** Emergency alerts sent via GSM module.

## Components
- **ESP32-CAM:** For capturing and streaming live video.
- **GPS NEO-6M:** For accurate location tracking.
- **GSM Module:** For sending SMS alerts in emergency situations.
- **Arduino ESP32:** For integrating and controlling all components.

## Requirements
- ESP32-CAM
- GPS NEO-6M
- GSM Module (e.g., SIM800L)
- Arduino ESP32
- velcro band and Jumper Wires
- Power Supply (Battery or USB)
- Female/Male Headers (optional for easy connections)
- Additional sensors (e.g., accelerometer for fall detection)

## Setup and Installation

### Hardware Connections
1. **ESP32-CAM:**
    - Connect the ESP32-CAM to the Arduino ESP32 via serial communication (TX, RX).
2. **GPS NEO-6M:**
    - Connect the GPS module to the Arduino ESP32 (TX to RX, RX to TX, VCC to 3.3V/5V, GND to GND).
3. **GSM Module:**
    - Connect the GSM module to the Arduino ESP32 (TX to RX, RX to TX, VCC to 3.3V/5V, GND to GND).

### Software Setup
1. **Arduino IDE:**
    - Install the latest version of Arduino IDE from [here](https://www.arduino.cc/en/software).
    - Add ESP32 board support in Arduino IDE (go to File > Preferences and add `https://dl.espressif.com/dl/package_esp32_index.json` to Additional Board Manager URLs).

2. **Libraries:**
    - Install necessary libraries for GPS, GSM, and ESP32-CAM:
      - `TinyGPS++` for GPS
      - `ESP32` for ESP32-CAM
      - `SoftwareSerial` for serial communication with GSM module


