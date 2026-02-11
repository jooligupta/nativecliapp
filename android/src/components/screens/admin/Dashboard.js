import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalUsers: 245,
        totalMedicines: 1560,
        totalOrders: 892,
        revenue: '₹1,24,560'
    });
    const [recentOrders, setRecentOrders] = useState([
        { id: '1', customer: 'John Doe', amount: '₹1,200', status: 'Delivered' },
        { id: '2', customer: 'Jane Smith', amount: '₹2,500', status: 'Processing' },
        { id: '3', customer: 'Robert Johnson', amount: '₹800', status: 'Pending' },
        { id: '4', customer: 'Sarah Wilson', amount: '₹3,400', status: 'Delivered' },
    ]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const statCards = [
        {
            id: 1,
            title: 'Total Users',
            value: stats.totalUsers,
            icon: 'account-group',
            color: '#4CAF50',
            bgColor: '#E8F5E9'
        },
        {
            id: 2,
            title: 'Medicines',
            value: stats.totalMedicines,
            icon: 'pill',
            color: '#2196F3',
            bgColor: '#E3F2FD'
        },
        {
            id: 3,
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: 'cart',
            color: '#FF9800',
            bgColor: '#FFF3E0'
        },
        {
            id: 4,
            title: 'Revenue',
            value: stats.revenue,
            icon: 'currency-inr',
            color: '#9C27B0',
            bgColor: '#F3E5F5'
        },
    ];

    const quickActions = [
        {
            id: 1,
            title: 'Add Medicine',
            icon: 'plus-circle',
            screen: 'MedicineManagement',
            color: '#4CAF50'
        },
        {
            id: 2,
            title: 'View Orders',
            icon: 'clipboard-list',
            screen: 'Orders',
            color: '#2196F3'
        },
        {
            id: 3,
            title: 'Users',
            icon: 'account-cog',
            screen: 'User Management',
            color: '#FF9800'
        },
        {
            id: 4,
            title: 'Analytics',
            icon: 'chart-bar',
            screen: 'Analytics',
            color: '#9C27B0'
        },
    ];

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={[styles.statusBadge,
                {
                    backgroundColor: item.status === 'Delivered' ? '#E8F5E9' :
                        item.status === 'Processing' ? '#FFF3E0' : '#FFEBEE'
                }]}>
                    <Text style={[styles.statusText,
                    {
                        color: item.status === 'Delivered' ? '#4CAF50' :
                            item.status === 'Processing' ? '#FF9800' : '#F44336'
                    }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.orderAmount}>{item.amount}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.name || 'Admin'}</Text>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Image
                        source={require('../../../assets/download.jpeg')}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                {statCards.map((card) => (
                    <View key={card.id} style={[styles.statCard, { backgroundColor: card.bgColor }]}>
                        <View style={styles.statIconContainer}>
                            <Icon name={card.icon} size={24} color={card.color} />
                        </View>
                        <Text style={styles.statValue}>{card.value}</Text>
                        <Text style={styles.statTitle}>{card.title}</Text>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.actionCard}
                            onPress={() => navigation.navigate(action.screen)}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                                <Icon name={action.icon} size={28} color={action.color} />
                            </View>
                            <Text style={styles.actionText}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Recent Orders */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                        <Text style={styles.seeAll}>See All →</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={recentOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </View>

            {/* Bottom Spacer */}
            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    greeting: {
        fontSize: 14,
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginTop: 2,
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 40) / 2 - 10,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 5,
    },
    statTitle: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    seeAll: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '500',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - 50) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3436',
        textAlign: 'center',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3436',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    customerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2D3436',
        marginBottom: 4,
    },
    orderAmount: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
});

export default AdminDashboard;