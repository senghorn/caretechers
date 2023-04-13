import { FlatList } from 'react-native-bidirectional-infinite-scroll';

import { addDays, subDays } from 'date-fns';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Day from './day';
import WeekLabel from './weekLabel';
import MonthLabel from './monthLabel';

export default function ScrollableScreen({
  renderingDataForFlatList,
  setRenderingDataForFlatList,
  createRenderingDataForFlatList,
  setCurrentDateDisplayed,
  navigation,
}) {
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentDateDisplayed(viewableItems[0].item.date);
    }
  };

  const renderFlatListDay = ({ item }) => <RenderDayFromData date={item.date} types={item.types} navigation={navigation} />;

  const [lock, setLock] = useState(false);

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);
  const flatListRef = useRef();
  return (
    <FlatList
      ref={flatListRef}
      refreshing={true}
      style={styles.scrollContainer}
      data={renderingDataForFlatList}
      renderItem={renderFlatListDay}
      keyExtractor={(item) => item.id}
      onEndReachedThreshold={4}
      onEndReached={() =>
        updateEndRendering(renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList)
      }
      onStartReachedThreshold={6}
      onStartReached={async () => {
        if (!lock) {
          setLock(true);
          await updateStartRendering(renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList);
          setLock(false);
        }
      }}
      showsVerticalScrollIndicator={false}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  );
}

function RenderDayFromData({ date, types, navigation }) {
  return (
    <View>
      {types.includes('month') && <MonthLabel date={date} />}
      {types.includes('week') && <WeekLabel date={date} />}
      {types.includes('day') && <Day date={date} navigation={navigation} />}
    </View>
  );
}

const updateStartRendering = (renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList) => {
  return new Promise((resolve) => {
    const firstDate = renderingDataForFlatList[0].date;
    const newFirstDate = subDays(firstDate, 4);
    const newDays = createRenderingDataForFlatList(newFirstDate, subDays(firstDate, 1));
    const renderingData = [...newDays, ...renderingDataForFlatList];
    setRenderingDataForFlatList(renderingData);
    resolve();
  });
};

const updateEndRendering = (renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList) => {
  return new Promise((resolve) => {
    const lastDate = renderingDataForFlatList[renderingDataForFlatList.length - 1].date;
    const newLastDate = addDays(lastDate, 14);
    const newDays = createRenderingDataForFlatList(addDays(lastDate, 1), newLastDate);
    const renderingData = [...renderingDataForFlatList, ...newDays];
    setRenderingDataForFlatList(renderingData);
    resolve();
  });
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    flexDirection: 'column',
  },
});
