import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday',
];

export default function RestaurantTimingModal({ visible, onClose, onSave }) {
  const [timings, setTimings] = useState(
    daysOfWeek.map(day => ({
      day,
      isOpen: false,
      is24Hours: false,
      from: '',
      to: '',
    }))
  );

  const [showTimePicker, setShowTimePicker] = useState({
    show: false,
    index: null,
    type: null,
  });

  const handleTimeChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowTimePicker({ show: false, index: null, type: null });
      return;
    }

    const date = selectedDate || new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formatted =
      Platform.OS === 'ios'
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : `${(hour % 12 || 12)
            .toString()
            .padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${
            hour >= 12 ? 'PM' : 'AM'
          }`;

    const updated = [...timings];
    updated[showTimePicker.index][showTimePicker.type] = formatted;
    setTimings(updated);
    setShowTimePicker({ show: false, index: null, type: null });
  };

  const handleSave = () => {
    const formatted = {};

    timings.forEach(item => {
      formatted[item.day] = item.isOpen
        ? item.is24Hours
          ? { from: '00:00', to: '23:59' }
          : {
              from: item.from || '00:00',
              to: item.to || '00:00',
            }
        : {
            from: 'Closed',
            to: 'Closed',
          };
    });

    onSave(formatted);
    onClose();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 12,
              width: '90%',
              maxHeight: '85%',
            }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Select Opening Times
            </Text>

            <ScrollView>
              {timings.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    paddingBottom: 10,
                  }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.day}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ marginRight: 10 }}>Open:</Text>
                    <Switch
                      value={item.isOpen}
                      onValueChange={value => {
                        const updated = [...timings];
                        updated[index].isOpen = value;
                        setTimings(updated);
                      }}
                    />
                  </View>

                  {item.isOpen && (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ marginRight: 10 }}>24 Hours:</Text>
                        <Switch
                          value={item.is24Hours}
                          onValueChange={value => {
                            const updated = [...timings];
                            updated[index].is24Hours = value;
                            if (value) {
                              updated[index].from = '00:00';
                              updated[index].to = '23:59';
                            } else {
                              updated[index].from = '';
                              updated[index].to = '';
                            }
                            setTimings(updated);
                          }}
                        />
                      </View>

                      {!item.is24Hours && (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <TouchableOpacity
                            onPress={() =>
                              setShowTimePicker({ show: true, index, type: 'from' })
                            }
                            style={{
                              flex: 1,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 6,
                              padding: 10,
                              alignItems: 'center',
                            }}>
                            <Text>{item.from || 'From'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              setShowTimePicker({ show: true, index, type: 'to' })
                            }
                            style={{
                              flex: 1,
                              borderWidth: 1,
                              borderColor: '#ccc',
                              borderRadius: 6,
                              padding: 10,
                              alignItems: 'center',
                            }}>
                            <Text>{item.to || 'To'}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: '#FF4D4D',
                padding: 12,
                marginTop: 10,
                borderRadius: 8,
              }}
              onPress={handleSave}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Save & Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showTimePicker.show && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={false} // ✅ This enables AM/PM mode
          onChange={handleTimeChange}
        />
      )}
    </>
  );
}