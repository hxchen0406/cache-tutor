import Button from "@material-ui/core/Button";
import {useCookies} from "react-cookie";
import {useState} from "react";

import {randGenerateConfig} from './Question'
import {TextField} from "@material-ui/core";

export default function Tutor() {
  const [cookies, setCookie] = useCookies(['name']);
  const [numStep, setNumStep] = useState(0)
  const [config, setConfig] = useState(cookies.config)

  const [stepOneAnswer, setStepOneAnswer] = useState()
  const gradeStepOne = () => {
    setIsStepCorrect({...isStepCorrect, 'one': parseInt(stepOneAnswer) === config['numElemPerWay']})
  }

  const [stepTwoAnswer, setStepTwoAnswer] = useState()
  const gradeStepTwo = () => {
    setIsStepCorrect({...isStepCorrect, 'two': parseInt(stepTwoAnswer) === config['numElemPerWay'] + 1})
  }


  const [isStepCorrect, setIsStepCorrect] = useState({})


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
            console.log(isStepCorrect)
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
        <Button variant={'outlined'} onClick={() => setIsStepCorrect({
          ...isStepCorrect,
          'three': true
        })}>A[n+{config.numElemPerWay}]</Button>
        <Button variant={'outlined'}
                onClick={() => setIsStepCorrect({
                  ...isStepCorrect,
                  'three': false
                })}>A[n+{config.numElemPerWay / 2}]</Button>
        <Button variant={'outlined'}
                onClick={() => setIsStepCorrect({
                  ...isStepCorrect,
                  'three': false
                })}>A[n+{config.numElemPerWay * 1.5}]</Button>

        {'three' in isStepCorrect && <div className={'StepThreeResult'}>
          {isStepCorrect['three']? <div>
            step 3 correct
          </div>: <div>
            step 3 incorrect
          </div>}
        </div>}

      </div>}

    </div>
  )

}