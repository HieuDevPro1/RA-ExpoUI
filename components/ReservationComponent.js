import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Switch,
  Button,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import * as Calendar from "expo-calendar";
// import * as Permissions from "expo-permissions";

// class ModalContent extends Component {
//   render() {
//     return (
//       <View style={styles.modal}>
//         <Text style={styles.modalTitle}>Your Reservation</Text>
//         <Text style={styles.modalText}>Number of Guests: {this.props.guests}</Text>
//         <Text style={styles.modalText}>Smoking?: {this.props.smoking ? 'Yes' : 'No'}</Text>
//         <Text style={styles.modalText}>Date and Time: {format(this.props.date, 'dd/MM/yyyy - HH:mm')}</Text>
//         <Button title='Close' color='#7cc' onPress={() => this.props.onPressClose()} />
//       </View>
//     );
//   }
// }

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      showDatePicker: false,
      showModal: false,
      animationKey: 1,
    };
    this.focusListener = this.props.navigation.addListener("focus", () => {
      // Update the state to change the key and force re-render
      this.setState({ animationKey: this.state.animationKey + 1 });
    });
  }

  // obtainCalendarPermission = async () => {
  //   const { status } = await Calendar.requestCalendarPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert("Calendar permission not granted");
  //     return false;
  //   }
  //   return true;
  // };

  // getDefaultCalendarSource = async () => {
  //   if (Platform.OS === "android") {
  //     return { isLocalAccount: true, name: "Expo Calendar" };
  //   } else {
  //     const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  //     return defaultCalendar.source;
  //   }
  // };

  // addReservationToCalendar = async (date) => {
  //   const permissionGranted = await this.obtainCalendarPermission();
  //   if (!permissionGranted) return;

  //   const startDate = new Date(Date.parse(date));
  //   const endDate = new Date(Date.parse(date) + 2 * 60 * 60 * 1000);

  //   const defaultCalendarSource = await this.getDefaultCalendarSource();

  //   const newCalendarID = await Calendar.createCalendarAsync({
  //     title: "Expo Calendar",
  //     color: "blue",
  //     entityType: Calendar.EntityTypes.EVENT,
  //     sourceId: defaultCalendarSource.id,
  //     source: defaultCalendarSource,
  //     name: "internalCalendarName",
  //     ownerAccount: "personal",
  //     accessLevel: Calendar.CalendarAccessLevel.OWNER,
  //   });

  //   const eventDetails = {
  //     title: "Con Fusion Table Reservation",
  //     startDate,
  //     endDate,
  //     timeZone: "Asia/Hong_Kong",
  //     location:
  //       "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
  //   };

  //   try {
  //     await Calendar.createEventAsync(newCalendarID, eventDetails);
  //     console.log("Event created successfully");
  //   } catch (error) {
  //     console.log("Error creating event:", error);
  //   }
  // };

  render() {
    return (
      <ScrollView>
        <Animatable.View
          key={this.state.animationKey}
          animation="zoomIn"
          duration={2000}
          delay={1000}
        >
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(value) => this.setState({ guests: value })}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/No-Smoking?</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              onValueChange={(value) => this.setState({ smoking: value })}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <Icon
              name="schedule"
              size={36}
              onPress={() => this.setState({ showDatePicker: true })}
            />
            <Text style={{ marginLeft: 10 }}>
              {format(this.state.date, "dd/MM/yyyy - HH:mm")}
            </Text>
            <DateTimePickerModal
              mode="datetime"
              isVisible={this.state.showDatePicker}
              onConfirm={(date) =>
                this.setState({ date: date, showDatePicker: false })
              }
              onCancel={() => this.setState({ showDatePicker: false })}
            />
          </View>
          <View style={styles.formRow}>
            <Button
              title="Reserve"
              color="#7cc"
              onPress={() => this.handleReservation()}
            />
          </View>
        </Animatable.View>

        {/* <Modal animationType={'slide'} visible={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}>
            <ModalContent guests={this.state.guests} smoking={this.state.smoking} date={this.state.date}
              onPressClose={() => this.setState({ showModal: false })} />
          </Modal> */}
      </ScrollView>
    );
  }
  handleReservation() {
    Alert.alert(
      "Your Reservation OK?",
      "Number of Guests: " +
        this.state.guests +
        "\nSmoking? " +
        this.state.smoking +
        "\nDate and Time: " +
        this.state.date.toISOString(),
      [
        { text: "Cancel", onPress: () => this.resetForm() },
        {
          text: "OK",
          onPress: async () => {
            await this.addReservationToCalendar(this.state.date);
            this.presentLocalNotification(this.state.date);
            this.resetForm();
          },
        },
      ]
    );
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      showDatePicker: false,
    });
  }

  async presentLocalNotification(date) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Your Reservation",
          body: "Reservation for " + date + " requested",
          sound: true,
          vibrate: true,
        },
        trigger: null,
      });
    }
  }

  async addReservationToCalendar(date) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const defaultCalendarSource = {
        isLocalAccount: true,
        name: "Expo Calendar",
      };
      const newCalendarID = await Calendar.createCalendarAsync({
        title: "Expo Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "internalCalendarName",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      const eventId = await Calendar.createEventAsync(newCalendarID, {
        title: "Confusion Table Reservation",
        startDate: date,
        endDate: new Date(date.getTime() + 2 * 60 * 60 * 1000),
        timeZone: "Asia/Hong_Kong",
        location:
          "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
      });
      alert("Your new event ID is: " + eventId);
    }
  }
}

export default Reservation;

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: { fontSize: 18, flex: 2 },
  formItem: { flex: 1 },
  modal: { justifyContent: "center", margin: 20 },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#7cc",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: { fontSize: 18, margin: 10 },
});
