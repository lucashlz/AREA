import './Input.css';

type InputProps = {
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    type: string
}

export default function Input(props: InputProps) {
    return (
        <div className='field-container'>
          <input
            type={props.type}
            className='input'
            placeholder={props.placeholder}
            value={props.value}
            required
            onChange={props.onChange}
          />
        </div>
    )
}