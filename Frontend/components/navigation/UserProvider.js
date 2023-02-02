import UserContext from '../../services/context/UserContext';

// Create a component that will provide the context
export default function UserProvider({ children, user }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
