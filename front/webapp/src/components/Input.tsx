import './Input.css';

export type InputProps = {
  placeholder: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  type: string,
  icon?: string,
  required?: boolean,
}

export default function Input(props: InputProps) {
  return (
    <div className='field-container'>
      <div className='input-icon-container'>
        {props.icon && <img src={props.icon} alt="Icon" className='input-icon' />}
        <input
          type={props.type}
          className='input'
          style={props.icon ? {paddingLeft: '60px'} : {}}
          placeholder={props.placeholder}
          value={props.value}
          required={props.required === undefined ? false : props.required}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}

