import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text, ImageBackground } from "react-native";

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_HEIGHT = 100;

const MARIO_WIDTH = 50;
const MARIO_HEIGHT = 70;

const PIPE_WIDTH = 60;
const PIPE_HEIGHT = 150;
const PIPE_SPEED = 4;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const BIRD_SPEED = 10;
const COIN_SIZE = 25;
const COIN_SPEED = 4;

export default function GameContainer() {
  const [gameWidth, setGameWidth] = useState(0);
  const [gameHeight, setGameHeight] = useState(0);
  const [marioY, setMarioY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipeX, setPipeX] = useState(9999);
  const [birdX, setBirdX] = useState(9999);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pipeHeight, setPipeHeight] = useState(150);
  const [birdY, setBirdY] = useState(100);
  const [coinX, setCoinX] = useState(9999);
  const [coinY, setCoinY] = useState(150);
  const coinXRef = useRef(0);
  const coinYRef = useRef(0);
  const [coinSpin, setCoinSpin] = useState(0);

  const birdXRef = useRef(0);
  const birdYRef = useRef(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCoinSpin(s => s + 10);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // const birdLeft = birdXRef.current;
  // const birdRight = birdLeft + BIRD_WIDTH;
  // const birdTop = birdYRef.current;
  // const birdBottom = birdTop + BIRD_HEIGHT;

  useEffect(() => {
    coinXRef.current = coinX;
  }, [coinX]);

  useEffect(() => {
    coinYRef.current = coinY;
  }, [coinY]);

  useEffect(() => {
    birdXRef.current = birdX;
  }, [birdX]);

  useEffect(() => {
    birdYRef.current = birdY;
  }, [birdY]);

  const marioYRef = useRef(0);
  const pipeXRef = useRef(0);
  // const gameLoop = useRef<NodeJS.Timeout | null>(null);
  const gameLoop = useRef(null);


  const getRandomCoinHeight = () => {
    const min = 80;
    const max = gameHeight - GROUND_HEIGHT - 150;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomBirdHeight = () => {
    const min = 50;
    const max = gameHeight - GROUND_HEIGHT - 200;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomPipeHeight = () => {
    const minHeight = 80;
    const maxHeight = 300;
    return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  };


  useEffect(() => {
    marioYRef.current = marioY;
  }, [marioY]);

  useEffect(() => {
    pipeXRef.current = pipeX;
  }, [pipeX]);

  const resetGame = () => {
    setMarioY(gameHeight / 2);
    setVelocity(0);
    setPipeX(gameWidth);
    setScore(0);
    setGameOver(false);
    setBirdX(gameWidth + 300);
    setBirdY(getRandomBirdHeight());
    setCoinX(gameWidth + 600);
    setCoinY(getRandomCoinHeight());
  };

  const jump = () => {
    if (gameOver) {
      resetGame();
    } else {
      setVelocity(JUMP_FORCE);
    }
  };

  const checkCollision = () => {
    const marioX = 80;
    const marioTop = marioYRef.current;
    const marioBottom = marioTop + MARIO_HEIGHT;
    const marioRight = marioX + MARIO_WIDTH;


    const pipeLeft = pipeXRef.current;
    const pipeRight = pipeLeft + PIPE_WIDTH;
    const pipeTop = gameHeight - GROUND_HEIGHT - pipeHeight;
    const pipeBottom = gameHeight - GROUND_HEIGHT;


    const coinLeft = coinXRef.current;
    const coinRight = coinLeft + COIN_SIZE;
    const coinTop = coinYRef.current;
    const coinBottom = coinTop + COIN_SIZE;

    const hitCoin =
      marioRight > coinLeft &&
      marioX < coinRight &&
      marioBottom > coinTop &&
      marioTop < coinBottom;

    if (hitCoin) {
      setScore(s => s + 5);   
      setCoinX(gameWidth + 400); 
    }

    const hitPipe =
      marioRight > pipeLeft &&
      marioX < pipeRight &&
      marioBottom > pipeTop &&
      marioTop < pipeBottom;

    if (hitPipe) {
      setGameOver(true);
      return;
    }


    const birdLeft = birdXRef.current;
    const birdRight = birdLeft + BIRD_WIDTH;
    const birdTop = birdYRef.current;
    const birdBottom = birdTop + BIRD_HEIGHT;

    const hitBird =
      marioRight > birdLeft &&
      marioX < birdRight &&
      marioBottom > birdTop &&
      marioTop < birdBottom;

    if (hitBird) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameWidth && gameHeight) {
      resetGame();
    }
  }, [gameWidth, gameHeight]);


  useEffect(() => {
    if (!gameWidth || !gameHeight) return;

    gameLoop.current = setInterval(() => {
      if (gameOver) return;

      setVelocity(v => {
        let newVelocity = v + GRAVITY;

        setMarioY(y => {
          let newY = y + newVelocity;

          const groundY = gameHeight - GROUND_HEIGHT - MARIO_HEIGHT;

          if (newY > groundY) {
            newY = groundY;
            newVelocity = 0;
          }

          if (newY < 0) {
            newY = 0;
            newVelocity = 0;
          }

          return newY;
        });

        return newVelocity;
      });

      setPipeX(x => {
        const newX = x - PIPE_SPEED;

        if (newX < -PIPE_WIDTH) {
          setScore(s => s + 1);
          setPipeHeight(getRandomPipeHeight());
          return gameWidth;
        }

        return newX;
      });

      setBirdX(x => {
        const newX = x - BIRD_SPEED;

        if (newX < -BIRD_WIDTH) {
          setBirdY(getRandomBirdHeight());
          return gameWidth + Math.random() * 200;
        }

        return newX;
      });

      setCoinX(x => {
        const newX = x - COIN_SPEED;

        if (newX < -COIN_SIZE) {
          return gameWidth + Math.random() * 400;
        }

        return newX;
      });


      checkCollision();
    }, 16);

    return () => clearInterval(gameLoop.current!);
  }, [gameWidth, gameHeight, gameOver]);


  return (

    <ImageBackground
      style={{ flex: 1 }}
      source={require("../../assets/images/marioBg.jpg")}
    >
      <TouchableWithoutFeedback onPress={jump}>

        <View
          style={styles.container}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            setGameWidth(width);
            setGameHeight(height);
          }}
        >
          <Text style={styles.score}>{score}</Text>


          <View style={[styles.mario, { top: marioY }]}>
            <View style={styles.hat} />
            <View style={styles.face}>
              <View style={styles.mustache} />
            </View>
            <View style={styles.body} />
            <View style={styles.shoes} />
          </View>


          <View style={[styles.bird, { left: birdX, top: birdY }]}>
            <View style={styles.wingLeft} />
            <View style={styles.wingRight} />
          </View>

          <View
            style={[
              styles.coin,
              {
                left: coinX,
                top: coinY,
                transform: [{ rotateY: `${coinSpin}deg` }],
              },
            ]}
          />




          <View
            style={[
              styles.pipeWrapper,
              {
                left: pipeX,
                bottom: GROUND_HEIGHT,
                height: pipeHeight,
              },
            ]}
          >

            <View style={styles.pipeCap} />


            <View style={styles.pipeBody}>
              <View style={styles.pipeHighlight} />
            </View>
          </View>


          <View style={styles.ground} />

          {gameOver && (
            <View style={styles.gameOverBox}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>Score : {score}</Text>
              <Text style={styles.gameOverText}>GAME OVER</Text>
              <Text style={styles.restartText}>Tap to Restart</Text>
            </View>
          )}
        </View>


      </TouchableWithoutFeedback>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#5c94fc",
    backgroundColor: "transparent",
  },

  score: {
    position: "absolute",
    top: 40,
    left: 20,
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    zIndex: 10,
  },

  mario: {
    position: "absolute",
    left: 80,
    width: MARIO_WIDTH,
    height: MARIO_HEIGHT,
    alignItems: "center",
  },

  hat: {
    width: 40,
    height: 10,
    backgroundColor: "red",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  face: {
    width: 30,
    height: 20,
    backgroundColor: "#f5c28b",
    borderRadius: 4,
  },

  mustache: {
    width: 18,
    height: 4,
    backgroundColor: "brown",
    marginTop: 10,
    borderRadius: 2,
    alignSelf: "center",
  },

  body: {
    width: 35,
    height: 20,
    backgroundColor: "blue",
    borderRadius: 4,
  },

  shoes: {
    width: 35,
    height: 10,
    backgroundColor: "brown",
    borderRadius: 4,
    marginTop: 2,
  },

  pipeWrapper: {
    position: "absolute",
    width: PIPE_WIDTH,
  },

  pipeCap: {
    width: PIPE_WIDTH + 10,
    height: 20,
    backgroundColor: "#2ecc71",
    marginLeft: -5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 2,
    borderColor: "#1e8449",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  pipeBody: {
    flex: 1,
    backgroundColor: "#27ae60",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#1e8449",
    position: "relative",
  },

  pipeHighlight: {
    position: "absolute",
    left: 6,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
  },

  ground: {
    position: "absolute",
    bottom: 0,
    height: GROUND_HEIGHT,
    width: "100%",
    backgroundColor: "#c68642",
  },

  gameOverBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  gameOverText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },

  restartText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  bird: {
    position: "absolute",
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
    backgroundColor: "#555",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#222",
  },
  wingLeft: {
    position: "absolute",
    left: -10,
    top: 8,
    width: 12,
    height: 6,
    backgroundColor: "#777",
    borderRadius: 3,
  },
  wingRight: {
    position: "absolute",
    right: -10,
    top: 8,
    width: 12,
    height: 6,
    backgroundColor: "#777",
    borderRadius: 3,
  },

  coin: {
    position: "absolute",
    width: COIN_SIZE,
    height: COIN_SIZE,
    borderRadius: COIN_SIZE / 2,
    backgroundColor: "#f1c40f",
    borderWidth: 2,
    borderColor: "#d4ac0d",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },



});
