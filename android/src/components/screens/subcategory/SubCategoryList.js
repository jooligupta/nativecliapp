import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    fetchSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from "../../../redux/categorySlice";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or MaterialCommunityIcons, Ionicons, etc.

const SubCategoryList = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { categories, subcategories, loading } = useSelector((state) => state.category);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);
    const [subcategoryName, setSubcategoryName] = useState("");

    // Dropdown states
    const [open, setOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState([]);

    // Load categories on component mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Transform categories for dropdown
    useEffect(() => {
        if (categories && categories.length > 0) {
            const items = categories.map(category => ({
                label: category.name,
                value: category._id,
            }));
            setDropdownItems(items);
        }
    }, [categories]);

    // Fetch subcategories when category is selected
    useEffect(() => {
        if (selectedCategory) {
            dispatch(fetchSubcategories(selectedCategory));
        }
    }, [selectedCategory, dispatch]);

    const handleAddSubcategory = () => {
        if (!selectedCategory) {
            Alert.alert("Error", "Please select a category first");
            return;
        }

        if (!subcategoryName.trim()) {
            Alert.alert("Error", "Please enter subcategory name");
            return;
        }

        const subcategoryData = {
            name: subcategoryName,
            category: selectedCategory,
        };

        dispatch(addSubcategory(subcategoryData))
            .unwrap()
            .then(() => {
                Alert.alert("Success", "Subcategory added successfully");
                resetForm();
            })
            .catch((error) => {
                Alert.alert("Error", error.message || "Failed to add subcategory");
            });
    };

    const handleUpdateSubcategory = () => {
        if (!subcategoryName.trim()) {
            Alert.alert("Error", "Please enter subcategory name");
            return;
        }

        const subcategoryData = {
            name: subcategoryName,
            category: selectedCategory,
        };

        dispatch(
            updateSubcategory({ id: currentSubcategory._id, data: subcategoryData })
        )
            .unwrap()
            .then(() => {
                Alert.alert("Success", "Subcategory updated successfully");
                resetForm();
            })
            .catch((error) => {
                Alert.alert("Error", error.message || "Failed to update subcategory");
            });
    };

    const handleDeleteSubcategory = (id) => {
        Alert.alert(
            "Delete Subcategory",
            "Are you sure you want to delete this subcategory?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteSubcategory(id))
                            .unwrap()
                            .then(() => {
                                Alert.alert("Success", "Subcategory deleted successfully");
                            })
                            .catch((error) => {
                                Alert.alert(
                                    "Error",
                                    error.message || "Failed to delete subcategory"
                                );
                            });
                    },
                },
            ]
        );
    };

    const openEditModal = (subcategory) => {
        setCurrentSubcategory(subcategory);
        setSubcategoryName(subcategory.name);
        setEditMode(true);
        setModalVisible(true);
    };

    const resetForm = () => {
        setSubcategoryName("");
        setCurrentSubcategory(null);
        setEditMode(false);
        setModalVisible(false);
    };

    const renderSubcategory = ({ item, index }) => (
        <View style={styles.subcategoryCard}>
            <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                    <View style={styles.indexCircle}>
                        <Text style={styles.indexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.subcategoryInfo}>
                        <Text style={styles.subcategoryName}>{item.name}</Text>
                        <Text style={styles.subcategoryDate}>
                            Created: {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => openEditModal(item)}
                    >
                        <Icon name="edit" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleDeleteSubcategory(item._id)}
                    >
                        <Icon name="delete" size={20} color="#F44336" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const getSelectedCategoryName = () => {
        if (!selectedCategory) return "None selected";
        const category = categories.find(cat => cat._id === selectedCategory);
        return category ? category.name : "Unknown";
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Subcategories</Text>
                    <Text style={styles.headerSubtitle}>Manage subcategories for categories</Text>
                </View>
                <TouchableOpacity
                    style={[styles.addButton, !selectedCategory && styles.disabledButton]}
                    onPress={() => setModalVisible(true)}
                    disabled={!selectedCategory}
                >
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.content}>
                {/* Category Selection Card */}
                <View style={styles.selectionCard}>
                    <View style={styles.cardHeader}>
                        <Icon name="category" size={24} color="#007AFF" />
                        <Text style={styles.cardTitle}>Select Category</Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>Choose a category</Text>
                        <DropDownPicker
                            open={open}
                            value={selectedCategory}
                            items={dropdownItems}
                            setOpen={setOpen}
                            setValue={setSelectedCategory}
                            setItems={setDropdownItems}
                            placeholder="Select a category..."
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownMenu}
                            textStyle={styles.dropdownText}
                            arrowIconStyle={styles.arrowIcon}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                        />
                        {selectedCategory && (
                            <View style={styles.selectedCategoryBadge}>
                                <Icon name="check-circle" size={16} color="#4CAF50" />
                                <Text style={styles.selectedCategoryText}>
                                    Selected: {getSelectedCategoryName()}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Subcategories List Card */}
                {selectedCategory ? (
                    <View style={styles.listCard}>
                        <View style={styles.listHeader}>
                            <View style={styles.listTitleContainer}>
                                <Icon name="folder" size={24} color="#007AFF" />
                                <View>
                                    <Text style={styles.listTitle}>Subcategories</Text>
                                    <Text style={styles.listSubtitle}>
                                        {getSelectedCategoryName()}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{subcategories.length}</Text>
                            </View>
                        </View>

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Loading subcategories...</Text>
                            </View>
                        ) : (
                            <>
                                {subcategories.length > 0 ? (
                                    <FlatList
                                        data={subcategories}
                                        renderItem={renderSubcategory}
                                        keyExtractor={(item) => item._id}
                                        scrollEnabled={false}
                                        contentContainerStyle={styles.listContent}
                                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                                    />
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Icon name="folder-open" size={64} color="#ddd" />
                                        <Text style={styles.emptyTitle}>No Subcategories Yet</Text>
                                        <Text style={styles.emptyText}>
                                            Start by adding your first subcategory
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.emptyButton}
                                            onPress={() => setModalVisible(true)}
                                        >
                                            <Icon name="add" size={20} color="#fff" />
                                            <Text style={styles.emptyButtonText}>Add First Subcategory</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                ) : (
                    <View style={styles.noSelectionCard}>
                        <Icon name="list" size={64} color="#ccc" />
                        <Text style={styles.noSelectionTitle}>Select a Category</Text>
                        <Text style={styles.noSelectionText}>
                            Choose a category from the dropdown above to view and manage its subcategories
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button for Mobile */}
            {selectedCategory && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={28} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Add/Edit Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={resetForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode ? "Edit Subcategory" : "New Subcategory"}
                            </Text>
                            <TouchableOpacity onPress={resetForm}>
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalLabel}>Category</Text>
                            <View style={styles.categoryDisplay}>
                                <Icon name="folder" size={16} color="#007AFF" />
                                <Text style={styles.categoryDisplayText}>
                                    {getSelectedCategoryName()}
                                </Text>
                            </View>

                            <Text style={styles.modalLabel}>Subcategory Name</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter subcategory name"
                                value={subcategoryName}
                                onChangeText={setSubcategoryName}
                                autoFocus
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={resetForm}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalSaveButton,
                                    !subcategoryName.trim() && styles.disabledButton
                                ]}
                                onPress={editMode ? handleUpdateSubcategory : handleAddSubcategory}
                                disabled={!subcategoryName.trim()}
                            >
                                <Text style={styles.modalSaveText}>
                                    {editMode ? "Update" : "Create Subcategory"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SubCategoryList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    // Header Styles
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#6c757d",
        marginTop: 2,
    },
    addButton: {
        backgroundColor: "#007AFF",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    disabledButton: {
        backgroundColor: "#adb5bd",
        shadowColor: "transparent",
    },
    // Content Styles
    content: {
        flex: 1,
        padding: 16,
    },
    // Card Styles
    selectionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
        marginLeft: 12,
    },
    dropdownContainer: {
        marginTop: 4,
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#495057",
        marginBottom: 8,
    },
    dropdown: {
        borderColor: "#dee2e6",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        minHeight: 52,
    },
    dropdownMenu: {
        borderColor: "#dee2e6",
        borderRadius: 12,
        marginTop: 4,
        borderWidth: 1.5,
    },
    dropdownText: {
        fontSize: 16,
        color: "#212529",
    },
    arrowIcon: {
        tintColor: "#6c757d",
    },
    tickIcon: {
        tintColor: "#007AFF",
    },
    selectedCategoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e8f5e9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: "flex-start",
    },
    selectedCategoryText: {
        fontSize: 14,
        color: "#2e7d32",
        marginLeft: 6,
        fontWeight: "500",
    },
    // List Card Styles
    listCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    listTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#212529",
        marginLeft: 12,
    },
    listSubtitle: {
        fontSize: 14,
        color: "#6c757d",
        marginLeft: 12,
        marginTop: 2,
    },
    countBadge: {
        backgroundColor: "#007AFF",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    countText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#6c757d",
    },
    listContent: {
        paddingBottom: 8,
    },
    // Subcategory Card Styles
    subcategoryCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        overflow: "hidden",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    cardLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    indexCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#e3f2fd",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    indexText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#007AFF",
    },
    subcategoryInfo: {
        flex: 1,
    },
    subcategoryName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#212529",
        marginBottom: 4,
    },
    subcategoryDate: {
        fontSize: 12,
        color: "#6c757d",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    separator: {
        height: 1,
        backgroundColor: "#e9ecef",
        marginHorizontal: 16,
    },
    // Empty State Styles
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#6c757d",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#adb5bd",
        textAlign: "center",
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    emptyButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    // No Selection State
    noSelectionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 40,
        alignItems: "center",
        marginTop: 20,
    },
    noSelectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#6c757d",
        marginTop: 16,
        marginBottom: 8,
    },
    noSelectionText: {
        fontSize: 14,
        color: "#adb5bd",
        textAlign: "center",
        lineHeight: 20,
    },
    // FAB Styles
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: "100%",
        maxWidth: 400,
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e9ecef",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#212529",
    },
    modalBody: {
        padding: 20,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#495057",
        marginBottom: 8,
    },
    categoryDisplay: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    categoryDisplayText: {
        fontSize: 16,
        color: "#212529",
        marginLeft: 8,
    },
    modalInput: {
        borderWidth: 1.5,
        borderColor: "#dee2e6",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    modalFooter: {
        flexDirection: "row",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#e9ecef",
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#dee2e6",
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6c757d",
    },
    modalSaveButton: {
        flex: 2,
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    modalSaveText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});