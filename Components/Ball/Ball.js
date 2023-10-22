import { View, Text, useWindowDimensions, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './Ball.styles';

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedGestureHandler,
    withRepeat,
    withSequence,
    BounceIn
} from 'react-native-reanimated';

import { PanGestureHandler } from 'react-native-gesture-handler';

/**NOTE - for ball */
/********************** for ball ***********************/
const FPS = 60; // for 60FPS Screen
const DELTA = 1000 / FPS; // time between two frames
const SPEED = 10; // speed of the ball w.r.t frames 
const BALL_WIDTH = 25;

/**NOTE - for island */
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
    /*NOTE - for score calculation */
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    /**NOTE - Target position */
    /************************************************** { Target position } *****************************************************/
    const { height, width } = useWindowDimensions();

    /*NOTE - we put " PLAYER_DIMENSION " here because we use " useWindowDimensions(); "
    /********************** for Player ***********************/
    const PLAYER_DIMENSION = { x: width / 4, y: height - 100, w: width / 2, h: 30 };

    const targedPositionX = useSharedValue(width / 2);
    const targedPositionY = useSharedValue(height / 2);
    const direction = useSharedValue(normilizeVector({ x: Math.random(), y: Math.random() }));
    // console.log(direction);

    const PLAYER_POSITION = useSharedValue({ x: width / 4, y: height - 100 })

    /**NOTE - useEffect */
    /************************************************** { useEffect } *****************************************************/

    useEffect(() => {
        // console.warn("won");
        /***{ this function will call update function in every 1000 sec [setInterval is javaScript inbuild function] }***/
        const interval = setInterval(() => {
            /**NOTE - Game Over condition */
            if (!gameOver) {
                update();
            };
        }, DELTA);

        return () => clearInterval(interval); // to clear the memory leak
    }, [gameOver]);

    /**NOTE - this function will update the position of ball in x and y in every 500 sec */
    /************************************{ this function will update the position of ball in x and y in every 500 sec }************************************/
    const update = () => {

        let nextPosition = getNextPosition(direction.value);
        // console.log("1st next position:", nextPosition);

        let newDirection = direction.value;

        /**NOTE - Screen Wall Collision Detection */
        /*********************** Screen Wall Collision Detection ************************/
        // to set game over true every time ball hit the ground
        if (nextPosition.y > height - BALL_WIDTH) {
            setGameOver(true);
        }

        // to make ball bounce back from walls [vertical wall] 
        if (nextPosition.y < 0) {
            // console.log("Before", direction.value);
            // console.log("1st next position:", nextPosition);
            newDirection = { x: direction.value.x, y: -direction.value.y } // to change direction

            // console.log("We are on top");
        }

        // to make ball bounce back from walls [horizontal wall] 
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

        /**NOTE - Colision condition [ Island hit detection ] */
        /*********************** Colision condition [ Island hit detection ] *************************/
        if (
            nextPosition.x < ISLAND_DIMENSION.x + ISLAND_DIMENSION.w &&
            nextPosition.x + BALL_WIDTH > ISLAND_DIMENSION.x &&
            nextPosition.y < ISLAND_DIMENSION.y + ISLAND_DIMENSION.h &&
            BALL_WIDTH + nextPosition.y > ISLAND_DIMENSION.y
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
            setScore((score) => score + 1);
        }

        /**NOTE - Colision condition [ Player hit detection ] */
        /*********************** Colision condition [ Player hit detection ] *************************/
        if (
            nextPosition.x < PLAYER_POSITION.value.x + PLAYER_DIMENSION.w &&
            nextPosition.x + BALL_WIDTH > PLAYER_POSITION.value.x &&
            nextPosition.y < PLAYER_POSITION.value.y + PLAYER_DIMENSION.h &&
            nextPosition.y + BALL_WIDTH > PLAYER_POSITION.value.y
        ) {
            if (
                targedPositionX.value < PLAYER_POSITION.value.x
                ||
                targedPositionX.value > PLAYER_POSITION.value.x + PLAYER_DIMENSION.w
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

    /**NOTE - function to get position */
    /******************************************** { function to get position } ***********************************************/

    const getNextPosition = (direction) => {

        return {
            x: targedPositionX.value + direction.x * SPEED,
            y: targedPositionY.value + direction.y * SPEED
        };
    };

    /*NOTE - reStartTheGame function*/
    const reStartTheGame = (game) => {
        targedPositionX.value = width / 2;
        targedPositionY.value = height / 2;
        setScore(0);
        setGameOver(false);
    };

    /**NOTE - { for ball Animation }*/
    /******************************************* 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 { for ball Animation } ***********************************************/
    const ballAnimateedStyles = useAnimatedStyle(() => {
        return {
            top: targedPositionY.value,
            left: targedPositionX.value,
        };
    });

    const islandAnimatedStyles = useAnimatedStyle(() => ({
        width:
            withSequence(
                withTiming(ISLAND_DIMENSION.w * 1.2),
                withTiming(ISLAND_DIMENSION.w),
            ),
        height:
            withSequence(
                withTiming(ISLAND_DIMENSION.h * 1.2),
                withTiming(ISLAND_DIMENSION.h),
            ),
        opacity:
            withSequence(
                withTiming(0),
                withTiming(1)
            ),
    }),
        [score]
    );

    const playerAnimatedStyles = useAnimatedStyle(() => ({
        left: PLAYER_POSITION.value.x,

        // for movement in Y-axis 
        // top: PLAYER_POSITION.value.y,
    }));

    /**NOTE - Gesture Handler */
    /******************************** Gesture Handler ******************************************************/
    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event) => {
            // console.log(event);
        },
        onActive: (event) => {
            // console.log(event);
            PLAYER_POSITION.value = { ...PLAYER_POSITION.value, x: event.absoluteX - PLAYER_DIMENSION.w / 2 }

            // PLAYER_POSITION.value = { ...PLAYER_POSITION.value, y: event.absoluteY - PLAYER_DIMENSION.h / 2}
        },
    });

    return (
        <View style={styles.container}>
            {/**NOTE - For Score */}
            <Text style={styles.score}>
                {score}
            </Text>

            {/** if the game is over then only show text and button  */}
            {gameOver && (
                <View style={styles.gameOverContainer}>
                    {/**NOTE - Game Over */}
                    <Text style={styles.gameOver}>Game Over</Text>
                    <Text style={styles.support}>upi id: 9875704712@ybl</Text>

                    {/**NOTE - Restart Button */}
                    <Button title='Restart' onPress={reStartTheGame} />
                </View>
            )}



            {/* using animated ball */}
            {!gameOver && <Animated.View style={[styles.ball, ballAnimateedStyles]} />}

            {/**NOTE - Island View */}
            <Animated.View
                entering={BounceIn}
                key={score}
                style={{
                    position: "absolute",
                    top: ISLAND_DIMENSION.y - 10,
                    left: ISLAND_DIMENSION.x - 3,
                    width: ISLAND_DIMENSION.w + 10,
                    height: ISLAND_DIMENSION.h + 10,
                    borderRadius: 20,
                    backgroundColor: "black",
                }}
            />

            {/**NOTE - Player View */}
            <Animated.View style={[
                {
                    top: PLAYER_POSITION.value.y,
                    left: PLAYER_POSITION.value.x,
                    position: 'absolute',
                    width: PLAYER_DIMENSION.w,
                    height: PLAYER_DIMENSION.h,
                    backgroundColor: "black",
                    borderRadius: 30
                }, playerAnimatedStyles,
            ]} />

            {/**NOTE - To controle the playable View */}
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={{
                    width: "100%",
                    height: 100,
                    // backgroundColor: 'blue',
                    position: "absolute",
                    bottom: 0
                }} />
            </PanGestureHandler>

        </View>
    );
}

/***TODO 1 => Fix Score problem => count increase by 2 not 1 why?? ==> completed 
 * 2 => Add refresh button
 * 3 => Add ball animation
 * 4 => Add Home screen
 * 5 => Add starting screen
*/

export default Ball;