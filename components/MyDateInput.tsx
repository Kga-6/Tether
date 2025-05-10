import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface DatePickerProps {
  containerClassName?: string;
  text?: string;
  headingText?: string;
  labelClassName?: string;
  inputWrapperClassName?: string; 
  textInputClassName?: string; 
  icon?: React.ReactNode;
  dateStatus: Date | null
  visible: boolean;
  onConfirm: () => void;
  onShow: () => void;
  onHide: () => void;
  iconContainerClassName?: string;
  focusBorderClassName?: string;
}

const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const minDate = new Date(maxDate.getFullYear() - 100, maxDate.getMonth(), maxDate.getDate());

const MyTextInput = (props: DatePickerProps) => {

  const {
    containerClassName = "w-full mb-3", // Default container styling
    text,
    headingText,
    labelClassName = "mb-1 text-sm text-gray-700",
    inputWrapperClassName = "flex-row  border-2 border-gray-300 rounded-xl bg-white", // Base wrapper style
    textInputClassName = "flex-1 text-center py-3 px-4 text-base text-gray-900", // Base text input style
    icon,
    dateStatus,
    visible,
    onConfirm,
    onShow,
    onHide,
    focusBorderClassName = "border-blue-600",
    iconContainerClassName = "pl-3", // Padding for the icon container
    
    ...restProps
  } = props;

  const formatted = dateStatus ? dateStatus.toLocaleDateString() : 'Select date'

  let finalWrapperClasses = inputWrapperClassName;
  if(visible){
    finalWrapperClasses = `${inputWrapperClassName} ${focusBorderClassName}`;
  }else{
    finalWrapperClasses = inputWrapperClassName;
  }

  return (
    <View className={containerClassName}> 

      <Text className='text-lg mb-2 mx-3 text-accent-100'>{headingText}</Text>

      <View className='flex text-center'>

        <TouchableOpacity
                activeOpacity={0.8}
                onPress={onShow}
                className={inputWrapperClassName}
            >
            <Text
                className={formatted == "Select date" ? textInputClassName + " text-accent-400" : textInputClassName }
                {...restProps} // Pass down other TextInput props (onChangeText, placeholder, etc.)
            >
                {formatted}
                
            </Text>
        </TouchableOpacity>
        
        <View>
          <DateTimePickerModal
              isVisible={visible}
              mode="date"
              date={dateStatus || new Date()}
              onConfirm={onConfirm}
              onCancel={onHide}
              minimumDate={minDate}
              maximumDate={maxDate}
          />
        </View>

      </View>
      
    </View>
  )
}


export default MyTextInput
