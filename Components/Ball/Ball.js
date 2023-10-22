import { View, Text, useWindowDimensions } from 'react-native';
import React, { useEffect } from 'react';
import styles from './Ball.styles';

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedGestureHandler
} from 'react-native-reanimated';

import { PanGestureHandler } from 'react-native-gesture-handler';


/********************** for ball ***********************/
const FPS = 60; // for 60FPS Screen
const DELTA = 1000 / FPS; // time between two frames
const SPEED = 10; // speed of the ball w.r.t frames 
const BALL_WIDTH = 25;

/********************** for island ***********************/
const ISLAND_DIMENSION = { x: 99.8, y: 10, w: 212, h: 22 };


// function to normilize vector (x and y co-ordinates)
const normilizeVector = (vector) => {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)

    return ({
        x: vector.x / magnitude,
        y: vector.y / magnitude
    });
};


const Ball = () => {

    /************************************************** { enemy position } *****************************************************/
    const { height, width } = useWindowDimensions();

    /*NOTE - we put " PLAYER_DIMENSION " here because we use " useWindowDimensions(); "
    /********************** for Player ***********************/
    const PLAYER_DIMENSION = { x: width / 4, y: height - 100, w: width / 2, h: 30 };

    const targedPositionX = useSharedValue(width / 2);
    const targedPositionY = useSharedValue(height / 2);
    const direction = useSharedValue(normilizeVector({ x: Math.random(), y: Math.random() }));
    // console.log(direction);

    const PLAYER_POSITION = useSharedValue({ x: width / 4, y: height - 100 })


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

        let newDirection = direction.value;
        /*********************** Wall Collision Detection ************************/
        // to make ball bounce back from walls [horizontal wall] 
        if (nextPosition.y < 0 || nextPosition.y > height - BALL_WIDTH) {
            // console.log("Before", direction.value);
            // console.log("1st next position:", nextPosition);

            newDirection = { x: direction.value.x, y: -direction.value.y } // to change direction
            // console.log("We are on top");
        }

        // to make ball bounce back from walls [vertical wall] 
        if (nextPosition.x < 0 || nextPosition.x > width - BALL_WIDTH) {
            newDirection = { x: -direction.value.x, y: direction.value.y }
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

        /*********************** Colision condition [ Island hit detection ] *************************/
        if (
            nextPosition.x < ISLAND_DIMENSION.x + ISLAND_DIMENSION.w &&
            nextPosition.x + BALL_WIDTH > ISLAND_DIMENSION.x &&
            nextPosition.y < ISLAND_DIMENSION.y + ISLAND_DIMENSION.h &&
            nextPosition.y + BALL_WIDTH > ISLAND_DIMENSION.y
        ) {
            if (
                targedPositionX.value < ISLAND_DIMENSION.x
                ||
                targedPositionX.value > ISLAND_DIMENSION.x + ISLAND_DIMENSION.w
            ) {
                // console.log("Hitting from the side");
                newDirection = { x: -direction.value.x, y: direction.value.y }
            } else {
                // console.log("Hitting from the top/bottom");
                newDirection = { x: direction.value.x, y: -direction.value.y }
            }
        }

        direction.value = newDirection;
        nextPosition = getNextPosition(newDirection);
    };

    /******************************************** { function to get position } ***********************************************/

    const getNextPosition = (direction) => {

        return {
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

    const playerAnimateedStyles = useAnimatedStyle(() => ({
        left: PLAYER_POSITION.value.x,
    }));

    /**************** Gesture Handler ***************************/
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event) => {
            // console.log(event);
        },
        onActive: (event) => {
            // console.log(event);
            PLAYER_POSITION.value = { ...PLAYER_POSITION.value, x: event.absoluteX - PLAYER_DIMENSION.w / 2}
        },
    });

    return (
        <View style={styles.container}>
            {/* using animated ball */}
            <Animated.View style={[styles.ball, ballAnimateedStyles]} />

            {/* Island View */}
            <View style={{
                top: ISLAND_DIMENSION.y,
                left: ISLAND_DIMENSION.x,
                position: 'absolute',
                width: ISLAND_DIMENSION.w,
                height: ISLAND_DIMENSION.h,
                // backgroundColor: "black",
                borderRadius: 30
            }} />

            {/* Player View */}
            <Animated.View style={[
                {
                top: PLAYER_POSITION.value.y,
                left: PLAYER_POSITION.value.x,
                position: 'absolute',
                width: PLAYER_DIMENSION.w,
                height: PLAYER_DIMENSION.h,
                backgroundColor: "black",
                borderRadius: 30
            }, playerAnimateedStyles,
            ]} />

            {/**************** To controle the playable View ****************/}
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={{
                    width: "100%",
                    height: 200,
                    // backgroundColor: 'blue',
                    position: "absolute",
                    bottom: 0
                }} />
            </PanGestureHandler>

        </View>
    );
}

export default Ball;