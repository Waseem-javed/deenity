import { HomeMenu } from "@/constants/data";
import React from "react";
import { FlatList, Text, View } from "react-native";

const OtherList = () => {
  return (
    <View>
      <FlatList
        data={HomeMenu}
        keyExtractor={(item) => item.type.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default OtherList;
