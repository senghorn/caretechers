import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const FadeInView = (props) => {
  const opacityLowerBound = props.opacityLowerBound || 0;
  const fadeAnim = useRef(new Animated.Value(opacityLowerBound)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: opacityLowerBound,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
