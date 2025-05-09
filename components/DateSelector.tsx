import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

export interface DatePickerProps {
  value?: any;
  mode: any;
  display: any;
  onChange: any;
  handleConfirm: any;
  handleCancel: any;
}


const DateSelector = (props: DatePickerProps) => {

   const {
    value,
    mode:selectedMode,
    display: selectedDisplay,
    onChange,
    handleConfirm,
    handleCancel,
    ...restProps
  } = props;

  const display = Platform.OS === 'ios' ? 'spinner' : 'spinner'  // force wheel everywhere


  return (
    <View className='flex'>
      <View className='flex '>

         <View className='bg-white rounded-lg mb-4'>
          <DateTimePicker
              value={value}
              mode={selectedMode}
              display={selectedDisplay}
              onChange={onChange}
              minimumDate={new Date(1950, 0, 1)} // Jan 1, 1950
              maximumDate={new Date(2008, 11, 31)} // Dec 31, 2008
          />
          <TouchableOpacity onPress={handleConfirm} className='w-full h-[55px] bg-white justify-center items-center rounded-lg'>
            <Text className='font-medium text-secondary'>Confirm</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className='w-full h-[55px] bg-white justify-center items-center rounded-lg' onPress={handleCancel}>
          <Text className='font-bold text-secondary'>Cancel</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default DateSelector