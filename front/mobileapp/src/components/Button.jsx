import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";


const Button = (props) => {
  const { onPress, title, buttonStyle, textStyle, children } = props;

  return (
    <TouchableOpacity
      testID="button"
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      {children}
      {title ? (
        <Text testID="button-text" style={[styles.text, textStyle]}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    paddingTop: 2,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Button;
