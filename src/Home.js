import Button from '@material-ui/core/Button'
export default function Home(){
  return(
    <div className={'Home'}>
      <h1>Home</h1>
      <p>This is an intelligent tutoring system that can teach you how to solve a specific kind of cache problems.</p>
      <p>To begin with, press "Generate a question"</p>
      <Button href={'/question'}>Generate a question</Button>

      {/*<Button href={'/profile'}>Profile</Button>*/}
    </div>
  )
}