import { StyleSheet } from "react-native"
// initializing variables
const BALL_WIDTH = 25;


const styles = StyleSheet.create({
    ball: {
        backgroundColor: "black",
        width: BALL_WIDTH,
        aspectRatio: 1,
        borderRadius: 50,
        position: "absolute",
        // left: 341,
        // top: 0,
    },
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;