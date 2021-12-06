import Button from "@material-ui/core/Button";
import {useCookies} from "react-cookie";
import {useState} from "react";

import {calculateNewMastery, randGenerateConfig} from './Question'
import {CircularProgress, TextField} from "@material-ui/core";

export default function Tutor() {
  const [cookies, setCookies] = useCookies();
  const [numStep, setNumStep] = useState(0)
  const [config, setConfig] = useState(cookies.config)


  const [isStepCorrect, setIsStepCorrect] = useState({})

  const getNextHint = (hints, currStep, setCurrStep) => {
    const len = hints.length
    if (currStep + 1 < len) {
      setCurrStep(currStep + 1)
    }
  }


  const [stepOneAnswer, setStepOneAnswer] = useState()
  const gradeStepOne = () => {
    const isCorrect = parseInt(stepOneAnswer) === config['cacheSize'] / config['sizePerElem']
    setIsStepCorrect({...isStepCorrect, 'one': isCorrect})
    //TODO: update kc value
  }

  const [currStepOneHint, setCurrStepOneHint] = useState(0)
  const stepOneHint = ['We already know the size of the entire cache and the size for each element, so how do we calculate the number of elements for the whole cache?',
    'Divide the cache size by the size of each element. Then you will get the number of elements.',
    `The number of elements that can fit into the whole cache is ${config['cacheSize'] / config['sizePerElem']}`]

  const [stepTwoAnswer, setStepTwoAnswer] = useState()
  const gradeStepTwo = () => {
    const isCorrect = parseInt(stepTwoAnswer) === config['numElemPerWay']
    setIsStepCorrect({...isStepCorrect, 'two': isCorrect})
    //TODO: update kc value

  }
  const [currStepTwoHint, setCurrStepTwoHint] = useState(0)
  const stepTwoHint = ['In order to know the number of elements per way, we need to first figure out the size of each way.',
    'Divide the size of each way by the size of each element. Then you will get the number of elements per way.',
    `The size of each way is ${config['waySize']}`,
    `The number of elements that can fit into one way is ${config['numElemPerWay']}`]

  const [stepThreeAnswer, setStepThreeAnswer] = useState()
  const gradeStepThree = () => {
    const isCorrect = parseInt(stepThreeAnswer) === config['blockSize'] / config['sizePerElem']
    setIsStepCorrect({...isStepCorrect, 'three': isCorrect})
    //TODO: update kc value

  }
  const [currStepThreeHint, setCurrStepThreeHint] = useState(0)
  const stepThreeHint = ['We already know the size of each block and size of each element, so what\'s the next step?',
    'Divide the size of each block by the size of each element. Then you will get the number of elements per block.',
    `The number of elements that can fit into one block is ${config['blockSize'] / config['sizePerElem']}`]

  const [stepFourAnswer, setStepFourAnswer] = useState()

  const gradeStepFour = () => {
    const isCorrect = parseInt(stepFourAnswer) === config['numElemPerWay']
    setIsStepCorrect({...isStepCorrect, 'four': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery, 0.1, 0.3, 0.1, isCorrect)
    if (cookies.mastery < 0.5) {
      setCookies('mastery', Math.min(0.5, newMastery))
    }
  }
  const [currStepFourHint, setCurrStepFourHint] = useState(0)
  const stepFourHint = [`Now way 0 is all filled up by ${config['dataType']}s, and we actually just calculated how many of them can be fit into one way`,
    `There are ${config['numElemPerWay']} ${config['dataType']}s in way 0, which suggests A[0] through A[${config['numElemPerWay'] - 1}] are in way 0. So what's the next element?`,
    `A[${config['numElemPerWay']}] would be the first element in way 1 index 0 offset 0.`]


  const [stepFiveAnswer, setStepFiveAnswer] = useState()
  const gradeStepFive = () => {
    const isCorrect = parseInt(stepFiveAnswer) === (config['numElemPerWay'] + 1)
    setIsStepCorrect({...isStepCorrect, 'five': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery, 0.1, 0.3, 0.1, isCorrect)
    if (cookies.mastery < 0.5) {
      setCookies('mastery', Math.min(0.5, newMastery))
    }
  }
  const [currStepFiveHint, setCurrStepFiveHint] = useState(0)
  const stepFiveHint = [`Way 1, index 0, and offset ${config['sizePerElem']} suggest this should be the next element right after A[${config['numElemPerWay']}]`,
    `In other words, this should be A[${config['numElemPerWay'] + 1}]`]


  const gradeStepSix = (isCorrect) => {
    setIsStepCorrect({...isStepCorrect, 'six': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery, 0.12, 0.28, 0.1, isCorrect)
    if (cookies.mastery < 0.5) {
      setCookies('mastery', Math.min(0.5, newMastery))
    }
  }
  const [currStepSixHint, setCurrStepSixHint] = useState(0)
  const stepSixHint = [`Now you see A[0] and A[${config['numElemPerWay']}] map to the same index and offset, so does the pair of A[1] and A[${config['numElemPerWay']+1}]. What can you infer from this?`,
  `The index difference of these matching pairs is ${config['numElemPerWay']}.`,
  `Therefore, A[N] would map to the same index and offset as A[N+${config['numElemPerWay']}]`]



  const [stepSevenAnswer, setStepSevenAnswer] = useState()
  const gradeStepSeven = () => {
    const givenIdx = config.givenIdx
    const ansIdx = parseInt(stepSevenAnswer)
    const diff = Math.abs(givenIdx - ansIdx)
    //1. index difference should be divisible by number of elements per way 2. the answer should not be the same as the given index
    //3 & 4. the index should be within bound (non-negative, cannot exceed the array size)
    let isCorrect = (diff % config.numElemPerWay === 0) && diff !== 0 && ansIdx >= 0 && ansIdx < config.arraySize
    setIsStepCorrect({...isStepCorrect, 'seven': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery, 0.3, 0.1, 0.1, isCorrect)
    if (cookies.mastery < 0.5) {
      setCookies('mastery', Math.min(0.5, newMastery))
    }
  }

  const [currStepSevenHint, setCurrStepSevenHint] = useState(0)
  const stepSevenHint = [`According to the previous step, A[n] and A[n+${config['numElemPerWay']}] are mapped to the same index and offset.`,
  `If you replace n with ${config['givenIdx']}, what should n+${config['numElemPerWay']} be?`,
  `One possible answer is A[${config['givenIdx']+config['numElemPerWay']}]`]




  const generateQuestionText = (questionConfig) => {
    return `The following array is declared in the code: 
    ${questionConfig['dataType']} A[${questionConfig['arraySize']}]; //${questionConfig['dataType']} is ${questionConfig['sizePerElem']}B
     Consider a ${questionConfig['cacheSize']}B, ${questionConfig['numWays']}-way set associative cache with ${questionConfig['blockSize']}B blocks.
     Find another element of the array which maps to the same index and offset as A[${questionConfig['givenIdx']}].`
  }

  return (
    <div className={'Tutor'}>
      <div className={'Navigation'}>
        <nav>
          <Button variant={'outlined'} href={'/question'}>Back to question</Button>
        </nav>
      </div>
      <p>Your current progress:</p>
      {/*{cookies.mastery}*/}
      <CircularProgress variant="determinate" value={Math.min(1, cookies.mastery) * 100}/>
      <br/>
      {cookies.mastery >= 0.5 && <div>
        <p>You can only earn up to 50% of mastery score through the tutoring process.</p>
        <p> To push yourself further, try solving a question on your own.</p>
      </div>}

      <h3>Let's take a look at this question:</h3>

      <div style={{whiteSpace: 'break-spaces'}}>{generateQuestionText(config)}
      </div>
      {numStep === 0 ? <Button variant={'outlined'} onClick={() => {
          setNumStep(1)
        }}>Start tutorial</Button> :
        <Button variant={'outlined'} onClick={() => {
          if (window.confirm('Are you sure you want to restart with another variant?')) {
            setNumStep(0);
            setConfig(randGenerateConfig())
            setIsStepCorrect({})
            setStepOneAnswer(undefined)
            setStepTwoAnswer(undefined)
            setStepThreeAnswer(undefined)
            setStepFourAnswer(undefined)
            setStepFiveAnswer(undefined)
            setStepSevenAnswer(undefined)
            setCurrStepOneHint(0)
            setCurrStepTwoHint(0)
            setCurrStepThreeHint(0)
            setCurrStepFourHint(0)
            setCurrStepFiveHint(0)
            setCurrStepSixHint(0)
            setCurrStepSevenHint(0)
          }
        }
        }>Restart with a different variant</Button>}


      {/*To begin with, calculate number of elements for the whole cache/per way/per block*/}
      {numStep >= 1 && // calculate number of elements for the entire cache
      <div className={'StepOne'}>
        <p>To begin with, let's analyze the given cache configuration.</p>
        <p>Let's think about how many {config.dataType}s we can fit into the entire cache, each way, and each block,
          respectively.</p>
        {/*<p>Since the total size of the cache is {config.cacheSize}B and the cache has {config.numWays} way(s),*/}
        {/*  what is the size of each way?</p>*/}

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <div className={'NumElemFullCache'} style={{display: 'flex', flexDirection: 'column'}}>
            <TextField label={'the entire cache'} variant={'outlined'} onChange={(e) => {
              setStepOneAnswer(e.target.value)
            }}/>
            <Button variant={'outlined'} onClick={gradeStepOne} disabled={isStepCorrect['one']}>Submit</Button>
            {isStepCorrect['one'] && <div>That's right!</div>}
            {isStepCorrect['one'] === false && <div>
              <p>That looks incorrect :(</p>
              <p>{stepOneHint[currStepOneHint]}</p>
              {currStepOneHint + 1 < stepOneHint.length &&
              <Button onClick={() => getNextHint(stepOneHint, currStepOneHint, setCurrStepOneHint)}
                      variant={'outlined'}>Next Hint</Button>}
            </div>}
          </div>
          <div className={'NumElemPerWay'} style={{display: 'flex', flexDirection: 'column'}}>

            <TextField label={'per way'} variant={'outlined'} onChange={(e) => {
              setStepTwoAnswer(e.target.value)
            }}/>
            <Button variant={'outlined'} onClick={gradeStepTwo} disabled={isStepCorrect['two']}>Submit</Button>
            {isStepCorrect['two'] && <div>That's right!</div>}
            {isStepCorrect['two'] === false && <div>
              <p>That looks incorrect :(</p>
              <p>{stepTwoHint[currStepTwoHint]}</p>
              {currStepTwoHint + 1 < stepTwoHint.length &&
              <Button onClick={() => getNextHint(stepTwoHint, currStepTwoHint, setCurrStepTwoHint)}
                      variant={'outlined'}>Next Hint</Button>}
            </div>}

          </div>
          <div className={'NumElemPerBlock'} style={{display: 'flex', flexDirection: 'column'}}>

            <TextField label={'per block'} variant={'outlined'} onChange={(e) => {
              setStepThreeAnswer(e.target.value)
            }}/>
            <Button variant={'outlined'} onClick={gradeStepThree} disabled={isStepCorrect['three']}>Submit</Button>
            {isStepCorrect['three'] && <div>That's right!</div>}
            {isStepCorrect['three'] === false && <div>
              <p>That looks incorrect :(</p>
              <p>{stepThreeHint[currStepThreeHint]}</p>
              {currStepThreeHint + 1 < stepThreeHint.length &&
              <Button onClick={() => getNextHint(stepThreeHint, currStepThreeHint, setCurrStepThreeHint)}
                      variant={'outlined'}>Next Hint</Button>}
            </div>}
          </div>
        </div>


      </div>}
      {isStepCorrect['one'] && isStepCorrect['two'] && isStepCorrect['three'] && <Button onClick={() => {
        setNumStep(numStep + 1)
      }} variant={'outlined'}>Continue</Button>}

      {/*step 4: ask the learner to find the array index of a specific element*/}
      {numStep >= 2 &&
      <div className={'StepFour'}>
        <p>Now, let's think about what can we infer when two elements are mapped to the same index and offset.</p>
        <p>Suppose the cache starts empty, and the LRU FSM for all indices are [0,1...]</p>
        <p>Suppose <b>A[0]</b> maps to <b>way 0, index 0 and offset 0</b>.</p>
        <p>Now let's try traversing the array A in sequential order (A[0], A[1], A[2]...). These elements will fill in
          the cache accordingly.</p>
        <p>With all these assumptions, when way 0 is all filled up and we move to <b>way 1</b>, <b>index 0</b>, <b>offset
          0</b> for the first time,
          what is the array index for that element?</p>

        <TextField label={'array index'} variant={'outlined'} onChange={(e) => setStepFourAnswer(e.target.value)}/>
        <Button variant={'outlined'} onClick={gradeStepFour}>Submit</Button>


        {/*after question one gets answered, display something*/}
        {'four' in isStepCorrect && <div className={'stepFourResult'}>
          {/*if the answer is correct, go to step five (ask a different element)*/}
          {isStepCorrect['four'] &&
          <div>
            <h3>That's correct!</h3>
            <Button variant={'outlined'} onClick={() => {
              setNumStep(3)
            }}>Continue</Button>
          </div>}

          {/*if the answer is incorrect, show some feedbacks*/}
          {isStepCorrect['four'] === false && <div>
            <p>{stepFourHint[currStepFourHint]}</p>
            {currStepFourHint + 1 < stepFourHint.length &&
            <Button onClick={() => getNextHint(stepFourHint, currStepFourHint, setCurrStepFourHint)}
                    variant={'outlined'}>Next Hint</Button>}
          </div>}
        </div>
        }
      </div>

      }

      {/*step 5: ask another element (or should I call it step 1.1?)*/}
      {numStep >= 3 &&
      <div className={'StepFive'}>
        <p>Then what about way 1, index 0, and offset {config.sizePerElem}? Hint: A[1] is mapped to the same index and
          offset of way 0.</p>
        <TextField label={'array index'} variant={'outlined'} onChange={(e) => setStepFiveAnswer(e.target.value)}/>
        <Button variant={'outlined'} onClick={gradeStepFive}>Submit</Button>


        {'five' in isStepCorrect && <div className={'StepFiveResult'}>
          {isStepCorrect['five'] ?
            <div>
              <h3>Excellent! Let's keep going.</h3>
              <Button variant={'outlined'} onClick={() => {
                setNumStep(4)
              }}>Continue</Button>
            </div> :
            <div>
              <p>{stepFiveHint[currStepFiveHint]}</p>
              {currStepFiveHint + 1 < stepFiveHint.length &&
              <Button onClick={() => getNextHint(stepFiveHint, currStepFiveHint, setCurrStepFiveHint)}
                      variant={'outlined'}>Next Hint</Button>}</div>}
        </div>}
      </div>}

      {/*step 6: try to generalize the question*/}
      {numStep >= 4 &&
      <div className={'StepSix'}>
        <p>Do you see the pattern here? Given A[n], which of the following element would map to the same index and
          offset as A[N]?</p>
        <p>(Suppose there's no index-out-of-bound issue.)</p>
        <Button variant={'outlined'} onClick={() => gradeStepSix(true)} disabled={isStepCorrect['six']}>A[N+{config.numElemPerWay}]</Button>
        <Button variant={'outlined'} disabled={isStepCorrect['six']}
                onClick={() => gradeStepSix(false)}>A[N+{config.numElemPerWay / 2}]</Button>
        <Button variant={'outlined'} disabled={isStepCorrect['six']}
                onClick={() => gradeStepSix(false)}>A[N+{config.numElemPerWay * 1.5}]</Button>

        {'six' in isStepCorrect && <div className={'StepSixResult'}>
          {isStepCorrect['six'] ? <div>
            <h3>Impressive! You ROCK!!</h3>
            <Button variant={'outlined'} onClick={() => {
              setNumStep(5)
            }}>Continue</Button>

          </div> : <div>
            <p>{stepSixHint[currStepSixHint]}</p>
            {currStepSixHint + 1 < stepSixHint.length &&
            <Button onClick={() => getNextHint(stepSixHint, currStepSixHint, setCurrStepSixHint)}
                    variant={'outlined'}>Next Hint</Button>}
          </div>}
        </div>}
      </div>}

      {/*step 7: apply the technique to solve the original question*/}
      {numStep === 5 && <div className={'StepSeven'}>
        <p>Now you get the idea. Suppose the number of elements that can fit into <b>one way</b> of the cache is n,
          then A[i] and A[i+n] should map to the same index and offset</p>
        <p>So now let's go back to the original question. What is one possible array element that maps to the same index
          and offset as A[{config.givenIdx}]?</p>
        <TextField variant={'outlined'} label={'array index'} onChange={(e) => {
          setStepSevenAnswer(e.target.value)
        }}/>
        <Button variant={'outlined'} onClick={gradeStepSeven}>Submit</Button>

        {'seven' in isStepCorrect && <div className={'SteoSevenResult'}>
          {isStepCorrect['seven'] ?
            <div className={'StepSevenCorrect'}>
              <h3>Congratulations! You've made it!</h3>
              <p>Now let's try this question again with a different configuration to strengthen your understanding</p>
              <Button variant={'outlined'} href={'/question'} onClick={() => {
                setCookies('mastery', 0.5) //TODO: fix: carry current mastery over
              }
              }>Ok, try another variant.</Button>
            </div> : <div className={'StepSevenIncorrect'}>
                <p>{stepSevenHint[currStepSevenHint]}</p>
                {currStepSevenHint + 1 < stepSevenHint.length &&
                <Button onClick={() => getNextHint(stepSevenHint, currStepSevenHint, setCurrStepSevenHint)}
                        variant={'outlined'}>Next Hint</Button>}
            </div>}
        </div>}


      </div>}

    </div>
  )

}