import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

export default function Profilescreen() {
    return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <StatusBar hidden />
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ overflow: 'hidden' }}>
              <Image
                source={require('../../assets/images/resbg.png')}
                resizeMode="cover"
                style={{ height: 200, width: '100%' }}
              />
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                marginTop: -40,
                alignItems: 'center',
              }}
            >
              <View style={{ marginTop: -55 }}>
                <Image
                  source={
                       require('../../assets/images/profileicon.png')
                  }
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75,
                  }}
                />
              </View>

              {/* <TouchableOpacity
                // onPress={handleImagePick}
                style={{
                  backgroundColor: '#fff',
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  position: 'absolute',
                  top: 55,
                  right: 120,
                }}
              >
                <Image
                  source={require('../../assets/images/cameraicon.png')}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity> */}

              <View style={{ paddingVertical: 20, paddingHorizontal: 20, width: '100%' }}>
                <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>Full Name</Text>
                <TextInput
                //   value={name}
                //   onChangeText={setName}
                  placeholder="John"
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    width: '100%',
                    marginTop: 10,
                  }}
                />

                <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>
                  Enter Your Phone Number
                </Text>
                <TextInput
                //   value={phone}
                //   onChangeText={setPhone}
                  placeholder="+1234567890"
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    width: '100%',
                    marginTop: 10,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}