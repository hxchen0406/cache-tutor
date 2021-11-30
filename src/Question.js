import {useState} from "react";
import {useCookies} from 'react-cookie';

import {TextField, Button, CircularProgress} from "@material-ui/core";



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

export const calculateNewMastery = (p_prev, ps, pg, pt, isCorrect) => {
  const p_prev_correct = p_prev * (1 - ps) / (p_prev * (1 - ps) + (1 - p_prev) * pg)
  const p_prev_incorrect = p_prev * ps / (p_prev * ps + (1 - p_prev) * (1 - pg))

  return isCorrect ? Math.min(1,(p_prev_correct + (1-p_prev_incorrect) * pt)) : Math.min(1,(p_prev_incorrect + (1-p_prev_correct)* pt))
}

export default function Question() {

  const [problem, setProblem] = useState()
  const [config, setConfig] = useState()
  const [answer, setAnswer] = useState()
  const [isQuestionComplete,setIsQuestionComplete] = useState(false)
  const [questionStatus, setQuestionStatus] = useState('NotStarted')

  const [cookies, setCookies] = useCookies(['mastery', 'config']);


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
    setCookies('config', problemConfig, {path: '/'})
    setAnswer(undefined)
    setQuestionStatus('NotStarted')
    setIsQuestionComplete(false)
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
    // having P(slip)=0.1, P(guess)=0.2 and P(transfer) = 0.3 looks good to me
    // the learners cannot abuse the system by keep submitting incorrect answers
    // for those who know how to solve the problem, they will complete after answering the question for three times
    const newMastery = calculateNewMastery(cookies['mastery'],0.3,0.1,0.2,isCorrect)

    setIsQuestionComplete(isCorrect)

    setCookies('mastery', newMastery, {path: '/'}) // WIP, will incorporate BKT
  }




  return (
    <div className={'Question'} style={{whiteSpace: 'break-spaces'}}>
      <nav>
        <Button variant={'outlined'} href={'/'}>Home</Button>
        {/*<Button variant={'outlined'} href={'/profile'}>Check your learner profile</Button>*/}
      </nav>
      <p>Your current progress:</p>
      <CircularProgress variant="determinate" value={Math.min(1,cookies.mastery)*100}/>
      <br/>


      <Button variant={'outlined'} onClick={() => {
        if (window.confirm('Are you sure you want to reset your progress?')) {
          setCookies('mastery', 0, {path: '/'})
          setIsQuestionComplete(false)
          randGenerateQuestion()
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
          <Button variant={'outlined'} disabled={isQuestionComplete} onClick={grade}>Submit</Button>
        </div>

        <div className={'results'}>
          {cookies.mastery>=0.95 ? <div className={'CompleteLearning'}>
            <h3>Congratulations! You've MASTERED this kind of problem!</h3>
            <p>You may quit the tutoring now, or keep practicing if you wish.</p>
          </div>:   <div className={'OngoingLearning'}>{/*If the answer is correct, show this message*/}
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
            </div>}</div>}
        </div>

      </div>}
    </div>
  )
}

