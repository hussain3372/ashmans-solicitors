import React from 'react'
import { Button as AntButton, ButtonProps } from 'antd'

interface CustomButtonProps extends ButtonProps {
  text?: string
}

export const Button: React.FC<CustomButtonProps> = ({ text, ...props }) => {
  return <AntButton {...props}>{text}</AntButton>
}
