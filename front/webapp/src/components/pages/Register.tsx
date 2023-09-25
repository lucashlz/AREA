import { Button } from '../Button'
import Title from '../Title'
import './Register.css'

export default function Register() {
    return (
        <div className="get-started">
            <Title title='Get started' />
            <Button buttonSize='btn--medium' buttonStyle='btn--primary-inverted' type='button' >Continue with Facebook</Button>
            <Button buttonSize='btn--medium' buttonStyle='btn--primary' type='button' >Continue with Google</Button>
            <div>Or use your email to sign up or log in</div>
        </div>
    )
}