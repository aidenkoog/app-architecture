import { View, StyleSheet } from "react-native"

/**
 * component ui that is used in container.
 * @returns {JSX.Element}
 */
export default function PermissionComponent() {
    return (
        <View style={styles.container}>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ff7271',
        flex: 1
    },
})