
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface BottomSheetProps {
  containerClassName?: string;
  headingText?: string;
  optionText?: string;
  labelClassName?: string;
  inputWrapperClassName?: string; 
  textInputClassName?: string; 
  icon?: React.ReactNode;
  currentStatus: string | null;
  options: string[];
  visible: boolean;
  onChange: (value: string) => void;
  onShow: () => void;
  onHide: () => void;
  iconContainerClassName?: string;
  focusBorderClassName?: string;
}

const MyBottomSheet = (props: BottomSheetProps) => {

  const {
    containerClassName = "w-full mb-3", // Default container styling
    headingText,
    optionText,
    labelClassName = "mb-1 text-sm text-gray-700",
    inputWrapperClassName = "flex-row  border-2 border-gray-300 rounded-xl bg-white", // Base wrapper style
    textInputClassName = "flex-1 text-center py-3 px-4 text-base text-gray-900", // Base text input style
    icon,
    currentStatus,
    options,
    visible,
    onChange,
    onShow,
    onHide,
    focusBorderClassName = "border-blue-600",
    iconContainerClassName = "pl-3", // Padding for the icon container
    ...restProps
  } = props;

  const [display,setDisplay] = useState(currentStatus)
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSelectGender = (gender: string | null) => {
    onChange(gender)
    onHide()
    bottomSheetRef.current?.close();
  };

  const handleSelectShow = () => {
    onShow()
    bottomSheetRef.current?.expand();
  }

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.0101}
    />
  ), []);

  useEffect(()=>{
    if(currentStatus == null || currentStatus == ""){
        setDisplay("Select")
    }else{
        setDisplay(currentStatus)
    }

    console.log(currentStatus,display)
  }, [currentStatus])

  let finalWrapperClasses = inputWrapperClassName;

  if(visible){
    finalWrapperClasses = `${inputWrapperClassName} ${focusBorderClassName}`;
  }else{
    finalWrapperClasses = inputWrapperClassName;
  }

  return (
    <>
      
        <Text className='text-lg mb-2 mx-3 text-accent-100'>{headingText}</Text>

        <View className='flex text-center'>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSelectShow}
            className={inputWrapperClassName}
          >
            <Text
              className={display == "Select" ? textInputClassName + " text-accent-400" : textInputClassName}
              {...restProps} // Pass down other TextInput props (onChangeText, placeholder, etc.)
            >
              {display}
            </Text>
            {icon}
          </TouchableOpacity> 
          
        </View>

        <BottomSheet
          style={{ flex: 1 }}
          ref={bottomSheetRef}
          index={-1}
          backdropComponent={renderBackdrop}
          enableDynamicSizing={true}
        >
          <BottomSheetView className="p-6">
            <Text className='text-lg mb-4 mx-3 text-accent-100'>{optionText}</Text>
            {options.map((option:string) => (
              <TouchableOpacity
                className="justify-center align-middle border-b-2  h-[55px] border-accent-200"
                key={option}
                onPress={() => handleSelectGender(option)}
              >
                <Text className=" ml-4 text-accent-100 text-lg font-light">{option}</Text>
              </TouchableOpacity>
            ))}
          </BottomSheetView>
        </BottomSheet>
    </>
  )
}

export default MyBottomSheet
