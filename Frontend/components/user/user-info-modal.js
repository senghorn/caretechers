import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import {
    Avatar,
    Text,
    Modal,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import { useState, useEffect } from 'react';
import colors from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RemoveUserFromGroup } from '../../services/api/user';
import { getUserRole, setUserDataInfo } from '../../utils/userController';
import RoleBadge from './role-badge';

/**
 * React Native functional component that displays a modal for managing a user.
 * @param {object} param0 Props object
 * @param {object} param0.selectedUser Currently selected user
 * @param {function} param0.setSelectedUser Function to update the currently selected user
 * @param {object} param0.user Current user
 * @returns {JSX.Element} ManageUserModal component JSX.Element
 */
const ManageUserModal = ({ selectedUser, setSelectedUser, user }) => {
    const [userRole, setUserRole] = useState(0);
    const [removing, setRemoving] = useState(false);
    useEffect(() => {
        if (user && selectedUser) {
            // If user see their info, hide remove user button
            if (user.id !== selectedUser?.email) {
                const role = getUserRole(user);
                setUserRole(role);
            } else {
                setUserRole(0);
            }
        }
    }, [selectedUser, user]);

    const handleRemoveUser = async () => {
        setRemoving(true);
        const removed = await RemoveUserFromGroup(selectedUser.email, user.curr_group, user.access_token);
        if (!removed) {
            Alert.alert('Failed to remove', selectedUser.first_name + ' ' + selectedUser.last_name);
        }
        setRemoving(false);
        setSelectedUser(null);
    };
    const handleCancel = () => { };
    const removeUserHandler = () => {
        Alert.alert(
            'Remove User',
            'Are you sure you want to remove this user?',
            [
                {
                    text: 'Cancel',
                    onPress: handleCancel,
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    onPress: handleRemoveUser,
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <Modal
            visible={selectedUser !== null}
            onDismiss={() => {
                setSelectedUser(null);
            }}
            contentContainerStyle={styles.modal}
        >
            <View style={styles.modalContainerStyle}>
                <View style={styles.profileContainer}>
                    <View style={styles.leftContainer}>
                        <Avatar.Image size={65} source={{ uri: selectedUser?.profile_pic }} style={styles.photo} />
                    </View>
                    <View style={styles.rightContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{selectedUser?.first_name + ' ' + selectedUser?.last_name}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() => {
                                console.log('pressed');
                            }}
                        >
                            <Ionicons name="call-outline" size={26} color="red" style={styles.infoIcon} />
                            <Text style={styles.phone}>{selectedUser?.phone_num}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() => {
                                console.log('pressed');
                            }}
                        >
                            <Ionicons name="mail-outline" size={26} color="green" style={styles.infoIcon} />
                            <Text style={styles.phone}>{selectedUser?.email}</Text>
                        </TouchableOpacity>
                        <View style={styles.infoRow}>
                            <RoleBadge group={selectedUser} />
                            <Text style={styles.role}>
                                {selectedUser?.admin_status === 2 ? 'Admin' : selectedUser?.admin_status === 1 ? 'Co-Admin' : 'Non-Admin'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.manageButtons}>
                    {userRole === 0 && !removing ? null : (
                        <Button style={styles.removeButton} color="red" onPress={removeUserHandler}>
                            Remove User
                        </Button>
                    )}
                    {removing ? <ActivityIndicator /> : null}
                </View>
            </View>
        </Modal>
    );
};

export default ManageUserModal;

const styles = StyleSheet.create({
    roleBadge: {
        backgroundColor: 'transparent',
        flex: 1
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        padding: 20,
        minHeight: '30%',
        borderRadius: '100%',
        borderWidth: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '95%',
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    leftContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3
    },
    rightContainer: {
        flex: 8
    },
    nameRow: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    name: {
        fontSize: 24,
        color: colors.black,
    },
    phone: {
        fontSize: 14,
        color: 'gray',
    },
    manageButtons: {
        marginTop: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    removeButton: {
        backgroundColor: colors.lightYellow,
    },
    role: {
        marginLeft: 8,
        fontSize: 14,
        color: 'gray',
        flex: 8
    },

});
