import React, { useEffect, useRef } from 'react';
import {
    View,
    Animated,
    StyleSheet,
} from 'react-native';

const AnimatedSplash = ({ onFinish }) => {
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1, // Zoom in
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 0, // Zoom out
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onFinish && onFinish();
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../assets/screen.png')}
                style={[
                    styles.image,
                    { transform: [{ scale }] },
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

export default AnimatedSplash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // same as native splash bg
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,      // Fixed width
        height: 200,     // Fixed height
    },
});
