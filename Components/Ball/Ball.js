import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import styles from './Ball.styles';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';


const FPS = 60; // for 60FPS Screen
const DELTA = 1000 / FPS; // time between two frames
const SPEED = 3; // speed of the ball w.r.t frames 
const BALL_WIDTH = 25;

// function to normilize vector (x and y co-ordinates)
const normilizeVector = (vector) => {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)

    return ({
        x: vector.x / magnitude,
        y: vector.y / magnitude
    });
}


const Ball = () => {
    
    /************************************************** { enemy position } *****************************************************/  
    const targedPositionX = useSharedValue(50);
    const targedPositionY = useSharedValue(100);
    const direction = useSharedValue(normilizeVector({ x: Math.random(), y: Math.random() }));
    // console.log(direction);

    const {height, width} = useWindowDimensions();

    /************************************************** { useEffect } *****************************************************/  

    useEffect(() => {
        // console.warn("won");
        /***{ this function will call update function in every 1000 sec [setInterval is javaScript inbuild function] }***/
        const interval = setInterval(update, DELTA);

        return () => clearInterval(interval); // to clear the memory leak
    }, []);


    /************************************{ this function will update the position of ball in x and y in every 500 sec }************************************/ 
    const update = () => {
        let nextPosition = getNextPosition(direction.value);
        // console.log("1st next position:", nextPosition);

        // to make ball bounce back from walls [horizontal wall] 
        if(nextPosition.y < 0 || nextPosition.y > height - BALL_WIDTH) {
            // console.log("Before", direction.value);
            // console.log("1st next position:", nextPosition);

            const newDirection = {x: direction.value.x, y: -direction.value.y} // to change direction
            // console.log("We are on top");
            direction.value = newDirection;
            // console.log("After", direction.value);            
            nextPosition = getNextPosition(newDirection);
            // console.log("recalculated next position:", nextPosition);

        }

        // to make ball bounce back from walls [vertical wall] 
        if(nextPosition.x < 0 || nextPosition.x > width - BALL_WIDTH){
            const newDirection = {x: -direction.value.x, y: direction.value.y} 
            direction.value = newDirection;
            nextPosition = getNextPosition(newDirection);
        }

        // console.log("Updating Physics");
        targedPositionX.value = withTiming(nextPosition.x, {
            duration: DELTA,
            easing: Easing.linear,
        })
        targedPositionY.value = withTiming(nextPosition.y, {
            duration: DELTA,
            easing: Easing.linear,
        })
    };

    /******************************************** { function to get position } ***********************************************/

    const getNextPosition = (direction) => {

        return{
            x: targedPositionX.value + direction.x * SPEED,
            y: targedPositionY.value + direction.y * SPEED
        }
    }

    /******************************************** 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 { for ball Animation } ***********************************************/
    const ballAnimateedStyles = useAnimatedStyle(() => {
        return {
            top: targedPositionY.value,
            left: targedPositionX.value,

        };
    });

    return (
        <View style={styles.container}>
            {/* using animated  */}
            <Animated.View style={[styles.ball, ballAnimateedStyles]} />
            <View style/>
        </View>
    );
}

export default Ball;