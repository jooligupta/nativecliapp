import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons'

// Import Admin Screens
// import AdminDashboard from '../admin/Dashboard';
import CategoryList from '../category/Category';
import SubCategoryList from '../subcategory/SubCategoryList';
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>
            {/* Drawer Header with User Info */}
            <View style={styles.drawerHeader}>
                <Image
                    source={require('../../../assets/download.jpeg')}
                    style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.name || 'Admin User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'admin@example.com'}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>ADMIN</Text>
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

function AdminDrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                    width: 300,
                },
                drawerActiveTintColor: '#2D3436',
                drawerInactiveTintColor: '#666',
                drawerActiveBackgroundColor: '#F0F9FF',
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '500',
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
                name="Category"
                component={CategoryList}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon2 name="grid-outline" color={color} size={size} />
                    ),
                    headerTitle: 'Category List'
                }}
            />
            <Drawer.Screen
                name="Sub Category"
                component={SubCategoryList}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Octicons name="list-unordered" color={color} size={size} />
                    ),
                    headerTitle: 'SubCategory List'
                }}
            />
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
        backgroundColor: '#4CAF50',
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

export default AdminDrawerNavigator;