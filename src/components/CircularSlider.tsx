import { useState } from "react";
import { View, Dimensions, Image, StyleSheet } from "react-native";
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const images = [
  require("../assets/img-alaska.jpg"),
  require("../assets/img-aurora.jpg"),
  require("../assets/img-brasil.jpg"),
  require("../assets/img-filipines.jpg"),
  require("../assets/img-japan.jpg"),
  require("../assets/img-norway.jpg"),
  require("../assets/img-ny.jpg"),
];

const { width } = Dimensions.get("screen");
const _itemSize = width * 0.24;
const _spacing = 12;
const _itemTotalSize = _itemSize + _spacing;

function CorouselItem({
  imageUri,
  index,
  scrollX,
}: {
  imageUri: string | any;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const styles = useAnimatedStyle(() => {
    return {
      borderWidth: 4,
      borderColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        ["transparent", "white", "transparent"]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [_itemSize / 3, 0, _itemSize / 3]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        },
        styles,
      ]}
    >
      <Image
        source={imageUri}
        style={{
          flex: 1,
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
        }}
      />
    </Animated.View>
  );
}

export function CircularSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = clamp(
      e.contentOffset.x / _itemTotalSize,
      0,
      images.length - 1
    );
    const newActiveIndex = Math.round(scrollX.value);

    if (activeIndex !== newActiveIndex) {
      runOnJS(setActiveIndex)(newActiveIndex);
    }
  });

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#000" }}
    >
      <View style={[StyleSheet.absoluteFillObject]}>
        <Animated.Image
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          key={`image-${activeIndex}`}
          source={images[activeIndex]}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      </View>
      <Animated.FlatList
        data={images}
        style={{ flexGrow: 0, height: _itemSize * 2 }}
        contentContainerStyle={{
          paddingHorizontal: (width - _itemSize) / 2,
          gap: _spacing,
        }}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => {
          return (
            <CorouselItem imageUri={item} index={index} scrollX={scrollX} />
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        //Scrolling
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
        snapToInterval={_itemTotalSize}
        decelerationRate={"fast"}
      />
    </View>
  );
}
