import { CSSProperties } from 'react'
import './Title.css'

type TitleProps = {
    title: string,
    style?: CSSProperties
}

export default function Title(props: TitleProps) {
    return (
        <div style={props.style} className="title">
            {props.title}
        </div>
    )
}