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
    score: {
        fontSize: 100,
        fontWeight: "500",
        position: "absolute",
        top: 100,
        color: "lightgrey",
    },
    gameOver: {
        fontSize: 35,
        fontWeight: "500",
        color: "black",
    },
    gameOverContainer: {
        position: "absolute",
        top: 350,
    },
    support: {
        fontSize: 15,
    }
});

export default styles;