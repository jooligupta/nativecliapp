// import { View, Text, Button } from 'react-native';

// export default function HomeScreen({ navigation }) {
//     return (
//         <View>
//             <Text>Home Screen</Text>
//             <Button
//                 title="Go to Profile"
//                 onPress={() => navigation.navigate('Profile')}
//             />
//         </View>
//     );
// }
// import { View, Text, FlatList } from "react-native";
// import { useEffect, useState } from "react";
// import api from "../api/api";

// export default function HomeScreen() {
//     const [medicines, setMedicines] = useState([]);

//     useEffect(() => {
//         api.get("/medicines").then((res) => setMedicines(res.data));
//     }, []);

//     return (
//         <FlatList
//             data={medicines}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => <Text>{item.name} - ₹{item.price}</Text>}
//         />
//     );
// }
import React from 'react'
import { View, Text } from 'react-native'

function HomeScreen() {
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen