import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import colors from './constants/colors';
import { Asset } from 'expo-asset';

export default function App() {
  const [imagesLoaded] = useImages([
    require('./assets/abstract_background.jpg'),
    require('./assets/caretaker.png'),
    require('./assets/blue-background.jpg'),
  ]);

  return (
    <NavigationContainer>
      <Navigation />
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
});

function useImages(images) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    Asset.loadAsync(images)
      .then(() => setLoaded(true))
      .catch(setError);
  }, []);

  return [loaded, error];
}
