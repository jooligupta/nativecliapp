import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../../redux/categorySlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const UserDashboard = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { categories, loading } = useSelector((state) => state.category);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch categories on load
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchCategories()).finally(() => {
            setRefreshing(false);
        });
    };

    // 🔥 Map category name → vector icon
    const getCategoryIcon = (name) => {
        switch (name?.toLowerCase()) {
            case 'electronics':
                return 'cellphone';
            case 'fashion':
                return 'tshirt-crew';
            case 'shoes':
                return 'shoe-sneaker';
            case 'beauty':
                return 'lipstick';
            case 'home':
                return 'sofa';
            case 'grocery':
                return 'cart';
            default:
                return 'shape';
        }
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIconContainer}>
                <Icon
                    name={getCategoryIcon(item.name)}
                    size={20}
                    color="#000"
                />
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
            </Text>
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
            <View style={styles.headerContainer}>
                <Text style={styles.logoText}>Shopping Store</Text>

                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <EvilIcons name="search" size={26} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="shopping-bag" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer}>
                <Icon name="magnify" size={20} color="#666" />
                <Text style={styles.searchText}>Search products...</Text>
            </TouchableOpacity>

            {/* Banner */}
            <View style={styles.bannerContainer}>
                <Image
                    source={require('../../../assets/banner.jpg')}
                    style={styles.headerImage}
                />
            </View>

            {/* Categories Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Categories</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 14 }}
                    renderItem={renderCategory}
                />
            )}

            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },

    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    headerIcons: {
        flexDirection: 'row',
    },

    iconButton: {
        marginLeft: 15,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },

    searchText: {
        marginLeft: 10,
        color: '#999',
        fontSize: 16,
    },

    bannerContainer: {
        marginHorizontal: 14,
        marginTop: 14,
        borderRadius: 18,
        overflow: 'hidden',
    },

    headerImage: {
        width: '100%',
        height: 180,
    },

    sectionHeader: {
        marginTop: 20,
        marginHorizontal: 14,
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    categoryItem: {
        alignItems: 'center',
        marginRight: 15,
        width: 60,
        marginTop:10
    },

    categoryIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 35,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    categoryName: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
    },
});

export default UserDashboard;
