import React from 'react'
import { useForm } from 'react-hook-form'
import TextEditor from '../components/TextEditor'

function AddPost() {

  const {control,handleSubmit} = useForm()

  const onSubmit =(data)=>{
    console.log(data)
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextEditor name='content' control={control} />
        <button
        className='mt-5 ml-5 py-2 px-4 text-white rounded-md bg-cyan-950'
         type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddPost