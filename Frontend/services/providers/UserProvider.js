import UserContext from '../context/UserContext';

// Create a component that will provide the context
export default function UserProvider({ children, user, setUser }) {
  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
}
