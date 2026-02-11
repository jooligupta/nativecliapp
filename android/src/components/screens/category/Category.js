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
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../redux/categorySlice";

const Category = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter category name");
      return;
    }

    const categoryData = {
      name: categoryName,
      slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, "-"),
    };

    dispatch(addCategory(categoryData))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Category added successfully");
        resetForm();
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to add category");
      });
  };

  const handleUpdateCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter category name");
      return;
    }

    const categoryData = {
      name: categoryName,
      slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, "-"),
    };

    dispatch(updateCategory({ id: currentCategory._id, data: categoryData }))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Category updated successfully");
        resetForm();
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to update category");
      });
  };

  const handleDeleteCategory = (id) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteCategory(id))
              .unwrap()
              .then(() => {
                Alert.alert("Success", "Category deleted successfully");
              })
              .catch((error) => {
                Alert.alert(
                  "Error",
                  error.message || "Failed to delete category"
                );
              });
          },
        },
      ]
    );
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setCurrentCategory(null);
    setEditMode(false);
    setModalVisible(false);
  };

  const navigateToSubcategories = (category) => {
    // IMPORTANT: Make sure to pass the category object in params
    console.log("Navigating with category:", category); // Debug log
    navigation.navigate("SubCategoryList", { category: category });
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        style={styles.categoryInfo}
        onPress={() => navigateToSubcategories(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categorySlug}>{item.slug}</Text>
        <Text style={styles.tapHint}>Tap to view subcategories →</Text>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item._id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No categories found</Text>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? "Edit Category" : "Add Category"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category Slug (optional)"
              value={categorySlug}
              onChangeText={setCategorySlug}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editMode ? handleUpdateCategory : handleAddCategory}
              >
                <Text style={styles.buttonText}>
                  {editMode ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryInfo: {
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  categorySlug: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tapHint: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});