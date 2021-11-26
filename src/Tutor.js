import Button from "@material-ui/core/Button";
import {useCookies} from "react-cookie";
import {useState} from "react";

import {randGenerateConfig,calculateNewMastery} from './Question'
import {CircularProgress, TextField} from "@material-ui/core";

export default function Tutor() {
  const [cookies, setCookies] = useCookies();
  const [numStep, setNumStep] = useState(0)
  const [config, setConfig] = useState(cookies.config)


  const [isStepCorrect, setIsStepCorrect] = useState({})

  const [stepOneAnswer, setStepOneAnswer] = useState()

  const gradeStepOne = () => {
    const isCorrect = parseInt(stepOneAnswer) === config['numElemPerWay']
    setIsStepCorrect({...isStepCorrect, 'one': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery,0.1,0.3,0.1,isCorrect)
    if(cookies.mastery<0.5){
      setCookies('mastery',Math.min(0.5,newMastery))
    }
  }

  const [stepTwoAnswer, setStepTwoAnswer] = useState()
  const gradeStepTwo = () => {
    const isCorrect = parseInt(stepTwoAnswer) === (config['numElemPerWay']+1)
    setIsStepCorrect({...isStepCorrect, 'two': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery,0.1,0.3,0.1,isCorrect)
    if(cookies.mastery<0.5){
      setCookies('mastery',Math.min(0.5,newMastery))
    }   }

  const gradeStepThree = (isCorrect)=>{
    setIsStepCorrect({...isStepCorrect, 'three': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery,0.12,0.28,0.1,isCorrect)
    if(cookies.mastery<0.5){
      setCookies('mastery',Math.min(0.5,newMastery))
    }   }


  const [stepFourAnswer, setStepFourAnswer] = useState()
  const gradeStepFour = () => {
    const givenIdx = config.givenIdx
    const ansIdx = parseInt(stepFourAnswer)
    const diff = Math.abs(givenIdx - ansIdx)
    //1. index difference should be divisible by number of elements per way 2. the answer should not be the same as the given index
    //3 & 4. the index should be within bound (non-negative, cannot exceed the array size)
    let isCorrect = (diff % config.numElemPerWay === 0) && diff!==0 && ansIdx>=0 && ansIdx<config.arraySize
    setIsStepCorrect({...isStepCorrect, 'four': isCorrect})
    const newMastery = calculateNewMastery(cookies.mastery,0.3,0.1,0.1,isCorrect)
    if(cookies.mastery<0.5){
      setCookies('mastery',Math.min(0.5,newMastery))
    }   }


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
      <p>Your current mastery level:</p>
      {cookies.mastery}
      <CircularProgress variant="determinate" value={Math.min(1,cookies.mastery)*100}/>
      <br/>
      {cookies.mastery>=0.5 &&<div>
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
          }
        }
        }>Restart with a different variant</Button>}

      {/*step 1: ask the learner to find the array index of a specific element*/}
      {numStep >= 1 &&
      <div className={'StepOne'}>
        <p>First, let's think about what can we infer when two elements are mapped to the same index and offset.</p>
        <p>Suppose the cache starts empty, and the LRU FSM for all indices are [0,1...]</p>
        <p>Suppose <b>A[0]</b> maps to <b>way 0, index 0 and offset 0</b>.</p>
        <p>Now let's try traversing the array A in sequential order (A[0], A[1], A[2]...). These elements will fill in
          the cache accordingly.</p>
        <p>With all these assumptions, when way 0 is all filled up and we move to <b>way 1</b>, <b>index 0</b>, <b>offset
          0</b> for the first time,
          what is the array index for that element?</p>

        <TextField label={'array index'} variant={'outlined'} onChange={(e) => setStepOneAnswer(e.target.value)}/>
        <Button variant={'outlined'} onClick={gradeStepOne}>Submit</Button>

        {/*after question one gets answered, display something*/}
        {'one' in isStepCorrect && <div className={'stepOneResult'}>
          {/*if the answer is correct, go to step two (ask a different element)*/}
          {isStepCorrect['one'] &&
          <div>
            <h3>That's correct!</h3>
            <Button variant={'outlined'} onClick={() => {
              setNumStep(2)
            }}>Continue</Button>
          </div>}

          {/*if the answer is incorrect, show some feedbacks*/}
          {/*TODO: add feedbacks here*/}
          {isStepCorrect['one'] === false && <div>Incorrect</div>}
        </div>
        }
      </div>

      }

      {/*step 2: ask another element (or should I call it step 1.1?)*/}
      {numStep >= 2 &&
      <div className={'StepTwo'}>
        <p>Then what about way 1, index 0, and offset {config.sizePerElem}? Hint: A[1] is mapped to the same index and
          offset of way 0.</p>
        <TextField label={'array index'} variant={'outlined'} onChange={(e) => setStepTwoAnswer(e.target.value)}/>
        <Button variant={'outlined'} onClick={gradeStepTwo}>Submit</Button>


        {'two' in isStepCorrect && <div className={'StepTwoResult'}>
          {isStepCorrect['two'] ?
            <div>
              <h3>Excellent! Let's keep going.</h3>
              <Button variant={'outlined'} onClick={() => {
                setNumStep(3)
              }}>Continue</Button>
            </div> : <div>step two incorrect</div>}
        </div>}
      </div>}

      {/*step 3: try to generalize the question*/}
      {numStep >= 3 &&
      <div className={'StepThree'}>
        <p>Do you see the pattern here? Given A[n], which of the following element would map to the same index and
          offset as A[n]?</p>
        <p>(Suppose there's no index-out-of-bound issue.)</p>
        <Button variant={'outlined'} onClick={() => gradeStepThree(true)}>A[n+{config.numElemPerWay}]</Button>
        <Button variant={'outlined'}
                onClick={() => gradeStepThree(false)}>A[n+{config.numElemPerWay / 2}]</Button>
        <Button variant={'outlined'}
                onClick={() => gradeStepThree(false)}>A[n+{config.numElemPerWay * 1.5}]</Button>

        {'three' in isStepCorrect && <div className={'StepThreeResult'}>
          {isStepCorrect['three'] ? <div>
            <h3>Impressive! You ROCK!!</h3>
            <Button variant={'outlined'} onClick={() => {
              setNumStep(4)
            }}>Continue</Button>

          </div> : <div>
            {/*TODO: more feedback here*/}
            step 3 incorrect
          </div>}
        </div>}
      </div>}

      {numStep === 4 && <div className={'StepFour'}>
        <p>Now you get the idea. Suppose the number of elements that can fit into <b>one way</b> of the cache is n,
          then A[i] and A[i+n] should map to the same index and offset</p>
        <p>So now let's go back to the original question. What is one possible array element that maps to the same index
          and offset as A[{config.givenIdx}]?</p>
        <TextField variant={'outlined'} label={'array index'} onChange={(e) => {
          setStepFourAnswer(e.target.value)
        }}/>
        <Button variant={'outlined'} onClick={gradeStepFour}>Submit</Button>

        {'four' in isStepCorrect && <div className={'SteoFourResult'}>
          {isStepCorrect['four']?
            <div className={'StepFourCorrect'}>
              <h3>Congratulations! You've made it!</h3>
              <p>Now let's try this question again with a different configuration to strengthen your understanding</p>
              <Button variant={'outlined'} href={'/question'} onClick={()=>{
              setCookies('mastery',0.5)}
              }>Ok, try another variant.</Button>
            </div> :<div className={'StepFourIncorrect'}>
              {/*TODO: step four feedbacks*/}
              Step four incorrect
            </div>}
        </div> }


      </div>}

    </div>
  )

}