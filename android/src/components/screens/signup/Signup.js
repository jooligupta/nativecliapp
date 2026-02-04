
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../../redux/authSlice';

const { width, height } = Dimensions.get('window');

function Signup({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const { success, error, loading } = useSelector((state) => state.auth);

    React.useEffect(() => {
        if (success) {
            Alert.alert("Success", "Account created successfully!", [
                { text: "OK", onPress: () => navigation.navigate('Home') }
            ]);
        }
    }, [success, navigation]);

    React.useEffect(() => {
        if (error) {
            Alert.alert("Signup Error", error);
        }
    }, [error]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" hidden={true} />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header Image Section */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../../assets/signin.jpg')}
                        style={styles.headerImage}
                        resizeMode='cover'
                    />
                    <View style={styles.overlay} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Create Account</Text>
                        <Text style={styles.headerSubtitle}>Sign up to get started</Text>
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor="#A0A0A0"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoCorrect={false}
                            importantForAutofill="no"
                            textContentType="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="hello@example.com"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            importantForAutofill="no"
                            textContentType="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            autoCorrect={false}
                            importantForAutofill="no"
                            textContentType="none"
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#A0A0A0"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCorrect={false}
                            importantForAutofill="no"
                            textContentType="none"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.signUpButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (email && password && confirmPassword && name) {
                                if (password === confirmPassword) {
                                    dispatch(signupUser({ name, email, password }));
                                } else {
                                    Alert.alert("Error", "Passwords do not match");
                                }
                            } else {
                                Alert.alert("Error", "Please fill in all fields");
                            }
                        }}
                    >
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    headerContainer: {
        height: height * 0.35, // Slightly shorter than Signin
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTextContainer: {
        position: 'absolute',
        bottom: 40,
        left: 24,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 32,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F7F7F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    signUpButton: {
        backgroundColor: '#2D3436', // Modern dark charcoal
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#2D3436',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    footerText: {
        color: '#888',
        fontSize: 14,
    },
    signInText: {
        color: '#2D3436',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default Signup;