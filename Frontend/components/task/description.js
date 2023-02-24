import { Fragment } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Description({ data, isLoading, editMode, editDescription, setEditDescription }) {
  return (
    <Fragment>
      <View style={styles.container}>
        <Text style={styles.header}>Description</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
        ) : (
          <Fragment>
            <DescriptionField
              editMode={editMode}
              isLoading={isLoading}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              data={data}
            />
          </Fragment>
        )}
      </View>
    </Fragment>
  );
}

function DescriptionField({ editMode, editDescription, setEditDescription, data }) {
  if (editMode) {
    return (
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={styles.descriptionBorder}
        label=""
        value={editDescription}
        onChangeText={(text) => setEditDescription(text)}
        selectionColor="#2196f3"
        underlineColor="#2196f3"
        activeUnderlineColor="#2196f3"
      />
    );
  }
  return (
    <View style={styles.descriptionBorderLocked}>
      <Text style={styles.description}>{data && data[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selectDateContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  takesPlaceText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 12,
    marginRight: 8,
  },
  container: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  loader: {
    marginTop: 48,
  },
  header: {
    fontSize: 18,
    color: '#1664a1',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
  },
  descriptionBorder: {
    marginTop: 8,
    marginBottom: 24,
    height: 160,
    backgroundColor: '#fff',
    borderColor: '#888',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  descriptionBorderLocked: {
    marginTop: 8,
    marginBottom: 24,
    height: 160,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
});
