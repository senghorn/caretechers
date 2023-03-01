import {StyleSheet, Text, View} from 'react-native';
import {Dimensions} from 'react-native';
import {LineChart} from "react-native-chart-kit";
import { Button } from 'react-native-paper';

export default function Graph({id, title, units, labels, data, navigation, getGraphs}) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      }
    ],
    legend: [`${units}`]
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    decimalPlaces: 0,
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#2D78E9",
    backgroundGradientTo: "#add8e6",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Button
          mode="contained"
          color="#2196f3"
          icon="pencil-outline"
          style={styles.button}
          onPress={() => navigation.navigate('EditGraph', { id, units, title, getGraphs })}
        >Edit</Button>
      </View>

      <LineChart
      data={chartData}
      width={Dimensions.get("window").width - 20}
      height={Dimensions.get("window").height / 3}
      withShadow='false'
      chartConfig={chartConfig}
      style={styles.graph}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16
  },
  titleBar: {
    width: Dimensions.get('window').width - 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '20%'
  },
  button: {
    alignSelf: 'center'
  }
});