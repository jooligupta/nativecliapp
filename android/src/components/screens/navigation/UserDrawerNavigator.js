import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../redux/authSlice';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import UserDashboard from '../user/Dashboard';
import { logout } from '../../../redux/authSlice';
// Import User Screens
// import UserDashboard from '../screens/user/Dashboard';
// import BrowseMedicines from '../screens/user/BrowseMedicines';
// import MyOrders from '../screens/user/MyOrders';
// import Profile from '../screens/user/Profile';
// import Support from '../screens/user/Support';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
                <Image
                    source={require('../../../assets/download.jpeg')}
                    style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>USER</Text>
                    </View>
                </View>
            </View>

            {/* Drawer Items */}
            <DrawerItemList {...props} />

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => dispatch(logout())}
            >
                <Icon name="logout" size={22} color="#FF3B30" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

function UserDrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                    width: 280,
                },
                drawerActiveTintColor: '#2D3436',
                drawerInactiveTintColor: '#666',
                drawerActiveBackgroundColor: '#F0F9FF',
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: -15,
                },
                headerStyle: {
                    backgroundColor: '#2D3436',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={UserDashboard}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon2 name="home-outline" color={color} size={size} />
                    ),
                    headerTitle: 'Home'
                }}
            />
            {/* <Drawer.Screen
                name="Browse Medicines"
                component={BrowseMedicines}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="pill" color={color} size={size} />
                    ),
                }}
            /> */}
            {/* <Drawer.Screen
                name="My Orders"
                component={MyOrders}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="cart" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={Profile}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="account" color={color} size={size} />
                    ),
                }}
            /> */}
            {/* <Drawer.Screen
                name="Support"
                component={Support}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="headset" color={color} size={size} />
                    ),
                }}
            /> */}
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    drawerHeader: {
        padding: 20,
        backgroundColor: '#2D3436',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userInfo: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 5,
    },
    roleBadge: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    roleText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 'auto',
        marginBottom: 20,
        backgroundColor: '#FFF0F0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

export default UserDrawerNavigator;