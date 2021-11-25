import Button from '@material-ui/core/Button'
import {useState} from "react";
import {useCookies} from 'react-cookie';

import {TextField} from "@material-ui/core";

export function randGenerateConfig() {
  const waySize = 2 ** (Math.floor(Math.random() * 3) + 7) //way size is randomly chosen between [128,256,512]
  const numWays = Math.floor(Math.random() * 3) + 2 //number of ways randomly chosen between [2,3,4]
  const cacheSize = waySize * numWays
  const sizePerElem = 2 ** (Math.floor(Math.random() * 2) + 2) //size of each element between [4, 8]
  const numElemPerWay = waySize / sizePerElem
  const dataType = sizePerElem === 4 ? 'int' : 'double'
  const arraySize = Math.floor((Math.random() + 3) * numElemPerWay)
  const givenIdx = Math.floor(Math.random() * numElemPerWay) + numElemPerWay
  const blockSize = 2 ** (Math.floor(Math.random() * 3 + 4))
  return {
    'waySize': waySize,
    'numWays': numWays,
    'cacheSize': cacheSize,
    'sizePerElem': sizePerElem,
    'numElemPerWay': numElemPerWay,
    'dataType': dataType,
    'arraySize': arraySize,
    'givenIdx': givenIdx,
    'blockSize': blockSize
  }
}

export default function Question() {

  const [problem, setProblem] = useState()
  const [config, setConfig] = useState()
  const [answer, setAnswer] = useState()
  const [questionStatus, setQuestionStatus] = useState('NotStarted')

  const [cookies, setCookie] = useCookies(['mastery', 'config']);


  const randGenerateQuestion = () => {
    //size of array should be between 3 and 4 times of the size per way
    //2-4 ways maybe
    //index between 33% and 66% so that at least one solution on the larger side and one on the smaller side
    //int or double
    //16/32/64B blocks (don't matter though)

    const problemConfig = randGenerateConfig()

    const problemDescription = `The following array is declared in the code: 
    ${problemConfig.dataType} A[${problemConfig.arraySize}]; //${problemConfig.dataType} is ${problemConfig.sizePerElem}B
    
     Consider a ${problemConfig.cacheSize}B, ${problemConfig.numWays}-way set associative cache with ${problemConfig.blockSize}B blocks.
     Find another element of the array which maps to the same index and offset as A[${problemConfig.givenIdx}].`

    setProblem(problemDescription)
    setConfig(problemConfig)
    setCookie('config', problemConfig, {path: '/'})
    setAnswer(undefined)
    setQuestionStatus('NotStarted')
  }

  const calculateCorrectAns = () => {
    const solutions = []
    const numElemPerWay = config['numElemPerWay']
    const arraySize = config['arraySize']
    const givenIdx = config['givenIdx']
    let factor = 1
    while (factor * numElemPerWay + givenIdx < arraySize) {
      solutions.push(factor * numElemPerWay + givenIdx)
      factor++
    }

    factor = -1
    while (factor * numElemPerWay + givenIdx >= 0) {
      solutions.push(factor * numElemPerWay + givenIdx)
      factor--
    }

    return solutions
  }

  const grade = () => {
    const possibleSolutions = calculateCorrectAns()
    const isCorrect = possibleSolutions.includes(parseInt(answer))
    setQuestionStatus(isCorrect ? 'Correct' : 'Incorrect')
    setCookie('mastery', isCorrect ? 1 : -1, {path: '/'}) // WIP, will incorporate BKT
  }


  return (
    <div className={'Question'} style={{whiteSpace: 'break-spaces'}}>
      <nav>
        <Button variant={'outlined'} href={'/'}>Home</Button>
        <Button variant={'outlined'} href={'/profile'}>Check your learner profile</Button>
      </nav>
      <p>Your current progress: {cookies.mastery}</p>
      <Button variant={'outlined'} onClick={() => {
        if (window.confirm('Are you sure you want to reset your progress back to 0?')) {
          setCookie('mastery', 0, {path: '/'})
        }
      }
      }>Reset your progress</Button>
      <Button variant={'outlined'} onClick={randGenerateQuestion}>Create a new problem instance</Button>
      <Button variant={'outlined'} href={'/tutor'}>Just show me the tutorial anyway</Button>
      {problem && <div>
        <div className={'problem'}>
          {problem}
        </div>
        <div className={'answer'}>
          <TextField label="Your Answer" variant="outlined" onChange={(e) => setAnswer(e.target.value)}/>
          <br/>
          <Button variant={'outlined'} onClick={grade}>Submit</Button>
        </div>

        <div className={'results'}>
          {/*If the answer is correct, show this message*/}
          {questionStatus === 'Correct' && <div>
            <h3>That's correct! Well done!</h3>
            <p>Let's try a few more times to make sure you really understand.</p>
            <p>If you are interested, here's a tutorial you can follow:</p>
          </div>}

          {/*If the answer is incorrect, show this message*/}
          {questionStatus === 'Incorrect' && <div>
            <h3>Uh-oh, something is wrong here.</h3>
            <h3>Let me lead you through this problem step by step</h3>
          </div>}

          {/*In both situations, show the button to check out the tutorial*/}
          {questionStatus !== 'NotStarted' && <div>
            <Button variant={'outlined'} href={'/tutor'}>Check out the tutorial</Button>
          </div>}
        </div>

      </div>}
    </div>
  )
}

