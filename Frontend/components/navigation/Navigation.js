import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import GoogleLogin from '../../screens/google';
import RegisterUser from '../../screens/register-user';
import Group from '../../screens/group';
import Visit from '../../screens/visit';
import Task from '../../screens/task';
import { useState } from 'react';
import UserProvider from './UserProvider';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(null);
  return (
    <UserProvider user={user}>
      <Stack.Navigator screenOptions={{}} initialRouteName={'Login'}>
        <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
        <Stack.Screen name={'Home'} options={{ headerShown: false }}>
          {(props) => <BottomNavigation {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen name={'RegisterUser'} component={RegisterUser} options={{ headerShown: false }} />
        <Stack.Screen name={'Group'} component={Group} options={{ headerShown: false }} />
        <Stack.Screen name="Visit" component={Visit} options={{ headerShown: false }} />
        <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
      </Stack.Navigator>
    </UserProvider>
  );
}
