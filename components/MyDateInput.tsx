import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateSelector from './DateSelector';

export interface DatePickerProps {
  containerClassName?: string;
  text?: string;
  headingText?: string;
  labelClassName?: string;
  inputWrapperClassName?: string; 
  textInputClassName?: string; 
  icon?: React.ReactNode;
  date: Date | null
  onDateChange: (date: Date) => void
  iconContainerClassName?: string;
}


const MyTextInput = (props: DatePickerProps) => {

  const {
    containerClassName = "w-full mb-3", // Default container styling
    text,
    headingText,
    labelClassName = "mb-1 text-sm text-gray-700",
    inputWrapperClassName = "flex-row  border-2 border-gray-300 rounded-xl bg-white", // Base wrapper style
    textInputClassName = "flex-1 text-center py-3 px-4 text-base text-gray-900", // Base text input style
    icon,
    date,
    onDateChange,
    iconContainerClassName = "pl-3", // Padding for the icon container
    ...restProps
  } = props;

  const display = Platform.OS === 'ios' ? 'spinner' : 'spinner'  // force wheel everywhere
  const [show, setShow] = useState(false)
  const [currentDate,setCurrentDate] = useState<Date | undefined>()
  const formatted = date ? date.toLocaleDateString() : 'Select date'

  const showSelector = () => {
    setShow(true)
  }

  const handleConfirm = () => {
    setShow(false)
    if(currentDate){
        onDateChange(currentDate)
    }
  }
  const handleCancel = () => {
    setShow(false)

  }

  const onChange = (_: any, selected?: Date) => {
    setShow(Platform.OS === 'ios')
    console.log(selected)
    setCurrentDate(selected)
  }

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index:any ) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <View className={containerClassName}> 

      <Text className='text-lg mb-2 mx-3 text-accent-100'>{headingText}</Text>

      <View className='flex text-center'>

        <TouchableOpacity
                activeOpacity={0.8}
                onPress={showSelector}
                className={inputWrapperClassName}
            >
            <Text
                className={textInputClassName}
                {...restProps} // Pass down other TextInput props (onChangeText, placeholder, etc.)
            >
                {formatted}
                
            </Text>
        </TouchableOpacity>
        
        {show && ( 
            <DateSelector
                value={currentDate || new Date()}
                mode="date"
                display={display}
                onChange={onChange}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
            />
        )}

      </View>
      
    </View>
  )
}


export default MyTextInput
